/**
 * Created by ChenChao on 2017/7/17.
 */

var url = require('url');
var path = require('path');
var fs = require('fs');
var https = require('https');
var WebSocket = require('ws');
var Uuid = require('uuid');
var port = 443;
var options = {
    key: fs.readFileSync(__dirname + '/keys/214025060130250.key'),
    cert: fs.readFileSync(__dirname + '/keys/214025060130250.pem')
};
var server = https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end('hello\n');
}).listen(port, function listening() {
    console.log('WebSocket server listening on %d', server.address().port);
});
var wss = new WebSocket.Server({
    server: server,
    verifyClient: function (info, next) {
        console.log(url.parse(info.req.url).query);
	//todo 添加验证规则
        next(true);
    }
});
var config = {
    //保存格式可选 [.mp4, .webm]
    suffix: '.mp4',
    //临时视频文件目录
    tempVideoPath: path.resolve(__dirname, '../videos_temp'),
    //确认的视频文件目录
    videoPath: path.resolve(__dirname, '../videos')
};

wss.on('connection', function connection(socket) {
    var fileWriteStream = null;
    socket.send(JSON.stringify({
        action: 'apply format',
        suffix: config.suffix
    }));
    socket.on('message', function onData(data) {
        //二进制数据
        if(typeof data === 'object'){
            fileWriteStream && fileWriteStream.write(data);
        }
        //其他动作
        if(typeof data === 'string'){
            var actionObj = JSON.parse(data);
            var action = actionObj.action;
            var actionFn = {
                'record start': function () {
                    var fileName = Uuid.v4() + config.suffix;
                    var tempFilePath = path.join(config.tempVideoPath, fileName);
                    fileWriteStream = fs.createWriteStream(tempFilePath, {
                        flags: 'a',
                        encoding: null,
                        mode: 0o666
                    });
                    fileWriteStream.on('open', function () {
                        console.log('file write stream open ...');
                    });
                    fileWriteStream.on('close', function () {
                        console.log('file write stream closed!');
                        fs.rename(tempFilePath, path.join(config.videoPath, fileName), function (err) {
                            if(err){
                                console.log('重命名文件失败！');
                                socket.send(JSON.stringify({action: 'saved failed', errorMessage: '视频保存失败'}));
                            }else{
                                socket.send(JSON.stringify({action: 'saved success', path: ['videos', fileName].join('/')}));
                            }
                        });
                    });
                },
                'record over': function () {
                    fileWriteStream && fileWriteStream.end();
                    fileWriteStream = null;
                },
                'other wise': function () {
                    console.log('未定义的 action!');
                }
            };
            actionFn[actionFn[action] ? action : 'other wise']();
        }
    });
    socket.on('close', function onClose() {
        //todo
    });
});