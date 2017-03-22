/**
 * Created by ChenChao on 2016/9/27.
 */

var config = require('../../server/config');
var app = getApp();

Page({
    data: {
        userInfo: {},
        sysInfo: {},
        networkType: ''
    },
    onLoad: function () {
        this.userInfo();
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
    }
});