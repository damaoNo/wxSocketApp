/**
 * Created by ChenChao on 2017/2/16.
 */

var http = require('http');
var WebSocket = require('ws');
var port = 3000;
var server = http.createServer().listen(port, function listening() {
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

wss.on('connection', function connection(socket) {
    console.log('hehe some one coming ...');
});