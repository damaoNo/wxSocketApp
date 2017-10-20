'use strict';
function socketInit(callback){
  var _suffix_ = 'webm';
  var _token_ = 'rdsa213132131dfsaf';
  //var url = 'wss://alywgyz.eastmoney.com:8008/?token=' + _token_;
  //var url = 'wss://10.10.83.68:443/?token=' + _token_;
  //var url = 'wss://localhost:443/?token=' + _token_;
  var url = 'wss://www.nodejser.site/?token=' + _token_;
  var _webSocket_ = new WebSocket(url);
  //callback && callback(_webSocket_, _suffix_, _token_);
  _webSocket_.onopen = function() {
    console.log('socket已连接');
    callback && callback(_webSocket_, _suffix_, _token_);
  };
  _webSocket_.onmessage = function (data) {
    var res = JSON.parse(data.data);
    if(res.action === 'apply format'){
      console.log('服务端接受格式：', res.suffix);
      _suffix_ = res.sufiix;
    }
    if(res.action === 'saved success'){
      console.log('视频保存路径:', res.path);
    }
    if(res.action === 'saved failed'){
      console.log(res.errorMessage);
    }
  };
  _webSocket_.onerror = function(e) {
    alert('socket连接出错');
    alert(e);
  };
  _webSocket_.onclose = function() {
    alert('socket已关闭');
  };
}

socketInit(function (_webSocket_, _suffix_, _token_) {
  var mediaSource = new MediaSource();
  mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
  var mediaRecorder;
  var recordedBlobs;
  var sourceBuffer;

  var gumVideo = document.querySelector('video#gum');
  var recordedVideo = document.querySelector('video#recorded');

  var recordButton = document.querySelector('button#record');
  var playButton = document.querySelector('button#play');
  var downloadButton = document.querySelector('button#download');
  var recordOverButton = document.querySelector('button#record_over');

  //add
  var photoPaper = document.getElementById('photoPaper');
  photoPaper.width = 320;
  photoPaper.height = 240;
  var photoContext = photoPaper.getContext("2d");
  var photoApplyButton = document.querySelector('button#take_photo');
  var types = document.querySelectorAll('[name="type"]');
  var masks = document.querySelectorAll('.mask');
  var typeValue = null;  //拍照类型
  var imgData = null;  //拍照图像数据
  types.forEach(function (elem, index) {
    elem.onclick = function (e) {
      resetMasks();
      masks[this.value].style.display = 'block';
      photoApplyButton.disabled = false;
    }
  });
  photoApplyButton.onclick = function () {
    var checked = document.querySelector('[type="radio"]:checked');
    if(!checked){
      alert('请选择拍照类型');
      return;
    }
    typeValue = checked.value;
    photoContext.drawImage(gumVideo, 0, 0, 320, 240);
    imgData = photoPaper.toDataURL("image/jpeg");
    document.getElementById('viewImg').src = imgData;
  };

  function resetMasks() {
    masks.forEach(function (elem, index) {
      elem.style.display = 'none';
    });
  }


  recordButton.onclick = toggleRecording;
  playButton.onclick = play;
  downloadButton.onclick = download;
  recordOverButton.onclick = function () {
    _webSocket_.send(JSON.stringify({action: 'record over'}));
    recordOverButton.disabled = true;
  };

// window.isSecureContext could be used for Chrome
  var isSecureOrigin = location.protocol === 'https:' ||
      location.host === 'localhost';
// if (!isSecureOrigin) {
//   alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
//     '\n\nChanging protocol to HTTPS');
//   location.protocol = 'HTTPS';
// }

// Use old-style gUM to avoid requirement to enable the
// Enable experimental Web Platform features flag in Chrome 49


  var constraints = {
    audio: true,
    //使用前置摄像头
    video: { facingMode: "user" },

    //使用后置摄像头
    //video: { facingMode: { exact: "environment" } }
  };

  // 一堆兼容代码
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
  // 正式启动摄像头
  navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);


  //navigator.getUserMedia(constraints, successCallback, errorCallback);

  function successCallback(stream) {
    console.log('getUserMedia() got stream: ', stream);
    window.stream = stream;
    if (window.URL) {
      gumVideo.src = window.URL.createObjectURL(stream);
    } else {
      gumVideo.src = stream;
    }

    //var video = document.querySelector('video');
    // if ("srcObject" in gumVideo) {
    //   gumVideo.srcObject = stream
    // } else {
    //   gumVideo.src = window.URL && window.URL.createObjectURL(stream) || stream
    // }
    // gumVideo.play();
  }

  function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    //sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    console.log('Source buffer: ', sourceBuffer);
  }

  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      _webSocket_.send(event.data);
      recordedBlobs.push(event.data);
    }
  }

  function handleStop(event) {
    console.log('Recorder stopped: ', event);
  }

  function toggleRecording() {
    if (recordButton.textContent === '开始录制') {
      startRecording();
      _webSocket_.send(JSON.stringify({action: 'record start', token: _token_}));
    } else {
      stopRecording();
      recordButton.textContent = '开始录制';
      playButton.disabled = false;
      downloadButton.disabled = false;
      recordOverButton.disabled = false;
    }
  }

// The nested try blocks will be simplified when Chrome 47 moves to Stable
  function startRecording() {
    var options = {
      mimeType: 'video/webm',
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 256000
    };
    recordedBlobs = [];
    try {
      console.log(0)
      mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', e0);
      try {
        console.log(1)
        options = {mimeType: 'video/webm,codecs=vp9', bitsPerSecond: 1000000};
        mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', e1);
        try {
          console.log(2)
          options = 'video/vp8'; // Chrome 47
          mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e2) {
          alert('MediaRecorder is not supported by this browser.\n\n' +
              'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
          console.error('Exception while creating MediaRecorder:', e2);
          return;
        }
      }
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = '停止录制';
    playButton.disabled = true;
    downloadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(100); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
  }

  function stopRecording() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    recordedVideo.controls = true;
  }

  function play() {
    var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
  }

  function download() {
    var blob = new Blob(recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
});