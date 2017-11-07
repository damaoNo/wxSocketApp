/**
 * Created by ChenChao on 2017/11/6.
 */

var functions = require('./functions');
var rooms = {};

module.exports = {
    getAll: function () {
        var result = [];
        var room;
        for(var roomId in rooms){
            if(rooms.hasOwnProperty(roomId)){
                room = rooms[roomId];
                result.push({
                    id: room.id,
                    name: room.name,
                    members: room.members
                });
            }
        }
        return result;
    },
    createRoom: function () {
        var roomId = functions.randomId();
        var roomName = 'webRTC开户房间_' + roomId;
        while(rooms[roomName]){ //如果随机产生的房间号码已存在
            roomId = functions.randomId();
            roomName = 'webRTC开户房间_' + roomId;
        }
        rooms[roomId] = {
            name: roomName,
            id: roomId,
            members: 0,
            service: null,
            currentUser: null,
            users: {}
        };
        return rooms[roomId];
    },
    addUser: function (roomId, connector) {
        var room = rooms[roomId];
        var type = connector.type;
        var id = connector.id;
        if(room){
            if(type === 'service'){
                room.service = connector;
            }
            if(type === 'user'){
                room.currentUser = connector;
                room.users[id] = connector;
                room.members += 1;
            }
        }
    },
    // setCurrentUser: function (roomId, connector){
    //     var room = rooms[roomId];
    //     var type = connector.type;
    //     if(room){
    //         if(type === 'service'){
    //             room.service = connector; 
    //         }
    //         if(type === 'user'){
    //             room.currentUser = connector;
    //         }
    //     }
    // },
    getRoom: function (roomId){
        return rooms[roomId] || null;
    },
    getRoomInfo: function (roomId){
        var room = rooms[roomId];
        if(room){
            return {
                id: room.id,
                name: room.name,
                members: room.members
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
            if(type === 'user'){
                room.currentUser = null;
                if(room.users[id]){
                    room.users[id] = null;
                    delete room.users[id];
                    room.members -= 1;
                }
            }
        }
    },
    closeRoom: function (roomId) {
        var room = rooms[roomId];
        if(room){
            room.service = null;
            room.currentUser = null;
            for(var user in room.users){
                if(room.users.hasOwnProperty(user)){
                    delete room.users[user];   
                }
            }
            delete rooms[roomId];
        }
    }
};