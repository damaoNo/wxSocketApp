/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = function (env) {

    'use strict';

    var videoOptions = {
	mimeType: 'video/webm\;codecs=h264',
	audioBitsPerSecond : 128000,
	videoBitsPerSecond : 256000
    };
    var config = {
	'dev': {
	    env: 'dev',
	    wsServer: 'wss://localhost:443',
	    iceServer: {
		"iceServers": [{
		    "url": "stun:180.153.145.212:3478"
		}, {
		    "url": "turn:180.153.145.212:3478",
		    "username": "admin",
		    "credential": "admin"
		}]
	    },
	    videoOptions: videoOptions,
	    logger: true
	},
	'dev2': {
	    env: 'dev2',
	    wsServer: 'wss://www.nodejser.site:443',
	    iceServer: {
		"iceServers": [{
		    "url": "stun:10.10.81.168:3478"
		}, {
		    "url": "turn:180.153.145.212:3478",
		    "username": "admin",
		    "credential": "admin"
		}]
	    },
	    videoOptions: videoOptions,
	    logger: true
	},
	'test': {
	    env: 'test',
	    wsServer: 'wss://ceshi.securities.eastmoney.com:7235',
	    iceServer: {
		"iceServers": [{
		    "url": "stun:10.10.81.168:3478"
		}, {
		    "url": "turn:180.153.145.212:3478",
		    "username": "admin",
		    "credential": "admin"
		}]
	    },
	    videoOptions: videoOptions,
	    logger: true
	},
	'prd': {
	    env: 'prd',
	    wsServer: 'wss://ceshi.securities.eastmoney.com',
	    iceServer: {
		"iceServers": [{
		    "url": "stun:stun.l.google.com:19302"
		}, {
		    "url": "turn:numb.viagenie.ca",
		    "username": "webrtc@live.com",
		    "credential": "muazkh"
		}]
	    },
	    videoOptions: videoOptions,
	    logger: false
	}
    };
    return config[env] || config['dev'];

};