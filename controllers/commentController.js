const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_comment = new FileSync('db/comment.json')
const email_auth = require('../config').email_auth;
const site_name = require('../config').seo.title;
const authors = require('../config').author;
const db_comment = low(adapter_comment)
var users = require('../server/config/user').items;
var nodemailer  = require('nodemailer');
var mailTransport = nodemailer.createTransport({
    host : 'smtp.qq.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
        user : email_auth.id,
        pass : email_auth.key
    },
});
const pug = require('pug');
// 编译评论页面
const compiledComment = pug.compileFile('views/partails/comment-list.pug');
// 判断是否登陆
var ifLogin = function (name) {
    for (i in users) {
        if (users[i].name === name) return true;
    }
    return false;
}

// 发送邮件通知
function sendMail(to_name, to_email, title, text, html , send_time=0){
    var options = {
        from: email_auth.name + ' ' + '<' + email_auth.id + '>',
        to: to_name + ' ' + '<' + to_email + '>',
        subject: title,
        text: text,
        html: html,
        attachments:[]
    };

    // 网络原因可能导致邮件发送失败，多大尝试发送次数设为5次
    if(send_time < 5){
        mailTransport.sendMail(options, function(err, msg){
            if(err){
                console.log(err);
                console.log("发送失败");
                sendMail(to_name, to_email, title, text, html , send_time+1)
            }
            else {
                return;
            }
        });
    }
}

// 添加评论
function push_comment(data, href) {
    var p_title = data.title;
    var cid = Math.random().toString(16).substr(7);
    var clink = data.link;
    if(clink.indexOf("http") == -1){
        clink = "http://" + clink;
    }
    if(db_comment.get(data.pid).value() == undefined){
        console.log("文章首次评论")
        db_comment.set(data.pid, {}).write()
    }
    if (data.pre == "") {
        db_comment.get(data.pid).set(cid, {
            cid: cid,
            nick: data.nick,
            email: data.email,
            link: clink,
            content: data.content,
            time: data.time,
            child: {}
        }).write()
    } else {
        var ccid = data.pid + '.' + data.pre + '.child';
        db_comment.get(ccid).set(cid, {
            cid: cid,
            nick: data.nick,
            email: data.email,
            link: data.link,
            content: data.content,
            time: data.time,
            pre: data.pre
        }).write()
        // 邮件通知被回复者
        var pre_c = db_comment.get(data.pid + '.' + data.pre).value();
        var p_nick = pre_c.nick;
        var p_mail = pre_c.email;
        var p_content = pre_c.content;
        var title = "你在" + site_name + "上的文章《" + p_title + "》评论收到了来自" +  data.nick + "的回复！";
        var text = p_content;
        var html = "<h2>" + p_nick + ":</h2>" + "<blockquote>" + p_content + "</blockquote><br>" + "<h2>" + data.nick + ":</h2>" + "<blockquote>" + data.content + "</blockquote><br>"
        html += "<a href=\"" + href + "\">查看原文</a>";
        sendMail(p_nick, p_mail, title, text, html);
    }
    // 文章评论通知作者
    var author = data.author;
    if(author == "" || author == undefined) {
        author = "佚名";
    }
    authors_email = authors[author].email;
    author_name = authors[author].blog_name;
    var title = "你在" + site_name + "上的文章《" + p_title + "》收到了来自" +  data.nick + "的评论！";
    var text = data.content;
    var html = "<h2>" + data.nick + ":</h2>" + "<blockquote>" + data.content + "</blockquote><br>"
    html += "<a href=\"" + href + "\">查看原文</a>";
    sendMail(author_name, authors_email, title, text, html);
}

// 删除留言
function del_comment(req, res){
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = ifLogin(loginUser);
    if(!isLogined){
        res.end('error'); 
        return;
    }
    var pid = req.body.pid;
    if(req.body.pre != "") {
        pid = pid + "." + req.body.pre + ".child";
    }
    db_comment.get(pid).unset(req.body.cid).write();
    var comment = db_comment.get(req.body.pid)
    .sortBy(function(o){
        var t = o.time.split(' ')[0].split('-');
        return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
    })
    .value()
    res.send(compiledComment({
        comment: comment
    }))
}

exports.com_Controller = (req, res) =>{
    var op = req.body.op;
    switch(op){
        case 'get':
            var comment = db_comment.get(req.body.pid)
            .sortBy(function(o){
                var t = o.time.split(' ')[0].split('-');
                return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
            })
            .value();
            if (comment == undefined || comment == {}) {
                res.end("<div style=\"text-align:center;\">还没有评论！</div>");
                return;
            }
            res.send(compiledComment({
                comment: comment
            }));
            break;
        case 'push':
            push_comment(req.body, req.headers.referer);
            var comment = db_comment.get(req.body.pid)
            .sortBy(function(o){
                var t = o.time.split(' ')[0].split('-');
                return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
            })
            .value()
            res.send(compiledComment({
                comment: comment
            }))
            break;
        case 'del':
            del_comment(req, res)
            break;
        default:
            break; 
    }
}