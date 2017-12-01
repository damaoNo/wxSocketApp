/**
 * Created by ChenChao on 2017/9/25.
 */

const fs = require('fs');
const path = require('path');

module.exports = function (string) {
    let now = new Date();
    let date = dateFormat.call(now, 'yyyy-MM-dd');
    let logDir = path.resolve(__dirname, './logs');
    let logFile = path.join(logDir, `${date}.log`);
    let content = `[${dateFormat.call(now, 'HH:mm:ss')}]: ${string}\r\n`;
    fs.appendFile(logFile, content, function(err){
	if (err) throw err;
    });
};

function dateFormat(fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o){
        if(o.hasOwnProperty(k)){
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}