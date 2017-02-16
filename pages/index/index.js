/**
 * Created by ChenChao on 2016/9/27.
 */

var wssTimer = null;

    Page({
    data: {
        isOpen: false,
        message: ''
    },
    onLoad: function () {
        var $this = this;
        connect();
        wx.onSocketError(function(res) {
            console.log('WebSocket连接打开失败，请检查！', res);
        });
        wx.onSocketOpen(function(res) {
            console.log('WebSocket连接已打开！', res);
            console.log('5秒后将自动断开！');
            $this.setData({
                isOpen: true
            });
            setTimeout(function () {
                wx.closeSocket();
            }, 5000);
        });
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已断开！');
            $this.setData({
                isOpen: false
            });
            //断开重连
            console.log('2秒后尝试重新连接...');
            wssTimer = setInterval(function () {
                if(wssTimer && $this.data.isOpen){
                    clearInterval(wssTimer);
                }else{
                    connect();
                }
            }, 2000);
        });
        wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：', res);
            $this.setData({
                message: res.data
            });
        });

        function connect() {
            wx.connectSocket({
                url: 'wss://www.playgame365.xyz'
            });
        }
    }
});