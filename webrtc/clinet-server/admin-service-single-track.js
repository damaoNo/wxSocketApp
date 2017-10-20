'use strict';

function socketInit(callback){
  var _suffix_ = 'webm';
  var url = 'wss://alywgyz.eastmoney.com:8008/?token=admin';
  //var url = 'wss://localhost/?token=admin';
  var _webSocket_ = new WebSocket(url);
  //callback && callback(_webSocket_, _suffix_);
  _webSocket_.onopen = function() {
    console.log('socket已连接');
    _webSocket_.send(JSON.stringify({action: 'ping', verify: 'admin'}));
    callback && callback(_webSocket_, _suffix_);
  };
  _webSocket_.onmessage = function (data) {
    if(typeof data.data === 'string'){
      var res = JSON.parse(data.data);
      if(res.action === 'user recode over'){
        APP.socketData.push(res);
      }
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

socketInit(function (_webSocket_, _suffix_) {
  window.APP = new Vue({
    el: '#container',
    data: function () {
      return {
        socketData: []
      }
    },
    methods: {
      playVideo: function (url) {
        console.log(url);
        document.getElementById('userVideoPlayer').src = url;//'./46d7af84-c18d-4dee-9a8d-8956c78559fc.mp4';
      }
    }
  });
});