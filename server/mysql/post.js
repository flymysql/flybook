const connection = require('../config/db').connection
const config = require('../../config')
const until = require('../../until/until')
//serverStartTimestamp
const sst = new Date().getTime()
const option = {
    title: config.seo.title,
    icp: config.options.ICP,
    cop: config.options.copyright,
    pagenum: 20,
    avator: "",
    carousel: config.carousel,
}

// 文章归档和后台使用同一个模板渲染
const Articleslist = function(res, ifadmin){
    var selectsql=`select id,title,updateTime from articles where type = 'post' order by updateTime desc`;
    if(ifadmin){
        selectsql = `select id,title,updateTime from articles`;
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
                'updateTime': time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
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
                'img': rows[i].img,
                'cop': "原创",
                'updateTime': time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
            });
        }
        // console.log(result);
        
        res.render('index', { 
            'site':option,
            'list':result,
            'next': parseInt(page)+1 || 1,
            'pre': parseInt(page)-1>=0? parseInt(page)-1 : 0,
            'carousel': option.carousel,
            'friends': config.friends,
            'sst':sst
        }); 
    });
};

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
            'like': rows[0].like,
            'view': rows[0].visitors,
            'tag': rows[0].tag,
            'updateTime': time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate(),
            'sst': sst
        });
    });
};

exports.createArticle = (res, req) =>{
    var sess = req.session;
    // 生成一个随机字符串作为文章id
    var id = Math.random().toString(16).substr(6);
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    // var isLogined = !!loginUser;
    res.render('create', {
        'update': false,
        'site':option,
        'isLogined': isLogined,
        'name': loginUser,
        'type': 'insert',
        'id': id,
        'sst': sst
    });
};

exports.insertArticle = (req, res) =>{
    var date = until.nowDate;
    var content = req.body.content.replace(/'/g,"\"");
    var title = req.body.title.replace(/'/g,"\"");
    var desc = content.substring(0,80);
    // var title = req.body.title.replace("\"","\\\"")
    var pid = req.body.id;
    if(req.body.ifpage == 'page'){
        pid = title;
    }
    console.log(date)
    var sql = `INSERT INTO articles  VALUES('${pid}', '${title}', '${desc}', '${content}', '${req.body.img}', '${req.body.ifpage}', 0, 0, '${req.body.tag}', '${date}', '${date}')`;
    if(req.body.type == 'update'){
        console.log('update')
        sql = `UPDATE articles SET title = '${title}', description = '${desc}', post_content = '${content}', img = '${req.body.img}',tag = '${req.body.tag}',updateTime = '${date}' where id = '${req.body.id}'`;
    }
    // sql = mysql.escape(sql);
    // console.log(sql)
    connection.query(sql,function(err,rows){
        // 如果标签不存在的话就创建新标签
        if(err){
            console.log(err)
        }
        else{
            res.end('succeed'); 
        }
    });
};

exports.updateArticle = (res, req) =>{
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
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
            'isLogined': isLogined,
            'name': loginUser,
            'type': 'update',
            'sst': sst
        }); 
    });
};

exports.deleteArticle = (res, id) =>{
    var deltesql = `DELETE FROM articles WHERE id = '${id}'`;
    connection.query(deltesql,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        res.send('succeed');
    });
}

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


exports.get_add_like = (res, req) => {
    console.log(req.headers.referer)
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
