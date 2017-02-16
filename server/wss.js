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
        });
    }
};