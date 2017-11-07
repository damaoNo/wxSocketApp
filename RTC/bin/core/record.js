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
    return this;
}

Record.prototype = {
    start: function () {
	var _this = this;
	var fileName = Uuid.v4() + config.suffix;
	var tempFilePath = path.join(config.tempVideoPath, fileName);
	var date = functions.dateFormat.call(new Date(), 'yyyy-MM-dd');
	var savePath = path.join(config.videoPath, date);
	this.fileWriteStream = fs.createWriteStream(tempFilePath, {
	    flags: 'a',
	    encoding: null,
	    mode: '0666'
	});
	this.fileWriteStream.on('open', function () {
	    console.log('file write stream open ...');
	    log('file write stream open ...');
	    fs.stat(savePath, function (err, stat) {
		if(err){
		    console.log(`创建新的目录:${savePath}`);
		    log(`创建新的目录:${savePath}`);
		    fs.mkdir(savePath);
		}
	    });
	});
	this.fileWriteStream.on('close', function () {
	    console.log('file write stream closed!');
	    log('file write stream closed!');
	    fs.rename(tempFilePath, path.join(savePath, fileName), function (err) {
		if(err){
		    console.log('重命名文件失败！');
		    log('重命名文件失败！');
		    _this.socket.send(JSON.stringify({event: 'record failed', errorMessage: err}), function (error) {
			if(error){
			    console.log(error);
			    log(error);
			}
		    });
		}else{
		    let videoFile = [path.basename(config.videoPath), date, fileName].join('/');
		    console.log(`${videoFile} 文件已保存！`);
		    log(`${videoFile} 文件已保存！`);
		    _this.socket.send(JSON.stringify({event: 'record success', path: videoFile}), function (error) {
			if(error){
			    console.log(error);
			    log(error);
			}
		    });
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
    }
};

module.exports = Record;