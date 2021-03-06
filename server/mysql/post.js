const config = require('../../config');
const until = require('../../until/until');
const createrss = require('../file/rss').createrss;
var users = require('../config/user').items;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_post = new FileSync('db/post.json') 
const db_post = low(adapter_post)
const db_link = low(new FileSync('db/link.json') )

const pug = require('pug');
// 编译文章页面
const compiledPost = pug.compileFile('views/post.pug');
// 编译首页页面
const compiledIndex = pug.compileFile('views/index.pug');
// 编译归档页面
const compiledArchives = pug.compileFile('views/archives.pug');

//serverStartTimestamp
const sst = new Date().getTime();
const option = {
    title: config.seo.title,
    icp: config.options.ICP,
    cop: config.options.copyright,
    pagenum: 20,
    avator: "",
    carousel: config.carousel,
    keywords: config.seo.keywords,
    description: config.seo.description,
    footer: config.footer_menu
}

// 判断是否登陆
var ifLogin = function (name) {
    for (i in users) {
        if (users[i].name === name) return true;
    }
    return false;
}

// 文章归档和后台使用同一个模板渲染
const Articleslist = function(res,flag, ifadmin){
    var type = "post";
    if(flag) {
        type = "cao"
    }
    var rows = [];
    // var selectsql=`select id,title,updateTime from articles where type = 'post' order by updateTime desc`;
    if(ifadmin){
        rows = db_post.filter({type: type})
        .sortBy(function(o){
            var t = o.updateTime.split('-');
            return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
        })
        .value()
        //selectsql = `select id,title,updateTime from articles  where type = '${type}' order by updateTime desc`;
    } else {
        rows = db_post.filter({type: "post"})
        .sortBy(function(o){
            var t = o.updateTime.split('-');
            return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
        })
        .value()
    }
    var result= [];
    for(var i in rows){
        var time = rows[i].updateTime;
        result.push({
            'id':rows[i].id,
            'title':rows[i].title, 
            'updateTime': time
        });
    }
    res.send(compiledArchives({
        'ifadmin': ifadmin,
        'site': option,
        'list': result,
        'sst': sst
    }))
}

exports.adminArticle = (res, flag) =>Articleslist(res,flag, true);
exports.archivesArticle = (res => Articleslist(res, 0, false));

/**
 * 获取文章列表
 */
exports.getArticleList = (res, page) =>{
    var pagenum = page * option.pagenum || 0;
    var result= [];
    var rows =db_post.filter({type: "post"})
                    .sortBy(function(o){
                        var t = o.updateTime.split('-');
                        return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
                    })
                    .slice(pagenum, pagenum + option.pagenum) 
                    .value()
    if (rows != []) {
        for(var i in rows){
            var time = rows[i].updateTime;
            var author_info = config.author[rows[i].author];
            if (author_info == undefined) {
                author_info = config.author["佚名"];
            }
            result.push({
                'id':rows[i].id,
                'title':rows[i].title, 
                'content':rows[i].desc,
                'like': rows[i].like,
                'view': rows[i].visitors,
                'tag': rows[i].tag,
                'author': rows[i].author,
                'author_head': author_info.head_img,
                'img': rows[i].img,
                'cop': "原创",
                'updateTime': time
            });
        }
        if(page == undefined){
            res.send(compiledIndex({ 
                'site':option,
                'list':result,
                'index_aside': config.index_aside,
                'next': parseInt(page)+1 || 1,
                'pre': parseInt(page)-1>=0? parseInt(page)-1 : 0,
                'carousel': option.carousel,
                'friends': config.friends,
                'sst':sst,
                'tags':config.tags
            })); 
        }
        else{
            res.json({
                'list': result,
                'code': 1
            });
        }
    }
};
// 单文章页面
exports.getArticleDetail = (res, id) =>{
    var ht = id.indexOf(".html");
    if( ht != -1) {
        id = id.slice(0, ht);
    }
    var rows = db_post.get(id).value()
    if(rows == undefined){
        res.render('404');
        return;
    }
    var author_info = config.author[rows.author];
    if (author_info == undefined) {
        author_info = config.author["佚名"];
    }
    res.send(compiledPost({
        'site':option,
        'title': rows.title,
        'content': rows.content,
        'desc': rows.desc, 
        'like': rows.like,
        'author': rows.author,
        'head_img': author_info.head_img,
        'blog_name': author_info.blog_name,
        'header_logo' : author_info.header_logo,
        'logo' : author_info.logo,
        'view': rows.visitors,
        'tag': rows.tag,
        'updateTime': rows.updateTime,
        'createTime': rows.createTime,
        'tags':config.tags,
        'sst': sst
    }));
    db_post.get(id).assign({visitors:Number(rows.visitors)+1}).write()
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
        'status': 'insert',
        'id': id,
        'sst': sst,
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
    var content = req.body.content.replace(/'/g,'\'');
    var title = req.body.title.replace(/'/g,'\'');
    var desc = req.body.desc;
    if(desc.length > 100){
        desc = desc.substring(0,100);
    }
    // var title = req.body.title.replace("\"","\\\"")
    var pid = req.body.id;
    if(req.body.ifpage == 'page'){
        pid = title;
    }
    if(req.body.type == 'update'){
        db_post.get(pid).assign({
            title: title,
            desc: desc,
            content: content,
            img: req.body.img,
            type: req.body.ifpage,
            tag: req.body.tag,
            updateTime: date,
            author: req.body.author
        }).write()
    } else {
        db_post.set(pid, {
                id: pid,
                title: title,
                desc: desc,
                content: content,
                img: req.body.img,
                type: req.body.ifpage,
                visitors: 0,
                like: 0,
                tag: req.body.tag,
                createTime: date,
                updateTime: date,
                author: req.body.author
                })
            .write()
        }
    createrss(db_post);
    res.end('succeed'); 
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
    var rows = db_post.get(req.params.id)
                    .value()
    if(rows == undefined){
        res.render('404');
        return;
    }
    res.render('create', {
        'update': true,
        'id': req.params.id,
        'site': option,
        'title': rows.title,
        'content': rows.content,
        'tag': rows.tag,
        'img': rows.img,
        'author': rows.author,
        'isLogined': isLogined,
        'name': loginUser,
        'status': 'update',
        'sst': sst
    }); 
};

