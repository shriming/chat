var gulp = require('gulp');
var shell = require('gulp-shell');
var path = require('path');
var replace = require('gulp-replace-path');
var flatten = require('gulp-flatten');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var argv = require('yargs').argv;
var spawn = require('child_process').spawn;
var fs = require('fs');
var app, myShell;

function start () {
    if (app != null && typeof app.kill == 'function') {
        console.log('Sails has already started!');
        return;
    }
    console.log('Start Sails!');

    app = spawn('node', ['app.js']);

    fs.writeFile('pid.txt', app.pid, function (err) {
        if (err) throw err;
        console.log('Pid %s saved!', app.pid);
    });

    // Listen for data
    app.stdout.on('data', function (data) {
        console.log('Sails data: ', data);
    });

    //        // Listen for errors data
    //        app.stderr.on('data', function (data) {
    //            console.warn(data);
    //            stop();
    //            start();
    //        });

    // Listen for an exit event:
    app.on('exit', function (exitCode) {
        console.log("Sails app exited with code: " + exitCode);
    });
}

function stop () {
    fs.readFile('pid.txt', 'utf8', function (err, data) {
        if (err) throw err;
        console.log('current pid from file: ', data);
        if (data) {
            gulp.src('')
                .pipe(shell([
                    'kill ' + data + " || rm pid.txt"
                ]))
        }
    });
}

function restart () {
    stop();
    start();
}

gulp.task('watch', function () {

    gulp.watch([
        'frontend/**/*.{png,jpg,gif}',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function () {
        runSequence('copy-images');
    });

    gulp.watch([
        'frontend/**/*.{css,styl}',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function () {
        gulp.src('')
            .pipe(shell([
                './node_modules/.bin/enb make -d frontend --no-cache',
                'gulp copy-css'
            ]));
    });

    gulp.watch([
        'frontend/**/*.js',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function () {
        gulp.src('')
            .pipe(shell([
                './node_modules/.bin/enb make -d frontend --no-cache',
                'gulp copy-js'
            ]));
    });

});

gulp.task('app-start', function () {
    start();
});

gulp.task('app-stop', function () {
    stop();
});

gulp.task('app-restart', function () {
    stop();
    start();
});

gulp.task('app-watch', function () {
    gulp.watch([
        'frontend/**/*.{bemtree,bemhtml}',
        'api/**/*.{js,json}',
        'config/**/*.{js,json}',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function (file) {
        console.log('Files changed args: ', arguments);
        if(['.bemtree', '.bemhtml'].indexOf(path.extname(file.path)) > -1) {
            return gulp.src('').
                pipe(shell([
                './node_modules/.bin/enb make -d frontend --no-cache',
                'gulp copy-files',
                'gulp app-restart'
            ]));
        }
        runSequence('app-restart');
    });
});

gulp.task('enb', function () {
    var cache = argv.cache == undefined ? '': ' --no-cache';
    gulp.src('')
        .pipe(shell([
             './node_modules/.bin/enb make -d frontend' + cache
        ]));
});

gulp.task('enb-no-cache', shell.task([
    './node_modules/.bin/enb make -d frontend --no-cache'
]));

gulp.task('enb-cached', shell.task([
    './node_modules/.bin/enb make -d frontend'
]));

gulp.task('copy-files', ['copy-js', 'copy-css', 'copy-images']);

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
        .pipe(replace(/(url\([',"]?(.*[\/]{1})?(\w*\.(png|jpg|gif))[',"]?\))/gmi, 'url("../images/$3")'))
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


/*
 * Sync browser when any static files changed
 * */
gulp.task('browser-sync', function () {
    var files = [
            './frontend/static/**/*'
        ],
        options = {
            files : files,
            notify : true,
            open : true,
            ghostMode : false,
            injectChanges : true,
            logLevel : 'debug',
            minify : false,
            codeSync : true,
            port : 8080,
            proxy : '127.0.0.1:1337'
        };

    browserSync.init(options, function (err, inj) {
        if(err) {
            throw Error(err);
        }
    });
});

/*
 * You can manually reload browser, using this task.
 * */
gulp.task('browser-reload', browserSync.reload);

gulp.task('default', function () {
    gulp.src('')
        .pipe(shell([
            './node_modules/.bin/enb make -d frontend --no-cache',
            'gulp copy-files',
            'gulp app-start'
        ]));
    runSequence('app-watch', 'watch');
});
