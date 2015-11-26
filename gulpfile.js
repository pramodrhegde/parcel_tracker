var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload');

    gulp.task('styles',function(){
        return sass('sass/main.scss',{style:'expanded'})
               .pipe(autoprefixer('last 2 version'))
               .pipe(gulp.dest('src/css/'))
               .pipe(notify({message:'style task complete.'}));

    });

    gulp.task('images',function(){
        return gulp.src('src/images/**/*')
               .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
               .pipe(gulp.dest('src/images/comp/'))
               .pipe(notify({ message: 'Images task complete' }));
    });

    gulp.task('watch',function(){
          // Watch .scss files
          gulp.watch('sass/*.scss', ['styles']);

          // Watch image files
          gulp.watch('src/images/**/*', ['images']);
    });

    gulp.task('default',function() {
        gulp.start('styles','images');
    });