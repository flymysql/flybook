const connection = require('./db').connection;
const config = require('../../config')
const until = require('../../until/until')

const option = {
    title: config.seo.title,
    icp: config.options.ICP,
    cop: config.options.copyright,
    pagenum: 10,
    avator: ""
}

exports.queryAllTags = (res)=>{
    var result = [];
    var selectags = `select distinct tag from articles where type='post'`;
    connection.query(selectags,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            result.push(rows[i].tag);
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
    var selectsql=`select * from articles where type = 'post' and tag = '${tname}' order by updateTime desc`;
    console.log(selectsql)
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
            'tag': true
        }); 
    });
}