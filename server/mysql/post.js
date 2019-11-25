const connection = require('../config/db').connection;
const config = require('../../config');
const until = require('../../until/until');
const createrss = require('../file/rss').createrss;
var users = require('../config/user').items;
//serverStartTimestamp
const sst = new Date().getTime();
const option = {
    title: config.seo.title,
    icp: config.options.ICP,
    cop: config.options.copyright,
    pagenum: 20,
    avator: "",
    carousel: config.carousel,
}

// 判断是否登陆
var ifLogin = function (name) {
    for (i in users) {
        if (users[i].name === name) return true;
    }
    return false;
}

// 文章归档和后台使用同一个模板渲染
const Articleslist = function(res, ifadmin){
    var selectsql=`select id,title,updateTime from articles where type = 'post' order by updateTime desc`;
    if(ifadmin){
        selectsql = `select id,title,updateTime from articles order by updateTime desc`;
    }
    var result= [];
    connection.query(selectsql,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            var time = rows[i].updateTime;
            result.push({
                'id':rows[i].id,
                'title':rows[i].title, 
                'updateTime': time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate()
            });
        }
        res.render('archives', {
            'ifadmin': ifadmin,
            'site': option,
            'list': result,
            'sst': sst
        })
    });
}

exports.adminArticle = (res =>Articleslist(res, true));
exports.archivesArticle = (res => Articleslist(res, false));

/**
 * 获取文章列表
 */
exports.getArticleList = (res, page) =>{
    var pagenum = page * option.pagenum || 0;
    var selectsql=`select * from articles where type = 'post' order by updateTime desc limit ${pagenum}, ${option.pagenum}`;
    var result= [];
    connection.query(selectsql,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            var time = rows[i].updateTime;
            result.push({
                'id':rows[i].id,
                'title':rows[i].title, 
                'content':rows[i].description,
                'like': rows[i].like,
                'view': rows[i].visitors,
                'tag': rows[i].tag,
                'author': rows[i].author,
                'author_head': config.author[rows[i].author].head_img,
                'img': rows[i].img,
                'cop': "原创",
                'updateTime': time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate()
            });
        }
        // console.log(result);
        if(page == undefined){
            res.render('index', { 
                'site':option,
                'list':result,
                'next': parseInt(page)+1 || 1,
                'pre': parseInt(page)-1>=0? parseInt(page)-1 : 0,
                'carousel': option.carousel,
                'friends': config.friends,
                'sst':sst
            }); 
        }
        else{
            res.json({
                'list': result,
                'code': 1
            });
        }
    });
};

// 单文章页面
exports.getArticleDetail = (res, id) =>{
    var selectsql=`select * from articles where id = "${id}"`;
    var updatetag = `update articles set visitors=visitors+1 where id = "${id}"`;
    connection.query(updatetag);
    connection.query(selectsql,function(err,rows){
        if(err){
        console.log(err);
        return;
        }
        if(rows[0] == undefined){
            res.render('404');
            return;
        }
        var time = rows[0].updateTime;
        res.render('post', {
            'site':option,
            'title': rows[0].title,
            'content': rows[0].post_content,
            'desc': rows[0].description, 
            'like': rows[0].like,
            'author': rows[0].author,
            'head_img': config.author[rows[0].author].head_img,
            'blog_name': config.author[rows[0].author].blog_name,
            'view': rows[0].visitors,
            'tag': rows[0].tag,
            'updateTime': time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate(),
            'sst': sst
        });
    });
};

// 后台写文章页面
exports.createArticle = (res, req) =>{
    var sess = req.session;
    // 生成一个随机字符串作为文章id
    var id = Math.random().toString(16).substr(6);
    var loginUser = sess.loginUser;
    var isLogined = ifLogin(loginUser);
    console.log(isLogined);
    // var isLogined = !!loginUser;
    res.render('create', {
        'update': false,
        'site':option,
        'isLogined': isLogined,
        'name': loginUser,
        'type': 'insert',
        'id': id,
        'sst': sst,
        'authors': config.author
    });
};

// 文章插入操作
exports.insertArticle = (req, res) =>{
    var sess = req.session;
    var isLogined  = ifLogin(sess.loginUser);
    if(!isLogined){
        console.log("passwd error");
        res.end('error'); 
        return;
    }
    var date = until.nowDate();
    var content = req.body.content.replace(/'/g,'"');
    var title = req.body.title.replace(/'/g,'"');
    var desc = req.body.desc;
    if(desc.length > 100){
        desc = desc.substring(0,100);
    }
    // var title = req.body.title.replace("\"","\\\"")
    var pid = req.body.id;
    if(req.body.ifpage == 'page'){
        pid = title;
    }
    var sql = `INSERT INTO articles  VALUES('${pid}', '${title}', '${desc}', '${content}', '${req.body.img}', '${req.body.ifpage}', 0, 0, '${req.body.tag}', '${date}', '${date}','${req.body.author}')`;
    if(req.body.type == 'update'){
        sql = `UPDATE articles SET title = '${title}', description = '${desc}', post_content = '${content}', img = '${req.body.img}',tag = '${req.body.tag}',updateTime = '${date}',author = '${req.body.author}' where id = '${req.body.id}'`;
    }
    // sql = mysql.escape(sql);
    // console.log(sql)
    connection.query(sql,function(err,rows){
        if(err){
            console.log(err)
        }
        else{
            createrss();
            res.end('succeed'); 
        }
    });
};

// 文章更新操作
exports.updateArticle = (res, req) =>{
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = ifLogin(loginUser);
    if(!isLogined){
        res.end('error'); 
        return;
    }
    var selectsql=`select * from articles where id = '${req.params.id}'`;
    connection.query(selectsql,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        res.render('create', {
            'update': true,
            'id': req.params.id,
            'site': option,
            'title': rows[0].title,
            'content': rows[0].post_content,
            'tag': rows[0].tag,
            'img': rows[0].img,
            'author': rows[0].author,
            'isLogined': isLogined,
            'name': loginUser,
            'type': 'update',
            'sst': sst
        }); 
    });
};

// 文章删除操作
exports.deleteArticle = (res, id, islogin) =>{
    if(!islogin){
        res.end("you are not admin !!!");
        return;
    }
    var deltesql = `DELETE FROM articles WHERE id = '${id}'`;
    connection.query(deltesql,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        res.send('succeed');
    });
}

