module.exports ={
    // 站点信息
    seo:{
        title:"兰州小红鸡",
        index:"https://me.idealli.com",
        keywords:"兰州小红鸡,博客,技术博客,写作,阅读",
        description:"兰州小红鸡的博客，代码记录成长",
    },
    // 用户配置
    users: [
        {name: '小鸡', password: '123456'},
        {name: 'Valky', password: '123456'}
    ],
    // 作者信息
    author:{
      "佚名": {
        head_img:"/images/head.png",
        blog_name: "佚名",
        header_logo: "/images/headerico.png",
        logo: "logo4.png",
        email: "flyphp@outlook.com"
      },
      "小鸡": {
        head_img:"/images/head.png",
        blog_name: "小鸡",
        header_logo: "/images/headerico.png",
        logo: "logo4.png",
        email: "flyphp@outlook.com"
      },
      "Valky":{
        head_img:"/images/head_r.jpg",
        blog_name: "Valky",
        header_logo: "/images/headerico_r.png",
        logo: "headerico2_r.png",
        email: "1696731766@qq.com"
      }
    },
    // 站点信息
    options:{
        avatar:"/images/avatar.jpg",   
        nickname:"兰州小红鸡",    
        description:"桃李春风一杯酒，江湖夜雨十年灯",
        ICP:"闽ICP备18025365号",
        copyright:"© 2018"
    },
    // 首页轮播图设置
    carousel:[
        {
          'link':'https://me.idealli.com/post/651cfd47.html',
          'img':'/images/18123106.jpg'
        },
        {
          'link':'https://me.idealli.com/post/73ad4183.html',
          'img':'/images/18122304.jpg'
        },
        {
          'link':'https://me.idealli.com/post/e8d13fc.html',
          'img':'/images/110602.png'
        },
        {
          'link':'https://me.idealli.com/post/118d23db.html',
          'img':'/images/110601.png'
        },
        {
          'link':'https://me.idealli.com/post/56d5689a.html',
          'img':'/images/111302.png'
        },
     ],
     email_auth:{
        // 用来发送消息的邮箱
        name: "小鸡",
        id: "237199972@qq.com",
        key: "",
        // 自己用来接收消息的邮箱
        my_mail: "flyphp@outlook.com"
     },
     // 首页侧边栏
     index_aside: [
       {
         img: "/images/110604.jpg",
         link: "/tag/%E9%9A%8F%E6%83%B3/"
       },
       {
        img: "/images/110605.jpg",
        link: "/tag/资源"
      },
      {
        img: "/images/110606.jpg",
        link: "/post/about小鸡"
      },
      {
        img: "/images/110607.png",
        link: "/archives"
      }
     ],
     // 首页友链
     friends:[
      {
        img: "https://me.idealli.com/images/head_r.jpg",
        link: "http://blog.idealli.com/",
        name: "pink",
        desc: "博主的可爱女友"
      },
      {
        img: "https://secure.gravatar.com/avatar/1741a6eef5c824899e347e4afcbaa75d?s=64&r=G&d=",
        link: "https://blog.imalan.cn/",
        name: "无文字",
        desc: "无文字 | 三无计划"
      },
      {
        img: "https://www.52share.online/medias/avatar.jpg",
        link: "https://www.52share.online/",
        name: "在线分享网",
        desc: "免费分享各种学习视频，资源收集于网络！"
      },
      {
        img: "/images/Rss.png",
        link: "/post/email",
        name: "邮件订阅",
        desc: "友情位闲置中，欢迎入驻"
      }
    ],
    // 标签云
    tags: ["随想","博客","机器学习","教程","邻家酒肆","前端","深度学习","算法","小程序",
          "资源","cpp","html","javascript","python","sql","node","wordpress"],
    // 页脚菜单栏
    footer_menu:[
      {
        desc: "关于小鸡",
        link: "/post/about"
      },
      {
        desc: "联系小鸡",
        link: "/post/about"
      },
      {
        desc: "RSS订阅",
        link: "/rss.xml"
      },
      {
        desc: "邮件订阅",
        link: "/post/email"
      },
      {
        desc: "Github",
        link: "https://www.github.com/flymysql"
      },
      {
        desc: "微博",
        link: "https://weibo.com/237199972"
      },
    ]
}