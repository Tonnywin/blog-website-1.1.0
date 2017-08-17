var introPopClose = $(".introPopClose");
var introPopup = $("#introPopup");
var introListCont = $(".introListCont");
var intrestImg = $(".intrestImg").find("img");
var skillImg = $(".skillImg").find("img");
var introShareUl = introPopup.find(".introShareUl");

intrestImg.add(skillImg).click(function () {
    var address = 'advicePhp/'+$(this).attr("data-target")+'.php';
    getIntroJson(address);
    introPopup.slideToggle();
});

introPopClose.add(introPopup).click(function () {
    introPopup.slideToggle();
    return false;
});
introListCont.on('click',function (ev) {
  ev.stopPropagation();
});

function getIntroJson(address) {
    $.getJSON(address,function (json) {
        introShareUl.html("");
        $.each(json, function(index, value) {
            var oLi = $("<li>");
            var oDiv = $("<div class='introBox'></div>");
            oDiv.html('<a href="'+json[index].sourceLink+'" target="_blank">'+decodeURI(json[index].sourceName)+'</a><p><span>密码：</span><i>'+json[index].sourcePassword+'</i><span class="hidden-xs">更新时间：</span><i class="hidden-xs">'+json[index].addtime+'</i></p>');
            oDiv.appendTo(oLi);
            oLi.appendTo(introShareUl);
        });
    });
}