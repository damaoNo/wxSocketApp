/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = {
    dateFormat: function (fmt) {
	var o = {
	    "M+": this.getMonth() + 1, //月份
	    "d+": this.getDate(), //日
	    "H+": this.getHours(), //小时
	    "m+": this.getMinutes(), //分
	    "s+": this.getSeconds(), //秒
	    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
	    "S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) {
	    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (let k in o){
	    if(o.hasOwnProperty(k)){
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    }
	}
	return fmt;
    },
    randomId: function () {
	var r = Math.random() * 1000000;
	r = Math.ceil(r);
	while(r.toString().length < 6){
	    r = r * 10;
	}
	return r;
    }
};