var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;

var inject = require('gulp-inject');

gulp.task('index', function () {
	var target = gulp.src('index.html');
	var sources = gulp.src(['controller.js', 'styles.css'], {read: false});

	return target.pipe(inject(sources,{ relative: true }))
		.pipe(gulp.dest('./'));
});


gulp.task('bower', function () {
	gulp.src('index.html')
		.pipe(wiredep({
			optional: 'configuration',
			goes: 'here'
		}))
		.pipe(gulp.dest(''));
});

// gulp.task('browserSync', function() {
// 	browserSync.init({
// 		server: {
// 			baseDir: './'
// 		}
// 	})
// });


// gulp.task('serve',['index','bower','browserSync'],function  () {
//
// });