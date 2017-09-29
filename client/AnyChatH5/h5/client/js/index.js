var UrlQueryString = function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
};
var TimeFormat = function(time){
    var m = Math.floor(time / 60);
    m = m > 9 ? m : (m > 0 ? "0" + m : "00");
    var s = time % 60;
    s = s > 9 ? s : (s > 0 ? "0" + s : "00");
    return m + ":" + s;
};
var UserInfo = JSON.parse(localStorage.userinfo);
var noConnector=AnyChatConfig.noConnector || '';
var ClientData = {
    ip: "", //"h5service.anychat.net.cn"
    port: "", //9940
    appId: "", //"23AEA683-094D-564E-ACA9-76A46CAACFF2"
    areaId: UrlQueryString("hallId") || "2", //营业厅ID
    queueId: UrlQueryString("businessId") || "2002", //队列ID
    custId: UrlQueryString("custId") || UserInfo.phone || "YiLouHuan", //客户ID
    custName: UrlQueryString("custName") || UserInfo.customerName || "忆楼欢", //客户姓名
    certKind: UrlQueryString("certKind") || "身份证", //证件类型
    certCode: UrlQueryString("certCode") || UserInfo.customerId || "420222198710235532", //身份证号码
    priority: UrlQueryString("priority") || 5, //优先级
    src_order_no: UrlQueryString("src_order_no") || "123456", //业务数据流水号
    custInfoUrl: UrlQueryString("custInfoUrl") || "http://xx.xxx.xx?xx=xx", //业务数据url
    takePhoto: 0, //是否需要拍照
    questions: [], //问题列表
    id: 0, //anychat客户登录 ID
    targetId: 0, //anychat座席登录 ID
    roomId: 0, //房间号
    tradeNo: JSON.parse(localStorage.tradenoContent).tradeno,
    timer: -1, // 检查插件是否安装完成定时器
    qtimer: -1, // 排队时长定时器,
    reason:'',//驳回原因;
    result:0//面签结果
};
$.extend(ClientData, {
    AddLog: function(message, type) {
        if (type == LOG_TYPE_API) {			// API调用日志，绿色
            message = message.fontcolor("Green");
        } else if (type == LOG_TYPE_EVENT) {	// 回调事件日志，黄色
            message = message.fontcolor("#CC6600");
        } else if (type == LOG_TYPE_ERROR) {	// 出错日志，红色
            message = message.fontcolor("#FF0000");
        } else {							// 普通日志，灰色
            message = message.fontcolor("#333333");
        }
        $("#LOG_DIV_CONTENT").append(message + "&nbsp" + new Date().toLocaleTimeString().fontcolor("#333333") + "<br />");
    },
    GetID: function(domId) {
        return document.querySelector("#" + domId);
    },
    AXO_Init: function(){ //初始化ActiveXObject
        // 检查是否安装了插件
        var NEED_ANYCHAT_APILEVEL = "0"; // 定义业务层需要的AnyChat
        // API Level
        var errorcode = BRAC_InitSDK(NEED_ANYCHAT_APILEVEL); // 初始化插件（返回成功(0)或插件版本号太低的编号）
        ClientData.AddLog("BRAC_InitSDK(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode, LOG_TYPE_API);
        if (errorcode == GV_ERR_SUCCESS) {
            BRAC_SetSDKOption(BRAC_SO_VIDEOBKIMAGE, "./img/videobk.jpg");
            ClientData.AddLog("AnyChat Plugin Version:" + BRAC_GetVersion(0), LOG_TYPE_NORMAL);
            ClientData.AddLog("AnyChat SDK Version:" + BRAC_GetVersion(1), LOG_TYPE_NORMAL);
            ClientData.AddLog("Build Time:" + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME), LOG_TYPE_NORMAL);
            ClientData.Logic_Init();
        }

        /**
         * 日志抽屉显示
         */
        var is = true;
        $('#LOG_DIV_BODY .left').off().on('click',function(){
            if(is){
                $('#LOG_DIV_BODY').animate({width:"100%"});
                $(this).attr('src','images/right65.png').css('left','0');
            }else{
                $('#LOG_DIV_BODY').animate({width:"0"});
                $(this).attr('src','images/left101.png').css('left','-18px');
            }
            is = !is;
        });
    },
    Logic_Init: function(){
        BRAC_Connect(ClientData.ip, ClientData.port);
    },
    Open_Video_Mic: function(userId){
        var mDevices = BRAC_EnumDevices(BRAC_DEVICE_VIDEOCAPTURE);
        BRAC_SetUserStreamInfo(-1, 0, BRAC_SO_LOCALVIDEO_DEVICENAME,mDevices[0]);
        BRAC_SetUserStreamInfo(-1, 0, BRAC_SO_LOCALVIDEO_BITRATECTRL,150*1000);//kbps
        BRAC_SetUserStreamInfo(-1, 0, BRAC_SO_LOCALVIDEO_WIDTHCTRL,320);
        BRAC_SetUserStreamInfo(-1, 0, BRAC_SO_LOCALVIDEO_HEIGHTCTRL,240);
        log('打开自己摄像头：'+ClientData.id);
        BRAC_UserSpeakControl(-1,1);
        BRAC_UserCameraControlEx(-1,1,0,0,'');
        BRAC_SetVideoPos(-1, document.getElementById('Client-Area'),'self-video');
        
        log('打开对方摄像头：'+ClientData.targetId);
        BRAC_UserSpeakControl(ClientData.targetId,1);
        BRAC_UserCameraControlEx(ClientData.targetId,1,0,0,'');
        BRAC_SetVideoPos(ClientData.targetId, document.getElementById('Agent-Area'),'agent-video');
            
        // /**视频操作*/
		// var errorcode = BRAC_UserCameraControl(userId, 1);
		// ClientData.AddLog("BRAC_UserCameraControl(" + userId + "," + 1 + ")=" + errorcode, LOG_TYPE_API);

		// /**语音操作*/
		// errorcode = BRAC_UserSpeakControl(userId, 1);
		// ClientData.AddLog("BRAC_UserSpeakControl(" + userId + "," + 1 + ")=" + errorcode, LOG_TYPE_API);

    },
    Set_Video_Timer: function(){
        var userList = [];
        var svt = setInterval(function(){
            userList = BRAC_GetOnlineUser();
            if (userList.length == 1 && userList[0] == ClientData.targetId) {
                clearInterval(svt);
                ClientData.Open_Video_Mic(ClientData.targetId);
                // BRAC_SetVideoPos(ClientData.targetId, ClientData.GetID("Agent-Area"), "ANYCHAT_VIDEO_REMOTE");
                // BRAC_SetVideoPos(ClientData.id, ClientData.GetID("Client-Area"), "ANYCHAT_VIDEO_LOCAL");
            }
        }, 500);
    },
    Trans_Buffer: function(userId, jsonObj){
        BRAC_TransBuffer(userId, encodeURI(JSON.stringify(jsonObj)));
    },
    Room_Empty: function(){
        document.querySelector("#Agent-Area").innerHTML = "";
        document.querySelector("#Client-Area").innerHTML = "";
    },
    cancel_queue: function(){
        if(noConnector!='static'){
            $.ajax({
                type:"POST",
                url:"/AnyChatFaceXClient/v1/client/tradeRecord/updateBusinessRecord",
                data:{
                    businessNo: ClientData.tradeNo,
                    agentId: '',
                    agentName: '',
                    state:1
                },
                dataType:"json",
                success:function(res){
                    if(res.errorcode==0){

                    }
                }
            });
        }

        if (ClientData.targetId != 0) {
            /**取消主动呼叫*/
            var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, ClientData.targetId, GV_ERR_SESSION_QUIT, 0, 0, "");
            BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, ClientData.targetId, 0, 0, 0, ""); 
            ClientData.AddLog("BRAC_VideoCallControl(" + BRAC_VIDEOCALL_EVENT_REPLY + "," + ClientData.id + "," + GV_ERR_SESSION_QUIT + ",0,0,''" + ")=" + errorcode, LOG_TYPE_API);
        }
        /**离开队列*/
        errorcode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, ClientData.queueId, ANYCHAT_QUEUE_CTRL_USERLEAVE, 0, 0, 0, 0, "");
        ClientData.AddLog("BRAC_ObjectControl(" + ANYCHAT_OBJECT_TYPE_QUEUE + "," + ClientData.queueId + "," + ANYCHAT_QUEUE_CTRL_USERLEAVE + ",0,0,0,0,''" + ")=" + errorcode, LOG_TYPE_API);
        BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, ClientData.areaId, ANYCHAT_AREA_CTRL_USERLEAVE, 0, 0, 0, 0, "");
        BRAC_Logout();
        location.href = "login.html";
    },
    refesh_queue: function() {
        var waiting = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, ClientData.queueId, ANYCHAT_QUEUE_INFO_LENGTH);
        waiting = waiting <= 0 ? 1 : waiting;
        $("#queue-realtime-no").html(waiting);
        var position = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, ClientData.queueId, ANYCHAT_QUEUE_INFO_BEFOREUSERNUM);
        position = position < 0 ? 1 : position+1;
        $("#queue-realtime-range").html(position);
    },
    create_trade: function(){
        if(noConnector!='static') {
            var req_data = {
                agentId: '',
                agentName: '',
                customerId: ClientData.custId,
                customerName: ClientData.custName,
                businessHallId: ClientData.areaId,
                businessHallName: BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AREA, parseInt(ClientData.areaId), ANYCHAT_OBJECT_INFO_NAME),
                queueId: ClientData.queueId,
                queueName: BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, parseInt(ClientData.queueId), ANYCHAT_OBJECT_INFO_NAME),
                state: 0,
            };
            $.ajax({
                type: "POST",
                url: "/AnyChatFaceXClient/v1/client/tradeRecord/saveBusinessRecord",
                data: req_data,
                dataType: "json",
                success: function (res) {
                    if (res.errorcode == 0) {
                        ClientData.tradeNo = res.content.businessRecordNo;
                    }
                },
                error: function () {
                    console.log("系统错误");
                }
            });
        }
    },
    create_record: function(){
        //生成客户记录
        if(noConnector!='static') {
            $.ajax({
                url: "/AnyChatFaceXClient/v1/client/customerQueue/saveCustomerQueueRecord",
                type: "POST",
                dataType: "json",
                data: {
                    customerId: ClientData.custId,
                    customerName: ClientData.custName,
                    agentId: "",
                    agentName: "",
                    linkState: 0,
                    queueId: ClientData.queueId,
                    queueName: BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, ClientData.queueId, ANYCHAT_OBJECT_INFO_NAME),
                    businessHallId: ClientData.areaId,
                    businessHallName: BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AREA, ClientData.areaId, ANYCHAT_OBJECT_INFO_NAME)
                },
                success: function (redata) {
                    console.log("success");
                    ClientData.admin_queue_id = redata.content && redata.content.id;
                },
                error: function () {
                    console.log("error")
                }
            });
        }
	},
    update_record: function(){
        //更新队列变化
        if(noConnector!='static') {
            $.ajax({
                url: "/AnyChatFaceXClient/v1/client/customerQueue/updateCustomerQueueRecord",
                type: "POST",
                dataType: "json",
                data: {
                    id: ClientData.admin_queue_id,
                    linkState: 1,
                    agentId: ClientData.targetId || "",
                    agentName: BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AGENT, ClientData.targetId, ANYCHAT_OBJECT_INFO_NAME) || ""
                },
                success: function () {
                    console.log("success")
                },
                error: function () {
                    console.log("error")
                }
            });
        }
	},
});
$(function(){
    if(noConnector=='static'){
        ClientData.ip = AnyChatConfig.ip;
        ClientData.port = AnyChatConfig.port;
        ClientData.appId = AnyChatConfig.appId;
        ClientData.questions = AnyChatConfig.questions;
        ClientData.AXO_Init();
    }else{
        $.ajax({
            url: "/AnyChatFaceXClient/v1/client/system/list",
            dataType: "json",
            success: function(res){
                if (res.errorcode == 0) {
                    var mapping = {};
                    res.content.map(function(v){
                        mapping[v.key] = v.value;
                    });
                    ClientData.ip = ClientData.ip || mapping["VIDEO_CALL_INTERNET_IP"];
                    ClientData.port = ClientData.port || mapping["VIDEO_CALL_INTERNET_PORT"];
                    ClientData.appId = ClientData.appId || mapping["BUSINESS_APP_ID"];
                    ClientData.AXO_Init();
                }
            },
            error: function(err){
                console.log("系统错误！");
            }
        });
        // ClientData.AXO_Init();
        $.ajax({
            url: "/AnyChatFaceXClient/v1/client/question/getquestions",
            dataType: "json",
            data: {
                businessHallId: ClientData.areaId,
                queueId: ClientData.queueId
            },
            success: function(res){
                if (res.errorcode == 0) {
                    var questions = [];
                    res.content.map(function(v){
                        questions.push(v.questionDesc);
                    });
                    ClientData.questions = questions;
                }
            },
            error: function(err){
                console.log("系统错误！");
            }
        });
    }


    $("#cancle-queue").on("click",function(){//客户端取消排队;
        ClientData.cancel_queue();
    });
    $("#video-call-refuse-modal").on("hide.bs.modal", function(){
        window.open('','_self','');
        window.close();
    });
    window.onbeforeunload = function(){
        BRAC_Logout();
    }
});
