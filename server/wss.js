/**
 * Created by ChenChao on 2017/2/16.
 */

var https = require('https');
var fs = require('fs');
var ws = require('ws');

var options = {
      key: fs.readFileSync('./private.key')
    , cert: fs.readFileSync('./file.crt')
    //, passphrase: '1234'
};

var server = https.createServer(options, function (req, res) {
    //res.writeHead(403);
    res.end("This is a  WebSockets server!\n");
}).listen(25550);


var wss = new ws.Server( { server: server } );
wss.on( 'connection', function ( wsConnect ) {
    console.log('some one connected!');
    wsConnect.on( 'message', function ( message ) {
        console.log( message );
    });
});