var post = require('../server/mysql/post');
var tags = require('../server/mysql/tags');


exports.index = (req, res) => { post.getArticleList(res, req.query.page);};

// 为每文章显示详细信息的页面
exports.post_detail = (req, res) => { post.getArticleDetail(res, req.params.id) };

// 由 GET 显示创建文章的表单
exports.post_create_get = (req, res) => { post.createArticle(res, req) };

// 由 post 插入创建文章的表单
exports.post_insert_post = (req, res) => { post.insertArticle(req, res) };

// 文章列表后台
exports.post_admin = (req, res) => { post.adminArticle(res) };

// 由 GET 显示修改文章的表单
exports.post_update_get = (req, res) => { post.updateArticle(res, req) };

// 由 GET 显示删除文章的表单
exports.post_delete_get = (req, res) => { post.deleteArticle(res, req.params.id, req.session.loginUser); };

// get处理文章归档
exports.post_archives_get = (req, res) => { post.archivesArticle(res); }

// get处理标签获取
exports.post_tags_get = (req, res) => { tags.queryAllTags(res);}

// get获取单个文章页面
exports.get_one_tag = (req, res) => { tags.queryOneTags(res, req) ;}

// post获取搜索内容
exports.post_search = (req, res) => { post.post_search(res, req.query.s)}

// get新建标签
exports.get_insert_tag = (req, res) => { tags.get_insert_tag(res, req.query.tagname) }

// get增加like
exports.get_add_like = (req, res) => { post.get_add_like(res, req) }

exports.get_photos = (req, res) => { post.render_photos(res) }
