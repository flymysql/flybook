(function(b){b.extend({viewImage:function(d){var c=b.extend({target:".view-image img",exclude:""},d);b(c.exclude).attr("view-image",!1);b(c.target).click(function(a){a={t:b(this),z:.9,m:Math.min,ww:b(window).width(),wh:b(window).height()};console.log(a.t);if(!b(this).attr("view-image")&&!b(this).is(c.exclude)&&(a.t.attr("src")||a.t.attr("href").match(/.+\.(jpg|jpeg|webp|gif|png)/gi)))return a.t.attr("src")?(a.is="zoom-out"===a.t[0].style.cursor,a.os=a.t.offset(),a.w=a.t.width(),a.h=a.t.height(),a.scale=
a.is?1:a.m(a.m(a.t[0].naturalWidth,a.ww*a.z)/a.w,a.m(a.t[0].naturalHeight,a.wh*a.z)/a.h),a.X=a.is?0:(-a.os.left+(a.ww-a.w)/2)/a.scale,a.Y=a.is?0:(-a.os.top+(a.wh-a.h)/2+b(document).scrollTop())/a.scale,a.t.attr("style",(a.is?"":"position: relative;z-index: 999;")+"transition: transform 0.4s;transform: scale("+a.scale+") translate("+a.X+"px, "+a.Y+"px);cursor: zoom-"+(a.is?"in":"out")+";")):(a.c=".vi-"+Math.random().toString(36).substr(2),b("body").append("<div class='"+a.c.substr(1)+"' style='position: fixed;background: rgba(255, 255, 255, "+
a.z+");top: 0;left: 0;right: 0;bottom: 0;z-index: 999;'></div>"),b(a.c).html("<img src="+a.t.attr("href")+" style='position: absolute;top: 50%;left: 50%;max-width: 90%;max-height: 90%;transform: translate(-50%,-50%);'>"),b(a.c).click(function(){b(this).remove()})),!1})}})})(jQuery);
// 图像查看
jQuery(document).ready(function () {
    jQuery.viewImage({
        'target' : 'img',
        'exclude': '#no-view',
        'delay'  : 300 
    });
});
// 用户点击喜欢
$("#like1").click(function(){
    $.get("/like-add", function(status){
        if(status.code==1){
        alert("谢谢你的喜欢！！")
        }
    });
});
// 评论提交按钮
$("#c_submit").click(function(){
    $("#c_submit")[0].innerHTML = "回复中...";
    var pid = window.location.pathname.slice(6);
    var nick = $("#c_nick").val();
    var email = $("#c_mail").val();
    var link = $("#c_link").val();
    var content = $("#c_content").val();
    var pre = $("#pre_com")[0].dataset.pre;
    var author = $("#author_name")[0].dataset.name;
    if(author == undefined) {
        author = "";
    }
    if(nick == "") {
        alert("请输入昵称");
        return;
    };
    if(email == "") {
        alert("请输入邮箱");
        return;
    };
    if(content == "") {
        alert("评论内容不能为空哦");
        return;
    };
    $.ajax({
        url: '/comment',
        type: 'POST',
        data :{
            op: 'push',
            pid: pid,
            nick: nick,
            email: email,
            link: link,
            content: content,
            author: author,
            title: $(".post-title")[0].innerText,
            time: CurentTime(),
            pre: pre
        },
        success: function(data) {
            $("#c_submit")[0].innerHTML = "回复"
            $("#comment")[0].innerHTML = data;
            $("#pre_com")[0].dataset.pre = "";
            $("#pre_com")[0].innerHTML = "";
            $("#c_content").val("");
            comment_event();
        },
        fail: function(err){
            alert("评论添加失败！可能是网络的问题！")
        }
    })
});
function CurentTime(){ 
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; 
    var day = now.getDate();
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
    var clock = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss; 
    return(clock); 
}
function comment_event(){
    var ats = $(".c_at");
    for(let i = 0; i < ats.length; i++){
        var cid = ats[i].id;
        $("#"+cid).click(function(){
            $("#pre_com")[0].innerHTML = "<div>" + this.parentNode.parentNode.innerHTML + "<div><a href=\"#tagcloud\" class=\"cancel\" id=\"cancel\">取消回复</a>";
            $("#pre_com")[0].dataset.pre = ats[i].dataset.cid;
            $("#c_content").val(this.dataset.at + "，");
            $("#cancel").click(function(){
                $("#pre_com")[0].dataset.pre = "";
                $("#pre_com")[0].innerHTML = "";
                $("#c_content").val("");
            })
        });
    }
}
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
    if($("#comment")[0] != undefined) {
        var pid = window.location.pathname.slice(6);
        $.ajax({
            url: '/comment',
            type: 'POST',
            data :{
                op: 'get',
                pid: pid
            },
            success: function(data) {
                $("#comment")[0].innerHTML = data;
                comment_event();
            }
        })
    }
}
if (typeof IntersectionObserver == "function"){
    console.log("浏览器支持懒加载");
    var observertag = new IntersectionObserver(
        function (changes) {
            changes.forEach( function (change) {
                if (change.intersectionRatio > 0) {
                    create_tag();
                    observertag.unobserve(tagcloud);
                }
            })
        }
    )
    observertag.observe(tagcloud);
    console.log("懒加载程序正常执行！");
}
else {
    console.log("该浏览器不支持图片懒加载，启动强制加载")
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

document.getElementById("qrcode").src="http://qr.topscan.com/api.php?&w=200&text=" + window.location.href;