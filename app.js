/**
 * Created by ChenChao on 2017/1/12.
 */

App({
    onLaunch: function () {

    },
    onShow: function () {
        //todo
    },
    onHide: function () {
        //todo
    },
    getUserInfo: function (cb) {
        var that = this;

        //调用登录接口
        wx.login({
            success: function (res) {
                if (that.globalData.userInfo) {
                    typeof cb == "function" && cb(that.globalData.userInfo, res);
                } else {
                    wx.getUserInfo({
                        success: function (_res) {
                            that.globalData.userInfo = _res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo, res);
                        }
                    })
                }
            }
        });
    },
    globalData: {
        userInfo: null
    }
});

//做一下文件改动 就是测试下