var gulp = require('gulp');

// Require plugins
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('prefixer', function() {
  return gulp.src('app/css/*.css')
    .pipe(autoprefixer({
      browsers:['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/dist/css'))
});

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

// Gulp watch syntax
gulp.task('watch', function() {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('app/dist/images'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('app/dist/fonts'))
})

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'prefixer', 'browserSync'], 'watch',
    callback
  )
})
