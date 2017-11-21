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
	    if (client.readyState === WebSocket.OPEN && client.type === 'customer') {
		console.log(`广播客服消息给用户: ${client.uuid}`);
		client.send(message, function (error) {
		    if (error) {
			console.log(`broadcast to customer ${client.uuid} message error：'`, error);
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
		record && record.write(message);
		return;
	    }

	    //普通信令
	    if(typeof message === 'string'){
		var json = JSON.parse(message);
		//通过ping完成身份的确认和加入房间
		if(json.event === 'ping'){
		    newConnector.type = json.type;
		    if(json.type === 'admin'){
			Room.setAdmin(newConnector);
		    }
		    if(json.type === 'service'){
			record = new Record(ws);
		    }
		    if(json.roomId){
			newConnector.roomId = json.roomId;
			Room.addService(json.roomId, newConnector);
		    }
		    sendMessage(ws, JSON.stringify({
			event: 'ping',
			type: json.type,
			roomId: json.roomId
		    }));
		}
		
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
		    var rooms = Room.getAll();
		    console.log('--------------------------------');
		    console.log('当前房间数量：', rooms.length);
		    console.log('--------------------------------');
		    if(rooms.length > 2){
			sendMessage(newConnector.ws, JSON.stringify({
			    event: 'full'
			}));
		    }else{
			var newRoom = Room.createRoom(newConnector);
			var admin = Room.getAdmin();
			admin && sendMessage(admin.ws, JSON.stringify({
			    event: 'create room',
			    rooms: Room.getAll(),
			    newRoom: newRoom
			}));
			newConnector.roomId = newRoom.id;
		    }
		}

		if(json.event === 'service ready' && json.type === 'service'){
		    let room = Room.getRoom(json.roomId);
		    //即让当前连接进入对应房间
		    room && sendMessage(room.currentUser.ws, JSON.stringify({
			event: 'join',
			roomId: json.roomId
		    }));
		}

		//视频发起方的请求视频
		if(json.event === '_offer'){
		    console.log('收到_offer??');
		    console.log('roomId:', json.roomId);
		    let room = Room.getRoom(json.roomId);
		    if(room && room.service){
			sendMessage(room.service.ws, message);
		    }
		}
		//客服响应
		if(json.event === '_answer'){
		    console.log('收到_answer??');
		    console.log('roomId:', json.roomId);
		    let room = Room.getRoom(json.roomId);
		    if(room && room.currentUser){
			sendMessage(room.currentUser.ws, message);
		    }
		}
		//ICE候选
		if(json.event === '_ice_candidate'){
		    console.log('收到_ice_candidate?? 身份：', json._ice_candidate_type);
		    console.log('roomId:', json.roomId);
		    let room = Room.getRoom(json.roomId);
		    if(newConnector.type === 'service' && room.currentUser){
			sendMessage(room.currentUser.ws, message);
		    }
		    if(newConnector.type === 'customer' && room.service){
			sendMessage(room.service.ws, message);
		    }
		}
		//视频流录制
		if(json.event === 'record start'){
		    let room = Room.getRoom(json.roomId);
		    if(room && room.service){
			if(json.type === 'customer'){
			    sendMessage(room.service.ws, JSON.stringify({event: 'record start'}));
			}
			if(json.type === 'service'){
			    console.log('start to record!');
			    log('start to record!');
			    record && record.start();
			}
		    }
		}
		if(json.event === 'record over'){
		    let room = Room.getRoom(json.roomId);
		    if(room && room.service){
			if(json.type === 'customer'){
			    sendMessage(room.service.ws, JSON.stringify({event: 'record over'}));
			}
			if(json.type === 'service'){
			    console.log('stop record!');
			    record && record.end();
			}
		    }
		}
		if(json.event === 'apply'){
		    let room = Room.getRoom(json.roomId);
		    if(room && room.service){
			if(json.type === 'customer'){
			    sendMessage(room.service.ws, JSON.stringify({event: 'record apply'}));
			}
			if(json.type === 'service'){
			    console.log(`发送最终结果给客户：${message}`);
			    record && record.transformFile(function (message) {
				sendMessage(room.currentUser.ws, message);
			    });
			}
		    }
		}
	    }
	});

	ws.on('close', function () {
	    var id = newConnector.id;
	    var type = newConnector.type;
	    if(type === 'customer'){
		let room = Room.getRoom(newConnector.roomId);
		if(room){
		    var admin = Room.getAdmin();
		    admin && sendMessage(admin.ws, JSON.stringify({
			event: 'room close'
		    }));
		    if(room.service){
			sendMessage(room.service.ws, JSON.stringify({event: 'room close'}), function () {
			    Room.closeRoom(newConnector.roomId);
			    User.removeUser(id);
			});
		    }else{
			Room.closeRoom(newConnector.roomId);
			User.removeUser(id);
		    }
		}
	    }else{
		User.removeUser(id);
		Room.removeUser(newConnector);
	    }
	});
    });

    function sendMessage(ws, data, callback) {
	ws.send(data, function (error) {
	    callback && callback(error);
	    if(error){
		console.log(`send message error：`, error);
	    }
	});
    }
    
    return wss;
};