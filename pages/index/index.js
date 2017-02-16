/**
 * Created by ChenChao on 2016/9/27.
 */

var config = require('../../server/config');
var app = getApp();
var wssTimer = null;
var isAutoConnect = false;
var message = [];

Page({
    data: {
        userInfo: {},
        sysInfo: {},
        networkType: '',
        isOpen: false,
        statusMsg: '已断开',
        message: message
    },
    onLoad: function () {
        this.userInfo();
        this.wssInit();
    },
    userInfo: function () {
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            });
        });
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sysInfo: res
                });
            }
        });
        wx.getNetworkType({
            success: function(res) {
                that.setData({
                    networkType: res.networkType
                });
            }
        });
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
                $this.sendMessage('Hi, 你好吗？');
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
            message.push(res.data);
            $this.setData({
                message: message
            });
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
    sendMessage: function (data, msg) {
        if(this.data.isOpen){
            console.log('尝试向服务器发送消息：', data);
            wx.sendSocketMessage({
                data: data
            });
        }
    }
});

function connect() {
    wx.connectSocket({
        url: config.wssUrl
    });
}