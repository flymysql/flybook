var express = require('express');
var router = express.Router();
const authorController = require('../controllers/authorController');

// 获取站点配置
router.get('/get_config', authorController.get_config);

// 更新站点配置
router.post('/push_config', authorController.push_config);

// 获取站点文件内容
router.post('/get_file', authorController.get_file);

// get code
//router.post('/getcode', authorController.getcode);

// wechat signup
router.post('/wechat_signup', authorController.wechat_signup);

// 更新站点文件内容
router.post('/update_file', authorController.update_file);

// 站点主题修改
router.get('/style', authorController.get_style_path);

// login
router.post('/login', authorController.authorLogin);

// signup page
router.get('/tosignup', authorController.toSignUP);

// logout
router.post('/logout', authorController.authorLogin)

module.exports = router;
