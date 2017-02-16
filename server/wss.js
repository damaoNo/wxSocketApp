/**
 * Created by ChenChao on 2017/2/16.
 */

var room = require('./room');
var user = require('./user');

module.exports = {
    init: function(WebSocket, wss, socket) {
        socket.send(new Date().toLocaleString() + '：哈喽,来自地球的小伙伴 :)');

        socket.on('message', function(message) {
            console.log('收到客户端消息：', JSON.stringify(message));
            var msgType = message.type;
            var data = message.data;
            msgHandler(msgType, data);
        });

        var msgHandlers = {
            getUser: function (data) {
                socket.send({data: user.getUsers(), status: 1, message: 'OK'});
            },
            otherWise: function (data) {
                socket.send({data: '', status: 0, message: 'Error message type!'});
            }
        };

        function msgHandler(type, data) {
            if(msgHandlers[type]){
                msgHandlers[type](data);
            }else{
                msgHandlers.otherWise(data);
            }
        }
    }
};