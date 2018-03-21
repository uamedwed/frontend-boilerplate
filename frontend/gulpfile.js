var gulp = require('gulp');
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend_PROJECTNAME"
};
var path = {
    build: {
        html: 'build/',
        js: 'build/assets/js/',
        favicon: 'build/',
        css: 'build/assets/css/',
        img: 'build/assets/img/',
        imgTemp: 'build/assets/content/img/',
        fonts: 'build/assets/fonts/'
    },
    src: {
        html: 'src/*.html',
        favicon: 'src/favicon.*',
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
        favicon: 'src/favicon*',
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
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('favicon:build', function() {
    gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.build.favicon))
        .pipe(reload({stream: true}));
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
    gulp.src(path.src.fontAwesome)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
          sass: path.src.styleDirectory,
          css: path.src.cssDirectory,
          image: path.src.imgDirectory
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
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
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
    gulp.src(path.src.imgTemp)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(),svgmin()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.imgTemp))
        .pipe(reload({stream: true}));
});
gulp.task('build', [
    'html:build',
    'favicon:build',
    'fonts:build',
    'style:build',
    'js:build',
    'image:build'
]);
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.favicon], function(event, cb) {
        gulp.start('favicon:build');
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

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
