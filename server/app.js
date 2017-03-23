/**
 * Created by ChenChao on 2017/2/16.
 */

var https = require('https');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var util = require('util');
var exec = require('child_process').exec;
var WebSocket = require('ws');
var express = require('express');
var config = require('./config');
var wsHandler = require('./wss');
var port = config.httpsPort;
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/push-wxSocketApp', function (req, res) {
    exec('sh ./restart.sh', function(err, stdOut, stdErr){
        res.setHeader('content-type', 'text/plain');
        var msg = 'Restart OK!';
        if(err) {
            msg = 'Restart error: ' + stdErr;
        }
        console.log({msg: msg, timeStamp: new Date()});
        res.send({msg: msg, timeStamp: new Date()});
    });
});

app.post('/saveRecord', function (req, res, next) {
    var data = req.query;
    console.log(data);
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files[data.name][0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/files/' + data.name + '.silk';
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }

        res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: filesTmp}));
    });
});

app.get('/getVoice', function (req, res, next) {
    var key = req.query.name;
    var file = path.join(__dirname, 'public', 'files', key + '.silk');
    console.log('客户端请求文件：' + file);
    var stats = fs.statSync(file);
    if(stats.isFile()){
        res.set({
            'Content-Type': 'audio/silk',
            'Content-Disposition': 'attachment; filename=' + file,
            'Content-Length': stats.size
        });
        fs.createReadStream(file).pipe(res);
    } else {
        console.log('文件不存在！');
        res.end(404);
    }
});

app.use(function (req, res) {
    res.send({ msg: "这是 shaman 的 socket 服务器！" , timeStamp: new Date()});
});

var options = {
    key: fs.readFileSync(config.key)
    , cert: fs.readFileSync(config.cert)
    //, passphrase: '1234'
};
var server = https.createServer(options, app).listen(port, function listening() {
    console.log('Listening on %d', server.address().port);
});
var wss = new WebSocket.Server( {
    server: server,
    verifyClient: function (info) {
        //console.log('收到来自 ' + info.origin + ' 的连接...');
        //todo 添加验证规则 1232132
        return true;
    }
} );

//定义消息广播
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function connection(socket) {
    wsHandler.init(WebSocket, wss, socket);
});