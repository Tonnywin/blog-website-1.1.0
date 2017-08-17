SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `comic` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `comic` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(4, '海贼王', 'https://www.baidu.com/', '8080', '2017-07-11 19:00:25'),
(3, '海贼王', 'www.baidu.com', '8080', '2017-07-11 19:00:21');

CREATE TABLE `comments` (
  `id` int(4) NOT NULL,
  `user` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comment` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `comments` (`id`, `user`, `comment`, `addtime`) VALUES
(1, 'fewa', 'jhfjkeljfklwa;lfjlajfew fewfweaf', '2017-07-08 23:26:56'),
(10, '路人', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2017-07-08 23:45:18'),
(12, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaa', '2017-07-08 23:58:58'),
(9, '路人', 'fseafffffeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '2017-07-08 23:44:16'),
(11, '路人', '法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了据了解法即刻我就看了解开了', '2017-07-08 23:56:47'),
(13, 'bbbbbbbb', 'aaaaaaaaaaaaaa', '2017-07-08 23:59:46'),
(14, 'avvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', 'aaaaaaaaaffaaaaaaaaaaaaaaaaaaaaaa', '2017-07-09 00:01:25'),
(15, '范德萨发范德萨得到', 'aaaaaaaggggrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', '2017-07-09 00:08:38'),
(16, '范德萨发范德范德萨发范德萨得到萨得到', '分啊问问啊发分哇分哇额哇额哇额哇额哇额哇额哇额哇', '2017-07-09 00:09:20'),
(17, '就范德萨发范德范德萨发范德萨得到萨得到', '分挖坟分哇为啊范围发额哇哇哇哇', '2017-07-09 00:09:53'),
(18, '路人', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2017-07-09 13:20:25'),
(19, '路人', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2017-07-09 13:21:14'),
(20, '路人', 'aaaaaaaaaaaaaaaaaaaaafffffffffffffff', '2017-07-09 13:26:56'),
(21, '路人', 'aaaaaaaaaaaaaaaaaaaaafffffffffffffff', '2017-07-09 13:26:57'),
(22, '路人', 'aaaaaaaaaaaaaaaaaaaaafffffffffffffff', '2017-07-09 13:26:58'),
(23, '路人', 'aaaaaaaaaaaaaaaaaaaaafffffffffffffff', '2017-07-09 13:26:59'),
(24, '路人', 'aaaaaaaaaaaaaaaaaaaaafffffffffffffff', '2017-07-09 13:27:02'),
(25, '路人', 'aaaaaaaaaaaaaaaaaaaaafffffffffffffff', '2017-07-09 13:27:03'),
(26, '路人', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', '2017-07-09 13:27:56'),
(27, '路人', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', '2017-07-09 13:27:57'),
(28, '路人', '啵啵啵啵啵啵啵啵啵啵啵啵啵啵啵啵啵啵不', '2017-07-09 13:35:18'),
(29, '路人', 'vvvvvvvvvvvvvvvvvvv', '2017-07-09 13:36:39'),
(30, '路人', 'llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll', '2017-07-09 13:41:33'),
(31, '路人', 'ppppppppppppppppppppppppppppppppppppppppp', '2017-07-09 13:42:14');



CREATE TABLE `finacing` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `finacing` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '这个发财技巧让你一夜成为百万富翁', 'www.baidu.com', '8888', '2017-07-11 19:13:26'),
(2, '这个发财技巧让你一夜成为百万富翁', 'www.baidu.com', '8888', '2017-07-11 19:13:28');

CREATE TABLE `frontendpdf` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `frontendpdf` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '黄金前端资源', 'tonnywin.club', '6666', '2017-07-10 10:15:54'),
(2, 'react技术', 'www.baidu.com', '4545', '2017-07-11 19:03:04');



CREATE TABLE `life` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `life` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '肥皂的一万个使用方法，生活中绝对会用得到，用得着', 'www.baidu.com', '1212', '2017-07-11 19:12:28'),
(2, '肥皂的一万个使用方法，生活中绝对会用得到，用得着', 'www.baidu.com', '1212', '2017-07-11 19:12:30');



CREATE TABLE `movie` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `movie` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '好莱坞最感动的电影，快戳速看~', 'www.baidu.com', '8888', '2017-07-11 19:14:22'),
(2, '好莱坞最感动的电影，快戳速看~', 'www.baidu.com', '8888', '2017-07-11 19:14:26');



CREATE TABLE `otherblog` (
  `uid` int(4) NOT NULL,
  `blogname` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `imagesrc` varchar(160) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `otherblog` (`uid`, `blogname`, `url`, `imagesrc`) VALUES
(1, '翁天信', 'https://www.dandyweng.com/', 'http://cgouz.img48.wal8.com/img48/572441_20170717175551/150028554505.jpg'),
(2, '尤雨溪', 'http://evanyou.me/', 'http://cgouz.img48.wal8.com/img48/572441_20170717175551/150028554507.jpg'),
(3, ' JJ Ying', 'http://iconmoon.com/blog2/index.php', 'http://cgouz.img48.wal8.com/img48/572441_20170717175551/15002858347.jpg');


CREATE TABLE `ppt` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `ppt` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '最眩酷的ppt，你值得拥有', 'www.baidu.com', '3333', '2017-07-11 19:11:45'),
(2, '最眩酷的ppt，你值得拥有', 'www.baidu.com', '3333', '2017-07-11 19:11:47'),
(3, '最眩酷的ppt，你值得拥有', 'www.baidu.com', '3333', '2017-07-11 19:11:47'),
(4, '最眩酷的ppt，你值得拥有', 'www.baidu.com', '3333', '2017-07-11 19:11:47');



CREATE TABLE `ps` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `ps` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '修图小技巧', 'www.wyzxw.com', '5555', '2017-07-11 19:09:30'),
(2, '修图小技巧', 'www.wyzxw.com', '5555', '2017-07-11 19:09:34');


CREATE TABLE `readpdf` (
  `uid` int(4) NOT NULL,
  `sourceName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceLink` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourcePassword` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `readpdf` (`uid`, `sourceName`, `sourceLink`, `sourcePassword`, `addtime`) VALUES
(1, '为什么我们要读书', 'www.baidu.com', '2828', '2017-07-11 19:04:46'),
(2, '为什么我们要读书', 'www.baidu.com', '2828', '2017-07-11 19:04:50');


CREATE TABLE `zhihutopic` (
  `uid` int(4) NOT NULL,
  `topicname` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(160) COLLATE utf8_unicode_ci DEFAULT NULL,
  `imagesrc` varchar(160) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `zhihutopic` (`uid`, `topicname`, `url`, `imagesrc`) VALUES
(1, '居家', 'https://www.zhihu.com/topic/19559947/hot ', 'http://cgouz.img48.wal8.com/img48/572441_20170717175551/15002866066.jpg'),
(2, '摄影书房', 'https://zhuanlan.zhihu.com/seatory ', 'http://cgouz.img48.wal8.com/img48/572441_20170717175551/150028660658.jpg'),
(3, '旅游线路', 'https://www.zhihu.com/topic/19624425/hot', 'http://cgouz.img48.wal8.com/img48/572441_20170717175551/150028660662.jpg');


ALTER TABLE `comic`
  ADD PRIMARY KEY (`uid`);

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `finacing`
  ADD PRIMARY KEY (`uid`);


ALTER TABLE `frontendpdf`
  ADD PRIMARY KEY (`uid`);

ALTER TABLE `life`
  ADD PRIMARY KEY (`uid`);


ALTER TABLE `movie`
  ADD PRIMARY KEY (`uid`);

ALTER TABLE `otherblog`
  ADD PRIMARY KEY (`uid`);

ALTER TABLE `ppt`
  ADD PRIMARY KEY (`uid`);

ALTER TABLE `ps`
  ADD PRIMARY KEY (`uid`);

ALTER TABLE `readpdf`
  ADD PRIMARY KEY (`uid`);


ALTER TABLE `zhihutopic`
  ADD PRIMARY KEY (`uid`);


ALTER TABLE `comic`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `comments`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

ALTER TABLE `finacing`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `frontendpdf`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `life`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `movie`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `otherblog`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `ppt`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `ps`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `readpdf`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `zhihutopic`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

