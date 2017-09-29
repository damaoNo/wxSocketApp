// AnyChat for Web SDK

/*******************************************************************************
 * 事件回调部分 *
 ******************************************************************************/
// 异步消息通知，包括连接服务器、登录系统、进入房间等消息
function OnAnyChatNotifyMessage(dwNotifyMsg, wParam, lParam) {
	switch (dwNotifyMsg) {
	case WM_GV_CONNECT:
		OnAnyChatConnect(wParam, lParam);
		break;// 连接
	case WM_GV_LOGINSYSTEM:
		OnAnyChatLoginSystem(wParam, lParam);
		break;// 登录系统
	case WM_GV_ENTERROOM:
		OnAnyChatEnterRoom(wParam, lParam);
		break;// 进入房间
	case WM_GV_ONLINEUSER:
		OnAnyChatRoomOnlineUser(wParam, lParam);
		break;// 线上用户
	case WM_GV_USERATROOM:
		OnAnyChatUserAtRoom(wParam, lParam);
		break;// 在房间的用户
	case WM_GV_LINKCLOSE:
		OnAnyChatLinkClose(wParam, lParam);
		break;// 连接关闭
	case WM_GV_MICSTATECHANGE:
		OnAnyChatMicStateChange(wParam, lParam);
		break;// 改变话筒状态
	case WM_GV_CAMERASTATE:
		OnAnyChatCameraStateChange(wParam, lParam);
		break;// 摄像头状态
	case WM_GV_P2PCONNECTSTATE:
		OnAnyChatP2PConnectState(wParam, lParam);
		break;// p2p连接状态
	case WM_GV_PRIVATEREQUEST:
		OnAnyChatPrivateRequest(wParam, lParam);
		break;// 私有请求
	case WM_GV_PRIVATEECHO:
		OnAnyChatPrivateEcho(wParam, lParam);
		break;// 私有输出
	case WM_GV_PRIVATEEXIT:
		OnAnyChatPrivateExit(wParam, lParam);
		break;// 私有离开
	case WM_GV_USERINFOUPDATE:
		OnAnyChatUserInfoUpdate(wParam, lParam);
		break;// 用户信息更新
	case WM_GV_FRIENDSTATUS:
		OnAnyChatFriendStatus(wParam, lParam);
		break;// 友人状态
	default:
		break;
	}
}

// 收到文字消息
function OnAnyChatTextMessage(dwFromUserId, dwToUserId, bSecret, lpMsgBuf,dwLen) {
}

// 收到透明通道传输数据
function OnAnyChatTransBuffer(dwUserId, lpBuf, dwLen) {
	if (lpBuf != ""){
	  	var jsonObj = JSON.parse(decodeURI(lpBuf));
	  	if (jsonObj.cmd == "CMD_Question_Content") {
			$(".TransBufferComponent").removeClass("hide");
			var name = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AGENT, parseInt(ClientData.targetId), ANYCHAT_OBJECT_INFO_NAME);
			var time = new Date();
			var year = time.toLocaleDateString();
			time = time.toLocaleTimeString();
			$("#Question-Content").append('<span class="message">' + name + "&nbsp&nbsp" + time + "</span>" + "<br />"+"<span>" + jsonObj.data.content + "</span>" + "<br />");
			$("#Question-Content").scrollTop(10000);
		} else if (jsonObj.cmd == "CMD_Video_Result") {
			var resultStatus = jsonObj.data.result;
			var data = {
				reasonStatus:resultStatus,
				reasonTxt:jsonObj.data.reason || ''
			};
		    sessionStorage.setItem("resultObj",JSON.stringify(data));
		    AnyChatH5.setStep("taskComplete.html");
			location.href = "taskComplete.html";
//			if (jsonObj.data.result == "200") {
//			} else if (jsonObj.data.result == "500") {
//				location.href = "login.html"; //失败
//			}
			// var global_window = window.parent;
			// console.log(global_window.postMessage);
			// global_window.postMessage(jsonObj, "*");
		}
	}
}

// 收到透明通道（扩展）传输数据
function OnAnyChatTransBufferEx(dwUserId, lpBuf, dwLen, wParam, lParam,dwTaskId) {

}

// 文件传输完成通知
function OnAnyChatTransFile(dwUserId, lpFileName, lpTempFilePath, dwFileLength, wParam, lParam, dwTaskId) {

}

// 系统音量改变通知
function OnAnyChatVolumeChange(device, dwCurrentVolume) {

}

// 收到服务器发送的SDK Filter数据
function OnAnyChatSDKFilterData(lpBuf, dwLen) {

}

