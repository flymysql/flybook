// const connection = require('../config/db').connection;
const fs = require('fs');
const until = require('../../until/until');
const config = require('../../config');
var index = config.seo.index;

exports.createrss = function(db_post){
    var today = until.nowDate();
    var urls = "";
    var rss_content = `
    <rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
        <channel>
            <title>${config.seo.title}</title>
            <link>${index}</link>
            <atom:link href="/rss.xml" rel="self" type="application/rss+xml"/>
            <description>${config.options.description}</description>
            <pubDate>${today}</pubDate>
            <generator>${index}/</generator>

    `;
    var sitemap_content = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;   
    var rows = db_post.filter({type: "post"})
    .sortBy(function(o){
        var t = o.updateTime.split('-');
        return 0-(Number(t[0]) * 365 + Number(t[1]) * 30 + Number(t[2]));
    })
    .value()
    // rss渲染
    for(var i = 0; i <= 30 && i < rows.length; i++){
        rss_content = rss_content + `
            <item>
                <title>${rows[i].title}</title>
                <link>${index}/post/${rows[i].id}</link>
                <guid>${index}/post/${rows[i].id}</guid>
                <pubDate>${rows[i].updateTime}</pubDate>
                <description>
                ${rows[i].desc}
                </description>
                <content:encoded>
                <![CDATA[${rows[i].content}]]>
                </content:encoded>
                <comments>
                ${index}/post/${rows[i].id}#disqus_thread
                </comments>
            </item>
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

    // 站点地图渲染
    // 渲染文章列表
    for(var i in rows){
        var time = rows[i].updateTime;
        if (time == null){
            time = today;
        }
        urls += `${index}/post/${rows[i].id}\n`;
        sitemap_content = sitemap_content + `
        <url>
            <loc>${index}/post/${rows[i].id}</loc>
            <lastmod>${time}</lastmod>
        </url>
        `;
    }
    // 渲染tag
    for(var i in config.tags){
        urls += `${index}/tag/${config.tags[i]}\n`;
        sitemap_content = sitemap_content + `
        <url>
            <loc>${index}/tag/${config.tags[i]}</loc>
            <lastmod>${today}</lastmod>
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
    fs.writeFile('public/urls.txt', urls, function (err) {
        if(err) {
        console.error(err);
        } else {
            console.log('写入urls成功');
        }
    });
    return;
}

