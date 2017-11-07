/**
 * Created by ChenChao on 2017/11/2.
 */

var WebSocket = require('ws');
var Sh = require('shelljs');
var Uuid = require('uuid');
var Record = require('./record');
var User = require('./user');
var Room = require('./room');
var log = require('./log');

module.exports = function (sslServer) {
    var wss = new WebSocket.Server({
	server: sslServer,
	verifyClient: function (info, next) {
	    //todo 可添加验证规则
	    next(true);
	}
    });

    //定义消息广播
    wss.broadcastToUsers = function broadcast(message) {
	wss.clients.forEach(function each(client) {
	    if (client.readyState === WebSocket.OPEN && client.type === 'user') {
		console.log(`广播客服消息给用户: ${client.uuid}`);
		client.send(message, function (error) {
		    if (error) {
			console.log(`broadcast to user ${client.uuid} message error：'`, error);
		    }
		});
	    }
	});
    };

    // 有socket连入
    wss.on('connection', function(ws, req) {
	var connectID = `USER-${Uuid.v4()}`;
	ws.uuid = connectID;
	var newConnector = {
	    id: connectID,
	    ip: req.connection.remoteAddress,
	    ws: ws,
	    type: '',
	    roomId: ''
	};
	User.addUser(newConnector);
	var record;

	// 转发收到的消息
	ws.on('message', function(message) {
	    //二进制数据
	    if(typeof message === 'object'){
		record.write(message);
		return;
	    }

	    //普通信令
	    if(typeof message === 'string'){
		var json = JSON.parse(message);
		if(json.event === 'room'){
		    let data = {
			event: 'room',
			data: Room.getAll()
		    };
		    sendMessage(ws, JSON.stringify(data));
		}

		if(json.event === 'room info'){
		    let data = {
			event: 'room info',
			data: Room.getRoomInfo(newConnector.roomId)
		    };
		    sendMessage(ws, JSON.stringify(data));
		}

		if(json.event === 'add room' && json.type === 'customer'){
		    var newRoom = Room.createRoom();
		    let _data = {
			event: 'join',
			data: newRoom,
			status: true
		    };
		    console.log(JSON.stringify(_data));
		    console.log('start https://localhost:3000/service?roomId=' + newRoom.id + '#service');
		    Sh.exec('start https://localhost:3000/service?roomId=' + newRoom.id + '#service', function (code) {
			console.log('打开浏览器，exit code:', code);
			sendMessage(ws, JSON.stringify(_data));
		    });
		}

		//通过ping完成身份的确认和加入房间
		if(json.event === 'ping'){
		    newConnector.type = json.type;
		    newConnector.roomId = json.roomId;
		    Room.addUser(json.roomId, newConnector);
		    //Room.setCurrentUser(json.roomId, newConnector, json.type);
		    sendMessage(ws, JSON.stringify({
			event: 'ping',
			type: json.type
		    }));
		    if(json.type === 'service'){
			record = new Record(ws);
		    }
		}

		var room = Room.getRoom(newConnector.roomId);
		//视频发起方的请求视频
		if(json.event === '_offer' && json.caller === 'true'){
		    if(room && room.service){
			sendMessage(room.service.ws, message);
		    }
		}
		//客服广播响应
		if(json.event === '_answer'){
		    if(room && room.currentUser){
			sendMessage(room.currentUser.ws, message);
		    }
		}
		//ICE候选
		if(json.event === '_ice_candidate' && room){
		    if(newConnector.type === 'service' && room.currentUser){
			sendMessage(room.currentUser.ws, message);
		    }
		    if(newConnector.type === 'user' && room.service){
			sendMessage(room.service.ws, message);
		    }
		}
		//视频流录制
		if(json.event === 'record start'){
		    if(room && room.service){
			if(json.type === 'user'){
			    sendMessage(room.service.ws, JSON.stringify({event: 'record start'}));
			}
			if(json.type === 'service'){
			    console.log('start to record!');
			    record && record.start();
			}
		    }
		}
		if(json.event === 'record over'){
		    if(room && room.service){
			if(json.type === 'user'){
			    sendMessage(room.service.ws, JSON.stringify({event: 'record over'}));
			}
			if(json.type === 'service'){
			    console.log('stop record!');
			    record && record.end();
			}
		    }
		}
	    }
	});

	ws.on('close', function () {
	    var id = newConnector.id;
	    User.removeUser(id);
	    Room.removeUser(newConnector)
	});
    });

    function sendMessage(ws, data, eventType) {
	ws.send(data, function (error) {
	    if(error){
		console.log(`send message error：`, error);
	    }
	});
    }
    
    return wss;
};