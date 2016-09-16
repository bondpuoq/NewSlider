var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoPrefixer = require('gulp-autoprefixer');
var liveReload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var imageMin = require('gulp-imagemin');
var pngQuant = require('imagemin-pngquant');
var haml = require('gulp-haml');
var concat = require('gulp-concat');


// Компиллируем SASS в CSS и минифицируем css и добавляем префиксы нужные
gulp.task('sass', function() {
  gulp.src('./src/scss/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(rename('style.css'))
  //.pipe(minifyCss(''))
  .pipe(autoPrefixer({
    browsers: ['last 10 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./dest/css/'))
  .pipe(connect.reload());
});

gulp.task('haml', function() {
  gulp.src('./src/*.haml')
  .pipe(haml())
  .pipe(gulp.dest('./dest/'))
  .pipe(connect.reload());
});

// Ужаснифицируем JS
gulp.task('js', function(){
  gulp.src(['./src/js/jquery310.js','./src/js/*.js'])
  .pipe(concat('allScripts.js'))
  .pipe(gulp.dest('./dest/js/'))
  .pipe(connect.reload());
});


// Минифицируем изображения
gulp.task('img', function() {
  gulp.src('./src/images/*')
  .pipe(imageMin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngQuant()]
  }))
  .pipe(gulp.dest('./dest/images/'))
  .pipe(connect.reload());
});


// Релоадим страничку при изменении в файлах
gulp.task('connect', function() {
  connect.server({
    root: 'dest',
    livereload: true
  });
});

// Добавляем процессы следящие за файлами
gulp.task('watch', function(){
  gulp.watch('./src/scss/*.scss', ['sass']);
  gulp.watch('./src/*.haml', ['haml']);
  gulp.watch('./src/js/*.js',['js']);
  gulp.watch('./src/images/*',['img']);
});

// Задача по умолчанию
gulp.task('default', ['connect', 'haml', 'sass', 'js', 'img',  'watch']);

