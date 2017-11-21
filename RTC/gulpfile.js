/**
 * Created by ChenChao on 2017/11/2.
 */

var gulp = require('gulp');
var sh = require('shelljs');


gulp.task('build', function () {
    sh.exec('webpack', function (err) {
	console.log('\nbuild completed!\n');
    });
});

gulp.task('watch', function () {
    gulp.watch(['./public/javascripts/**/*.js'], function () {
	sh.exec('webpack', function () {
	    console.log('\nwebpack task done!\n');
	});
    });
});