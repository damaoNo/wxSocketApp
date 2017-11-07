/**
 * Created by ChenChao on 2017/11/2.
 * 管理视频录制分组，每一次双向视频建立对应一个组
 */

var Uuid = require('uuid');
var groupsTable = {};

module.exports = {
    getAll: function () {
	var groups = [];
	var group;
	for(var id in groupsTable){
	    if(groupsTable.hasOwnProperty(id)){
		group = groupsTable[id];
		groups.push({
		    gid: group.id
		});
	    }
	}
	return groups;
    },
    getGroupId: function (type) {
	var groups = this.getAll();
	var targetGroup = {};
	for(var i = 0; i < groups.length; i++){
	    if(type === 'service' && !groups[i].service){
		targetGroup = groups[i];
		break;
	    }
	    if(type === 'user' && groups[i].service){
		targetGroup = groups[i];
		break;
	    }
	}
	return targetGroup.id;
    },
    getGroupById: function (id) {
	return groupsTable[id] || null;
    },
    addConnectorToGroup: function (newConnector) {
	var type = newConnector.type;
	var gid = this.getGroupId(type);
	var id = newConnector.id;
	var newGid;
	if(type === 'service'){
	    if(!gid){ //创建新的组
		newGid = `GROUP-${Uuid.v4()}`;
		groupsTable[newGid] = {
		    id: newGid,
		    service: newConnector,
		    userCount: 0,
		    users: {}
		};
		return newGid;
	    }else{  //成为该组的客服
		groupsTable[gid].service = newConnector;
		return gid;
	    }
	}
	if(type === 'user'){
	    if(!gid){ //创建新的组，并成为该组的客户
		newGid = `GROUP-${Uuid.v4()}`;
		groupsTable[newGid] = {
		    id: newGid,
		    service: null,
		    userCount: 0,
		    users: {}
		};
		groupsTable[newGid]['users'][id] = newConnector;
		groupsTable[newGid].userCount += 1;
		return newGid;
	    }else{  //加入该组的客户
		var group = groupsTable[gid];
		var users = group.users;
		if(!users[id]){
		    group.userCount += 1;
		    users[id] = newConnector;
		}
		return gid;
	    }
	}
    },
    removeConnector: function (connector) {
	var gid = connector.gid;
	var id = connector.id;
	var type = connector.type;
	var group = groupsTable[gid];
	if(group){
	    if(type === 'service'){
		group.service = null;
	    }
	    if(type === 'user'){
		var users = group.users;
		if(users[id]){
		    users[id] = null;
		    delete users[id];
		    group.userCount -= 1;
		}
	    }
	}
    }
};
