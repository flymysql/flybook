window.onload=function(){//页面加载完成后
	
	
	slideLlx("slide");//参数为字符串是外层容器的id,可以多次调用
	slideLlx("slide_two");
	
	//方法
	function slideLlx(slideID){
	var slide=document.getElementById(slideID);//容器
	var slideLis=slide.getElementsByTagName('li');
	var conut=slideLis.length;//实际图片数量
	if(conut<2){
		return false;//如果图片数量少于2就不开启轮播节约资源
	}
	var imgs=slide.getElementsByTagName("img");
	var firstSrc=imgs[0].getAttribute("src");//第一张图的路径
	var lastSrc=imgs[imgs.length-1].getAttribute("src");//最后一张图的路径
	var offset=slide.clientWidth;//每次滚动的距离
	var index=1;//当前是第一张图
	var slideUl=slide.getElementsByTagName("ul")[0];//Ul
	var Timer;//自动轮播定时器对象
	
	//开头插入最后一张图
	var firstLi=document.createElement("li");
	var firstIMG=document.createElement("img");
	firstIMG.setAttribute("src",lastSrc);
	firstLi.appendChild(firstIMG);
	slideUl.insertBefore(firstLi,slideUl.firstChild);//创建li并插入最后一张图的路径添加第一张图之前
	slideUl.style.transform="translateX("+(-offset)+"px)";//UL滚动到第一张图的位置
	
	//末尾插入第一张图
	var lastLi=document.createElement("li");
	var lastIMG=document.createElement("img");
	lastIMG.setAttribute("src",firstSrc);
	lastLi.appendChild(lastIMG);
	slideUl.appendChild(lastLi);
	
	
	//创建圆点控制按钮
	var circle_btn=document.createElement("div");
		circle_btn.setAttribute("class","circle_btn");
	for(var i=0;i<conut;i++){ //创建等同于图片数的按钮
		var cbtn=document.createElement("button");
		circle_btn.appendChild(cbtn);
	}
	slide.appendChild(circle_btn);
	//圆点绑定点击事件
	var circles=Array.prototype.slice.call(circle_btn.getElementsByTagName("button"));
	circles[0].setAttribute("class","active");//第一个圆点高亮
	circles.forEach(function(e,i){
		e.onclick=function(){
			closeAutoSlide();
			openTransition();
			index=i+1;
			goslide();
			beActive(this);
		}
	});
	
	//创建上一个按钮,并且绑定点击事件
	
	var btn_prev=slide.getElementsByClassName("prev_btn")[0];
	btn_prev.onclick=function(){
		closeAutoSlide();
		openTransition();//开启过渡
		index--;
		goslide();
		if(index<1){
			index=conut;
			beActive(circles[index-1]);
			setTimeout(function(){
			closeTransition();
			goslide();
			},600)
		}else{
			beActive(circles[index-1]);
		}
	}
	
	//创建下一个按钮，并绑定点击事件
	var btn_next=slide.getElementsByClassName("next_btn")[0];
	btn_next.onclick=function(){
		openTransition();//开启过渡
		index++;
		goslide();
		if(index>conut){
			index=1;
			beActive(circles[index-1]);
			setTimeout(function(){
			closeTransition();
			goslide();
			},600)
		}else{
			beActive(circles[index-1]);
		}
	}
	
	//定时器自动轮播
	
	openAutoSlide();//默认开启自动轮播
	function openAutoSlide(){
		if(Timer){
			window.clearInterval(Timer);
		}
		Timer=setInterval(function(){
		beActive(circles[index-1]);
		btn_next.onclick();
		},3000)//轮播间隔时间
	}
	//暂停自动轮播,并且在6秒后再次开始轮播
	function closeAutoSlide(){
		window.clearInterval(Timer);
		setTimeout(function(){
			openAutoSlide();
		},6000);//暂停后再次开始的时间
	}
	//用户操作时暂停自动
	btn_next.onmousedown=function(){
		closeAutoSlide();
	}
	btn_prev.onmousedown=function(){
		closeAutoSlide();
	}
	//为圆点添加高亮，高亮效果可以去修改对应的css
	function beActive(btn){
		circle_btn.getElementsByClassName("active")[0].setAttribute("class","");
		btn.setAttribute("class","active");
	}
	//打开过渡效果
	function openTransition(){
		slideUl.style.transition="all .6s";//完成动画的时间为600毫秒如果更改这里请把上面的600也相应的修改
	}
	//关闭过渡效果
	function closeTransition(){
		slideUl.style.transition="none";
	}
	//滚动到index相应的位置
	function goslide(){
		slideUl.style.transform="translateX(-"+index*offset+"px)";
	}
		
	
	
	//响应式，根据浏览器窗口变化
	slideUl.style.width=slideLis.length*100+"%";
	var liWidth=100/slideLis.length+"%";
	for(var i=0;i<slideLis.length;i++){
		slideLis[i].style.width=liWidth;
	}
	window.onresize=function(){
		closeTransition();//关闭动画
		offset=slide.clientWidth;
		goslide();//重置UL的位置
	}
}

}

