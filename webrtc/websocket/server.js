/**
 * Created by ChenChao on 2017/7/17.
 */

var url = require('url');
var path = require('path');
var fs = require('fs');
var https = require('https');
var WebSocket = require('ws');
var Uuid = require('uuid');
var log = require('./log');
var config = require('./config');
var port = config.port;
var server = https.createServer({
    key: config.key,
    cert: config.cert
}, function (req, res) {
    let query = url.parse(req.url).query;
    if(query){
        let qr = query.split('&')[0].split('=');
        let queryType = qr[0];
        let queryValue = qr[1];
        if(queryType === 'log'){
            let logDir = path.resolve(__dirname, '../webrtcvideo001');
            let logFile = path.join(logDir, `${queryValue}.log`);
            fs.stat(logFile, function (err, stat) {
                if(err){
                    res.writeHead(500);
                    res.end(err.toString());
                }else{
                    fs.readFile(logFile, 'utf8', function (err, content) {
                        if(err){
                            res.writeHead(500);
                            res.end(err.toString());
                        }else{
                            res.writeHead(200, {
                                'Content-Type': 'text/plain;charset=utf-8'
                            });
                            res.end(content);
                        }
                    });
                }
            });
        }else{
            res.writeHead(200);
            res.end('Query type error: type is not "log"!\n');
        }
    }else{
        res.writeHead(200);
        res.end('hello\n');
    }
}).listen(port, function listening() {
    console.log('WebSocket server listening on %d', server.address().port);
});
var wss = new WebSocket.Server({
    server: server,
    verifyClient: function (info, next) {
        //console.log(url.parse(info.req.url).query);
	//todo 添加验证规则
        next(true);
    }
});

// process.on('uncaughtException', function (err) {
//     console.log(`Caught exception: ${err}`);
//     log(`Caught exception: ${err}`);
// });
process.on('exit', function (code) {
    console.log(`Caught exception before exit: ${code}`);
    log(`Caught exception before exit: ${code}`);
});

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

//定义消息广播
wss.broadcast = function broadcast(message, verify) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            if(!verify){
                //公共频道
                client.send(message);
            }else{
                //私发客服
                if(client.verify === verify){
                    if(typeof message === 'object'){
                        //双向实时
                        client.send(message, function (error) {
                            if(error){
                                console.log(error);
                                log(error);
                            }
                        });
                    }
                    if(typeof message === 'string'){
                        client.send(message, function (error) {
                            if(error){
                                console.log(error);
                                log(error);
                            }
                        });
                    }
                }
            }
        }
    });
};

wss.on('connection', function connection(socket) {
    var fileWriteStream = null;
    var fileName = Uuid.v4() + config.suffix;
    var tempFilePath = path.join(config.tempVideoPath, fileName);
    var date = dateFormat.call(new Date(), 'yyyy-MM-dd');
    var savePath = path.join(config.videoPath, date);

    socket.verify = '';
    socket.send(JSON.stringify({
        action: 'apply format',
        suffix: config.suffix
    }));
    socket.on('message', function onData(data) {
        //二进制数据
        if(typeof data === 'object'){
            fileWriteStream && fileWriteStream.write(data);
            if(config.bothWay){
                wss.broadcast(data, 'admin');
            }
        }
        //其他动作
        if(typeof data === 'string'){
            var actionObj = JSON.parse(data);
            var action = actionObj.action;
            var token = actionObj.token;
            var actionFn = {
                'ping': function () {
                    //console.log('admin ping:', actionObj.verify);
                    socket.verify = actionObj.verify;
                },
                'record start': function () {
                    fileWriteStream = fs.createWriteStream(tempFilePath, {
                        flags: 'a',
                        encoding: null,
                        mode: '0666'
                    });
                    fileWriteStream.on('open', function () {
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
                    fileWriteStream.on('close', function () {
                        console.log('file write stream closed!');
                        log('file write stream closed!');
                        fs.lstat(tempFilePath, function (err, stats) {
                            if(err){
                                log('临时文件保存失败! err:' + (err.stack || err));
                                socket.send(JSON.stringify({action: 'record error', errorMessage: '录制异常，请重新录制！'}));
                            } else{
                                log('临时文件已保存：' + tempFilePath + ', size:' + stats.size + 'bytes.');
                                if(stats.size === 0){
                                    socket.send(JSON.stringify({action: 'record error', errorMessage: '录制异常，请重新录制！'}));
                                }else{
                                    socket.send(JSON.stringify({action: 'record success'}));
                                }
                            }
                        });
                    });
                },
                'record over': function () {
                    killWriteStream();
                },
                //确认录制
                'apply': function () {
                    fs.rename(tempFilePath, path.join(savePath, fileName), function (err) {
                        if(err){
                            console.log('确认视频文件重命名失败！');
                            log('确认视频文件重命名失败！ err:' + (err.stack || err));
                            socket.send(JSON.stringify({action: 'saved failed', errorMessage: '确认视频文件重命名失败！'}), function (error) {
                                if(error){
                                    console.log(error);
                                    log(error);
                                }
                            });
                        }else{
                            let videoFile = ['webrtcvideo001', date, fileName].join('/');
                            fs.lstat(videoFile, function (err, stats) {
                                log(`${videoFile} 文件已保存！`);
                                if(err){
                                    log('读取文件摘要失败! err:' + (err.stack || err));
                                } else{
                                    log('读取文件文件大小， size:' + stats.size + 'bytes.');
                                }
                                socket.send(JSON.stringify({action: 'saved success', path: videoFile}), function (error) {
                                    if(error){
                                        console.log(error);
                                        log(error);
                                    }
                                });
                            });
                            // 广播给客服
                            // wss.broadcast(JSON.stringify({
                            //     action: 'user recode over',
                            //     user: token,
                            //     time: new Date().toLocaleString(),
                            //     video: [config.videoUrl, fileName].join('')
                            // }), 'admin');
                        }
                    });
                },
                'other wise': function () {
                    console.log('未定义的 action!');
                    log('未定义的 action!');
                }
            };
            actionFn[actionFn[action] ? action : 'other wise']();
        }
    });
    socket.on('close', function onClose() {
        killWriteStream();
    });
    
    function killWriteStream() {
        fileWriteStream && fileWriteStream.end();
        setTimeout(function () {
            fileWriteStream = null;
        }, 1000);
    }
});