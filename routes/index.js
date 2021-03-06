const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

const upload = require('../server/file/images').post_img_upload

// 站点安装
router.get('/install', postController.install);

// 首页
router.get('/', postController.index);

// get请求文章
router.get('/post/:id', postController.post_detail);

// get创建文章
router.get('/create', postController.post_create_get);

// post插入文章
router.post('/insert_post', postController.post_insert_post);

// login
router.post('/login', authorController.authorLogin);

// logout
router.post('/logout', authorController.authorLogin)

// get后台文章列表
router.get('/admin', postController.post_admin);

// get后台文章草稿
router.get('/draft', postController.post_draft);

// get更新文章
router.get('/update/:id', postController.post_update_get);

// get删除文章
router.get('/delete/:id', postController.post_delete_get);

// get文章归档
router.get('/archives', postController.post_archives_get);

// get标签列表
router.get('/gettags', postController.post_tags_get);

// get单个标签
router.get('/tag/:id', postController.get_one_tag);

// post获取search
router.get('/search', postController.post_search);

// get增加like
router.get('/like-add', postController.get_add_like);

// get获取友链
router.get('/link', postController.get_link);

// 添加友链请求
router.post('/add_link', postController.add_link);

// get增加photos
router.get('/photos', postController.get_photos);

// 获取站点配置
router.get('/get_config', authorController.get_config);

// 更新站点配置
router.post('/push_config', authorController.push_config);

// 获取站点文件内容
router.post('/get_file', authorController.get_file);

// 更新站点文件内容
router.post('/update_file', authorController.update_file);

// 站点主题修改
router.get('/style', authorController.get_style_path);

// 评论管理
router.post('/comment', commentController.com_Controller);

// post上传图片
router.post('/upload', upload.array('imageup',10), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    var result = [];
    var names = req.files;
    for(var i in names){
      result.push("/uploads/images/" + names[i].filename)
    }
    res.json({
      "url":result
    })
  })

  
module.exports = router;
