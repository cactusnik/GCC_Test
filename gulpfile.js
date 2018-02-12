'use strict';

var gulp = require('gulp'),
	del = require('del'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	pug = require('gulp-pug'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	cssmin = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	rigger = require('gulp-rigger');
	
	
	
var browserSync = require('browser-sync').create(),
	reload = browserSync.reload;
	

	
var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        pug: 'app/',
        js: 'app/assets/js/',
        css: 'app/assets/css/',
        img: 'dist/assets/img/',
        fonts: 'dist/fonts/'
    },
    src: { //Пути откуда брать исходники
        pug: 'app/pug/pages/*pug', //Синтаксис src/*.pug говорит gulp что мы хотим взять все файлы с расширением .pug
        js: 'app/blocks/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'app/sass/main.sass',
        img: 'app/assets/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/sass/**/*.sass',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './app'
};	

gulp.task('serve', function(){
	browserSync.init({
		server: 'app'
	});
	gulp.watch('app/pug/**/*.pug', gulp.series('html'));
	gulp.watch(['app/blocks/**/*.sass','app/sass/**/*.sass'], gulp.series('css'));
	gulp.watch('app/blocks/**/*.js', gulp.series('js'));
	gulp.watch('*.html').on('change', reload);
});

gulp.task('html', function(){
	return gulp.src(path.src.pug)
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(path.dist.pug))
		.pipe(browserSync.stream());
		
});

gulp.task('css', function(){
	return gulp.src(path.src.style)
		.pipe(plumber())//Инициализируем sourcemap
        .pipe(sourcemaps.init()) //То же самое что и с js
		.pipe(sassGlob())//подсключаем sass вида /**/*.sass
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
		.pipe(gulp.dest(path.dist.css))
		.pipe(rename({suffix: '.min'}))//добавим префикс min
        .pipe(cssmin()) //Сожмем
		.pipe(gulp.dest(path.dist.css))
        .pipe(sourcemaps.write())
		.pipe(browserSync.stream());//Пропишем карты
		
});

gulp.task('js', function(){
	return gulp.src(path.src.js)
		.pipe(plumber())//Инициализируем sourcemap
        .pipe(sourcemaps.init()) //То же самое что и с js
		.pipe(concat('common.js'))//объединим
		.pipe(rename({suffix: '.min'}))//добавим префикс min
		.pipe(gulp.dest(path.dist.js))
        .pipe(uglify()) //Сожмем
		.pipe(gulp.dest(path.dist.js))
        .pipe(sourcemaps.write())
		.pipe(browserSync.stream());//Пропишем карты
		
});

gulp.task('cssVendor', function(){
	return gulp.src([
		'./app/vendor/normalize.css/normalize.css',
		'./app/vendor/slick-carousel/slick/slick.css',
		'./app/vendor/slick-carousel/slick/slick-theme.css',
		'./app/vendor/font-awesome/web-fonts-with-css/css/fontawesome.min.css'
	])
	.pipe(concat('vendor.min.css'))
    .pipe(cssmin()) //Сожмем
	.pipe(gulp.dest(path.dist.css));
});

gulp.task('jsVendor', function(){
	return gulp.src([
		'./app/vendor/jquery/dist/jquery.min.js',
		'./app/vendor/slick-carousel/slick/slick.min.js'
	])
	.pipe(concat('vendor.min.js'))
    .pipe(uglify()) //Сожмем
	.pipe(gulp.dest(path.dist.js));
});

gulp.task('fontsVendor', function(){
	return gulp.src([
		'./app/vendor/slick-carousel/slick/fonts/**/*.*',
		'./app/vendor/font-awesome/web-fonts-with-css/webfonts/**/*.*'
	])
	.pipe(gulp.dest('app/assets/fonts'));
});


gulp.task('build', gulp.parallel('html','css','js', 'cssVendor', 'jsVendor', 'fontsVendor'));

gulp.task('clean', function(){
	return del('dist');
});

gulp.task('img', function(){
	return gulp.src(path.src.img)
		.pipe(imagemin({use: [pngquant]}))
		.pipe(gulp.dest(path.dist.img));
});

gulp.task('dist', function(){
	var htmlDist = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
	var cssDist = gulp.src('app/assets/css/*.css')
		.pipe(gulp.dest('dist/assets/css'));
	var jsDist = gulp.src('app/assets/js/*.js')
		.pipe(gulp.dest('dist/assets/js'));
	var fontsDist = gulp.src('app/assets/fonts/*.*')
		.pipe(gulp.dest('dist/assets/fonts'));
	return htmlDist , cssDist, jsDist, fontsDist;
});

gulp.task('default', gulp.series('build', 'serve'));

gulp.task('public', gulp.series('clean','img', 'dist'));