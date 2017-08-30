const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const lazypipe = require('lazypipe');
const reload = browserSync.reload;
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const clean = require('gulp-clean');
const revHash = require('gulp-rev-hash');

var gr = {
  root: 'web',
  app: 'introduce'
};

var paths = {
  styles: [gr.root + '/' + gr.app + '/less/**/*.less'],
  files: [gr.root + '/' + gr.app + '/**/*.html'],
  js: [gr.root + '/' + gr.app + '/js/**/*.js'],
  dist: [gr.root + '/' + gr.app + '/dist/']
};

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.less({async: false}))
    .on('error', function (err) {
      console.log(err.message);
      this.emit('end');
    })
    //处理前缀的插件autoprefixer
    .pipe($.autoprefixer({
        browsers: [
          'Android >= 4',
          'Chrome >= 40',
          'last 6 Firefox versions',
          'iOS >= 6',
          'Safari >= 6'
        ],
        cascade: true
      }
    ))
    .pipe($.if('*.css', $.px2rem({rootValue: 75})))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest(gr.root + '/' + gr.app + '/css'))
});

gulp.task('serve', function () {
  browserSync({
    notify: false,
    port: 8001,
    server: {
      baseDir: [gr.root, '.'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(paths.styles, ['styles']).on('change', reload);
  gulp.watch(paths.files).on('change', reload);

});

gulp.task('clean', function () {
  return gulp.src(gr.root + '/' + gr.app + '/dist', {read: false})
    .pipe(clean());
});

gulp.task('moveImg', ['clean'], function () {
  gulp.src(gr.root + '/' + gr.app + '/images/**/*')
    .pipe(gulp.dest(gr.root + '/' + gr.app + '/dist/images'));
});

gulp.task('html', ['styles', 'moveImg'], function () {
  return gulp.src(paths.files)
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest(gr.root + '/' + gr.app + '/dist'));
});

gulp.task('rev', ['html'], function () {
  return gulp.src(gr.root + '/' + gr.app + '/dist/**/*.html')
    .pipe(revHash({assetsDir: gr.root + '/' + gr.app + '/dist'}))
    .pipe(gulp.dest(gr.root + '/' + gr.app + '/dist'));
});

gulp.task('dist', ['rev']);

gulp.task('default', ['styles']);