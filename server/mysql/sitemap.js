var sm = require('sitemap');
const connection = require('./db').connection;
var site = require('../../config').seo.index;

exports.get_sitemap = (res)=> {
    var selectsql=`select id,updateTime from articles`;
    connection.query(selectsql,function(err,rows){
        if(err){
            return res.status(500).end();
        }
        var urls = [];
        for(var i in rows){
            urls.push({
                url: site + "/post/" + rows[i].id,
                lastmod: rows[i].updateTime
            })
        }
        var sitemap = sm.createSitemap({
            hostname: site,
            cacheTime: 840000000,
            urls: urls
        })
        sitemap.toXML( function (err, xml) {
            if (err) {
              return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
    })
}