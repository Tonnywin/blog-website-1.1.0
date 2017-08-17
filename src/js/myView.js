var zhihuUl = $(".zhihuTopics");
var blogUl = $(".blogs");
$.getJSON('advicePhp/otherblog.php',function (json) {
    $.each(json, function(index, value) {
        var oLi = $("<li>");
        oLi.html('<img src="'+json[index].imagesrc+'" alt="blog"><a href="'+json[index].url+'" target="_blank" rel="nofollow">'+decodeURI(json[index].blogname)+'</a>');
        oLi.appendTo(blogUl);
    });
});
$.getJSON('advicePhp/zhihutopic.php',function (json) {
    $.each(json, function(index, value) {
        var oLi = $("<li>");
        oLi.html('<img src="'+json[index].imagesrc+'" alt="zhihu"><a href="'+json[index].url+'" target="_blank" rel="nofollow">'+decodeURI(json[index].topicname)+'</a>');
        oLi.appendTo(zhihuUl);
    });
});
