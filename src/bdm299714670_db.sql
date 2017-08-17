

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
(17, '就范德萨发范德范德萨发范德萨得到萨得到', '分挖坟分哇为啊范围发额哇哇哇哇', '2017-07-09 00:09:53');



ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `comments`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

