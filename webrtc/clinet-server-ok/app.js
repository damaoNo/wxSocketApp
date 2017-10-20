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

app.get('/bg-face.png', function(req, res) {
    res.sendfile(__dirname + '/bg-face.png');
});
app.get('/bg-card1.png', function(req, res) {
    res.sendfile(__dirname + '/bg-card1.png');
});
app.get('/bg-card2.png', function(req, res) {
    res.sendfile(__dirname + '/bg-card2.png');
});

app.get('/index_1', function(req, res) {
    res.sendfile(__dirname + '/index_1.html');
});

app.get('/service-single-track', function(req, res) {
    res.sendfile(__dirname + '/admin-service-single-track.html');
});

app.get('/admin-service-single-track.js', function(req, res) {
    res.sendfile(__dirname + '/admin-service-single-track.js');
});

app.get('/service-both-way', function(req, res) {
    res.sendfile(__dirname + '/admin-service-both-way.html');
});

app.get('/admin-service-both-way.js', function(req, res) {
    res.sendfile(__dirname + '/admin-service-both-way.js');
});

app.get('/vue2.0.min.js', function(req, res) {
    res.sendfile(__dirname + '/vue2.0.min.js');
});

app.get('/style.css', function(req, res) {
    res.sendfile(__dirname + '/style.css');
});

app.get('/main.js', function(req, res) {
    res.sendfile(__dirname + '/main.js');
});

app.get('/main_1.js', function(req, res) {
    res.sendfile(__dirname + '/main_1.js');
});

app.get('/common.js', function(req, res) {
    res.sendfile(__dirname + '/common.js');
});

app.get('/adapter-latest.js', function(req, res) {
    res.sendfile(__dirname + '/adapter-latest.js');
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