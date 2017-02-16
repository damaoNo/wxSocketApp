/**
 * Created by ChenChao on 2016/12/26.
 */

var rooms = {};

module.exports = {
    getRooms: function () {
        return rooms;
    },
    createRoom: function (io, socketId) {
        var roomId = randomId();
        var roomName = 'room_' + roomId;
        while(rooms[roomName]){ //如果随机产生的房间号码已存在
            roomId = randomId();
            roomName = 'room_' + roomId;
        }
        rooms[roomName] = {
            name: roomName,
            id: roomId,
            member: 1,
            users: {}
        };
        rooms[roomName].users[socketId] = socketId;
        return {
            roomName: roomName,
            roomSocket: io.of('/' + roomName)
        };
    },
    enterRoom: function (roomName, socketId) {
        var room = rooms[roomName];
        if(!room.users[socketId]){
            room.users[socketId] = socketId;
            room.member += 1;
        }
    },
    closeRoom: function (io, roomName) {
        io.off('/' + roomName);
    }
};

function randomId() {
    var r = Math.random() * 1000000;
    r = Math.ceil(r);
    while(r.toString().length < 6){
        r = r * 10;
    }
    return r;
}