/**
 * Created by ChenChao on 2017/2/16.
 */

var room = require('./room');
var user = require('./user');

module.exports = {
    init: function(WebSocket, wss, socket) {
        var id = Math.random().toString(36).substr(2);
        user.connectUser(id);

        socket.send(new Date().toLocaleString() + '：哈喽, ' + id);

        socket.on('message', function(message) {
            console.log('收到客户端消息：', message);
            message = JSON.parse(message);
            var msgType = message.type;
            var data = message.data;
            msgHandler(msgType, data);
        });

        socket.on('close', function (code, reason) {
            console.log(id, '离开了');
            user.disConnectUser(id);
        });

        //消息类型处理器
        var msgHandlers = {
            getUser: function () {
                sendData(user.getUsers());
            },
            otherWise: function () {
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