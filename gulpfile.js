var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sassLint = require('gulp-sass-lint');
var notify = require("gulp-notify");
var inlineCss = require('gulp-inline-css');

// Static Server + watching scss/html files
gulp.task('serve', ['sass-lint','inlineCSS'], function() {
    browserSync.init({
        server: "./app"
    });
    gulp.watch(["app/scss/*.scss"], ['sass-lint']);
    gulp.watch(["app/css/*.css","app/**/*.html"], ['inlineCSS']);
    gulp.watch(["app/**/*.html","app/css/*.css","app/js/*.js"]).on('change', browserSync.reload);
});

// sass-lint check
gulp.task('sass-lint', function (error) {
  return gulp.src('app/scss/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError().on('error',error))
    .pipe(sass().on('error',sass.logError))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/css"))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(rename({
        suffix:'.min'
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
    .pipe(notify("CSS Compiled Successfully"));
});

gulp.task('inlineCSS',function(){
    return gulp.src('app/*.html')
    .pipe(inlineCss({
        applyStyleTags: true,
        applyLinkTags: true,
        removeStyleTags: true,
        removeLinkTags: true
    }))
    .pipe(gulp.dest('./app/inlineCSS/'));
});

gulp.task('default', ['serve']);