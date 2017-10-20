/**
 * Created by ChenChao on 2017/7/17.
 */

var fs = require('fs');
var https = require('https');
var app = require('express')();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/test', function(req, res) {
    res.sendfile(__dirname + '/index_111.html');
});

app.get('/style.css', function(req, res) {
    res.sendfile(__dirname + '/style.css');
});

app.get('/bg-face.png', function(req, res) {
    res.sendfile(__dirname + '/bg-face.png');
});
app.get('/bg-card1.png', function(req, res) {
    res.sendfile(__dirname + '/bg-card1.png');
});
app.get('/bg-card2.png', function(req, res) {
    res.sendfile(__dirname + '/bg-card2.png');
});

app.get('/main.js', function(req, res) {
    res.sendfile(__dirname + '/main.js');
});

app.get('/webrtc.io.js', function(req, res) {
    res.sendfile(__dirname + '/webrtc.io.js');
});

var port = process.env.PORT || 8880;
var options = {
    key: fs.readFileSync(__dirname + '/keys/214025060130250.key'),
    cert: fs.readFileSync(__dirname + '/keys/214025060130250.pem')
};
var server = https.createServer(options, app).listen(port, function listening() {
    console.log('Client server listening on %d', server.address().port);
});