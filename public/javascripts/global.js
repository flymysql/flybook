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
// 获取指定名称的cookie
function getCookie(name){
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name){
            return arr[1];
        }
    }
    return "";
}

// 评论提交按钮
$("#c_submit").click(function(){
    var pid = window.location.pathname.slice(6);
    var nick = $("#c_nick").val();
    var email = $("#c_mail").val();
    var link = $("#c_link").val();
    var content = $("#c_content").val();
    var pre = $("#pre_com")[0].dataset.pre;
    var author = $("#author_name")[0].dataset.name;
    var reg=  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{1,8}$/;
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
    if(nick.length > 30) {
        alert("昵称太长了！！");
        return;
    }
    if(email.length > 30) {
        alert("邮箱太长了！！");
        return;
    }
    if(content.length > 8000) {
        alert("评论内容太长了！！");
        return;
    }
    if(reg.test(email) == false){
        alert("邮件格式错误");
        return;
    }
    $("#c_submit")[0].innerHTML = "回复中...";
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
            var exp = new Date();
            exp.setTime(exp.getTime() + 8640000000);
            document.cookie = "c_name" + "="+ nick + ";expires=" + exp.toGMTString();
            document.cookie = "c_email" + "="+ email + ";expires=" + exp.toGMTString();
            document.cookie = "c_link" + "="+ link + ";expires=" + exp.toGMTString();
        },
        fail: function(err){
            alert("评论添加失败！可能是网络的问题！")
        }
    })
});

// 获取当前时间的函数
// 格式：year-month-day h:m:s
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
// 评论列表获取
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

// 云标签创建
var tagcloud = document.getElementById('tagcloud');
var to_create = true;

// 获取标签云
function get_tags(){
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

// 获取评论列表
function get_comment(){
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
                var c_name = getCookie("c_name");
                var c_email = getCookie("c_email");
                var c_link = getCookie("c_link");
                $("#c_nick").val(c_name);
                $("#c_mail").val(c_email);
                $("#c_link").val(c_link);
            }
        })
    }
}

// 获取最新文章推荐
function get_more_post(){
    var post = document.getElementById('more_post_list');
    if (post!=undefined){
        $.get("/", {'page':0}, function(data){
            if(data.code == 1){
                
                var list = data.list;
                for(var i in list){
                    var l = document.createElement("li");
                    l.className = "post-item";
                    var block_class = '<div class="post-item-content">';
                    var post_img = "";
                    if(list[i].img != ""){
                        post_img = '<a class="post-item-img" href="/post/' + list[i].id +'"><img src="' + list[i].img + '" alt="" id="no-view"></a>';
                        block_class = '<div class="post-item-content-img">';
                    }
                    var title = '<h2 class="post-item-title"><a href="/post/' + list[i].id +'">' + list[i].title +'</a></h2>';
                    var desc = '<p>' + list[i].content + '</p>';
                    var meta = '<div class="post-item-meta"><a href="/search?s='+list[i].author+'"><img class="author_head" src="'+ list[i].author_head +'"><span class="author">'+ list[i].author +'</span></a><span class="cop">' + list[i].cop + '<i></i></span><span> 阅读' + list[i].view + '</span><span> ' + list[i].tag + '</span><span> ' + list[i].updateTime + '</span></div>';
                    var content = post_img + block_class + title + desc + meta + "</div>";
                    l.innerHTML = content;
                    post.appendChild(l);
                }
                console.log("succeed!")
                }
            })
    }
}

// 各功能区块的获取
var get_blocks = function(){
    // 获取标签云
    get_tags();
    // 获取评论列表
    get_comment();
    // 获取最新文章推荐
    get_more_post();
}
if (typeof IntersectionObserver == "function"){
    console.log("浏览器支持懒加载");
    var observertag = new IntersectionObserver(
        function (changes) {
            changes.forEach( function (change) {
                if (change.intersectionRatio > 0) {
                    get_blocks();
                    observertag.unobserve(tagcloud);
                }
            })
        }
    )
    observertag.observe(tagcloud);
    console.log("懒加载程序正常执行！");
}
else {
    console.log("该浏览器不支持懒加载，启动强制加载")
    get_blocks();
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
if (document.getElementById("qrcode")!=undefined){
    window.onload = function(){
        document.getElementById("qrcode").src="http://qr.topscan.com/api.php?&w=200&text=" + window.location.href;
    }
}
