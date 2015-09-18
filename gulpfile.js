var gulp = require('gulp');
var shell = require('gulp-shell');
var path = require('path');
var nodemon = require('gulp-nodemon');
var replace = require('gulp-replace-path');
var flatten = require('gulp-flatten');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

gulp.task('beforeNodemonRestart', function () {
    console.log('Nodemon is going to restart');
});

gulp.task('start-dev', function (cb) {
    var called = false;

    return nodemon({
        script : 'app.js',
        watch : ['./config', './api'],
        env : { 'NODE_ENV' : 'development' }
    })
    .on('start', function onStart() {
        if(!called) {
          cb();
        }

        called = true;
    })
    .on('restart', function (changedFiles) {
        setTimeout(function reload() {
            browserSync.reload({
                stream : false
            });
        }, 500);
    });
});

gulp.task('start-pro', function () {
    runSequence('enb-no-cache', 'copy-files', 'run-app');
});

gulp.task('run-app', shell.task([
    'node app.js --prod'
]));

gulp.task('js-lint', shell.task([
    'jshint-groups && jscs .'
]));

gulp.task('css-lint', shell.task([
    'csscomb -vl .'
]));

gulp.task('lint', ['js-lint', 'css-lint']);

gulp.task('copy-images', function () {
    gulp.src([
        'frontend/**/*.{png,jpg,gif}',
        '!frontend/static/*',
        '!frontend/*.bundles/*'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/images'));
});

gulp.task('copy-css', function () {
    gulp.src([
        'frontend/desktop.bundles/merged/_merged.css'
    ])
        .pipe(replace(/(url\([',']?(.*[\/]{1})?(\w*\.(png|jpg|gif))[',']?\))/g, 'url("../images/$3")'))
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/css'));
});

gulp.task('copy-js', function () {
    gulp.src([
        'frontend/desktop.bundles/merged/_merged.js'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/js'));
});

gulp.task('copy-files', ['copy-js', 'copy-css', 'copy-images']);

gulp.task('watch', function () {
    gulp.watch([
        'frontend/**/*.{png,jpg,gif}',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function () {
        runSequence('copy-images', 'browser-reload');
    });

    gulp.watch(['frontend/**/*.{css,stylus}',
                '!frontend/static/**/*',
                '!frontend/*.bundles/**/*'], function () {
        runSequence('enb-no-cache', 'copy-css', 'browser-reload');
    });

    gulp.watch(['frontend/**/*.js',
                '!frontend/static/**/*',
                '!frontend/*.bundles/**/*'], function () {
        runSequence('enb-no-cache', 'copy-js', 'browser-reload');
    });
});

gulp.task('enb-no-cache', shell.task([
    './node_modules/.bin/enb make -d frontend --no-cache'
]));

gulp.task('enb-cached', shell.task([
    './node_modules/.bin/enb make -d frontend'
]));

gulp.task('browser-sync', ['start-dev'], function () {
    var options = {
            notify : true,
            browser : ['google chrome'],
            ghostMode : false,
            injectChanges : true,
            logLevel : 'debug',
            minify : false,
            codeSync : true
        };

    browserSync.init(options, function (err, inj) {
        if(err) {
            throw Error(err);
        }
    });
});

gulp.task('browser-reload', function () {
    browserSync.reload();
});

gulp.task('default', function () {
    runSequence('enb-no-cache', 'copy-files', 'browser-sync', 'watch');
});
