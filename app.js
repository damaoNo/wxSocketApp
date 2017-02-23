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
        if (this.globalData.userInfo && this.globalData.res) {
            typeof cb == "function" && cb(this.globalData.userInfo, this.globalData.res);
        } else {
            //调用登录接口
            wx.login({
                success: function (res) {
                    that.globalData.res = res;
                    wx.getUserInfo({
                        success: function (_res) {
                            that.globalData.userInfo = _res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo, res);
                        }
                    })
                }
            });
        }
    },
    globalData: {
        userInfo: null
    }
});
