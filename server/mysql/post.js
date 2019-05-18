const connection = require('./db').connection
const config = require('../../config')
const until = require('../../until/until')

const option = {
    title: config.seo.title,
    icp: config.options.ICP,
    cop: config.options.copyright,
    pagenum: 10,
    avator: "",
    carousel: config.carousel,
}

// 文章归档和后台使用同一个模板渲染
const Articleslist = function(res, ifadmin){
    var selectsql=`select id,title,updateTime from articles where type = 'post'`;
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
            'list': result
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
    var selectsql=`select * from articles where type = 'post' order by updateTime desc limit ${pagenum}, 10`;
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
            'friends': config.friends
        }); 
    });
};

exports.getArticleDetail = (res, id) =>{
    var selectsql=`select * from articles where id = "${id}";
    update articles set visitors=visitors+1 where id = "${id}"
    `;
    connection.query(selectsql,function(err,rows){
        if(err){
        console.log(err);
        return;
        }
        rows = rows[0];
        var time = rows[0].updateTime;
        res.render('post', {
            'site':option,
            'title': rows[0].title,
            'content': rows[0].post_content,
            'like': rows[0].like,
            'view': rows[0].visitors,
            'tag': rows[0].tag,
            'updateTime': time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
        }); 
    });
};

exports.createArticle = (res, req) =>{
    var sess = req.session;
    // 生成一个随机字符串作为文章id
    var id = Math.random().toString(16).substr(6);
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    console.log(loginUser)
    console.log(isLogined)
    // var isLogined = !!loginUser;
    res.render('create', {
        'update': false,
        'site':option,
        'isLogined': isLogined,
        'name': loginUser,
        'type': 'insert',
        'id': id
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
    var sql = `INSERT INTO articles  VALUES('${pid}', '${title}', '${desc}', '${content}', '${req.body.img}', '${req.body.ifpage}', 0, 0, '${req.body.tag}', '${date}', '${date}', (select id from tags where name = '${req.body.tag}'))`;
    if(req.body.type == 'update'){
        console.log('update')
        sql = `UPDATE articles SET title = '${title}', description = '${desc}', post_content = '${content}', img = '${req.body.img}',tag = '${req.body.tag}',updateTime = '${date}', tagid = (select id from tags where name = '${req.body.tag}') where id = '${req.body.id}'`;
    }
    // sql = mysql.escape(sql);
    // console.log(sql)
    connection.query(sql,function(err,rows){
        // 如果标签不存在的话就创建新标签
        if(err){
            var insertAll = `insert into tags values(null , '${req.body.tag}');
            INSERT INTO articles  VALUES('${req.body.id}', '${title}', '${desc}', '${content}', '${req.body.img}', '${req.body.ifpage}', 0, 0, '${req.body.tag}', '${date}', '${date}', (select id from tags where name = '${req.body.tag}'))`;
            connection.query(insertAll, function(err,rows){
                if(err){
                    console.log(err);
                }
                res.end('succeed'); 
                console.log("new tags")
            });
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
            'type': 'update'
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
    var searchsql = `SELECT * FROM articles WHERE post_content LIKE '%${s}%'`;
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
            'friends': config.friends
        }); 
    });
}

exports.conn = connection;
