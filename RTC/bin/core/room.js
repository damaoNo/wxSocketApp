/**
 * Created by ChenChao on 2017/11/6.
 */

var functions = require('./functions');
var rooms = {};

module.exports = {
    getStatus: function (){
        return rooms;
    },
    getAll: function () {
        var result = [];
        var room;
        for(var roomId in rooms){
            if(rooms.hasOwnProperty(roomId) && roomId !== 'admin'){
                room = rooms[roomId];
                result.push({
                    id: room.id,
                    name: room.name
                });
            }
        }
        return result;
    },
    createRoom: function (connector) {
        var roomId = functions.randomId();
        var roomName = 'webRTC开户房间_' + roomId;
        while(rooms[roomName]){ //如果随机产生的房间号码已存在
            roomId = functions.randomId();
            roomName = 'webRTC开户房间_' + roomId;
        }
        rooms[roomId] = {
            name: roomName,
            id: roomId,
            service: null,
            currentUser: connector
        };
        return {
            name: roomName,
            id: roomId
        };
    },
    setAdmin: function (connector){
        rooms.admin = connector;
    },
    getAdmin: function (){
        return rooms.admin || null;
    },
    addService: function (roomId, connector) {
        var room = rooms[roomId];
        var type = connector.type;
        if(room){
            if(type === 'service'){
                room.service = connector;
            }
        }
    },
    getRoom: function (roomId){
        return rooms[roomId] || null;
    },
    getRoomInfo: function (roomId){
        var room = rooms[roomId];
        if(room){
            return {
                id: room.id,
                name: room.name
            }
        }else{
            return null;
        }
    },
    removeUser: function (connector){
        var room = rooms[connector.roomId];
        var type = connector.type;
        var id = connector.id;
        if(room){
            if(type === 'service'){
                room.service = null;
            }
            if(type === 'customer'){
                room.currentUser = null;
            }
        }
    },
    closeRoom: function (roomId) {
        var room = rooms[roomId];
        if(room){
            room.service = null;
            room.currentUser = null;
            delete rooms[roomId];
        }
    }
};