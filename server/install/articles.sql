-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2019-05-18 14:13:24
-- 服务器版本： 5.5.57-log
-- PHP 版本： 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `www_idealli_com`
--

-- --------------------------------------------------------

--
-- 表的结构 `articles`
--

CREATE TABLE `articles` (
  `id` varchar(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `post_content` longtext NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `visitors` bigint(20) DEFAULT '0',
  `like` bigint(20) DEFAULT '0',
  `tag` varchar(255) DEFAULT NULL,
  `createTime` date DEFAULT NULL,
  `updateTime` date DEFAULT NULL,
  `tagid` int(6) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `articles`
--

INSERT INTO `articles` (`id`, `title`, `description`, `post_content`, `img`, `type`, `visitors`, `like`, `tag`, `createTime`, `updateTime`, `tagid`) VALUES
('f108d095d', 'Flybook | 一个用node搭建的轻量级模仿简书风格的博客', '<p>搭了快一年的博客了，用过wordpress，也用过typecho，用的时间最长的是hexo。平常喜欢折腾，就一直在搞些杂七杂八的。也一直想自己动手做个属于', '<p>搭了快一年的博客了，用过wordpress，也用过typecho，用的时间最长的是hexo。平常喜欢折腾，就一直在搞些杂七杂八的。也一直想自己动手做个属于自己的博客框架，奈何之前技术水平不够，觉得这种项目离自己的水平还有点距离，学了半年前端后（其实也没系统地学），最近看到node这个轻量级的后端语言以及express这个成熟的框架可以很快的搭起一个网站骨架。</p><p>自己其实想要做的也很简单，一个轻量级的博客框架，只针对博客！对的，目标明确，这个框架应该只用来做博客，不考虑其他网站的用途。</p><h2><a id=\"user-content-网站骨架\" aria-hidden=\"true\" href=\"https://github.com/flymysql/flybook#%E7%BD%91%E7%AB%99%E9%AA%A8%E6%9E%B6\"><svg viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>网站骨架</h2><p>那么有了目标，思维就变得清晰了，只针对博客，其实需要的东西就没那么多了。动手进行第一个版本的网站骨架设计（其实也就是想到哪写到哪）</p><p>网站骨架如下</p><pre><code>.\n├── app.js\n├── bin					// 入口文件\n├── config.js				// 站点配置\n├── controllers			// 路由控制器\n├── package.json\n├── public					// 静态文件\n│   ├── images\n│   ├── javascripts\n│   └── stylesheets\n├── routes					// 路由\n├── server					// 数据库操作\n├── sessions				// 登录验证\n├── until					// 工具函数\n└── views					// 主题\n</code></pre><p>第一个版本的数据库初始模型：只有一个文章模型，模型的属性包含一篇正常博客文章所需的内容。</p><h2><a id=\"user-content-todo列表\" aria-hidden=\"true\" href=\"https://github.com/flymysql/flybook#todo%E5%88%97%E8%A1%A8\"><svg viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>todo列表</h2><p>版本一计划开发周期一星期，目前迭代进度。</p><p><strong>版本一迭代任务清单</strong></p><p>开始时间：2019-05-11 计划完成时间:2019-05-18 计划周期：一周</p><ul><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;网站骨架</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;首页页面渲染</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;文章详情页渲染</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;归档页面渲染</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;前台登录验证的实现</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;前台编写文章</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;前台修改与删除文章</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;后台文章</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;自定义页面</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;ajax渲染标签</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;各个页面美化</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;将博客搬过去</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;写文章页面图片上传</li><li><input type=\"checkbox\" id=\"\" disabled=\"\" checked=\"\">&nbsp;ajax上传文件</li><li><input type=\"checkbox\" id=\"\" disabled=\"\">&nbsp;单独标签页</li><li><input type=\"checkbox\" id=\"\" disabled=\"\">&nbsp;关于我</li><li><input type=\"checkbox\" id=\"\" disabled=\"\">&nbsp;博客相册</li></ul>', '', 'post', 1, 0, '随想', '2019-05-18', '2019-05-18', 1),
('872fdc4f6', 'Hello World！', '<p>欢迎使用flybook搭建你的站点</p><p>开始你的创作吧！</p><p><br></p>', '<p>欢迎使用flybook搭建你的站点</p><p>开始你的创作吧！</p><p><br></p>', '', 'post', 0, 0, '随想', '2019-05-18', '2019-05-18', 1);

--
-- 转储表的索引
--

--
-- 表的索引 `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`) USING BTREE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