// 收到录像或拍照完成事件（扩展：增加errorcode）
function OnAnyChatRecordSnapShotEx2(dwUserId, dwErrorCode, lpFileName, dwElapse, dwFlags, dwParam, lpUserStr) {

}

// AnyChatCoreSDK异步事件
function OnAnyChatCoreSDKEvent(dwEventType, lpEventJsonStr) {
	
}



/*******************************************************************************
 * AnyChat SDK核心业务流程 *
 ******************************************************************************/

// 客户端连接服务器，bSuccess表示是否连接成功，errorcode表示出错代码
function OnAnyChatConnect(bSuccess, errorcode) {
	ClientData.AddLog("OnAnyChatConnect(errorcode=" + errorcode + ")", LOG_TYPE_EVENT);
	BRAC_SetSDKOption(BRAC_SO_CLOUD_APPGUID, ClientData.appId);
	BRAC_Login(ClientData.custId, "", "");
}

// 客户端登录系统，dwUserId表示自己的用户ID号，errorcode表示登录结果：0 成功，否则为出错代码，参考出错代码定义
function OnAnyChatLoginSystem(dwUserId, errorcode) {
    ClientData.AddLog("OnAnyChatLoginSystem(userid=" + dwUserId + ", errorcode=" + errorcode + ")", LOG_TYPE_EVENT);
    if (errorcode == 0) {
		ClientData.id = dwUserId;
		//录像添加时间戳
		BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAYTIMESTAMP,1);
		//业务对象身份初始化
		BRAC_SetSDKOption(BRAC_SO_OBJECT_INITFLAGS, ANYCHAT_OBJECT_FLAGS_CLIENT);
		//客户端用户对象优先级
		BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, dwUserId, ANYCHAT_OBJECT_INFO_PRIORITY, 5);
		//客户端用户对象属性
		BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, dwUserId, ANYCHAT_OBJECT_INFO_ATTRIBUTE, -1);
		//向服务器发送数据同步请求指令
		BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, ANYCHAT_INVALID_OBJECT_ID, ANYCHAT_OBJECT_CTRL_SYNCDATA, dwUserId, 0, 0, 0, "");
	} else if (errorcode == 201) {
		layer.confirm('客户已登录，请勿重复登录', {
			btn: ['确认']
		}, function(){
			window.open('','_self','');
        	window.close();
		});
	}
}

// 客户端进入房间，dwRoomId表示所进入房间的ID号，errorcode表示是否进入房间：0成功进入，否则为出错代码
function OnAnyChatEnterRoom(dwRoomId, errorcode) {
    ClientData.AddLog("OnAnyChatEnterRoom(dwRoomId=" + dwRoomId + ',errorcode=' + errorcode + ')', LOG_TYPE_NORMAL);
	// ClientData.Open_Video_Mic(ClientData.id);
	ClientData.Set_Video_Timer();
}

// 收到当前房间的在线用户信息，进入房间后触发一次，dwUserCount表示在线用户数（包含自己），dwRoomId表示房间ID
function OnAnyChatRoomOnlineUser(dwUserCount, dwRoomId) {
	//打开自己摄像头，语音
}

// 用户进入（离开）房间，dwUserId表示用户ID号，bEnterRoom表示该用户是进入（1）或离开（0）房间
function OnAnyChatUserAtRoom(dwUserId, bEnterRoom) {
	ClientData.AddLog("OnAnyChatUserAtRoom(dwUserId="+dwUserId+',bEnterRoom=' + bEnterRoom +')', LOG_TYPE_NORMAL);
	if (bEnterRoom == 0 && ClientData.id == dwUserId) {
		BRAC_LeaveRoom(ClientData.roomId);
		ClientData.Room_Empty();
	}
}

// 网络连接已关闭，该消息只有在客户端连接服务器成功之后，网络异常中断之时触发，reason表示连接断开的原因
function OnAnyChatLinkClose(reason, errorcode) {
	ClientData.AddLog("OnAnyChatLinkClose(reason: " + reason + ",errorcode: " + errorcode , LOG_TYPE_ERROR);
	
	if(errorcode==209){
		ClientData.AddLog("你的账号在其他的地方被登录，你已经被下线!", LOG_TYPE_ERROR);
	}
	errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, ClientData.targetId, 0, 0, 0, ""); 	// 挂断
	errorcode = BRAC_Logout(); //退出系统
	ClientData.Room_Empty();
	ClientData.AddLog("BRAC_Logout()=" + errorcode, LOG_TYPE_API);
    if(errorcode==0){
    	BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, ClientData.areaId, ANYCHAT_AREA_CTRL_USERLEAVE, 0, 0, 0, 0, "");
	    $("#netClose-modal").modal('show');
    }
}

