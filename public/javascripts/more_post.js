var page = 1;
var havemore = true;
$("#more").click(function(){
    if(havemore == true){
    $.get("/", {'page':page}, function(data){
    if(data.code == 1){
        var post = document.getElementById('post-list');
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
            var meta = '<div class="post-item-meta"><span class="cop">' + list[i].cop + '<i></i></span><span> 阅读' + list[i].view + '</span><span> ' + list[i].tag + '</span><span> ' + list[i].updateTime + '</span></div>';
            var content = post_img + block_class + title + desc + meta + "</div>";
            l.innerHTML = content;
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
        alert("没有更多文章咯！快去催下小鸡更文！")
    }
});