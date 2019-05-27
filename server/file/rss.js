const connection = require('../config/db').connection;
const fs = require('fs');
const until = require('../../until/until');
const config = require('../../config');

var index = config.seo.index;

var rsssql=`select post_content,id,title,updateTime,description from articles where type = 'post' order by updateTime desc limit 30`;
var sitemapsql=`select id,updateTime from articles order by updateTime desc`;

exports.createrss = function(){
    var rss_content = `
    <rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
        <channel>
            <title>${config.seo.title}</title>
            <link>${index}</link>
            <atom:link href="/rss.xml" rel="self" type="application/rss+xml"/>
            <description>${config.options.description}</description>
            <pubDate>${until.nowDate}</pubDate>
            <generator>${index}/</generator>

    `;
    var sitemap_content = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;   
    connection.query(rsssql, function(err, rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            var time = rows[i].updateTime;
            var pubdata = time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate();
            rss_content = rss_content + `
            <item>
                <title>${rows[i].title}</title>
                <link>${index}/post/${rows[i].id}</link>
                <guid>${index}/post/${rows[i].id}</guid>
                <pubDate>${pubdata}</pubDate>
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
            sitemap_content = sitemap_content + `
            <url>
                <loc>${index}/post/${rows[i].id}</loc>
                <lastmod>${rows[i].updateTime}</lastmod>
            </url>
            `;

        }
        rss_content = rss_content + `</channel>
        </rss>`;
        fs.writeFile('public/rss.xml', rss_content, function (err) {
            if(err) {
             console.error(err);
             } else {
                console.log('写入rss成功');
             }
         });
    });
    connection.query(sitemapsql, function(err, rows){
        if(err){
            console.log(err);
            return;
        }
        for(var i in rows){
            var time = rows[i].updateTime;
            var pubdata = time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate();
            sitemap_content = sitemap_content + `
            <url>
                <loc>${index}/post/${rows[i].id}</loc>
                <lastmod>${pubdata}</lastmod>
            </url>
            `;

        }
        sitemap_content = sitemap_content + `</urlset>`;
         fs.writeFile('public/sitemap.xml', sitemap_content, function (err) {
            if(err) {
             console.error(err);
             } else {
                console.log('写入sitemap成功');
             }
         });
    });
    return;
}

