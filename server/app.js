/**
 * Created by ChenChao on 2017/2/16.
 */

var https = require('https');
var fs = require('fs');
var exec = require('child_process').exec;
var WebSocket = require('ws');
var express = require('express');
var config = require('./config');
var wsHandler = require('./wss');
var port = config.httpsPort;
var app = express();
var appId = config.appId;
var secret = config.secret;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/.well-known/pki-validation/fileauth.htm', function (req, res) {
    res.setHeader('content-type', 'text/plain');
    res.send(fs.readFileSync('./fileauth.htm'));
});

app.post('/order', function (req, res) {
    var jsCode = req.body.js_code;
    var grantType = 'authorization_code';
    console.log('jsCode: ', jsCode);
    createNewSession(appId, secret, jsCode, grantType, res, function (result) {
        var openid = result.openid;
        console.log('openid: ', openid);
        var formId = req.body.formId;
        var grantType = 'client_credential';
        console.log('formId: ', formId);
        var url = `https://api.weixin.qq.com/cgi-bin/token?appid=${appId}&secret=${secret}&grant_type=${grantType}`;
        https.get(url, function (_res) {
            var body = '';
            _res.on('data', function (data) {
                body += data;
            });
            _res.on('end', function () {
                try {
                    var result = JSON.parse(body);
                    // {"access_token": "ACCESS_TOKEN", "expires_in": 7200}
                    // {"errcode": 40013, "errmsg": "invalid appid"}
                    if (result.access_token) {
                        // https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=ACCESS_TOKEN
                        var data = {
                            "touser": openid,
                            "template_id": "KMIzdFkIWdoMCKOTaPxQVmhQxTW5wmFznwqn2PyHIk0",
                            "form_id": formId,
                            "data": {
                                "keyword3": {
                                    "value": "粤海喜来登酒店",
                                    "color": "#173177"
                                }
                            }
                        };
                        data = JSON.stringify(data);
                        var opt = {
                            method: 'POST',
                            host: 'https://api.weixin.qq.com',
                            path: `/cgi-bin/message/wxopen/template/send?access_token=${result.access_token}`,
                            headers: {
                                "Content-Type": 'application/json',
                                "Content-Length": data.length
                            }
                        };
                        var httpsReq = https.request(opt, function (serverFeedback) {
                            if (serverFeedback.statusCode == 200) {
                                var body = "";
                                serverFeedback.on('data', function (data) {
                                    body += data;
                                }).on('end', function () {
                                    res.send(body);
                                });
                            } else {
                                res.send("发送消息失败：500 error！");
                            }
                        });
                        httpsReq.write(data + "\n");
                        httpsReq.end();
                    } else {
                        res.send(result);
                    }
                } catch (e) {
                    res.send(body);
                }
            })
        }).on('error', function (err) {
            res.send(err);
        });
    });
});

function createNewSession(appId, secret, jsCode, grantType, res, callback) {
    var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${jsCode}&grant_type=${grantType}`;
    https.get(url, function (_res) {
        var body = '';
        _res.on('data', function (data) {
            body += data;
        });
        _res.on('end', function () {
            try {
                var result = JSON.parse(body);
                if (result.openid) {
                    callback(result);
                } else {
                    res.send(result);
                }
            } catch (e) {
                res.send(body);
            }
        })
    }).on('error', function (err) {
        res.send(err);
    });
}

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