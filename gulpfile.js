const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require ('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');


//Для работы без препроцессоров
/*
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
*/
const images = [
    './src/img/**/*'
]

const cssFiles = [
    './src/css/main.scss',
    './src/css/media.scss'
]

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]
gulp.task('sass', function () {
    return gulp.src('./src/css/main.scss')
     .pipe(sourcemaps.init())
     .pipe(sass.sync().on('error', sass.logError))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('./src/css'));
});

gulp.task('images', function() {
    return gulp.src(images)
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ], {
        verbose: true
    }
    ))
    .pipe(gulp.dest(images));
});



function styles() {
    return gulp.src(cssFiles)

    .pipe(sourcemaps.init())
    .pipe(sass())

    .pipe(concat('style.css'))

    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))

    .pipe(cleanCSS({
        level: 2
    }))

    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.stream());
}

function clean() {
    return del(['build/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/css/**/*.scss', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)))
gulp.task('dev', gulp.series('build', 'watch'))