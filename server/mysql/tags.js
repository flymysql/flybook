const config = require('../../config')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_post = new FileSync('server/db/post.json') 
const db_post = low(adapter_post)

const option = {
    title: config.seo.title,
    icp: config.options.ICP,
    cop: config.options.copyright,
    pagenum: 10,
    avator: "",
    carousel: config.carousel,
}

exports.queryAllTags = (res)=>{
    res.json({
        "code":200,
        "data":config.tags
    })
}

exports.queryOneTags = (res, req) =>{
    var tname = req.params.id;
    var rows = db_post.filter(function(o) {
        if ((o.tag == tname || o.content.indexOf(tname) != -1) && o.type == "post")
            return true
        return false;
    }).sortBy(function(o){
        var t = o.updateTime.split('-');
        return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
    }).value()
    //var selectsql=`select * from articles where type = 'post' and (tag like '%${tname}%' or post_content like '%${tname}%' ) order by updateTime desc`;
    var result= [];
    for(var i in rows){
        var author_info = config.author[rows[i].author];
        result.push({
            'id':rows[i].id,
            'title':rows[i].title, 
            'content':rows[i].desc,
            'like': rows[i].like,
            'view': rows[i].visitors,
            'tag': rows[i].tag,
            'img': rows[i].img,
            'cop': "原创",
            'updateTime': rows[i].updateTime,
            'author': rows[i].author,
            'author_head': author_info.head_img,
        });
    }
    // console.log(result);
    
    res.render('index', { 
        'site':option,
        'list':result,
        'tag': true,
        'carousel': option.carousel,
        'friends': config.friends,
        'sst' : new Date().getTime()
    }); 
}