// 用户的音频设备状态变化消息，dwUserId表示用户ID号，State表示该用户是否已打开音频采集设备（0：关闭，1：打开）
function OnAnyChatMicStateChange(dwUserId, State) {
	
}

// 用户摄像头状态发生变化，dwUserId表示用户ID号，State表示摄像头的当前状态（0：没有摄像头，1：有摄像头但没有打开，2：打开）
function OnAnyChatCameraStateChange(dwUserId, State) {
	
}

// 本地用户与其它用户的P2P网络连接状态发生变化，dwUserId表示其它用户ID号，State表示本地用户与其它用户的当前P2P网络连接状态（0：没有连接，1：仅TCP连接，2：仅UDP连接，3：TCP与UDP连接）
function OnAnyChatP2PConnectState(dwUserId, State) {

}

// 用户发起私聊请求，dwUserId表示发起者的用户ID号，dwRequestId表示私聊请求编号，标识该请求
function OnAnyChatPrivateRequest(dwUserId, dwRequestId) {

}

// 用户回复私聊请求，dwUserId表示回复者的用户ID号，errorcode为出错代码
function OnAnyChatPrivateEcho(dwUserId, errorcode) {

}

// 用户退出私聊，dwUserId表示退出者的用户ID号，errorcode为出错代码
function OnAnyChatPrivateExit(dwUserId, errorcode) {

}

// 视频通话消息通知回调函数
function OnAnyChatVideoCallEvent(dwEventType, dwUserId, dwErrorCode, dwFlags,dwParam, szUserStr) {
	switch(dwEventType)
	{
		case BRAC_VIDEOCALL_EVENT_REQUEST:
			//收到视频呼叫请求 
			onVideoCallControlRequest(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
			break;
		case BRAC_VIDEOCALL_EVENT_REPLY:
			////视频呼叫请求回复 
		    onVideoCallControlReply(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
			break;
		case BRAC_VIDEOCALL_EVENT_START:
			//通话开始 
			onVideoCallControlStart(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
			break;
		case BRAC_VIDEOCALL_EVENT_FINISH:
			//视频通话结束 
		     onVideoCallControlFinish(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
			break; 
		
	}
}
//视频呼叫请求回复
function onVideoCallControlReply(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	switch(dwErrorCode)
	{
		case GV_ERR_SUCCESS:
			break;
		case GV_ERR_SESSION_QUIT:
			ClientData.AddLog("用户主动放弃会话", LOG_TYPE_ERROR);
			BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, ClientData.targetId, 0, 0, 0, ""); 	// 挂断
			break;
		case GV_ERR_SESSION_OFFLINE:
		    ClientData.AddLog("目标用户不在线",LOG_TYPE_ERROR);
			break;
		case GV_ERR_SESSION_BUSY:
			ClientData.AddLog("目标用户忙", LOG_TYPE_ERROR);
			BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, ClientData.targetId, 0, 0, 0, "");
			break; 
		case GV_ERR_SESSION_REFUSE:
			BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, ClientData.targetId, 0, 0, 0, "");	
			/**离开队列*/
			BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, ClientData.queueId, ANYCHAT_QUEUE_CTRL_USERLEAVE, 0, 0, 0, 0, "");
			// 离开营业厅
			BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, ClientData.areaId, ANYCHAT_AREA_CTRL_USERLEAVE, 0, 0, 0, 0, "");
			ClientData.AddLog("目标用户拒绝会话", LOG_TYPE_ERROR);
			$("#video-call-refuse-modal").modal("show");
			break; 
		case GV_ERR_SESSION_TIMEOUT:
			ClientData.AddLog("会话请求超时",LOG_TYPE_ERROR);
			break; 
		case GV_ERR_SESSION_DISCONNECT:
			ClientData.AddLog("网络断线",LOG_TYPE_ERROR);
			break; 
		default:
			break;
	}
}
function onVideoCallControlStart(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	//请求进入指定的房间
	ClientData.roomId = dwParam;
	var errorcode = BRAC_EnterRoom(dwParam, "", 0);
	$("#Agent-Username").html(BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AGENT, parseInt(ClientData.targetId), ANYCHAT_OBJECT_INFO_NAME));
	$("#Agent-AnyChatId").html(BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AGENT, parseInt(ClientData.targetId), ANYCHAT_OBJECT_INFO_NAME));
	$("#Prepare").hide();
	$("#Video").show();
	clearInterval(ClientData.qtimer);
}
//视频通话结束
function onVideoCallControlFinish(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr)
{
	BRAC_LeaveRoom(ClientData.roomId);
	ClientData.Room_Empty();
}
// 用户信息更新通知，dwUserId表示用户ID号，dwType表示更新类别
function OnAnyChatUserInfoUpdate(dwUserId, dwType) {

}