// 文章删除操作
exports.deleteArticle = (res, id, islogin) =>{
    if(!islogin){
        res.end("you are not admin !!!");
        return;
    }
    db_post.get(id)
        .assign({ type: 'delete'})
        .write()
    res.send('succeed');
}

// 文章搜索
exports.post_search = (res, s) =>{
    var rows = [];
    if(s in config.author){
        // 搜索的是作者名字
        rows = db_post.filter({author: s, type: "post"})
        .sortBy(function(o){
            var t = o.updateTime.split('-');
            return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
        }).value()
    }
    else{
        // 搜索关键词
        rows = db_post.filter(function(o) {
            if (o.content.indexOf(s) == -1 && o.title.indexOf(s) == -1 || o.type != "post")
                return false
            return true;
        }).sortBy(function(o){
            var t = o.updateTime.split('-');
            return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
        }).value()
    }
    var result= [];
    for(var i in rows){
        var time = rows[i].updateTime;
        var author_info = config.author[rows[i].author];
        if (author_info == undefined) {
            author_info = config.author["佚名"];
        }
        result.push({
            'id':rows[i].id,
            'title':rows[i].title, 
            'content':rows[i].desc,
            'like': rows[i].like,
            'view': rows[i].visitors,
            'author': rows[i].author,
            'author_head': author_info.head_img,
            'tag': rows[i].tag,
            'img': rows[i].img,
            'cop': "原创",
            'updateTime': time
        });
    }
    // console.log(result);
    res.send(compiledIndex({
        'site':option,
        'list':result,
        'index_aside': config.index_aside,
        'tag': true,
        'carousel': option.carousel,
        'friends': config.friends,
        'tags':config.tags,
        'sst': sst
    })); 
}

// 点击喜欢事件，like+1
exports.get_add_like = (res, req) => {
    var index = req.headers.referer.indexOf("/post/");
    var id = req.headers.referer.slice(index+6, req.headers.referer.length);
    var old = db_post.get(id).value()
    db_post.get(id).assign({like:Number(old.like)+1}).write()
    res.json({
        code:1
    })
}

// 友链页面渲染
exports.get_link = (res, req) => {
    var rows =db_link.filter()
                    .value()
    res.render('link', {
        'links': rows,
        'site':option,
        'carousel': option.carousel,
        'tags':config.tags,
        'sst': sst
    })
}

// 友链添加请求
exports.add_link = (res, req) => {
    var b = req.body;
    var http = require('http');
    
    if (b.f_link.indexOf("https") != -1) {
         http = require('https');
    }
    try{
    http.get(b.f_link, function(r){
        let html='';
        r.setEncoding('utf8');
        r.on('data', (chunk) => {
        html += chunk;
        });
        r.on('end', () => {
            var check =html.indexOf("flycode.co");
            if(check != -1) {
                db_link.set(b.name, {
                    name:b.name,
                    href:b.href,
                    img:b.img,
                    desc:b.desc,
                    f_link:b.f_link,
                    email:b.email
                }).write()
                console.log("友链添加成功："+b.href);
                res.end("succeed")
            }
            else {
                res.end("err")
            }
        });
    })
    }catch(e){console.log(e)}
}

// 相册渲染
exports.render_photos = (res => {
    res.render('photos', {
        'sst':sst,
        'site':option,
    })
})
