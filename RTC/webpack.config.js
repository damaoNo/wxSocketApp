/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = {
    
    entry:  __dirname + "/public/javascripts/webrtc-business.js",
    
    output: {
	path: __dirname + "/public/release/resource/js",
	filename: "emrtc.main.js"//打包后输出文件的文件名
    }
};