/*! Copyright (c) 2005--2017 BaiRuiTech.Co.Ltd. All rights reserved. */
!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){function o(e){var t=new Date,n=t.getHours()>9?t.getHours():"0"+t.getHours(),o=t.getMinutes()>9?t.getMinutes():"0"+t.getMinutes(),r=t.getSeconds()>9?t.getSeconds():"0"+t.getSeconds();if(console.log(e),a=a+"\r\n & time："+n+":"+o+":"+r+":  "+e,e='<p><span class="text-info">time：'+n+":"+o+":"+r+"</span>&nbsp;&nbsp;&nbsp;&nbsp;"+e+"</p>",document.getElementById("log")){var s=document.getElementById("log").innerHTML;document.getElementById("log").innerHTML=e+s}i.putLog(a)}var r=n(1),i=n(8),a="";window.AnyChatSDK=r.instance,window.log=o,window.log_obj=i},function(e,t,n){var o=n(2),r=n(4),i=n(5),a=n(7),s=n(3),c=(window.URL||window.webkitURL||window.msURL||window.oURL,function(){function e(e){}function t(e,t){var n=e+":"+t,o=[];o.push(n),$.addr=o,P.sessionid=null,P.connect(o),log("正在链接:"+e+":"+t)}function n(e,t,n){var o={};return o.username=e,o.password=t,o.passenctype=n,o.username&&P.socket_send("request",0,"login",o),X.connect||($.loginData={},$.loginData=o),0}function c(e,t,n,o,r,i,a){var s={};return s.nickname=e,s.userid=t,s.struserid=n,s.appId=o,s.timestamp=r,s.lpSigStr=i,s.lpStrParam=a,P.socket_send("request",0,"loginex",s),0}function d(e,t,n){var o={};return o.roomid=e,o.roompass=t,o.passenctype=n,P.userid===-1?(log("还没有登录成功，不能进房间"),!1):void P.socket_send("request",0,"enterroom",o)}function u(e,t){var n={};n.roomname=e,n.roompass=t,n.passenctype=dwParam,P.socket_send("request",0,"enterroomex",n)}function l(e){var t={};return P.roomid?(Y.closeAll(Q),e||(e=-1),t.roomid=e,P.roomid=0,P.socket_send("request",0,"leaveroom",t),0):(log("但不成功，因为没有进入房间"),20)}function f(e,t){var n={};n.userid=e,n.jsonbuf=Y.base64encode(t),P.socket_send("request",0,"transbuffer",n)}function p(){var e={};return P.socket_send("request",0,"logout",e),0}function v(e,t,n,o,r,i){var a={};a.eventtype=e,a.userid=t,a.errorcode=n,a.flags=o,a.param=r,a.userstr=i,P.socket_send("request",0,"videocallcontrol",a)}function m(e,t,n,o){var r={};r.objecttype=e,r.objectid=t,r.infoname=n,r.infovalue=o,r.valuetype=1,P.socket_send("request",0,"objectsetvalue",r)}function g(e,t,n,o){var r={};r.objecttype=e,r.objectid=t,r.infoname=n,r.infovalue=o,r.valuetype=0,P.socket_send("request",0,"objectsetvalue",r)}function h(e,t,n){var o={};return o.objecttype=e,o.objectid=t,o.infoname=n,P.socket_send("request",0,"objectgetvalue",o),J.GetObjectIntValue(e,t,n)}function b(e,t,n){var o={};return o.objecttype=e,o.objectid=t,o.infoname=n,P.socket_send("request",0,"objectgetvalue",o),J.GetObjectStringValue(e,t,n)}function y(e,t,n,o,r,i,a,s){var c={};c.objecttype=e,c.objectid=t,c.ctrlcode=n,c.param1=o,c.param2=r,c.param3=i,c.param4=a,c.strparam=s,P.socket_send("request",0,"objectcontrol",c)}function _(e){var t={};return t.objecttype=e,P.socket_send("request",0,"objectgetidlist",t),J.ObjectGetIdList(e)}function S(e,t){var n={};n.optname=e,n.optval=t,X.connect?P.socket_send("request",0,"setsdkoptionstring",n):$.SetSDKOptionStringArr.push(n)}function k(e,t){var n={};n.optname=e,n.optval=t,X.connect?P.socket_send("request",0,"setsdkoptionint",n):$.SetSDKOptionIntArr.push(n)}function w(e){var t={};t.optname=e,P.socket_send("request",0,"getsdkoptionstring",t)}function C(e){var t={};t.optname=e,P.socket_send("request",0,"getsdkoptionint",t)}function O(e,t){var n={};n.userid=e,n.open=t,I(e,t,0,0,""),P.socket_send("request",0,"usercameracontrol",n)}function I(e,t,n,o,r){if(!P.roomid)return log("还没有进入房间"),!1;if(!e)return log("请输入对方userid"),!1;var i={};i.userid=e,i.open=t,i.streamindex=n,i.flags=o,i.strparam=r;var a,s=$.streamindex_video,c="";if(P.socket_send("request",0,"usercameracontrolex",i),e==-1||e==P.userid){for(var d in s)s[d].dwStreamIndex==n&&(c=s[d].value,a=s[d]);if(0==t)Y.closeMyCamera(Q);else{var u=V(c);Y.createStream(u,a)}}else if(0==t){var l=$.setvideoposData,f=0;for(var d in l)l[d].userId==e&&l[d].streamIndex==n&&(f=l[d].peerId);0!=f&&Y.closeOtherCamera(f)}else{var p=P.sessionid+"_"+e+"_"+n,v={};v.peerId=p,v.userId=e,v.streamIndex=n,$.setvideoposData.push(v),P.createPeerConnection(p),P.addStreams(p)}}function j(e,t){var n={};n.userid=e,n.open=t,P.socket_send("request",0,"userspeakcontrol",n)}function A(e,t,n,o,r){var i={};i.userid=e,i.open=t,P.socket_send("request",0,"userspeakcontrol",i)}function x(e,t,n,o){var r={};r.userid=e,r.secret=t,r.buf=Y.base64encode(n),P.socket_send("request",0,"sendtextmessage",r)}function D(e){}function L(e){return $.device_once=0,1==e?H.length:2==e?F.length:void 0}function M(e){if(1==e){var t=H[$.device_once++];return t.label}if(2==e){var t=F[$.device_once++];return t.label}}function q(e,t,n,o){$.streamindex_video=Y.strema_video($,t,n,o)}function R(e,t,n,o){$.streamindex_video=Y.strema_video($,t,n,o)}function E(e){if(e==-1)return P.userlist}function T(e){return e}function N(e,t){return 0}function V(e){for(var t in H)if(H[t].label==e)return H[t]}function B(e,t,n){function o(e){var t=$.setvideoposData;for(var n in t)t[n].userId==e;return n?n:-1}if(!P.roomid)return log("还没有进入房间"),!1;if(e==-1||P.userid==e){var r=document.createElement("video"),i=t;r.setAttribute("class","my"),r.setAttribute("autoplay","autoplay"),r.setAttribute("id",n),i.appendChild(r),console.log("初始化显示流");var a=setInterval(function(){Q[0]&&(console.log(Q[0]),P.attachStream(Q[0],n),clearInterval(a))},500)}var s=o(e);return s!=-1&&($.setvideoposData[s].parentobj=t,void($.setvideoposData[s].id=n))}function G(){function e(e){for(var t=0;t!=e.length;++t){var n=e[t];"video"===n.kind||"videoinput"===n.kind?H.push(n):"audio"!==n.kind&&"audioinput"!==n.kind||n.label.indexOf("麦克风")!=-1&&F.push(n)}}H=[],F=[],"undefined"!=typeof MediaStreamTrack.getSources?MediaStreamTrack.getSources(e):navigator.mediaDevices.enumerateDevices().then(function(t){e(t)})}function U(){P.on("reply",function(e){var t=e.data,n=t.cmdcode,o=t.errorcode,i="",a="";if(ee[n]){switch(n){case"connect":if(Y.clear_timer(),$.loginData){var e={};e=$.loginData,e.username&&P.socket_send("request",0,"login",e)}r.start(P),0==o&&(X.connect=!0,Y.SetSDKOptionString($.SetSDKOptionStringArr),Y.SetSDKOptionInt($.SetSDKOptionIntArr),$.SetSDKOptionStringArr=[],$.SetSDKOptionIntArr=[]);break;case"login":case"loginex":$.loginData={},0==o?(P.sessionid=t.sessionid,P.userid=i=t.userid):i=-1;break;case"enterroom":0==o&&(P.roomid=t.roomid),i=t.roomid}ee[n]&&Z.OnNotifyMessage(ee[n],i,a||o)}"tokenconnect"===n&&(0==o?(Y.clear_timer(),r.start(P),log("重连成功")):(P.sendData={},P.sessionid=null,log("重连失败"))),"heartbeat"===n&&r.notify(o),"logout"===n&&(log("注销成功"),P.socket.close(),Y.closeAll(Q),r.stop(),P.roomid=0,P.userid=0,P.socket=null,P.normalCloseWebsocket=!0)}),P.on("request",function(e){var t=e.data,n=t.cmdcode;"restrans"===n&&s.restrans_to_service(t.begin_reg)}),P.on("notify",function(e){var t=e.data,n=t.cmdcode,o=t.errorcode,r="",i="";if(s.set_big_index_notify(e.seq),ee[n]){switch(n){case"onlineuser":var a=t.useridlist;"object"!=typeof a&&(a=JSON.parse(a));var c=a.useridlist;P.userlist=c,r=c.length,i=t.roomid;break;case"linkclose":break;case"useratroom":r=t.userid,1==t.benter?P.userlist.push(r):Y.ArrayremoveByValue(P.userlist,r),i=t.benter}ee[n]&&Z.OnNotifyMessage(ee[n],r,i||o)}if("webrtcconsult"===n&&0==o){var d=JSON.parse(t.jsonbuf);"answer"===d.type?(log("收到answer"),d.sdp=Y.setMediaBitrates(d.sdp,P.bitrate,10),P.receiveAnswer(d.peerconnectionid,d.sdp)):"candidate"===d.type&&(log("收到candidate"),P.candidate(d))}if("sendtextmessage"===n){var u=Y.base64decode(t.buf);Z.OnAnyChatTextMessage(t.fromuserid,t.touserid,t.secret,u,0)}"objectevent"===n&&(0==t.eventtype?J.setObjectInfo(t):t.eventtype==-1?J.setObjectInfo_1(t):Z.OnAnyChatObjectEvent(t.objecttype,t.objectid,t.eventtype,t.param1,t.param2,t.param3,t.param4,t.strparam)),"videocallevent"===n&&Z.OnAnyChatVideoCallEvent(t.eventtype,t.userid,t.errorcode,t.flags,t.param,t.jsonbuf),"transbuffer"===n&&Z.OnAnyChatTransBuffer(t.userid,Y.base64decode(t.jsonbuf),0)}),P.on("stream_created",function(e){Q[0]=e}),P.on("close_websocket",function(e){log("正在尝试重连"),r.stop(),Y.tokenconnect($.addr)}),P.on("linkclose",function(e){var t=WM_GV+6;Z.OnNotifyMessage(t,0,e)}),P.on("offer",function(e,t){var n,o={},r={},i=$.setvideoposData;for(var a in i)i[a].peerId==t&&(n=i[a]);r.type="offer",r.sdp=e.sdp,r.peerconnectionid=t,r.streamindex=n.streamIndex,o.jsonbuf=r,P.socket_send("request",0,"webrtcconsult",o)}),P.on("pc_add_stream",function(e,t){var n=t.split("_");log("打开对方流：sessionid："+t);var o,r=$.setvideoposData;for(var i in r)r[i].peerId==t&&r[i].streamIndex==n[2]&&(o=r[i]);if(o){var a=document.createElement("video"),s=o.id,c=o.parentobj;o.parentobj&&(a.setAttribute("class","other"),a.setAttribute("name",t),a.setAttribute("autoplay","autoplay"),a.setAttribute("id",s),c.appendChild(a),P.attachStream(e,s))}}),P.on("ack",function(e){s.delt_pack(e.seq)})}function W(e,t){switch(e){case"OnNotifyMessage":Z.OnNotifyMessage=t;break;case"OnVideoCallEvent":Z.OnAnyChatVideoCallEvent=t;break;case"OnObjectEvent":Z.OnAnyChatObjectEvent=t;break;case"OnTextMessage":Z.OnAnyChatTextMessage=t;break;case"OnTransBuffer":Z.OnAnyChatTransBuffer=t}}function K(){P.browserName=Y.getBrowser(),console.log("浏览器名字："+P.browserName),U(),setTimeout(function(){G()},1)}var P=new o.instance,J=new i(P);s.setWay(P);var z={},H=[],F=[],Q=[],Y=a.instance(P);if(P.system=Y.system_s(),log("系统："+P.system),!P.support())return log("不支持h5音视频通话，请更换浏览器"),!1;var X={};X.connect=!1;var Z={},$={};$.setvideoposData=[],$.SetSDKOptionStringArr=[],$.SetSDKOptionIntArr=[],$.SetSDKOptionString=[],$.SetSDKOptionInt=[],$.streamindex_video=[];var ee={connect:WM_GV_CONNECT,login:WM_GV_LOGINSYSTEM,loginex:WM_GV_LOGINSYSTEM,enterroom:WM_GV_ENTERROOM,onlineuser:WM_GV_ONLINEUSER,linkclose:WM_GV_LINKCLOSE,useratroom:WM_GV_USERATROOM};return K(),z.InitSDK=e,z.Connect=t,z.Login=n,z.LoginEx=c,z.EnterRoom=d,z.EnterRoomEx=u,z.LeaveRoom=l,z.Logout=p,z.on=W,z.UserCameraControl=O,z.UserCameraControlEx=I,z.UserSpeakControl=j,z.PrepareFetchDevices=L,z.FetchNextDevice=M,z.SetVideoPos=B,z.SetUserStreamInfoString=q,z.SetUserStreamInfoInt=R,z.SetSDKOptionString=S,z.SetSDKOptionInt=k,z.VideoCallControl=v,z.SetObjectStringValue=m,z.SetObjectIntValue=g,z.GetObjectIntValue=h,z.GetObjectStringValue=b,z.ObjectControl=y,z.ObjectGetIdList=_,z.GetRoomOnlineUsers=E,z.SendTextMessage=x,z.GetSDKOptionString=w,z.GetSDKOptionInt=C,z.TransBuffer=f,z.GetVersion=D,z.GetCurrentDevice=T,z.QueryUserStateInt=N,z.UserSpeakControlEx=A,z});t.instance=c},function(e,t,n){function o(){this.events={}}function r(){this.localMediaStream=null,this.roomid="",this.userid=-1,this.socket=null,this.sessionid=null,this.is_socket=!1,this.peerConnections={},this.connections=[],this.numStreams=0,this.initializedStreams=0,this.browserName="",this.normalCloseWebsocket=!1,this.userlist=[],this.timeOut=0,this.timeOutInt=30,this.srrc_index=0,this.sendData={},this.system="",this.bitrate=100}var i=n(3),a=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection||"",s=window.URL||window.webkitURL||window.msURL||window.oURL||"",c=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia||"",d=window.mozRTCIceCandidate||window.RTCIceCandidate||"",u=window.mozRTCSessionDescription||window.RTCSessionDescription||"",l=(!!navigator.mozGetUserMedia,{iceServers:[{urls:"stun:h5.anychat.cn:9000"}]});o.prototype.on=function(e,t){this.events[e]=this.events[e]||[],this.events[e].push(t)},o.prototype.emit=function(e,t){var n,o,r=this.events[e],i=Array.prototype.slice.call(arguments,1);if(r)for(n=0,o=r.length;n<o;n++)r[n].apply(null,i)},r.prototype=new o,r.prototype.connect=function(e){var t,n=this;if(this.socket)return log("不需要重连，已经存在websocket 链接"),!1;var o="https:"==document.location.protocol,r=o?"wss:"+e[0]:"ws:"+e[0];if("WebSocket"in window)t=this.socket=new WebSocket(r,"anychat-protocol");else{if(!("MozWebSocket"in window))return log("不支持websocket"),void alert("WebSocket is not supported by this browser.");t=this.socket=new MozWebSocket(r,"anychat-protocol")}t.onopen=function(){n.is_socket=!0;var e={};e=n.sessionid?{eventname:"request",ssrc:0,data:{cmdcode:"tokenconnect",sessionid:n.sessionid}}:{eventname:"request",ssrc:0,data:{cmdcode:"connect"}},t.send(JSON.stringify(e))},t.onmessage=function(e){var o=JSON.parse(e.data),r=o.data;"object"!=typeof r&&(o.data=JSON.parse(r)),o.eventname?n.emit(o.eventname,o):n.emit("socket_receive_message",t,o)},t.onerror=function(e){console.log("socket_error"),n.socket=!1,n.is_socket=!1,n.emit("socket_error",e,t),n.emit("close_websocket",data)},t.onclose=function(e){n.is_socket=!1,n.normalCloseWebsocket||n.emit("close_websocket",e),n.normalCloseWebsocket=!1},n.on("ready",function(){})},r.prototype.socket_send=function(e,t,n,o){var r={};r.eventname=e,r.ssrc=0,r.data={},r.data=o,r.data.cmdcode=n,r=i.data_pack(r),this.is_socket&&this.socket.send(JSON.stringify(r))},r.prototype.data_pack=function(e){},r.prototype.support=function(){return!!(a&&c&&d&&u)},r.prototype.createStream=function(e,t){function n(){c.call(navigator,s,function(e){a.localMediaStream=e,a.initializedStreams++,log("自己视频流打开成功"),a.emit("stream_created",e),a.emit("ready"),a.initializedStreams===a.numStreams},function(e){log("视频流打开失败:"+e)})}var o,r,i,a=this,s={};if(t?(o=t.width||320,r=t.height||240,i=t.fpsctrl||15):(o=320,r=240,i=15),console.log("摄像头打开信息，分辨率w:"+o+"；分辨率h："+r),s.audio=!0,c)try{s.video={mandatory:{minHeight:0,maxHeight:r,minWidth:0,maxWidth:o,maxFrameRate:i}},n()}catch(e){log("不支持设置视频分辨率");try{s.video={height:{min:10,ideal:r,max:1280},width:{min:10,ideal:o,max:720},frameRate:{ideal:10,max:i}},n()}catch(e){s.video=!0,n()}}else log("不支持视频流")},r.prototype.addStreams=function(e){var t=this,n=setInterval(function(){t.localMediaStream&&(clearInterval(n),t.peerConnections[e].addStream(t.localMediaStream),t.sendOffers(e))},100)},r.prototype.attachStream=function(e,t){var n=document.getElementById(t);return n?("my"===n.className&&(n.volume=0,n.muted=!1),"ios"===this.system?(log("srcObject"),n.srcObject=e):(log("createObjectURL"),n.src=s.createObjectURL(e)),void n.addEventListener("canplaythrough",function(){log("视频分辨率宽："+n.clientWidth),log("视频分辨率高："+n.clientHeight)})):(log("找不到可以设置video 标签的div"),!1)},r.prototype.sendOffers=function(e){var t,n=this,o={};pcCreateOfferCbGen=function(e,t){return function(r){e.setLocalDescription(r),o=r,n.emit("offer",o,t),log("发送offer给对方")}},pcCreateOfferErrorCb=function(e){log("发送offer报错："+e),console.log(e)},t=this.peerConnections[e],t.createOffer(pcCreateOfferCbGen(t,e),pcCreateOfferErrorCb)},r.prototype.receiveOffer=function(e,t){this.peerConnections[e];this.sendAnswer(e,t)},r.prototype.sendAnswer=function(e,t){var n=this.peerConnections[e],o=this;n.setRemoteDescription(new u(t)),n.createAnswer(function(t){n.setLocalDescription(t),o.socket.send(JSON.stringify({eventName:"__answer",data:{socketId:e,sdp:t}}))},function(e){console.log(e)})},r.prototype.receiveAnswer=function(e,t){var n=this.peerConnections[e];if(!n)return!1;var o={};o.type="answer",o.sdp=t,n.setRemoteDescription(new u(o))},r.prototype.createPeerConnections=function(){var e,t;for(e=0,t=this.connections.length;e<t;e++)this.createPeerConnection(this.connections[e])},r.prototype.createPeerConnection=function(e){var t=this,n=new a(l);this.peerConnections[e]=n;var o={},r={sdpMid:"",sdpMLineIndex:"",candidate:""};return n.onicecandidate=function(n){if("object"==typeof n.candidate)try{r.sdpMid=n.candidate.sdpMid,r.sdpMLineIndex=n.candidate.sdpMLineIndex,r.candidate=n.candidate.candidate,r.peerconnectionid=e,r.type="candidate",n.candidate&&(o.jsonbuf=r,t.socket_send("request",0,"webrtcconsult",o))}catch(e){log("onicecandidate warm")}},n.onopen=function(){log("peerConnections打开成功")},n.onaddstream=function(o){t.emit("pc_add_stream",o.stream,e,n)},n.ondatachannel=function(o){t.addDataChannel(e,o.channel),t.emit("pc_add_data_channel",o.channel,e,n)},n},r.prototype.closePeerConnection=function(e){e&&e.close()},r.prototype.closeAllPeerConnection=function(){for(var e in this.peerConnections)this.peerConnections[e].close(),delete this.peerConnections[e];log("关闭peerConnection")},r.prototype.closeOtherPeerConnection=function(e){this.peerConnections[e]&&(this.peerConnections[e].close(),delete this.peerConnections[e]),log("关闭他人peerConnection:"+e)},r.prototype.removeVideo=function(){function e(e){var t=e.parentNode;t&&t.removeChild(e)}var t=document.querySelectorAll("video.my,video.other");for(var n in t)isNaN(n)||e(t[n]);log("移除video标签")},r.prototype.removeMyVideo=function(){function e(e){var t=e.parentNode;t&&t.removeChild(e)}var t=document.querySelectorAll("video.my");for(var n in t)e(t[n]);log("移除自己video标签")},r.prototype.removeOtherVideo=function(e){function t(e){var t=e.parentNode;t&&t.removeChild(e)}var n=document.querySelectorAll("video.other");for(var o in n)isNaN(o)||n[o].getAttribute("name")==e&&t(n[o]);log("移除他人video标签："+e)},r.prototype.candidate=function(e){var t=new d(e),n=this.peerConnections[e.peerconnectionid];return!!n&&void n.addIceCandidate(t)},t.instance=r},function(e,t){function n(e){return"heartbeat"!==e.data.cmdcode&&(e.seq=++l,u[l]=e),e}function o(e){for(var t=e;t>=f;t--)delete u[t];f=e}function r(e){d=e,setInterval(function(){a()},v)}function i(e){e-p===1||s(p),p=e}function a(){var e={eventname:"ack",ssrc:0,seq:p,data:{}};d.is_socket&&d.socket.send(JSON.stringify(e))}function s(e){var t={eventname:"request",ssrc:0,seq:0,data:{cmdcode:"restrans",begin_reg:++e}};d.is_socket&&d.socket.send(JSON.stringify(t))}function c(e){for(var t in u)t>e&&d.is_socket&&u[t]&&(d.socket.send(JSON.stringify(u[t])),delete u[t])}var d,u={},l=0,f=0,p=0,v=3e3;t.data_pack=n,t.delt_pack=o,t.setWay=r,t.set_big_index_notify=i,t.restrans_to_service=c},function(e,t){function n(e){var t={};clearInterval(i),i=setInterval(function(){e.socket_send("request",0,"heartbeat",t)},1e3*a)}function o(e){}function r(){i&&clearInterval(i)}var i,a=5;t.start=n,t.notify=o,t.stop=r},function(e,t,n){var o=(n(6),function(){function e(e){this.getway=e,this.objectInfoData={},this.objectInfoData_1={},this.objectidlist_5=[]}return e.prototype.setObjectInfo=function(e){var t=e.objecttype+"_"+e.objectid;this.objectInfoData[t]||e.objecttype==r&&this.objectidlist_5.push(e.objectid),this.objectInfoData[t]=JSON.parse(e.jsonbuf)},e.prototype.setObjectInfo_1=function(e){var t=e.objecttype+"_"+e.objectid;this.objectInfoData_1[t]=JSON.parse(e.jsonbuf)},e.prototype.GetObjectIntValue=function(e,t,n){var o=this,r=0,a=e+"_"+t;return o.objectInfoData[a]?(n==i?r=o.objectInfoData[a].flags:n==s?r=o.objectInfoData[a].priority:n==c?r=o.objectInfoData[a].attribute:n==u?r=o.objectInfoData[a].inttag:n==p?r=o.objectInfoData_1[a].beforeusernum:n==f?r=o.objectInfoData_1[a].mysequenceno:n==v?r=o.objectInfoData_1[a].myenterqueuetime:n==g?r=o.objectInfoData_1[a].waittimesecond:n==m&&(r=o.objectInfoData_1[a].queuelength),r):"undefined"},e.prototype.GetObjectStringValue=function(e,t,n){var o=this,r="",i=e+"_"+t;return o.objectInfoData[i]?(n==a?r=o.objectInfoData[i].objectname:n==d?r=o.objectInfoData[i].description:n==l&&(r=o.objectInfoData[i].stringtag),r):"undefined"},e.prototype.ObjectGetIdList=function(e){if(e==r)return this.objectidlist_5},e}()),r=5,i=7,a=8,s=9,c=10,d=11,u=12,l=13,f=501,p=502,v=503,m=504,g=508;e.exports=o},function(e,t){function n(e){var t,n,o,i,a,s;for(o=e.length,n=0,t="";n<o;){if(i=255&e.charCodeAt(n++),n==o){t+=r.charAt(i>>2),t+=r.charAt((3&i)<<4),t+="==";break}if(a=e.charCodeAt(n++),n==o){t+=r.charAt(i>>2),t+=r.charAt((3&i)<<4|(240&a)>>4),t+=r.charAt((15&a)<<2),t+="=";break}s=e.charCodeAt(n++),t+=r.charAt(i>>2),t+=r.charAt((3&i)<<4|(240&a)>>4),t+=r.charAt((15&a)<<2|(192&s)>>6),t+=r.charAt(63&s)}return t}function o(e){var t,n,o,r,a,s,c;for(s=e.length,a=0,c="";a<s;){do t=i[255&e.charCodeAt(a++)];while(a<s&&t==-1);if(t==-1)break;do n=i[255&e.charCodeAt(a++)];while(a<s&&n==-1);if(n==-1)break;c+=String.fromCharCode(t<<2|(48&n)>>4);do{if(o=255&e.charCodeAt(a++),61==o)return c;o=i[o]}while(a<s&&o==-1);if(o==-1)break;c+=String.fromCharCode((15&n)<<4|(60&o)>>2);do{if(r=255&e.charCodeAt(a++),61==r)return c;r=i[r]}while(a<s&&r==-1);if(r==-1)break;c+=String.fromCharCode((3&o)<<6|r)}return c}var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);t.base64encode=n,t.base64decode=o},function(e,t,n){var o,r=n(6),i=function(e){function t(e,t,n){for(var o=e.split("\r\n"),r=-1,i=0;i<o.length;i++)if(console.log("m="+t),0===o[i].indexOf("m="+t)){r=i;break}if(r===-1)return console.debug("Could not find the m line for",t),e;for(console.debug("Found the m line for",t,"at line",r),r++;0===o[r].indexOf("i=")||0===o[r].indexOf("c=");)r++;if(0===o[r].indexOf("b"))return console.debug("Replaced b line at line",r),o[r]-"b=AS."+n,o.join("\r\n");console.debug("Adding new b line before line",r);var a=o.slice(0,r);return a.push("b=AS:"+n),a=a.concat(o.slice(r,o.length)),a.join("\r\n")}var n={};return n.createStream=function(t,n){t?e.createStream(t.id,n):e.createStream("",n)},n.clear_timer=function(){e.timeOut=0,o||(clearInterval(o),o=null)},n.tokenconnect=function(t){o||(o=setInterval(function(){e.timeOut++,e.timeOut==e.timeOutInt&&(clearInterval(o),e.emit("linkclose",100),e.sendData={},o=null)},1e3)),setTimeout(function(){e.socket=null,e.connect(t)},4e3)},n.strema_video=function(t,n,o,r){function i(e){var n=t.streamindex_video,o=-1;for(var r in n)n[r].dwStreamIndex==e&&(o=r);return o}var a,s={},c=t.streamindex_video;switch(o){case BRAC_SO_LOCALVIDEO_DEVICENAME:s.dwStreamIndex=n,s.value=r,c.push(s);break;case BRAC_SO_LOCALVIDEO_WIDTHCTRL:a=i(n),a==-1||(c[a].width=r);break;case BRAC_SO_LOCALVIDEO_HEIGHTCTRL:a=i(n),a==-1||(c[a].height=r);break;case BRAC_SO_LOCALVIDEO_FPSCTRL:a=i(n),a==-1||(c[a].fpsctrl=r);break;case BRAC_SO_LOCALVIDEO_BITRATECTRL:e.bitrate=r/1e3,a=i(n),a==-1||(c[a].fpscode=r)}return c},n.getBrowser=function(){var e="unknown browser",t=navigator.userAgent.toLowerCase(),n={ie:/msie/.test(t)&&!/opera/.test(t),op:!/msie/.test(t)&&/opera/.test(t),sa:/version.*safari/.test(t),ch:/chrome/.test(t)&&window.navigator.webkitPersistentStorage,ff:/firefox/.test(t),qh360:/chrome/.test(t)&&!window.navigator.webkitPersistentStorage,qq:/qqbrowser/.test(t),sg:/metasr/.test(t)};return n.ch?e="Chrome":n.ie?e="IE":n.ff?e="Firefox":n.sa?e="Safari":n.qh360?e="360浏览器":n.op?e="Opera":n.qq?e="QQ浏览器":n.sg&&(e="搜狗浏览器"),e},n.system_s=function(){if(!navigator)return"ios";for(var e=navigator.userAgent,t=new Array("Android"),n=new Array("iPhone","iPad","iPod","Safari"),o=new Array("Windows"),r=0;r<t.length;r++){var i=e.indexOf(t[r]);if(i>0)return"android"}for(var r=0;r<o.length;r++){var i=e.indexOf(o[r]);if(i>0)return"windows"}for(var r=0;r<n.length;r++){var i=e.indexOf(n[r]);if(i>0)return"ios"}},n.log=function(e){console.log(e)},n.closeAll=function(t){e.closeAllPeerConnection(),e.removeVideo();try{t[0]&&(log("关闭摄像头"),log(t[0].getVideoTracks()[0]),t[0].getVideoTracks()[0].stop(),t[0]="")}catch(e){log("摄像头关闭失败"),log(e)}},n.closeMyCamera=function(t){try{log("关闭自己摄像头"),t[0].getVideoTracks()[0].stop(),t[0]="",e.removeMyVideo()}catch(e){log("摄像头关闭失败"),log(e)}},n.closeOtherCamera=function(t){e.closeOtherPeerConnection(t),e.removeOtherVideo(t)},n.SetSDKOptionString=function(t){for(var n in t){var o={};o=t[n],e.socket_send("request",0,"setsdkoptionstring",o)}},n.SetSDKOptionInt=function(t){for(var n in t){var o={};o=t[n],e.socket_send("request",0,"setsdkoptionint",o)}},n.ArrayremoveByValue=function(e,t){for(var n=0;n<e.length;n++)if(e[n]==t){e.splice(n,1);break}},n.base64encode=r.base64encode,n.base64decode=r.base64decode,n.setMediaBitrates=function(e,n,o){return t(t(e,"video",n),"audio",o)},n.funDownload=function(e,t){var n=document.createElement("a");n.download=t,n.style.display="none";var o=new Blob([e]);n.href=URL.createObjectURL(o),document.body.appendChild(n),n.click(),document.body.removeChild(n)},n};t.instance=i},function(e,t){var n=function(){function e(){this.filename="BRAnyChatCore.txt",this.log_txt="日志内容"}return e.prototype.explore=function(e,t,n){if(n)return this.weixinLog(e);var o=document.createElement("a");o.download=t,o.style.display="none";var r;try{r=new Blob([e],{type:"text/plain"})}catch(t){var i=BlobBuilder||WebKitBlobBuilder||MozBlobBuilder||"";if("TypeError"==t.name&&i){var a=new i;a.append([e]),r=a.getBlob("text/plain")}}o.href=URL.createObjectURL(r),document.body.appendChild(o),o.click(),document.body.removeChild(o)},e.prototype.weixinLog=function(e){function t(e){new Image;return e.toDataURL("image/jpeg")}function n(e,t,n,o,r){var i=t.getContext("2d");i.fillStyle="#ffffff",i.font="20px";for(var a=0,s=t.width,c=0,d=0;d<e.length;d++)a+=i.measureText(e[d]).width,(a>s-n||"&"==e[d])&&("&"==e[d],i.fillText(e.substring(c,d),n,o),o+=r,a=0,c=d),d==e.length-1&&i.fillText(e.substring(c,d+1),n,o)}var o=document.getElementById("myCanvas");return o.style.width="640px",n(e,o,20,20,22),t(o)},e.prototype.doExplore=function(e){return this.explore(this.log_txt,this.filename,e)},e.prototype.putLog=function(e){this.log_txt=e},e}(),o=new n;e.exports=o}]);