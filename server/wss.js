/**
 * Created by ChenChao on 2017/2/16.
 */

var https = require('https');
var fs = require('fs');
var ws = require('ws');
var express = require('express');
var port = 443;

var app = express();

app.get('/.well-known/pki-validation/fileauth.htm', function (req, res) {
    res.setHeader('content-type', 'text/plain');
    res.send(fs.readFileSync('./fileauth.htm'));
});

app.use(function (req, res) {
    res.send({ msg: "这是 shaman 的 socket 服务器！" });
});

var options = {
    key: fs.readFileSync('./private.pem')
    , cert: fs.readFileSync('./file.crt')
    //, passphrase: '1234'
};
var server = https.createServer(options, app).listen(port, function listening() {
    console.log('Listening on %d', server.address().port);
});
var wss = new ws.Server( {
    server: server,
    verifyClientL: function (info) {
        console.log('收到来自 ' + info.origin + ' 的连接...');
    }
} );

wss.on('connection', function connection(wsConnect) {
    console.log(1111111);
    wsConnect.send(new Date().toLocaleString() + '：哈喽,来自地球的小伙伴 :)');
    wsConnect.on( 'message', function ( message ) {
        console.log('收到客户端消息：', message);
    });
});