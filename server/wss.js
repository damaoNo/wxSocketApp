/**
 * Created by ChenChao on 2017/2/16.
 */

var room = require('./room');
var user = require('./user');

module.exports = {
    init: function(WebSocket, wss, socket) {
        socket.send(new Date().toLocaleString() + '：哈喽,来自地球的小伙伴 :)');

        socket.on('message', function(message) {
            console.log('收到客户端消息：', message);
            message = JSON.parse(message);
            var msgType = message.type;
            var data = message.data;
            msgHandler(msgType, data);
        });

        var msgHandlers = {
            getUser: function (data) {
                sendData(user.getUsers());
            },
            otherWise: function (data) {
                sendData('', true);
            }
        };

        function msgHandler(type, data) {
            if(msgHandlers[type]){
                msgHandlers[type](data);
            }else{
                msgHandlers.otherWise(data);
            }
        }

        function sendData(data, isErrorMsgType) {
            if(isErrorMsgType){
                socket.send(JSON.stringify({
                    status: 0,
                    data: '',
                    message: 'Error message type!'
                }));
            }else{
                socket.send(JSON.stringify({
                    status: 1,
                    data: data,
                    message: 'OK'
                }));
            }
        }
    }
};