// 文章搜索
exports.post_search = (res, s) =>{
    var searchsql = `SELECT * FROM articles WHERE post_content LIKE '%${s}%' or title like '%${s}%'`;
    var result= [];
    connection.query(searchsql,function(err,rows){
        if(err){
        console.log(err);
            return;
        }
        for(var i in rows){
            var time = rows[i].updateTime;
            result.push({
                'id':rows[i].id,
                'title':rows[i].title, 
                'content':rows[i].description,
                'like': rows[i].like,
                'view': rows[i].visitors,
                'tag': rows[i].tag,
                'img': rows[i].img,
                'cop': "原创",
                'updateTime': time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
            });
        }
        // console.log(result);
        res.render('index', {
            'site':option,
            'list':result,
            'tag': true,
            'carousel': option.carousel,
            'friends': config.friends,
            'sst': sst
        }); 
    });
}

// 点击喜欢事件，like+1
exports.get_add_like = (res, req) => {
    var id = req.headers.referer.replace(config.seo.index,"").replace("/post/","");
    var sql = 'update articles set `like` = `like`+1 where id ="' + id + '"';
    connection.query(sql, function(err, rows){
        if(err){
            console.log(err)
            res.json({
                code:0
            })
            return;
        }
        res.json({
            code:1
        })
    })
}

// 友链页面渲染
exports.get_link = (res, req) => {
    var sql = 'SELECT * FROM `links` WHERE 1';
    var links = []
    connection.query(sql, function(err, rows){
        if(err){
            console.log(err)
            res.json({
                code:0
            })
            return;
        }
        for(var i in rows){
            links.push({
                'name':rows[i].name,
                'src': rows[i].src,
                'href': rows[i].href,
                'desc': rows[i].desc
            });
        }
        res.render('link', {
            'site':option,
            'links':links
        })
    })
}

// 相册渲染
exports.render_photos = (res => {
    res.render('photos', {
        'sst':sst,
        'site':option,
    })
})

// 站点安装
exports.installWeb = (res, req) => {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = ifLogin(loginUser);
    if (isLogined) {
        console.log("islogin")
        var install_sql = "CREATE TABLE `articles` (`id` varchar(20) NOT NULL, `title` varchar(255) DEFAULT NULL,`description` varchar(255) DEFAULT NULL, `post_content` longtext NOT NULL,`img` varchar(255) DEFAULT NULL,`type` varchar(10) DEFAULT 'post', `visitors` bigint(20) DEFAULT '0',`like` bigint(20) DEFAULT '0', `tag` varchar(255) DEFAULT NULL, `createTime` date DEFAULT NULL,`updateTime` date DEFAULT NULL  ) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC; CREATE TABLE `tags` (`id` int(10) NOT NULL,`name` text NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8; ALTER TABLE `articles` ADD PRIMARY KEY (`id`) USING BTREE,ADD KEY `id` (`id`);ALTER TABLE `tags`ADD PRIMARY KEY (`id`);ALTER TABLE `tags`MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22; COMMIT;INSERT INTO `articles` (`id`, `title`, `description`, `post_content`, `img`, `type`, `visitors`, `like`, `tag`, `createTime`, `updateTime`) VALUES('872fdc4f6', 'Hello World！', '<p>欢迎使用flybook搭建你的站点</p><p>开始你的创作吧！</p><p><br></p>', '<p>欢迎使用flybook搭建你的站点</p><p>开始你的创作吧！</p><p><br></p>', '', 'post', 0, 0, '随想', '2019-05-18', '2019-05-18');"
        connection.query(install_sql, function(err, rows){
            if (err) {
                console.log(err);
                res.end("error");
                return;
            }
            else {
                res.render('install', {
                    'site':option,
                    'isLogined': isLogined,
                    'name': loginUser,
                    'type': 'insert',
                    'id': '000000',
                    'sst': sst
                });
            }
        });
    }
    else {
        console.log("login")
        res.render('install', {
            'site':option,
            'isLogined': isLogined,
            'name': loginUser,
            'type': 'insert',
            'id': '000000',
            'sst': sst
        });
    }
}