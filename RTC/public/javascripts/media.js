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
		mediaRecorder = new MediaRecorder(window._Rtc_Stream, setting);
	    } catch (e1) {
		console.log('Unable to create MediaRecorder with options Object: ', e1);
		try {
		    setting = 'video/webm\;codecs=h264';
		    mediaRecorder = new MediaRecorder(window._Rtc_Stream, setting);
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