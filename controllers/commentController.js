const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_comment = new FileSync('db/comment.json') 
const db_comment = low(adapter_comment)

// 添加评论
function push_comment(data) {
    var cid = Math.random().toString(16).substr(7);
    if(db_comment.get(data.pid).value() == undefined){
        console.log("文章首次评论")
        db_comment.set(data.pid, {}).write()
    }
    if (data.pre == "") {
        db_comment.get(data.pid).set(cid, {
            cid: cid,
            nick: data.nick,
            email: data.email,
            link: data.link,
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
    }
    
}

exports.com_Controller = (req, res) =>{
    var op = req.body.op;
    switch(op){
        case 'get':
            var comment = db_comment.get(req.body.pid).value();
            if (comment == undefined) {
                res.end("还没有评论！");
                return;
            }
            res.render('partails/comment-list', {
                comment: comment
            })
            break;
        case 'push':
            push_comment(req.body);
            var comment = db_comment.get(req.body.pid).value()
            res.render('partails/comment-list', {
                comment: comment
            })
            break;
        case 'delete':
            break;
        default:
            break; 
    }
}