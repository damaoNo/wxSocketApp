/**
 * Created by ChenChao on 2017/10/31.
 * 信令服务
 */

var https = require('https');
var signalServer = require('./core/signal-server');
var log = require('./core/log');
var config = require('./config');
var port = config.port;

//开启信令服务
signalServer(https.createServer({
    key: config.key,
    cert: config.cert
}, function (req, res) {
    res.writeHead(200);
    res.end('hello\n');
}).listen(port, function listening() {
    console.log(`信令服务已启动，端口: ${port}`);
    log(`信令服务已启动，端口: ${port}`);
}));

process.on('uncaughtException', function (err) {
    console.log(`Caught exception: ${err}`);
    log(`Caught exception: ${err}`);
});
process.on('exit', function (code) {
    console.log(`Caught exception before exit: ${code}`);
    log(`Caught exception before exit: ${code}`);
});