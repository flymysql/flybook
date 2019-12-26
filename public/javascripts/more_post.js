var page = 1;
var havemore = true;
$("#more").click(function(){
    var post = document.getElementById('post-list');
    var load = document.createElement("div");
    load.innerHTML = '<div class="loader-inner"><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div></div>';
    post.appendChild(load);
    if(havemore == true){
    $.get("/", {'page':page}, function(data){
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
            var meta = '<div class="post-item-meta"><a href="/search?s='+list[i].author+'"><img class="author_head" src="'+ list[i].author_head +'"><span class="author">'+ list[i].author +'</span></a><span class="cop">' + list[i].cop + '<i></i></span><span> 阅读' + list[i].view + '</span><span> ' + list[i].tag + '</span><span> ' + list[i].updateTime + '</span></div>';
            var content = post_img + block_class + title + desc + meta + "</div>";
            l.innerHTML = content;
            load.innerHTML = "";
            post.appendChild(l);
        }
        console.log("succeed!")
        page = page +1;
        if(list.length < 20){
            havemore = false;
        }
        }
    })
    }
    else{
        alert("没有更多文章咯！快去催下小鸡更文！");
        load.innerHTML = "";
    }
});