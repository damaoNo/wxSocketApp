var express = require('express');
var router = express.Router();

//房间管理
router.get('/admin', function(req, res, next) {
  res.render('admin', { title: '客服' });
});

//客服房间
router.get('/service', function(req, res, next) {
  res.render('index', { title: '客服' });
});

router.get('/user', function(req, res, next) {
  res.render('index', { title: '录制视频' });
});

module.exports = router;
