let gulp = require('gulp');

// Require plugins
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var autoPrefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('connect');
var serve = require('serve-static');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
var beeper = require('beeper');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

const path= {
  style: {
    src: {
      normalize: 'app/css/normalize.css',
      main: 'app/css/**/*.css'
    },
    dest: 'dist/css/'
  },
  script: {
    src: 'app/js/**/*.js',
    dest: 'dist/js/'
  },
  sass: {
    src: 'app/sass/**/*.sass',
    dest: 'app/css/'
  },
  image: {
    src: 'app/img/**/*.*',
    dest: 'dist/img/'
  },
  autoPrefix: {
    src: 'app/css/**/*.css',
    dest: 'app/css'
  },
  html: {
    src: 'app/*.html',
    dest: 'dist'
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
gulp.task('sass', function() {
  return gulp.src(path.sass.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass())
    .pipe(gulp.dest(path.sass.dest))

});

// Styles Task
gulp.task('styles', function() {
    gulp.src([path.style.src.normalize, path.style.src.main])
        .pipe(concat('site.css'))
        .pipe(gulp.dest(path.style.dest));
});

// Gulp script test, combine and minify
gulp.task('script', function() {
  return gulp.src(path.script.src)
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.script.dest));
});

// Images Task
gulp.task('images', function() {
    gulp.src(path.image.src)
        .pipe(imagemin())
        .pipe(gulp.dest(path.image.dest));
});

// Gulp browserSync
gulp.task('browserSync', function(cb) {
  return browserSync({
    server: {
      baseDir: 'app'
    }
  }, cb);
});

gulp.task('browserify', function() {
  return browserify('./app/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'));
})

// node Staic server
gulp.task('server', function() {
  return connect().use(serve(__dirname))
    .listen(8080)
    .on('listening', function() {
      console.log('Server running on port:8080');
    });
});

gulp.task('watch', function() {
  gulp.watch(path.sass.src, ['sass', browserSync.reload]);
  gulp.watch(path.html.src, browserSync.reload);
  gulp.watch(path.script.src, ['script', browserSync.reload]);
});

gulp.task('autoPrefix', function() {
  return gulp.src(path.autoPrefix.src)
    .pipe(autoPrefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(path.autoPrefix.dest));
});

// Build Sequences
// ---------------
gulp.task('default', function(cb) {
  runSequence('sass', 'autoPrefix', 'browserSync', 'watch', cb);
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('build', function(cb) {
  runSequence( 'sass', 'autoPrefix', 'script', 'images', 'styles', cb);
});
