/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = {
    parseUrl: function (url) {
	var a = document.createElement('a');
	a.href = url;
	return {
	    source: url,
	    protocol: a.protocol.replace(':',''),
	    host: a.hostname,
	    port: a.port,
	    query: a.search,
	    params: (function(){
		var ret = {},
		    seg = a.search.replace(/^\?/,'').split('&'),
		    len = seg.length, i = 0, s;
		for (;i<len;i++) {
		    if (!seg[i]) { continue; }
		    s = seg[i].split('=');
		    ret[s[0]] = s[1];
		}
		return ret;
	    })(),
	    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	    hash: a.hash.replace('#',''),
	    path: a.pathname.replace(/^([^\/])/,'/$1'),
	    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	    segments: a.pathname.replace(/^\//,'').split('/')
	};
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ChenChao on 2017/11/2.
 */

var RTC = __webpack_require__(2);
var util = __webpack_require__(0);
var btnRecord,
    btnRecordOver;
var btnEnter = document.getElementById('btn-enter');
    btnRecord = document.getElementById('btn-record');
    btnRecordOver = document.getElementById('btn-record-over');

RTC.ready(function (socket) {
    //进入房间
    btnEnter.onclick = function () {
	console.log('发送：创建房间');
	socket.send(JSON.stringify({
	    event: 'add room',
	    type: 'customer'
	}));
	btnRecord.disabled = false;
    };

    //开始录制
    btnRecord.onclick = function () {
	console.log('发送：请求录制开始');
	btnRecord.disabled = true;
	btnRecordOver.disabled = false;
	socket.send(JSON.stringify({
	    event: 'record start',
	    type: 'customer',
	    roomId: window._RTC_ROOMID
	}));
    };
    //结束录制
    btnRecordOver.onclick = function () {
	console.log('发送：请求录制结束');
	btnRecord.disabled = false;
	btnRecordOver.disabled = true;
	socket.send(JSON.stringify({
	    event: 'record over',
	    type: 'customer',
	    roomId: window._RTC_ROOMID
	}));
    };
}, function (startWebRtc, roomId) {
    var originData = util.parseUrl(window.location.href);
    var isCustomer = originData.hash === 'customer';
    if(isCustomer){
	btnEnter.disabled = true;
    }
    startWebRtc && startWebRtc(true, roomId);
}, function () {
    alert('当前队列已满，请走正常开户通道！');
    //todo
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ChenChao on 2017/11/2.
 */

var _env = 'dev2';
var config = __webpack_require__(3)(_env);
var logger = __webpack_require__(4)(config.logger);
var util = __webpack_require__(0);
var media = __webpack_require__(5);

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
    var recordedBlobs = [];
    // 创建PeerConnection实例
    var RTCPeer = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    var pc = new RTCPeer(config.iceServer);
    // 与信令服务器的WebSocket连接
    var socket = new WebSocket(config.wsServer);
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
	    window._Rtc_Stream = pc.getRemoteStream()[0];

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
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = function (env) {

    'use strict';

    var videoOptions = {
	mimeType: 'video/webm\;codecs=h264',
	audioBitsPerSecond : 128000,
	videoBitsPerSecond : 256000
    };
    var config = {
	'dev': {
	    env: 'dev',
	    wsServer: 'wss://localhost:443',
	    iceServer: {
		//开发环境为空，局域网可以不需要穿墙
	    },
	    videoOptions: videoOptions,
	    logger: true
	},
	'dev2': {
	    env: 'dev2',
	    wsServer: 'wss://www.nodejser.site:443',
	    iceServer: {
		//开发环境为空，局域网可以不需要穿墙
	    },
	    videoOptions: videoOptions,
	    logger: true
	},
	'test': {
	    env: 'test',
	    wsServer: 'wss://ceshi.securities.eastmoney.com',
	    iceServer: {

	    },
	    videoOptions: videoOptions,
	    logger: true
	},
	'prd': {
	    env: 'prd',
	    wsServer: 'wss://ceshi.securities.eastmoney.com',
	    iceServer: {
		"iceServers": [{
		    "url": "stun:stun.l.google.com:19302"
		}, {
		    "url": "turn:numb.viagenie.ca",
		    "username": "webrtc@live.com",
		    "credential": "muazkh"
		}]
	    },
	    videoOptions: videoOptions,
	    logger: false
	}
    };
    return config[env] || config['dev'];

};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = function (useLog) {
    if(!useLog){
	return function () {
	    //nothing to do
	};
    }else{
	window.onerror = function (e, url, line) {
	    console.log(`${e}\n${url}\n${line}`);
	}
    }
    return function (msg) {
	var logDiv = document.getElementById('rtc-logger') || createLoggerDiv();
	var p = document.createElement('p');
	p.innerHTML = msg;
	logDiv.appendChild(p);
    }
};

function createLoggerDiv() {
    var logDiv = document.createElement('div');
    logDiv.className = 'logger';
    logDiv.setAttribute('id', 'rtc-logger');
    logDiv.innerHTML = '<h5>调试输出：</h5>';
    document.querySelector('body').appendChild(logDiv);
    return logDiv;
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = {
    start: function (successFunc, errorFunc) {
	//处理兼容性
	window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);
	if (navigator.mediaDevices === undefined) {
	    navigator.mediaDevices = {};
	}
	if (navigator.mediaDevices.getUserMedia === undefined) {
	    navigator.mediaDevices.getUserMedia = function(constraints) {
		var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (!getUserMedia) {
		    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		}
		return new Promise(function(resolve, reject) {
		    getUserMedia.call(navigator, constraints, resolve, reject);
		});
	    }
	}
	navigator.mediaDevices.getUserMedia({
	    "audio": false,
	    "video": true
	}).then(successFunc).catch(errorFunc);
    },
    record: function (options) {
	var mediaRecorder;
	var setting = options.setting;
	try {
	    mediaRecorder = new MediaRecorder(window._Rtc_Stream, setting);
	} catch (e0) {
	    console.log('Unable to create MediaRecorder with options Object: ', e0);
	    try {
		setting = {mimeType: 'video/webm,codecs=vp9', bitsPerSecond: 1000000};
		mediaRecorder = new MediaRecorder(window.stream, setting);
	    } catch (e1) {
		console.log('Unable to create MediaRecorder with options Object: ', e1);
		try {
		    setting = 'video/webm\;codecs=h264';
		    mediaRecorder = new MediaRecorder(window.stream, setting);
		} catch (e2) {
		    alert('MediaRecorder is not supported by this browser.\n\n' +
			'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
		    console.error('Exception while creating MediaRecorder:', e2);
		    return;
		}
	    }
	}
	console.log('Created MediaRecorder', mediaRecorder, 'with options', setting);
	mediaRecorder.onstop = options.handlerStop;
	mediaRecorder.ondataavailable = options.handleDataAvailable;
	mediaRecorder.start(100); // collect 10ms of data
	return mediaRecorder;
    }
};

/***/ })
/******/ ]);