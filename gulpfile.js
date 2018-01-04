const gulp = require('gulp');

// Require plugins
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const autoPrefixer = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const connect = require('connect');
const serve = require('serve-static');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const plumber = require('gulp-plumber');
const beeper = require('beeper');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

const path = {
  style: {
    src: 'app/css/*.css',
    dest: 'dist/css/'
  },
  script: {
    src: 'app/js/**/*.js',
    dest: 'dist/js/'
  },
  sass: {
    src: 'app/css/sass/**/*.sass',
    dest: 'app/css/'
  },
  image: {
    src: 'app/img/**/*.*',
    dest: 'dist/img/'
  },
  autoPrefix: {
    src: 'app/css/**/*.css',
    dest: 'app/css/'
  },
  html: {
    src: 'app/*.html',
    dest: 'dist/'
  },
  font: {
    src: 'app/fonts/*.*',
    dest: 'dist/fonts/'
  }
};

// Error helper
function onError(err) {
  beeper();
  console.log('Name:', err.name);
  console.log('Reason:', err.reason);
  console.log('File:', err.file);
  console.log('Line:', err.line);
  console.log('Column:', err.column);
}

// Gulp compile sass
gulp.task('sass', () => gulp.src(path.sass.src)
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(sass())
  .pipe(autoPrefixer())
  .pipe(gulp.dest(path.sass.dest)));

gulp.task('html', () => gulp.src(path.html.src)
  .pipe(gulp.dest(path.html.dest)));

// Styles Task
gulp.task('styles', () => gulp.src([path.style.src])
  .pipe(concat('main.css'))
  .pipe(uglifycss({
    maxLineLen: 120,
    uglyComments: true
  }))
  .pipe(gulp.dest(path.style.dest)));

// Gulp script test, combine and minify
gulp.task('script', () => gulp.src(path.script.src)
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.script.dest)));

// Images Task
gulp.task('images', () => gulp.src(path.image.src)
  .pipe(imagemin())
  .pipe(gulp.dest(path.image.dest)));

gulp.task('fonts', () => gulp.src(path.font.src)
  .pipe(gulp.dest(path.font.dest)));

// Gulp browserSync
gulp.task('browserSync', cb => browserSync({
  server: {
    baseDir: 'app'
  }
}, cb));

gulp.task('browserify', () => browserify('./app/js/app.js')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist/js')));

// node Staic server
gulp.task('server', () => connect().use(serve(__dirname))
  .listen(8080)
  .on('listening', () => {
    console.log('Server running on port:8080');
  }));

gulp.task('watch', () => {
  gulp.watch(path.sass.src, ['sass', browserSync.reload]);
  gulp.watch(path.html.src, browserSync.reload);
  gulp.watch(path.script.src, ['script', browserSync.reload]);
});

gulp.task('autoPrefix', () => gulp.src(path.autoPrefix.src)
  .pipe(autoPrefixer())
  .pipe(gulp.dest(path.autoPrefix.dest)));

// Build Sequences
// ---------------
gulp.task('default', cb => {
  runSequence('sass', 'browserSync', 'watch', cb);
});

gulp.task('clean', cb => {
  del(['dist'], cb);
});

gulp.task('build', cb => {
  runSequence('sass', 'script', 'images', 'styles', 'fonts', 'html', cb);
});
