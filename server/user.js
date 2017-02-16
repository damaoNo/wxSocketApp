/**
 * Created by ChenChao on 2016/12/26.
 */

var users = {};

module.exports = {
    getUsers: function () {
        return users;
    },
    connectUser: function (socketId) {
        if(!users[socketId]){
            users[socketId] = {
                socketId: socketId
            }
        }
    },
    disConnectUser: function (socketId) {
        if(users[socketId]){
            delete users[socketId];
        }
    }
};