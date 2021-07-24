var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function () {});

gulp.task('scripts', function () {
    return gulp.src(['./src/globals.js', './src/HTML.js', './src/presets.js', './src/knobs.js', './src/grid.js', './src/controller.js', './src/gremaining.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./src/'));
});