/**
 * Created by ChenChao on 2017/11/7.
 * 视频录制
 */

var url = require('url');
var path = require('path');
var fs = require('fs');
var Uuid = require('uuid');
var functions = require('./functions');
var log = require('./log');
var config = require('../config');

function Record(socket) {
    this.socket = socket;
    this.fileWriteStream = null;
    this.tempFilePath = '';
    this.savePath = '';
    this.saveFileName = '';
    return this;
}

Record.prototype = {
    start: function () {
	var _this = this;
	this.saveFileName = Uuid.v4() + config.suffix;
	this.tempFilePath = path.join(config.tempVideoPath, this.saveFileName);
	var date = functions.dateFormat.call(new Date(), 'yyyy-MM-dd');
	this.savePath = path.join(config.videoPath, date);
	this.fileWriteStream = fs.createWriteStream(this.tempFilePath, {
	    flags: 'a',
	    encoding: null,
	    mode: '0666'
	});
	this.fileWriteStream.on('open', function () {
	    console.log('file write stream open ...');
	    log('file write stream open ...');
	    fs.stat(_this.savePath, function (err, stat) {
		if(err){
		    console.log(`创建新的目录:${_this.savePath}`);
		    log(`创建新的目录:${_this.savePath}`);
		    fs.mkdir(_this.savePath);
		}
	    });
	});
	this.fileWriteStream.on('close', function () {
	    console.log('file write stream closed!');
	    log('file write stream closed!');
	    fs.lstat(_this.tempFilePath, function (err, stats) {
		if(err){
		    console.log('临时文件保存失败! err:' + (err.stack || err));
		    log('临时文件保存失败! err:' + (err.stack || err));
		    _this.socket.send(JSON.stringify({action: 'record error', errorMessage: '录制异常，请重新录制！'}));
		} else{
		    console.log('临时文件已保存：' + _this.tempFilePath + ', size:' + stats.size + 'bytes.');
		    log('临时文件已保存：' + _this.tempFilePath + ', size:' + stats.size + 'bytes.');
		    if(stats.size === 0){
			console.log('发送重新录制消息！');
			log('发送重新录制消息！');
			_this.socket.send(JSON.stringify({action: 'record error', errorMessage: '录制异常，请重新录制！'}), function(err){
			    console.log(err ? '发送重新录制消息失败，原因：\n' + err : '已发送!');
			    log(err ? '发送重新录制消息失败，原因：\n' + err : '已发送!');
			});
		    }
		}
	    });
	});
    },
    write: function (data) {
	this.fileWriteStream && this.fileWriteStream.write(data);
    },
    end: function () {
	this.fileWriteStream && this.fileWriteStream.end();
	this.fileWriteStream = null;
    },
    transformFile: function(callback){
	var _this = this;
	var date = functions.dateFormat.call(new Date(), 'yyyy-MM-dd');
	fs.rename(this.tempFilePath, path.join(this.savePath, this.saveFileName), function (err) {
	    if(err){
		console.log('确认视频文件重命名失败！');
		log('确认视频文件重命名失败！ err:' + (err.stack || err));
		callback(JSON.stringify({action: 'saved failed', errorMessage: '确认视频文件重命名失败！'}));
	    }else{
		let videoFile = [path.basename(config.videoPath), date, _this.saveFileName].join('/');
		fs.lstat(videoFile, function (err, stats) {
		    if(err){
			console.log('确认视频文件保存失败! err:' + (err.stack || err));
			log('确认视频文件保存失败! err:' + (err.stack || err));
			callback(JSON.stringify({action: 'saved failed', errorMessage: '确认视频文件重命名失败！'}));
		    } else{
			console.log(`${videoFile} 文件已保存！`);
			log('确认视频文件已保存：' + videoFile + ', size:' + stats.size + 'bytes.');
			callback(JSON.stringify({action: 'saved success', path: videoFile}));
		    }
		});
	    }
	});
    }
};

module.exports = Record;