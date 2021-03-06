const { watch, src, dest, parallel } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');

const cssProcessors = [
  autoprefixer(),
  cssnano()
]

function cssTask() {
  return src('./src/codebase/scss/codebase.scss', { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed'})).on('error', sass.logError)
    .pipe(postcss(cssProcessors))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/dist'))
}

function cssTask2() {
  return src('./src/codebase/scss/codebase-l-d.scss', { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed'})).on('error', sass.logError)
    .pipe(postcss(cssProcessors))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/dist'))
}

function jsTask() {
  return src('./src/codebase/js/activator.js', { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [['@babel/preset-env', { "targets": "> 0.25%, Explorer 11" }]]
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/dist'))
}

function jsTask2() {
  return src('./src/codebase/js/activator.jquery.js', { allowEmpty: true })
    .pipe(dest('./src/dist'))
}

function zipDist() {
  return src('./src/dist/*')
    .pipe(zip('dist.zip'))
    .pipe(dest('./docs'))
}

function watchFiles() {
  watch('./**/*.scss', parallel(cssTask));
  watch('./**/*.scss', parallel(cssTask2));
  watch('./**/*.js', parallel(jsTask));
  watch('./**/*.js', parallel(jsTask2));
  watch('./**/*.scss', parallel(zipDist));
  watch('./**/*.js', parallel(zipDist));
};

exports.default = parallel(cssTask, cssTask2, jsTask, jsTask, watchFiles);