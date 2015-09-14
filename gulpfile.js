var gulp = require('gulp'),
    shell = require('gulp-shell'),
    path = require('path'),
    nodemon = require('gulp-nodemon'),
    replace = require('gulp-replace-path'),
    flatten = require('gulp-flatten'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create();

/*
 * Basic task that init nodemon with proper options and run some tasks before application is restarted.
 * See {@link https://github.com/JacksonGariety/gulp-nodemon gulp-nodemon) for more details.
 * */
gulp.task('start-dev', function () {
    nodemon({
        script : 'app.js',
        watch : [
            './api/**/*.{js,json}',
            './config/**/*.{js,json}',
            '*.{bemtree,bemhtml}'
        ],
        ignore : [
            './frontend/**/*.{js,json}',
            './frontend/static'
        ],
        delay : '100ms',
        ext : 'js json bemtree bemhtml',
        /*
         * If you need to run some gulp tasks before nodemon restart your app,
         * you can add tasks as follows.
         * */
        tasks : function (changedFiles) {
            var tasks = ['beforeNodemonRestart'];

            changedFiles.forEach(function (file) {
                if(/^frontend/.test(file)) {
                    if(['.bemtree', '.bemhtml'].indexOf(path.extname(file)) > -1) {
                        tasks.push('enb-cached');
                    }
                }
            });

            return tasks
        },
        env : { 'NODE_ENV' : 'development' }
    })
        .on('restart', function (changedFiles) {
            var shouldReload = true;

            /*
             * As argument we get list of changed files with absolute urls.
             * We can define any logic we want and run any gulp tasks, using runSequence.
             * */
//            changedFiles.forEach(function (file) {
//                file = path.relative(process.cwd(), file);
//                if (!shouldReload && ['.css', '.styl'].indexOf(path.extname(file)) === -1) {
//                    shouldReload = true;
//                }
//            });
//
//            todo rethink this timeout logic. Try to bind to started app event, if possible.
            if(shouldReload) {
                setTimeout(function () {
                    runSequence('browser-reload');
                }, 5000)
            }
        });
});

/*
* Build frontend, copy files, start app
* */
gulp.task('start-pro', function () {
    runSequence('enb-no-cache', 'copy-files', 'run-app');
});

/*
* Start app
* */
gulp.task('run-app', shell.task([
    'node app.js --prod'
]));

/*
 * Default task that runs before nodemon restarts.
 * */
gulp.task('beforeNodemonRestart', function () {
    console.info('Nodemon is going to be restarted!');
});

/*
 * Copy all frontend images to static/images
 * */

gulp.task('copy-files', function () {
    gulp.src([
        'frontend/**/*.{png,jpg,gif}',
        '!frontend/static/*',
        '!frontend/*.bundles/*'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/images'));

    gulp.src([
        'frontend/desktop.bundles/merged/_merged.css'
    ])
        .pipe(replace(/(url\([',']?(.*[\/]{1})?(\w*\.(png|jpg|gif))[',']?\))/g, 'url("../images/$3")'))
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/css'));

    gulp.src([
        'frontend/desktop.bundles/merged/_merged.js'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('frontend/static/js'));
});

/*
 * Watch frontend files and rebuild frontend ith enb if changed.
 * */
gulp.task('watch', function () {
    gulp.watch([
        'frontend/**/*.{css,stylus,js}',
        '!frontend/static/**/*',
        '!frontend/*.bundles/**/*'
    ], function () {
        runSequence('enb-cached', 'copy-files');
    });
});

/*
 * Rebuild frontend using enb compiler
 * */
gulp.task('enb-no-cache', shell.task([
    './node_modules/.bin/enb make -d frontend --no-cache'
]));

/*
 * Rebuild frontend using enb compiler
 * */
gulp.task('enb-cached', shell.task([
    './node_modules/.bin/enb make -d frontend'
]));

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
    runSequence('enb-no-cache', 'start-dev', ['browser-sync', 'watch']);
});
