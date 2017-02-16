/**
 * Created by ChenChao on 2016/9/27.
 */

var app = getApp();

Page({
    data: {
    },
    onLoad: function () {
        wx.connectSocket({
            url: 'wss://www.playgame365.xyz'
        });
        wx.onSocketOpen(function(res) {
            console.log('WebSocket连接已打开！', res);
        });
        wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：', res);
        })
    }
});