// 好友在线状态变化，dwUserId表示好友用户ID号，dwStatus表示用户的当前活动状态：0 离线， 1 上线
function OnAnyChatFriendStatus(dwUserId, dwStatus) {

}

//业务对象事件通知
function OnAnyChatObjectEvent(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam) {
	console.log("dwEventType:" + dwEventType);
	switch(dwEventType) {
	    case ANYCHAT_OBJECT_EVENT_UPDATE: OnAnyChatObjectUpdate(dwObjectType, dwObjectId); break;
	    case ANYCHAT_OBJECT_EVENT_SYNCDATAFINISH: OnAnyChatObjectSyncDataFinish(dwObjectType, dwObjectId); break;
		case ANYCHAT_AREA_EVENT_ENTERRESULT:	OnAnyChatEnterAreaResult(dwObjectType, dwObjectId, dwParam1);	break;
		case ANYCHAT_AREA_EVENT_LEAVERESULT:    OnAnyChatLeaveAreaResult(dwObjectType, dwObjectId, dwParam1); break;
		case ANYCHAT_AREA_EVENT_STATUSCHANGE:   OnAnyChatAreaStatusChange(dwObjectType, dwObjectId, dwParam1); break;
		case ANYCHAT_QUEUE_EVENT_STATUSCHANGE:	OnAnyChatQueueStatusChanged(dwObjectType, dwObjectId);			break;
		case ANYCHAT_QUEUE_EVENT_ENTERRESULT:	OnAnyChatEnterQueueResult(dwObjectType, dwObjectId, dwParam1);	break;
		case ANYCHAT_QUEUE_EVENT_LEAVERESULT:	OnAnyChatLeaveQueueResult(dwObjectType, dwObjectId, dwParam1);	break;
		case ANYCHAT_AGENT_EVENT_STATUSCHANGE: OnAnyChatAgentStatusChanged(dwObjectType, dwObjectId, dwParam1); break;
		case ANYCHAT_AGENT_EVENT_SERVICENOTIFY: OnAnyChatServiceStart(dwParam1, dwParam2, dwParam3); break;
		case ANYCHAT_AGENT_EVENT_WAITINGUSER:   OnAnyChatAgentWaitingUser(); break;
		case ANYCHAT_AGENT_EVENT_ISREADY:  OnAnyChatAgentprepared(dwParam1, dwParam2, dwParam3);break;
		default:
			break;
	}
}

//业务对象数据更新事件
function OnAnyChatObjectUpdate(dwObjectType, dwObjectId) {
    ClientData.AddLog('OnAnyChatObjectUpdate(' + dwObjectType + ',' + dwObjectId + ')', LOG_TYPE_EVENT);

	if(dwObjectType == ANYCHAT_OBJECT_TYPE_AREA) {	
		
	} else if(dwObjectType == ANYCHAT_OBJECT_TYPE_QUEUE) {
		
	} else if(dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT) {
		
	}
}

//业务对象同步完成事件
function OnAnyChatObjectSyncDataFinish(dwObjectType, dwObjectId) {
    ClientData.AddLog('OnAnyChatObjectSyncDataFinish(' + dwObjectType + ',' + dwObjectId + ')', LOG_TYPE_EVENT);

	if (dwObjectType == ANYCHAT_OBJECT_TYPE_AREA) {
        var errorcode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, 2, ANYCHAT_AREA_CTRL_USERENTER, 0, 0, 0, 0, "");             
		ClientData.AddLog("BRAC_ObjectControl(" + ANYCHAT_OBJECT_TYPE_AREA + "," + 2 + "," + ANYCHAT_AREA_CTRL_USERENTER + ",0,0,0,0,''" + ")=" + errorcode, LOG_TYPE_API); 
    }
}

// 进入服务区域通知事件
function OnAnyChatEnterAreaResult(dwObjectType, dwObjectId, dwErrorCode) {
	ClientData.AddLog('OnAnyChatEnterAreaResult(' + dwObjectType + ',' + dwObjectId +','+dwErrorCode + ')', LOG_TYPE_EVENT);
	if (dwErrorCode == 0) {
		/**进入队列*/
		var errorcode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, ClientData.queueId, ANYCHAT_QUEUE_CTRL_USERENTER, 0, 0, 0, 0, "");
		ClientData.AddLog("BRAC_ObjectControl(" + ANYCHAT_OBJECT_TYPE_QUEUE + "," + ClientData.queueId + "," + ANYCHAT_QUEUE_CTRL_USERENTER + ",0,0,0,0,''" + ")=" + errorcode, LOG_TYPE_API);
	}
}

