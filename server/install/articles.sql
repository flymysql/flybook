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
  `type` varchar(10) DEFAULT 'post',
  `visitors` bigint(20) DEFAULT '0',
  `like` bigint(20) DEFAULT '0',
  `tag` varchar(255) DEFAULT NULL,
  `createTime` date DEFAULT NULL,
  `updateTime` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `articles`
--

INSERT INTO `articles` (`id`, `title`, `description`, `post_content`, `img`, `type`, `visitors`, `like`, `tag`, `createTime`, `updateTime`) VALUES
('872fdc4f6', 'Hello World！', '<p>欢迎使用flybook搭建你的站点</p><p>开始你的创作吧！</p><p><br></p>', '<p>欢迎使用flybook搭建你的站点</p><p>开始你的创作吧！</p><p><br></p>', '', 'post', 0, 0, '随想', '2019-05-18', '2019-05-18');


--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(10) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, '随想'),
(4, '博客')；

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `id` (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

