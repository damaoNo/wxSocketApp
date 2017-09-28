/**
 * Created by ChenChao on 2017/7/21.
 */

var fs = require('fs');
var path = require('path');

module.exports = {
    //证书
    key: fs.readFileSync(__dirname + '/keys/214025060130250.key'),
    cert: fs.readFileSync(__dirname + '/keys/214025060130250.pem'),

    //是否为双向实时视频
    bothWay: true,
    //保存格式可选 [.mp4, .webm]
    suffix: '.mp4',
    //临时视频文件目录
    tempVideoPath: path.resolve(__dirname, '../videos_temp'),
    //确认的视频文件目录
    videoPath: path.resolve(__dirname, '../webrtcvideo001'),

    //mp4 url访问路径
    videoUrl: 'https://www.nodejser.site:8009/'
};