(function(b){b.extend({viewImage:function(d){var c=b.extend({target:".view-image img",exclude:""},d);b(c.exclude).attr("view-image",!1);b(c.target).click(function(a){a={t:b(this),z:.9,m:Math.min,ww:b(window).width(),wh:b(window).height()};console.log(a.t);if(!b(this).attr("view-image")&&!b(this).is(c.exclude)&&(a.t.attr("src")||a.t.attr("href").match(/.+\.(jpg|jpeg|webp|gif|png)/gi)))return a.t.attr("src")?(a.is="zoom-out"===a.t[0].style.cursor,a.os=a.t.offset(),a.w=a.t.width(),a.h=a.t.height(),a.scale=
a.is?1:a.m(a.m(a.t[0].naturalWidth,a.ww*a.z)/a.w,a.m(a.t[0].naturalHeight,a.wh*a.z)/a.h),a.X=a.is?0:(-a.os.left+(a.ww-a.w)/2)/a.scale,a.Y=a.is?0:(-a.os.top+(a.wh-a.h)/2+b(document).scrollTop())/a.scale,a.t.attr("style",(a.is?"":"position: relative;z-index: 999;")+"transition: transform 0.4s;transform: scale("+a.scale+") translate("+a.X+"px, "+a.Y+"px);cursor: zoom-"+(a.is?"in":"out")+";")):(a.c=".vi-"+Math.random().toString(36).substr(2),b("body").append("<div class='"+a.c.substr(1)+"' style='position: fixed;background: rgba(255, 255, 255, "+
a.z+");top: 0;left: 0;right: 0;bottom: 0;z-index: 999;'></div>"),b(a.c).html("<img src="+a.t.attr("href")+" style='position: absolute;top: 50%;left: 50%;max-width: 90%;max-height: 90%;transform: translate(-50%,-50%);'>"),b(a.c).click(function(){b(this).remove()})),!1})}})})(jQuery);
jQuery(document).ready(function () {
    jQuery.viewImage({
        'target' : 'img',
        'exclude': '#no-view',
        'delay'  : 300 
    });
});
var tagcloud = document.getElementById('tagcloud');
var to_create = true;
var create_tag = function(){
    $.ajax({
        url: '/gettags',
        type: 'get',
        success: function(data){
            if(data.code === 200){
                var tags = data.data;
                for(var i in tags){
                    if(tags[i]!=""){
                        var node = document.createElement("a");
                        node.setAttribute('style', 'font-size: 16px;');
                        node.setAttribute('href', '/tag/' + tags[i]);
                        node.innerHTML = '<div class="tag_img" style="background-image:url(https://image.idealli.com/tags/'+ tags[i] +'.png);"></div>' + tags[i];
                        tagcloud.appendChild(node);
                    }
                }
            }   
        }
    });
}
/**
 * 
 * 图片和标签懒加载
 */
function query(tag) {
    return Array.from(document.getElementsByTagName(tag));
}
const imglist = query('img');
try{
    var observerimg = new IntersectionObserver(
        (changes) => {
            changes.forEach((change) => {
                if (change.intersectionRatio > 0) {
                    var img = change.target;
                    if(img.dataset.src != undefined){
                        img.src = img.dataset.src;
                    }
                    observerimg.unobserve(img);
                }
            })
        }
    )
    var observertag = new IntersectionObserver(
        (changes) => {
            changes.forEach((change) => {
                if (change.intersectionRatio > 0) {
                    create_tag();
                    observertag.unobserve(tagcloud);
                }
            })
        }
    )
    observertag.observe(tagcloud);
    imglist.forEach((item) => {
        observerimg.observe(item);
    })
    console.log("懒加载程序正常执行！");
}
catch(err){
    console.log("该浏览器不支持图片懒加载，启动强制加载")
    imglist.forEach((item) => {
        if(item.dataset.src != undefined){
            item.src = item.dataset.src;
        }
    })
    create_tag();
}

//百度推送
window.onload = function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
}