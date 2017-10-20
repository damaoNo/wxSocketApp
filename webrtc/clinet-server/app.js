/**
 * Created by ChenChao on 2017/2/16.
 */

var https = require('https');
var fs = require('fs');
var util = require('util');
var express = require('express');
var port = 8888;
var app = express();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.use(function (req, res) {
    res.send('hello world!');
});

var options = {
    key: fs.readFileSync(__dirname + '/keys/214025060130250.key'),
    cert: fs.readFileSync(__dirname + '/keys/214025060130250.pem')
};
var server = https.createServer(options, app).listen(port, function listening() {
    console.log('Listening on %d', server.address().port);
});