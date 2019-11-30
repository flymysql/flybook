module.exports ={
    // 站点信息
    seo:{
        title:"兰州小红鸡",
        index:"https://me.idealli.com",
        keywords:"兰州小红鸡,博客,技术博客,写作,阅读",
        description:"兰州小红鸡的博客，代码记录成长",
    },
    // 数据库配置
    db:{
        host:  '120.77.183.14',
        user     : 'www_idealli_com',
        password : 'test',
        database : 'www_idealli_com',
        multipleStatements: true
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
        logo: "logo4.png"
      },
      "小鸡": {
        head_img:"/images/head.png",
        blog_name: "小鸡",
        header_logo: "/images/headerico.png",
        logo: "logo4.png"
      },
      "Valky":{
        head_img:"/images/head_r.jpg",
        blog_name: "Valky",
        header_logo: "/images/headerico_r.png",
        logo: "headerico2_r.png"
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
          'link':'https://me.idealli.com/post/d46a767e.html',
          'img':'/images/2019042801.png'
        },
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
    ]
}