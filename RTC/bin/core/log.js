/**
 * Created by ChenChao on 2017/9/25.
 */

var fs = require('fs');
var path = require('path');
var functions = require('./functions');
var config = require('../config');

module.exports = function (string) {
    var dateFormat = functions.dateFormat;
    var now = new Date();
    var date = dateFormat.call(now, 'yyyy-MM-dd');
    var logFile = path.join(config.logDir, `${date}.log`);
    var content = `[${dateFormat.call(now, 'HH:mm:ss')}]: ${string}\r\n`;
    fs.appendFile(logFile, content, function(err){
	if (err) throw err;
    });
};