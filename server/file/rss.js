const connection = require('../config/db').connection;
const fs = require('fs');
const until = require('../../until/until');
const config = require('../../config');

var index = config.seo.index;

var selectsql=`select post_content,id,title,updateTime,description from articles where type = 'post' order by updateTime desc limit 30`;
var head_content = `
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
    <channel>
        <title>${config.seo.title}</title>
        <link>${index}</link>
        <atom:link href="/rss.xml" rel="self" type="application/rss+xml"/>
        <description>${config.options.description}</description>
        <pubDate>${until.nowDate}</pubDate>
        <generator>${index}/</generator>

`;

var rss_content = head_content;

exports.createrss = function(){
    connection.query(selectsql, function(err, rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            rss_content = rss_content + `
            <item>
                <title>${rows[i].title}</title>
                <link>${index}/post/${rows[i].id}</link>
                <guid>${index}/post/${rows[i].id}</guid>
                <pubDate>${rows[i].updateTime}</pubDate>
                <description>
                ${rows[i].description}
                </description>
                <content:encoded>
                <![CDATA[${rows[i].post_content}]]>
                </content:encoded>
                <comments>
                ${index}/post/${rows[i].id}#disqus_thread
                </comments>
            </item>
            `;
        }
        rss_content = rss_content + `</channel>
        </rss>`
        fs.writeFile('public/rss.xml', rss_content, function (err) {
            if(err) {
             console.error(err);
             } else {
                console.log('写入成功');
                rss_content = head_content;
                return;
             }
         });
         rss_content = head_content;
         return;
    });
}

