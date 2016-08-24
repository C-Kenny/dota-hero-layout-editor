var gulp = require('gulp');
var minifyCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var pump = require('pump');
var del = require('del');

gulp.task('default', ['build']);

gulp.task('css', function () {
    return gulp.src([
          'src/layout-editor.css'
        ])
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'))
});

gulp.task('image', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

gulp.task('minify', function (cb) {
    pump([
        gulp.src([
            'src/layout-editor.js'
        ]),
        uglify({ compress: { drop_console: true, dead_code: true } }),
        gulp.dest('dist')
    ],
    cb
    );
});

gulp.task('copy-files', function () {
    return gulp
        .src([
            'src/*.txt',
            'src/save.php',
            'src/index.html'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['css', 'image', 'copy-files', 'minify']);

gulp.task('clean', function () {
    return del([
        '/srv/www/devilesk.com/dota2/apps/layout-editor/**/*',
        '!/srv/www/devilesk.com/dota2/apps/layout-editor/save',
        '!/srv/www/devilesk.com/dota2/apps/layout-editor/save/*'
    ], {force: true});
});

gulp.task('deploy', function () {
    return gulp.src([
            'dist/**/*',
            '!dist/save',
            '!dist/save/*'
        ])
        .pipe(chmod(755))
        .pipe(gulp.dest('/srv/www/devilesk.com/dota2/apps/layout-editor'));
});