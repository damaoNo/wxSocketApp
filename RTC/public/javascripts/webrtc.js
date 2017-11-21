/**
 * Created by ChenChao on 2017/11/2.
 */

var _env = 'dev2';
var config = require('./config')(_env);
var logger = require('./logger')(config.logger);
var util = require('./util');
var media = require('./media');

module.exports.ready = function (onReady, onJoinRoom, onRoomFull) {
    // 获取两个视频video
    var localVideo = document.getElementById('localVideo');
    var remoteVideo = document.getElementById('remoteVideo');
    var originData = util.parseUrl(window.location.href);
    var roomId = originData.params.roomId;
    var isCustomer = originData.hash === 'customer';
    logger('身份：' + originData.hash);
    logger('房间号：' + roomId);
    document.getElementById('remoteDiv').style.display = isCustomer ? 'none' : 'block';
    document.getElementById('actions').style.display = isCustomer ? 'block' : 'none';

    var mediaRecord;
    window.recordedBlobs = [];
    // 与信令服务器的WebSocket连接
    var socket = new WebSocket(config.wsServer);
    // 创建PeerConnection实例
    var RTCPeer = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    var pc = new RTCPeer(config.iceServer);
    // socket信令处理
    socket.onopen = function() {
	logger('socket已连接!');
	socket.send(JSON.stringify({
	    event: 'ping',
	    type: originData.hash,
	    roomId: roomId
	}));
    };
    socket.onerror = function(e) {
	logger('socket连接出错!');
	logger(JSON.stringify(e));
    };
    socket.onclose = function() {
	logger('socket已关闭!');
    };
    socket.onmessage = function (event) {
	var json = JSON.parse(event.data);
	console.log(json);
	logger('onmessage: ' + json.event);
	
	//收到ping后正式开启rtc
	if(json.event === 'ping'){
	    if(json.type === 'customer'){
		onReady && onReady(socket);
		window._RTC_ROOMID = json.roomId;
		return;
	    }
	    if(json.type === 'service'){
		startWebRtc();
		socket.send(JSON.stringify({
		    event: 'service ready',
		    type: 'service',
		    roomId: json.roomId
		}));
		window._RTC_ROOMID = json.roomId;
		return;
	    }
	}

	if(json.event === 'full' && isCustomer){
	    console.log('房间已满...');
	    onRoomFull && onRoomFull();
	    return;
	}
	if(json.event === 'join' && isCustomer){
	    console.log('准备开始双向视频了...');
	    onJoinRoom && onJoinRoom(startWebRtc, json.roomId);
	    return;
	}
	
	//开始录制
	if(json.event === 'record start'){
	    console.log('收到录制请求，开始录制...');
	    recordedBlobs = [];
	    mediaRecord = media.record({
		setting: config.videoOptions,
		handlerStop: function (event) {
		    console.log('Recorder stopped: ', event);
		},
		handleDataAvailable: function (event) {
		    if (event.data && event.data.size > 0) {
			console.log('record data:', event.data);
			socket.send(event.data);
			recordedBlobs.push(event.data);
		    }
		}
	    });
	    socket.send(JSON.stringify({
		event: 'record start',
		type: 'service',
		roomId: window._RTC_ROOMID
	    }));
	    return;
	}

	//结束录制
	if(json.event === 'record over'){
	    console.log('收到请求，停止录制...');
	    mediaRecord && mediaRecord.stop();
	    socket.send(JSON.stringify({
		event: 'record over',
		type: 'service',
		roomId: window._RTC_ROOMID
	    }));
	    return;
	}

	//确认录制
	if(json.event === 'record apply'){
	    console.log('收到请求，确认录制！');
	    socket.send(JSON.stringify({
		event: 'apply',
		type: 'service',
		roomId: window._RTC_ROOMID
	    }));
	    return;
	}

	if(json.event === 'record failed'){
	    console.log('视频录制失败原因：', json.errorMessage);
	    return;
	}
	if(json.event === 'record success'){
	    console.log('视频录制成功，保存路径：', json.path);
	    return;
	}
	if(json.event === 'room close'){
	    console.log('视频结束!');
	    window.close();
	    return;
	}

	//如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
	if (json.event === "_ice_candidate") {
	    pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
	    return;
	}
	if(json.event === "_offer" || json.event === "_answer"){
	    pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp));
	    // 如果是一个offer，那么需要回复一个answer
	    if (json.event === "_offer") {
		logger('收到视频请求，发送回应');
		pc.createAnswer(function (desc) {
		    logger('answer sdp:sdp.type' + desc.type);
		    pc.setLocalDescription(desc);
		    socket.send(JSON.stringify({
			"event": "_answer",
			"roomId": window._RTC_ROOMID,
			"caller": "false",
			"data": {
			    "sdp": desc
			}
		    }));
		}, function (error) {
		    logger('Answer failure callback: ' + error);
		});
	    }
	}
    };

    // 发送ICE候选到其他客户端
    pc.onicecandidate = function (event) {
	if (event.candidate !== null) {
	    socket.send(JSON.stringify({
		"event": "_ice_candidate",
		"roomId": window._RTC_ROOMID,
		"_ice_candidate_type": originData.hash,
		"data": {
		    "candidate": event.candidate
		}
	    }));
	}
    };
    // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
    pc.onaddstream = function (event) {
	console.log('stream remote:', event.stream);
	window._Rtc_Stream = event.stream;
	logger('收到远程视频流，开始视频了...');
	if ("srcObject" in remoteVideo) {
	    remoteVideo.srcObject = event.stream;
	} else {
	    remoteVideo.src = window.URL && window.URL.createObjectURL(event.stream) || event.stream;
	}
    };

    function startWebRtc(isCaller, roomId) {
	window._RTC_ROOMID = roomId;
	//启动摄像头
	media.start(function successFunc(stream) {
	    console.log('stream local:', stream);
	    if ("srcObject" in localVideo) {
		localVideo.srcObject = stream;
	    } else {
		localVideo.src = window.URL && window.URL.createObjectURL(stream) || stream;
	    }
	    //向PeerConnection中加入需要发送的流
	    logger('向PeerConnection中加入需要发送的流...');
	    pc.addStream(stream);
	    //如果是发起方则发送一个offer信令
	    if (isCaller) {
		logger('发起双向视频请求...');
		pc.createOffer(function (desc) {
		    logger('offer sdp:sdp.type:' + desc.type);
		    pc.setLocalDescription(desc);
		    socket.send(JSON.stringify({
			"event": "_offer",
			"caller": "true",
			"roomId": window._RTC_ROOMID,
			"data": {
			    "sdp": desc
			}
		    }));
		}, function (error) {
		    logger('sendOffer failure callback: ' + error);
		});
	    }
	}, function errorFunc(err) {
	    logger('本地摄像头输出流异常：' + err.name);
	});
    }

    var btnReplay = document.getElementById('btn-replay');
    btnReplay.onclick = function () {
	console.log('回放视频：');
	var recordedVideo = document.querySelector('video#replayVideo');
	var superBuffer = new Blob(window.recordedBlobs, {type: 'video/webm'});
	recordedVideo.src = window.URL.createObjectURL(superBuffer);
    };
};