var gulp = require('gulp'),
 browserSync = require('browser-sync').create(),
 babel = require("gulp-babel"),
 inject = require('gulp-inject'),
 sourcemaps = require('gulp-sourcemaps'),
 concat = require("gulp-concat"),
 watch = require('gulp-watch');


gulp.task('inject', function () {
	var target = gulp.src('index.html'),
	  sources = gulp.src(['dist/**/*.js', 'app/styles.css'], {read: false});

	return target.pipe(inject(sources,{ relative: true }))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream());
});


gulp.task("build-js", function () {
	return gulp.src("app/js/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat("all.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());
});

gulp.task('watch', function(){
	gulp.watch('app/js/**/*.js',['build-js']),
	gulp.watch('app/assets/styles/**/*.css',['index']);
	gulp.watch("index.html").on('change', browserSync.reload);
});

gulp.task('serve',['watch','inject'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	})
});
