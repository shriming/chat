var gulp = require('gulp');
var shell = require('gulp-shell');
var path = require('path');
var nodemon = require('nodemon');
var replace = require('gulp-replace-path');
var flatten = require('gulp-flatten');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var stylint = require('gulp-stylint');

gulp.task('server', function(){
    var called = false;

    nodemon({
        script : 'app.js',
        watch : ['./config', './api'],
        env : { 'NODE_ENV' : 'development' },
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

gulp.task('prod', function(){
    runSequence('enb-no-cache', 'copy-files', 'run-app');
});

gulp.task('run-app', shell.task([
    'node app.js --prod'
]));

gulp.task('nodemon-restart', function(){
    nodemon.emit('restart');
});

gulp.task('copy-images', function(){
    gulp.src([
        'frontend/**/*.{png,jpg,gif,svg,ico}',
        '!frontend/static/*',
        '!frontend/*.bundles/*'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/images'));
});

gulp.task('copy-css', function(){
    gulp.src([
        'frontend/desktop.bundles/merged/_merged.css'
    ])
        .pipe(replace(/(url\([',"]?(.*[\/]{1})?(\w*\.(png|jpg|gif|svg))[',"]?\))/g, 'url("../images/$3")'))
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/css'));
});

gulp.task('copy-js', function(){
    gulp.src([
        'frontend/desktop.bundles/merged/_merged.js'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/js'));
});

gulp.task('copy-files', ['copy-js', 'copy-css', 'copy-images']);

gulp.task('watch', function(){
    gulp.watch([
        'frontend/**/*.{png,jpg,gif,svg,ico}',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function(){
        runSequence('copy-images', 'browser-reload');
    });

    gulp.watch(['frontend/**/*.bemhtml',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'], function(){
        runSequence('jslint', 'enb-no-cache', 'copy-js', 'nodemon-restart');
    });

    gulp.watch(['frontend/**/*.bemtree',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'], function(){
        runSequence('jslint', 'enb-no-cache', 'copy-js', 'nodemon-restart');
    });

    gulp.watch(['frontend/**/*.styl',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'], function(){
        runSequence('stylint', 'enb-no-cache', 'copy-css', 'browser-reload');
    });

    gulp.watch(['frontend/**/*.js',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'], function(){
        runSequence('jslint', 'enb-no-cache', 'copy-js', 'browser-reload');
     });
});


gulp.task('enb-no-cache', shell.task([
    './node_modules/.bin/enb make -d frontend --no-cache'
]));

gulp.task('enb-cached', shell.task([
    './node_modules/.bin/enb make -d frontend'
]));

gulp.task('stylint', function(){
    return gulp.src(['frontend/**/*.styl',
        '!frontend/libs/**/*',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'])
        .pipe(stylint({ config : '.stylintrc' }));
});

gulp.task('jslint',  shell.task([
    'jshint-groups && jscs .'
]));

gulp.task('mongo', shell.task([
    'mkdir db & mongod --dbpath ./db'
]));

gulp.task('lint', ['jslint', 'stylint']);

gulp.task('browser-sync', function(){
    var options = {
        notify : true,
        ghostMode : true,
        injectChanges : true,
        logLevel : 'debug',
        minify : false,
        codeSync : true,
        port : 8090
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

gulp.task('dev', function(){
    runSequence('lint', 'enb-no-cache', 'copy-files', 'server', 'browser-sync', 'watch');
});

gulp.task('default', ['mongo', 'dev']);