//进入队列通知事件
function OnAnyChatEnterQueueResult(dwObjectType, dwObjectId, dwParam1){
	ClientData.AddLog('OnAnyChatEnterQueueResult(' + dwObjectType + ',' + dwObjectId + ',' + dwParam1 + ')', LOG_TYPE_EVENT);
	if (dwParam1 == 0) {
		ClientData.refesh_queue();
		$("#Bussiness-Title").html(BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, parseInt(ClientData.queueId), ANYCHAT_OBJECT_INFO_NAME));
		$("#Bussiness-Description").html();
		$("#App > div").hide();
        $("#productContent").text(localStorage.productContent);
        $("#queueId").text(ClientData.queueId)
		$("#App > .process-queue").show();
		var second = 0;
		var timer_box = $("#Waiting-Duration");
		ClientData.qtimer = setInterval(function(){
			second++;
			timer_box.html(TimeFormat(second));	
		}, 1000);
		// ClientData.create_trade();//排队成功后，创建流水
		ClientData.create_record();//排队成功后，创建客户记录
	}
}

function OnAnyChatLeaveQueueResult(dwObjectType, dwObjectId, dwParam1) {
	console.log("您已经离开队列");
	ClientData.update_record();
}
// 离开服务区域通知事件
function OnAnyChatLeaveAreaResult(dwObjectType, dwObjectId, dwErrorCode) {
    ClientData.AddLog('OnAnyChatLeaveAreaResult(' + dwObjectType + ',' + dwObjectId + ',' + dwErrorCode + ')', LOG_TYPE_EVENT);
}

//营业厅状态变化
function OnAnyChatAreaStatusChange(dwObjectType, dwObjectId, dwErrorCode) {
    ClientData.AddLog('OnAnyChatAreaStatusChange(' + dwObjectType + ',' + dwObjectId + ',' + dwErrorCode + ')', LOG_TYPE_EVENT);
}

// 队列状态变化
function OnAnyChatQueueStatusChanged(dwObjectType, dwObjectId) {
    ClientData.AddLog('OnAnyChatQueueStatusChanged(' + dwObjectType + ',' + dwObjectId + ')', LOG_TYPE_EVENT);
	ClientData.refesh_queue();
}


// 坐席状态变化
function OnAnyChatAgentStatusChanged(dwObjectType, dwObjectId, dwParam1) {
    ClientData.AddLog('OnAnyChatAgentStatusChanged(' + dwObjectType + ',' + dwObjectId + ',' + dwParam1 + ')', LOG_TYPE_EVENT);
}

// 坐席服务开始
function OnAnyChatServiceStart(dwAgentId, clientId, dwQueueId) {
    ClientData.AddLog('OnAnyChatServiceStart(' + dwAgentId + ',' + clientId + ',' + dwQueueId +')', LOG_TYPE_EVENT);
}

//队列里没有客户，坐席端处理方式
function OnAnyChatAgentWaitingUser(){
    ClientData.AddLog('OnAnyChatAgentWaitingUser()', LOG_TYPE_EVENT);
}


//客户收到坐席准备好
function OnAnyChatAgentprepared(dwAgentId, clientId, dwQueueId){
	ClientData.AddLog('OnAnyChatAgentprepared(' + dwAgentId + ',' + clientId + ',' + dwQueueId +')', LOG_TYPE_EVENT);
	console.log('客户收到通知');
	ClientData.targetId = dwAgentId;//用户id
	var ua = navigator.userAgent.toLowerCase();
	var platform = /(android|iphone)/.test(ua) ? "android" : "other";
	/**向指定的用户发送会话邀请*/
	var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REQUEST, ClientData.targetId, 0, 0, 0, "");
	ClientData.AddLog("BRAC_VideoCallControl(" + BRAC_VIDEOCALL_EVENT_REQUEST + "," + ClientData.targetId + "," + "0,0,0,''" + ")=" + errorcode, LOG_TYPE_API);
	ClientData.Trans_Buffer(dwAgentId, {
		cmd: "CMD_Trade_No",
		data: {
			tradeNo: ClientData.tradeNo,
			platform: platform,
			codingModel: 1,
			questions: ClientData.questions,
			search: location.search,
			clientTypeTag: "service"
		}
	});
}