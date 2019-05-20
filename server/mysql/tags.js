const connection = require('../config/db').connection;
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

exports.queryAllTags = (res)=>{
    var result = [];
    var selectags = `select name from tags`;
    connection.query(selectags,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            result.push(rows[i].name);
        }
        res.json({
            "code":200,
            "data":result
        })
    });
}

exports.queryTagid = (tagname)=>{
    var selectags = `select id from tags where name='${tagname}'`;
    connection.query(selectags,function(err,rows){
    if(err){
        console.log(err);
        return;
    }
    if(rows[0] == undefined){
        var inserttag = `insert into tags values(null,'${tagname}')`;
        connection.query(inserttag);
        connection.query(selectags,function(err,rows){
            if(err){
                console.log(err);
                return;
            }
            console.log(rows[0].id)
            return rows[0].id;
        });
    }
   });
}

exports.queryOneTags = (res, req) =>{
    var tname = req.params.id;
    var selectsql=`select * from articles where type = 'post' and (tag like '%${tname}%' or post_content like '%${tname}%' ) order by updateTime desc`;
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
            'tag': true,
            'carousel': option.carousel,
            'friends': config.friends,
            'sst' : new Date().getTime()
        }); 
    });
}

exports.get_insert_tag = (res, name) => {
    var insertsql = `insert into tags value(null, '${name}')`;
    connection.query(insertsql, function(err, rows){
        if(err){
            res.end("err");
            return;
        }
        res.send("succeed");
    })
}
