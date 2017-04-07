var gulp = require('gulp');
    watch = require('gulp-watch'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    pngquant = require('imagemin-pngquant');

var path = {
    build: {
        html: 'build/',
        js: 'build/assets/js/',
        css: 'build/assets/css/',
        img: 'build/assets/img/',
        imgTemp: 'build/assets/content/img/',
        fonts: 'build/assets/fonts/'
    },
    src: { 
        html: 'src/*.html', 
        js: 'src/js/main.js',
        style: 'src/scss/styles.scss',
        styleDirectory: 'src/scss',
        cssDirectory: 'src/css',
        img: 'src/img/**/*.*', 
        imgTemp: 'src/temp/images/**/*.*',
        imgDirectory: 'src/images',
        fonts: 'src/fonts/**/*.*',
        fontAwesome: 'vendor/font-awesome/fonts/**/*.*'
    },
    watch: { 
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/**/*.scss',
        img: 'src/img/**/*.*',
        imgTemp: 'src/temp/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        fontAwesome: 'vendor/font-awesome/fonts/**/*.*'
    },
    clean: './build'
};
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)); 
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
    gulp.src(path.src.fontAwesome)
        .pipe(gulp.dest(path.build.fonts));    
});
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(compass({
          sass: path.src.styleDirectory,      
          css: path.src.cssDirectory,
          image: path.src.imgDirectory
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js)); 
});
gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            optimizationLevel: 7,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(),svgmin()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)); 
    gulp.src(path.src.imgTemp) 
        .pipe(imagemin({ 
            progressive: true,
            optimizationLevel: 7,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(),svgmin()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.imgTemp));     
});
gulp.task('build', [
    'html:build',
    'fonts:build',    
    'style:build',    
    'js:build',
    'image:build'
]);
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });    
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });    
    watch([path.watch.imgTemp], function(event, cb) {
        gulp.start('image:build');
    });        
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});
gulp.task('default', ['build', 'watch']);