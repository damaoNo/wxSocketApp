/**
 * Created by ChenChao on 2016/9/27.
 */

var config = require('../../server/config');
var wssTimer = null;
var isAutoConnect = false;
var message = [];

Page({
    data: {
        isOpen: false,
        statusMsg: '已断开',
        message: message
    },
    onLoad: function () {
        this.wssInit();
    },
    wssInit: function () {
        var $this = this;
        $this.connectWss();
        wx.onSocketError(function(res) {
            console.log('WebSocket连接打开失败，请检查！', res);
            $this.setData({
                isOpen: false,
                statusMsg: '已断开'
            });
        });
        wx.onSocketOpen(function(res) {
            console.log('WebSocket连接已打开！', res);
            $this.setData({
                isOpen: true,
                statusMsg: '已连接'
            });
            setTimeout(function () {
                $this.sendMessage({type: 'getUser', data: 'Hi, 你好吗？'});
            }, 1000);
            if(isAutoConnect){
                console.log('10秒后将自动断开！');
                setTimeout(function () {
                    wx.closeSocket();
                }, 10000);
            }
        });
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已断开！');
            $this.setData({
                isOpen: false,
                statusMsg: '已断开'
            });
            //断开重连
            if(isAutoConnect){
                console.log('2秒后尝试重新连接...');
                wssTimer = setInterval(function () {
                    if(wssTimer && $this.data.isOpen){
                        clearInterval(wssTimer);
                    }else{
                        $this.connectWss();
                    }
                }, 2000)
            }
        });
        wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：', res);
            $this.msgHandler(res.data);
        });
    },
    connectWss: function () {
        this.setData({
            statusMsg: '连接中...'
        });
        connect();
    },
    disconnectWss: function () {
        wx.closeSocket();
    },
    sendMessage: function (data) {
        if(this.data.isOpen){
            console.log('尝试向服务器发送消息：', data);
            wx.sendSocketMessage({
                data: JSON.stringify(data)
            });
        }
    },
    msgHandler: function (msg) {
        console.log(msg);
        try {
            msg = JSON.parse(msg);
            if(msg.type == 'getUser'){
                console.log('[users]', msg.data);
            }
            if(msg.type == 'voice'){
                console.log('[voice message]', msg.data);
                wx.downloadFile({
                    url: 'https://www.nodejser.site/getVoice?name=' + msg.data.name,
                    success: function(res) {
                        console.log(res);
                        wx.playVoice({
                            filePath: res.tempFilePath
                        });
                    }
                });
            }
        }catch (e){
            message.push(msg);
            this.setData({
                message: message
            });
        }
    },
    onSpeak: function () {
        var that = this;
        console.log('start record!');
        wx.startRecord({
            success: function(res) {
                console.log('record over!');
                var tempFilePath = res.tempFilePath;
                var name = 'voice_' + +new Date();
                wx.uploadFile({
                    url: 'https://www.nodejser.site/saveRecord?name=' + name,
                    filePath: tempFilePath,
                    name: name,
                    formData:{
                        'name': name
                    },
                    success: function(res){
                        var data = res.data;
                        console.log(data);
                        that.sendMessage({type: 'voice', data: { name: name }});
                        /*wx.downloadFile({
                            url: 'https://www.nodejser.site/getVoice?name=' + name,
                            success: function(res) {
                                console.log(res);
                                wx.playVoice({
                                    filePath: res.tempFilePath
                                });
                            }
                        });*/
                    }
                })
            }
        })
    },
    onSpeakEnd: function () {
        console.log('stop record!');
        wx.stopRecord();
    }
});

function connect() {
    wx.connectSocket({
        url: config.wssUrl
    });
}