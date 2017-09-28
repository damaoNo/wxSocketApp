/**
 * Created by ChenChao on 2017/9/25.
 */

const fs = require('fs');
const path = require('path');

module.exports = function (string) {
    let now = new Date();
    let date = now.toLocaleDateString().replace(/\/|\\/g, '-');
    let logFile = path.join(__dirname, 'logs', `${date}.log`);
    let content = `[${now.toLocaleString()}]: ${string}\r\n`;
    fs.appendFile(logFile, content, function(err){
	if (err) throw err;
    });
};