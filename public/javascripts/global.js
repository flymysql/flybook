// 评论框编辑初始化
function comment_init(){
    var script = document.createElement('script') ;
    script.type ='text/javascript' ;
    script.src = "https://unpkg.com/wangeditor@3.1.1/release/wangEditor.min.js";
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);

    script.onload = function(){
        var E = window.wangEditor
        // var editor = new E('#editor')
        var editor = new E( document.getElementById('c_content') )
        editor.create()
    }
}

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
    var pid = window.location.pathname;
    var nick = $("#c_nick").val();
    var email = $("#c_mail").val();
    var link = $("#c_link").val();
    var content = $(".w-e-text")[0].innerHTML;
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
            $(".w-e-text")[0].innerHTML = "<p></p>";
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
            $(".w-e-text")[0].innerHTML = `<a href="#${ats[i].dataset.cid}">${this.dataset.at}，</a>`;
            $("#cancel").click(function(){
                $("#pre_com")[0].dataset.pre = "";
                $("#pre_com")[0].innerHTML = "";
                $(".w-e-text")[0].innerHTML = `<p></p>`;
            })
        });
    }
    var dels = $(".c_del");
    
    for(let j = 0; j < dels.length; j++){
        var id = dels[j].id;
        $("#"+id).click(function(){
            var pid = window.location.pathname;
            var pre = this.dataset.pre;
            if(pre == undefined){
                pre = "";
            }
            $.ajax({
                url: '/comment',
                type: 'POST',
                data :{
                    op: 'del',
                    pid: pid,
                    pre: pre,
                    cid: this.dataset.did
                },
                success: function(data) {
                    if(data=="error"){
                        alert("你不是管理员哦！")
                        return;
                    }
                    console.log("suucced delete")
                    $("#comment")[0].innerHTML = data;
                    comment_event();
                },
                fail: function(e){
                    console.log(e)
                }
            })
        });
    }
}

// 云标签创建
var tagcloud = document.getElementById('tagcloud');
var to_create = true;

// 获取标签云
function get_tags(){
    var tags = $(".tag_img");
    for(var i  = 0; i < tags.length; i++){
        tags[i].style.backgroundImage = `url("https://image.idealli.com/tags/${tags[i].dataset.img}.png")`;
    }
}

// 获取评论列表
function get_comment(){
    if($("#comment")[0] != undefined) {
        var pid = window.location.pathname;
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
                        post_img = '<a class="post-item-img" href="/post/' + list[i].id +'" target="_blank"><img src="' + list[i].img + '" alt="" id="no-view"></a>';
                        block_class = '<div class="post-item-content-img">';
                    }
                    var title = '<h2 class="post-item-title"><a href="/post/' + list[i].id +'" target="_blank">' + list[i].title +'</a></h2>';
                    var desc = '<p>' + list[i].content + '</p>';
                    var meta = '<div class="post-item-meta"><a href="/search?s='+list[i].author+'" target="_blank"><img class="author_head" src="'+ list[i].author_head +'"><span class="author">'+ list[i].author +'</span></a><span class="cop">' + list[i].cop + '<i></i></span><span> 阅读' + list[i].view + '</span><span> ' + list[i].tag + '</span><span> ' + list[i].updateTime + '</span></div>';
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
    // 初始化评论框的富文本编辑
    comment_init();
    // 获取标签云
    get_tags();
    // 获取评论列表
    get_comment();
    // 获取最新文章推荐
    get_more_post();
}
if (typeof IntersectionObserver == "function" && to_create == true){
    console.log("浏览器支持懒加载");
    var observertag = new IntersectionObserver(
        function (changes) {
            changes.forEach( function (change) {
                if (change.intersectionRatio > 0) {
                    get_blocks();
                    to_create = false;
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
