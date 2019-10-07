const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const del = require('del');

sass.compiler = require('node-sass');

const paths = {
  styles: {
    src: 'app/css/sass/*.s(c|a)ss',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'app/js/**/*.js',
    dest: 'dist/js/',
  },
  image: {
    src: 'app/img/**/*.*',
    dest: 'dist/img/',
  },
  autoPrefix: {
    src: 'dist/css/**/*.css',
    dest: 'dist/css/',
  },
  html: {
    src: 'app/*.html',
    dest: 'dist/',
  },
  fonts: {
    src: 'app/fonts/*.*',
    dest: 'dist/fonts/',
  },
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => { return del(['assets']); };

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min',
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts, watchFiles));
/*
* Export a default task
*/
export default build;
