/**
 * Created by ChenChao on 2017/11/2.
 */

var RTC = require('./webrtc');
var util = require('./util');
var btnRecord,
    btnRecordOver;
var btnEnter = document.getElementById('btn-enter');
    btnRecord = document.getElementById('btn-record');
    btnRecordOver = document.getElementById('btn-record-over'),
    btnRecordApply = document.getElementById('btn-record-apply');
var btnReplay = document.getElementById('btn-replay');

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
	btnRecordApply.disabled = false;
	socket.send(JSON.stringify({
	    event: 'record over',
	    type: 'customer',
	    roomId: window._RTC_ROOMID
	}));
    };
    //确认
    btnRecordApply.onclick = function () {
	console.log('发送：确认！');
	socket.send(JSON.stringify({
	    event: 'apply',
	    type: 'customer',
	    roomId: window._RTC_ROOMID
	}));

    };

    btnReplay.onclick = function () {
	console.log('回放视频：');
	var recordedVideo = document.querySelector('video#replayVideo');
	var superBuffer = new Blob(window.recordedBlobs, {type: 'video/webm'});
	recordedVideo.src = window.URL.createObjectURL(superBuffer);
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