/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = function (env) {

    'use strict';
    
    var config = {
	'dev': {
	    env: 'dev',
	    wsServer: 'wss://localhost:443',
	    iceServer: {
		//开发环境为空，局域网可以不需要穿墙
	    },
	    logger: true
	},
	'test': {
	    env: 'test',
	    wsServer: 'wss://www.nodejser.site:3001',
	    iceServer: {

	    },
	    logger: true
	},
	'prd': {
	    env: 'prd',
	    wsServer: 'wss://localhost:3001',
	    iceServer: {
		"iceServers": [{
		    "url": "stun:stun.l.google.com:19302"
		}, {
		    "url": "turn:numb.viagenie.ca",
		    "username": "webrtc@live.com",
		    "credential": "muazkh"
		}]
	    },
	    logger: false
	}
    };
    return config[env] || config['dev'];

};