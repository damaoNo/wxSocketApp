/**
 * Created by Administrator on 2017/7/10.
 */
function commentAPI(value,type) {
    var href="//"+window.location.host;
    if(type==0){
        return href+"/AnyChatFaceXAdmin/"+value;
    }
    if(type==1){
        return href+"/AnyChatFaceXClient/"+value;
    }
    if(type==2){
        return href+"/AnyChatFaceX/"+value;
    }
}

//毫秒转日期时间类/
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function layer() {
    var backdrop='<div class="backdrop"></div><div class="loading"><img src="./images/loading.gif"><span></span></div>';
    $(document.body).append(backdrop);
    $(".backdrop").css("height",$(document.body).height()+100);
}

function formData(birth) {
    var year =birth.slice(0,4);
    var month =birth.slice(4,6) ;
    var date =birth.slice(6,8);
    var curTime=year+"-"+month+"-"+date;
    return curTime;
}