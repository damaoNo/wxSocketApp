/**
 * Created by ChenChao on 2017/11/2.
 */

var RTC = require('./webrtc');
var util = require('./util');
var btnRecord,
    btnRecordOver,
    btnApply;

RTC.ready(function (socket, startWebRtc) {
    btnEnter = document.getElementById('btn-enter');
    btnReady = document.getElementById('btn-ready');
    btnRecord = document.getElementById('btn-record');
    btnRecordOver = document.getElementById('btn-record-over');
    // btnApply = document.getElementById('btn-apply');

    var originData = util.parseUrl(window.location.href);
    var isCustomer = originData.hash === 'customer';
    var isCaller = originData.hash === 'user';
    if(isCaller){
	btnEnter.disabled = true;
	btnReady.disabled = false;
    }

    //进入房间
    btnEnter.onclick = function () {
	console.log(isCustomer);
	if(isCustomer){
	    console.log('发送：创建房间');
	    socket.send(JSON.stringify({
		event: 'add room',
		type: 'customer'
	    }));
	}
    };
    //准备
    btnReady.onclick = function () {
	btnEnter.disabled = true;
	btnReady.disabled = true;
	btnRecord.disabled = false;
	startWebRtc && startWebRtc();
    };

    //开始录制
    btnRecord.onclick = function () {
	console.log('发送：请求录制开始');
	btnRecord.disabled = true;
	btnRecordOver.disabled = false;
	socket.send(JSON.stringify({
	    event: 'record start',
	    type: 'user'
	}));
    };
    //结束录制
    btnRecordOver.onclick = function () {
	console.log('发送：请求录制结束');
	btnRecord.disabled = false;
	// btnApply.disabled = false;
	btnRecordOver.disabled = true;
	socket.send(JSON.stringify({
	    event: 'record over',
	    type: 'user'
	}));
    };
    //确认
    // btnApply.onclick = function () {
	// console.log('发送：请求录制确认');
	// btnApply.disabled = true;
	// btnRecord.disabled = false;
	// socket.send(JSON.stringify({
	//     event: 'record apply',
	//     type: 'user'
	// }));
    // };
}, function (roomInfo) {
    //获取房间信息，如果获取到roomId则进入房间
    console.log('房间信息：', roomInfo);
    if(roomInfo){
    	window.location.href = '/user?roomId=' + roomInfo.id + '#user';
    }
});