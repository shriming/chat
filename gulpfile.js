var gulp = require('gulp');
var shell = require('gulp-shell');
var path = require('path');
var nodemon = require('nodemon');
var replace = require('gulp-replace-path');
var flatten = require('gulp-flatten');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var stylint = require('gulp-stylint');
var config = require('./config/env/config');

/***************************************************************************
 * Server tasks                                                            *
 ***************************************************************************/

gulp.task('server', function(){
    nodemon({
        script : config.appScript,
        watch : config.src.server,
        task : ['jslint']
    })
    .on('restart', function(changedFiles){
        setTimeout(function reload(){
            browserSync.reload({
                stream : false
            });
        }, 5000);
    });
});

gulp.task('nodemon-restart', function(){
    nodemon.emit('restart');
});

/***************************************************************************
 * Copy tasks                                                              *
 ***************************************************************************/

gulp.task('copy-images', function(){
    return gulp.src(config.src.images)
        .pipe(flatten())
        .pipe(gulp.dest(config.dest.images));
});

gulp.task('copy-css', function(){
    return gulp.src(config.dest.mergedCss)
        .pipe(replace(/(url\([',"]?(.*[\/]{1})?(.*\.(png|jpg|gif|svg))[',"]?\))/g, 'url("../images/$3")'))
        .pipe(flatten())
        .pipe(gulp.dest(config.dest.finalCss));
});

gulp.task('copy-js', function(){
    return gulp.src(config.dest.mergedJs)
        .pipe(flatten())
        .pipe(gulp.dest(config.dest.finalJs));
});

gulp.task('copy-files', ['copy-js', 'copy-css', 'copy-images']);

/***************************************************************************
 * Mongo tasks                                                             *
 ***************************************************************************/

gulp.task('mongo', shell.task([
    'mkdir db & mongod --dbpath ' + config.directoryForDb
]));

/***************************************************************************
 * Enb tasks                                                               *
 ***************************************************************************/

gulp.task('enb-no-cache', shell.task([
    config.bin + 'enb make -d frontend --no-cache'
]));

gulp.task('enb-cached', shell.task([
    config.bin + 'enb make -d frontend'
]));

/***************************************************************************
 * Lint tasks                                                              *
 ***************************************************************************/

gulp.task('stylint', function(){
    return gulp.src(config.src.css)
        .pipe(stylint({ config : '.stylintrc' }));
});

gulp.task('jslint',  shell.task([
    'jshint-groups && jscs .'
]));

gulp.task('lint', ['jslint', 'stylint']);

/***************************************************************************
 * Browser-sync tasks                                                      *
 ***************************************************************************/

gulp.task('browser-sync', function(){
    var options = {
        notify : true,
        ghostMode : true,
        injectChanges : true,
        logLevel : config.logLevel,
        minify : false,
        codeSync : true,
        port : config.browserSyncPort
    };

    browserSync.init(options, function(err, inj){
        if(err) {
            throw Error(err);
        }
    });
});

gulp.task('browser-reload', function(){
    browserSync.reload();
});

/***************************************************************************
 * Other tasks                                                             *
 ***************************************************************************/

gulp.task('run-app', shell.task([
    'node app.js --prod'
]));

gulp.task('watch', function(){
    gulp.watch(config.src.images, function(){
        runSequence('copy-images', 'browser-reload');
    });

    gulp.watch(config.src.bemhtmlTemplates, function(){
        runSequence('jslint', 'enb-no-cache', 'copy-js', 'nodemon-restart');
    });

    gulp.watch(config.src.bemtreeTemplates, function(){
        runSequence('jslint', 'enb-no-cache', 'copy-js', 'nodemon-restart');
    });

    gulp.watch(config.src.css, function(){
        runSequence('stylint', 'enb-no-cache', 'copy-css', 'browser-reload');
    });

    gulp.watch(config.src.js, function(){
        runSequence('jslint', 'enb-no-cache', 'copy-js', 'browser-reload');
     });
});

/***************************************************************************
 * Final gulp tasks                                                        *
 ***************************************************************************/

gulp.task('dev', function(){
    runSequence('lint', 'enb-no-cache', 'copy-files', 'server', 'browser-sync', 'watch');
});

gulp.task('prod', function(){
    runSequence('enb-no-cache', 'copy-files', 'run-app');
});

gulp.task('default', ['mongo', 'dev']);
