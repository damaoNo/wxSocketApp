/**
 * Created by Administrator on 2017/7/29.
 */
var noConnector=AnyChatConfig.noConnector || '';
$(function () {
    var phoneNumber;
    var anychat = AnyChatSDK();
    if(anychat){
        $("#phoneNext").removeAttr("disabled");
        sessionStorage.areaId= sessionStorage.areaId || UrlQueryString('areaId');
        sessionStorage.queueId= sessionStorage.queueId || UrlQueryString('queueId');
    }else {
        $.messager.popup("你的浏览器不支持H5");
        $(".modal-dialog").css("margin-left",-($(".modal-dialog").width()/2));
        $(".modal-dialog").css("margin-top",-($(".modal-dialog").height()/2));
        $("#phoneNext").addClass("hd");
    }
    $("#phoneNext").unbind("click").on("click",function () {
        var sMobile=$("#phoneText").val();
        if(sMobile==""){
            $(".message span").text("请输入手机号码")
            $(".message").show();
        }else if(!(/^1[3|4|5|7|8]\d{9}$/.test(sMobile))){
            $(".message span").text("手机号码格式有误")
            $(".message").show();
            $("#phoneText").focus();
        }else {
            phoneNumber=sMobile;
            var code=888888;
            layer();
            if(noConnector=='static'){
                var objTradeno={
                    "tradeno":"XXXXXX"+phoneNumber
                };
                var objUserinfo={
                    "phone":phoneNumber
                };

                localStorage.tradenoContent = JSON.stringify(objTradeno);
                localStorage.userinfo=JSON.stringify(objUserinfo);

                AnyChatH5.setStep("productChoice.html");
                window.location.href='productChoice.html';
            }else{
                var ajaxUrl=commentAPI("v1/client/login",1);
                var obj={
                    phonenumber:phoneNumber,
                    smscode:code,
                    logintype:2
                }
                $.ajax({
                    type:"POST",
                    url:ajaxUrl,
                    data:obj,
                    contentType:"application/x-www-form-urlencoded",
                    dataType:"json",
                    success:function(res){
                        if(res.errorcode==0){
                            localStorage.userinfo=JSON.stringify(res.content.user);
                            createTrade(res.content.user.id,res.content.user.phone);
                        }else {
                            $(".backdrop").remove();
                            $(".loading").remove();
                            $.messager.popup(res.msg);
                            $(".modal-dialog").css("margin-left",-($(".modal-dialog").width()/2));
                            $(".modal-dialog").css("margin-top",-($(".modal-dialog").height()/2));
                        }

                    }

                });
            }



        }
    });

    $("#phoneText").bind('input porpertychange',function(){
        $(".message").hide();
    });
})

function UrlQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}


function onlyNum() {
    if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39))
        if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)))
            event.returnValue=false;

}

function createTrade(id,phone) {
    var ajaxUrl=commentAPI("v1/client/trade/createTrade",1);
    $.ajax({
        type:"POST",
        url:ajaxUrl,
        data:{
            customerId: phone,
            phone:phone,
            fxmodel:4
        },
        contentType:"application/json",
        dataType:"json",
        success:function(res){
            if(res.errorcode==0) {
                localStorage.tradenoContent = JSON.stringify(res.content);
				AnyChatH5.setStep("productChoice.html");
                window.location.href='productChoice.html';
            }
        }
    });
}