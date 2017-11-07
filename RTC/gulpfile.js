/**
 * Created by ChenChao on 2017/11/2.
 */

var gulp = require('gulp');
var sh = require('shelljs');

gulp.task('watch', function () {
    gulp.watch(['./public/javascripts/**/*.js'], function () {
	sh.exec('webpack', function () {
	    console.log('\nwebpack task done!\n');
	});
    });
});