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
                        node.innerHTML = '<div class="tag_img" style="background-image:url(https://picture-1256429518.cos.ap-chengdu.myqcloud.com/'+ tags[i] +'.png);"></div>' + tags[i];
                        tagcloud.appendChild(node);
                    }
                }
            }   
        }
    });
}
if(tagcloud != null){
    var h = $('#tagcloud').offset().top;
    if(h < 1000){
        create_tag();
        to_create = false;
    }
    $(window).scroll(function(event){
        if(to_create && (h-$(document).scrollTop() < 888)){
            to_create = false;
            create_tag();
        }
    });
}