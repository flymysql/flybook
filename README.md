## Flybook

![](https://img.shields.io/github/issues/flymysql/flybook.svg)
![](https://img.shields.io/github/forks/flymysql/flybook.svg)
![](https://img.shields.io/github/stars/flymysql/flybook.svg)
![](https://img.shields.io/github/license/flymysql/flybook.svg)
![](https://img.shields.io/badge/language-node.js-green.svg)

搭了快一年的博客了，用过wordpress，也用过typecho，其中hexo用的最久，期间把nex主题改得乱七八糟。平常喜欢折腾，就一直在搞些杂七杂八的。也一直想自己动手做个属于自己的博客框架，奈何之前技术水平不够，觉得这种项目离自己的水平还有点距离，学了半年前端后（其实也没系统地学），上周看完node的文档后，决定自己用node搭一个博客web应用。历时一周，完成初步版本，本博客整体UI风模仿简书。。

自己其实想要做的也很简单，一个轻量级的博客框架，只针对博客！对的，目标明确，这个框架应该只用来做博客，不考虑其他网站的用途。

## todo列表

版本一计划开发周期一星期，目前迭代进度。

**版本一迭代任务清单**

开始时间：2019-05-11
计划完成时间:2019-05-18
计划周期：一周

**稳定版**（2019-05-24）
基本完成开发任务，后面会在此基础上增增改改
建站任务清单如下

- [X] 网站骨架
- [X] 首页页面渲染
- [X] 文章详情页渲染
- [X] 归档页面渲染
- [X] 前台登录验证的实现
- [X] 前台编写文章
- [X] 前台修改与删除文章
- [X] 后台文章
- [X] 自定义页面
- [X] ajax渲染标签
- [X] 各个页面css独立
- [X] 写文章页面图片上传
- [X] ajax上传文件
- [x] 点赞功能
- [x] 文章阅读数量刷新
- [x] 谷歌广告集成
- [x] 文章搜索功能
- [x] 集成image-view灯箱插件
- [x] 集成highlight代码高亮
- [ ] 单独标签页
- [x] 关于我
- [x] 博客相册
- [x] 把文章单标签模式换成一篇文章多标签的模式
- [x] 自定义页面的渲染模板和文章渲染模板分离开
- [x] 更好的文章编辑器
- [x] 各个设备的自适应
- [x] 图片懒加载
- [x] 开启http2协议
- [x] 搜索文章
- [x] sitemap站点地图
- [x] 文章的toc目录插件
- [x] 添加百度主动推送
- [x] 添加站点统计与文章统计
- [x] 添加邮件订阅
- [x] 添加rss生成
- [x] 添加文章与主页侧边栏广告位
- [x] 添加喜欢按钮
- [ ] 添加游客投稿功能
- [ ] 独立的评论系统
- [x] 添加站点数据自动安装

## 站点概览

**站点特点**：超级轻量级（其实也是因为东西少），每个页面只加载了必要的东西，可以说是物尽其用了，每一个脚本都有其它的必要之处。其实一个页面顶多也就两三个脚本，一两个css文件，而且每个css文件也没多大，包括html文件也只有1kb到几kb左右。

缓存机制和gzip压缩也都有用上，所以完全不用担心页面的加载速度问题。

### 手机上的页面效果

![](/public/images/blog/手机主页.jpg)  

![](/public/images/blog/手机文章.jpg)  
  

### 电脑上的页面效果

![](/public/images/blog/电脑主页.jpg)  

![](/public/images/blog/电脑文章.jpg)  

## 技术栈

1. node
2. express库
3. pug
4. mysql
5. 服务器端的配置

## 博客骨架


网站骨架如下
>├── app.js  
├── bin // 入口文件  
├── config.js // 站点配置  
├── controllers // 路由控制器  
├── package.json  
├── public // 静态文件  
│ ├── images  
│ ├── javascripts  
│ └── stylesheets  
├── routes // 路由  
├── server // 数据库操作  
├── sessions // 登录验证  
├── until // 工具函数  
└── views // 主题

其实就是在express初始化的网站骨架下对自己需要的部件进行添加。

## 页面响应


首先要确定页面中应显示哪些信息，然后定义适当的 URL 来返回这些资源。随后应创建路由（URL 处理器）和视图（模板）来显示这些页面。

下图展示了 HTTP 请求/响应处理的主数据流和需要实现的行为。图中除视图（View）和路由（Route）外，还展示了控制器（Controller），它们是实际的请求处理函数，与路由请求代码是分开的。

模型已经创建，现在要创建的主要是：

- 路由：把需要支持的请求（以及请求 URL 中包含的任何信息）转发到适当的控制器函数。
- 控制器：从模型中获取请求的数据，创建一个 HTML 页面显示出数据，并将页面返回给用户，以便在浏览器中查看。
- 视图（模板）：供控制器用来渲染数据。

![](https://me.idealli.com/uploads/images/imageup-1558169043543.png)  

## 博客安装

项目地址：[Flybook](https://github.com/flymysql/flybook)

### 安装

```
git clone https://github.com/flymysql/flybook.git
```

#### 填写数据库账号信息

进入路径`server\config\db.js`下，里面有两个文件。
1. db.js 中填写你的数据库信息
2. user.js 填写你的用户信息

#### 生成环境安装
进入项目文件夹文件夹后安装生产环境
```
npm install
```

或者使用cnpm安装
```
cnpm install
```
  
### 运行

使用pm2进程守护
```
npm run pmstart
```

如果要停止项目
```
npm run pmstop
```

如果要重启项目
```
npm run pmrestart
```

启动项目后访问服务器地址的3000端口便可以看到页面

### 配置域名

使用nginx反向代理

安装nginx，安装方法自行百度

配置nginx配置文件

1. 配置Nginx，使得访问`域名`时候转到`[http://localhost:3000](http://localhost:3000)`处理请求，配置文件如下，记得把域名改成自己的:

```
server {  
listen 80;  
server_name [me.idealli.com](http://me.idealli.com);  
location / {  
    proxy_pass [http://localhost:3000](http://localhost:3000);  
    proxy\_http\_version 1.1;  
    proxy\_set\_header Upgrade $http_upgrade;  
    proxy\_set\_header Connection "upgrade";  
    proxy\_set\_header Host $host;  
    proxy\_cache\_bypass $http_upgrade;  
}  
error_page 500 502 503 504 /50x.html;  
        location = /50x.html {  
        root /usr/share/nginx/html;  
    }  
}
```

配置后重启Nginx，`service nginx restart`。

当然，还有个最简单的方法是让应用监听80端口，前提是你的服务器没有其他网站在运行。修改端口在项目的/bin/www文件下

### 安装站点数据库

访问你的站点域名+install，比如`https://yuming.com/install`
登陆账号即可安装

### 更新升级

由于博客还在开发阶段，每天都会有大量更新和改动

所以写了个升级脚步，用于本地更新
```
npm run update
```

更新之后可以重启站点
```
npm run pmrestart
```

## 主题自定义

博客的主题文件放在view文件夹下，通过修改view文件夹下面的pug模板可以轻松地修改博客主题。css文件放在`public/stylesheets`文件夹下，修改主题时请认准相应模板的css文件（博客页面的css文件是独立的，比如index页面有`index.css`，而post页面有对应的`post.css`）

### 自定义服务的的页面渲染

当然也可以对自己修改页面的渲染代码，看半天node的文档基本上就会改了。页面渲染的代码在/server/mysql文件夹下，不同的渲染文件对应不同的页面渲染（大部分渲染函数都在post.js文件里）

#### 后续计划

还有挺多功能没实现，一周的课余时间搭这一个博客站点学到了挺多东西，后面再继续折腾。

