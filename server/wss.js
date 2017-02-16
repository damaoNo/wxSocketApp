/**
 * Created by ChenChao on 2017/2/16.
 */

var https = require('https');
var fs = require('fs');
var ws = require('ws');
var port = 443;

var options = {
      key: fs.readFileSync('./private.pem')
    , cert: fs.readFileSync('./file.crt')
    //, passphrase: '1234'
};

var server = https.createServer(options, function (req, res) {
    //res.writeHead(403);
    res.end('This is a  WebSockets server!\n');
}).listen(port, function () {
    console.log('Https server started at port: ' + port);
});


var wss = new ws.Server( { server: server } );
wss.on( 'connection', function ( wsConnect ) {
    console.log('some one connected!');

    wsConnect.send(new Date().toLocaleString() + '：Hello 来自地球的小伙伴...');

    wsConnect.on( 'message', function ( message ) {
        console.log( message );
    });
});