/**
 * Created by ChenChao on 2017/11/2.
 * 管理所有已连接socket服务的用户
 */

var userTable = {};

module.exports = {
    getUserList: function () {
	var users = [];
	for(var id in userTable){
	    if(userTable.hasOwnProperty(id)){
		users.push(userTable[id]);
	    }
	}
	return users;
    },
    getUserTable: function () {
	return userTable;
    },
    getUser: function (id) {
	return userTable[id] || null;
    },
    addUser: function (user) {
	var id = user.id;
	if(userTable[id]){
	    userTable[id] = null;
	    delete userTable[id];
	}
	userTable[id] = user;
    },
    removeUser: function (id) {
	if(userTable[id]){
	    userTable[id] = null;
	    delete userTable[id];
	}
    }
};