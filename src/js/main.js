require('./plugin/animatext.js');
require('./plugin/contactPop.js');
require('./plugin/drag.js');
require('./plugin/scrollLine.js');
require('./plugin/limitWords.js');
require('./plugin/toggleShowMore.js');
require('./plugin/bringins.js');

var hdNav = $("#hd_nav");
var conBox = $(".contentBox");
var conDiv = conBox.find(".contentDiv");
var listBox = $("#listBox");
var contact = $("#contact");
var navBrand = $(".navbar-brand").find("a");
var viewTabs = $(".viewTabs");
var myTechNews = $("#myTechNews");
var videoContent = $(".videoContent");
var videoItems = $("#videoItems");
var videoIframe = $("#videoIframe");
var addAdviceBtn = $(".addAdviceBtn");
var adviceInput = $("#adviceInput");
var userName = $(".userName");
var scrollBtn = $(".scrollBtn");
var misBoard = $(".msgBoard").find(".container");
var contactPic = $(".contact_pic").find("img");
var ismottoFresh = false;
var toggleTime = 400;

var hash = window.location.hash.substring(1) || "index";
//初始化
init();

function init() {
    mottoRefresh();
    //根据初始化hash添加相对应的class
    conDiv.each(function () {
        if ($(this).attr("data-hash") === hash) {
            $(this).addClass("active");
            navLiBg();
            bgRefresh();
        }
    });
    //绑定导航条点击事件
    hdNav.find("a").add(navBrand).click(function (ev) {
        if ($(this).attr("data-hash")) {
            hash = $(this).attr("data-hash");
            //改变hash值
            window.location.hash = hash;
        }
        //改变按钮样式
        if ($(this).get(0).nodeName == "A") {
            hdNav.find(".active").removeClass("active");
            $(this).closest("li").addClass("active");
        }
        ev.stopPropagation();
    });


    $(window).on('resize', function () {
        var listHeight = listBox.height();
        conDiv.css("height", "auto").height();
        listBox.get(0).adListBoxHeight = listHeight;
    });

    //绑定hash变化事件
    $(window).on("hashchange", function () {
        hash = window.location.hash.substring(1);
        mottoRefresh();
        navLiBg();
        bgRefresh();
        boxRefresh();
    });
    //每日一览绑定选项卡切换
    viewTabs.children("li").click(function () {
        $(viewTabs.children(".active").attr("data-target")).css("display", "none");
        viewTabs.children(".active").removeClass("active");
        $(this).addClass("active");
        $($(this).attr("data-target")).css("display", "block");
    });
    //根据hash值进行相应内容的刷新
    boxRefresh();
}
function mottoRefresh() {
    //签名板
    if(hash === "index" && !ismottoFresh){
        ismottoFresh = true;
        $(".mottoContent").animatext({
            speed:160
        });
        $(".mymotto").css("height",$(window).height());
        setTimeout(function () {
            $(".mymotto").css("height","auto");
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $(".mottoContent").css({
                    "font-weight":"normal",
                    "font-size":"28px",
                    "padding-top":0
                });
            } else {
                $(".mottoContent").css({
                    "font-weight":"normal",
                    "font-size":"60px",
                    "padding-top":0
                });
            }
            $(".mymotto").addClass("mottoBg");
            $(".mymotto").find("h1").css("display","block");
        },10000);
    }
}
//导航条按钮颜色改变
function navLiBg() {
    hdNav.find("a").each(function () {
        if ($(this).attr("data-hash") == hash) {
            hdNav.find(".active").removeClass("active");
            $(this).closest("li").addClass("active");
        }
    });
}
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    toggleTime = 1200;
} else {
    toggleTime = 500;
}
//背景图片刷新
function bgRefresh() {
    switch (hash) {
        case "index":
            contactPic.hide().filter(".spring").show();
            break;
        case "myIntro":
            contactPic.hide().filter(".summer").show();
            break;
        case "myView":
            contactPic.hide().filter(".winter").show();
            break;
        case "morePro":
            contactPic.hide().filter(".autumn").show();
            break;
        default:
            break;
    }
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        toggleTime = 1;
        switch (hash) {
            case "index":
                $(document.body).css("background-color", "#ffefd1");
                break;
            case "myIntro":
                $(document.body).css("background-color", "#86e0fa");
                break;
            case "myView":
                $(document.body).css("background-color", "#e34c26");
                break;
            case "morePro":
                $(document.body).css("background-color", "#f6c401");
                break;
            default:
                break;
        }
    } else {
        toggleTime = 500;
        switch (hash) {
            case "index":
                $(document.body).attr("class", "myIndexbg");
                break;
            case "myIntro":
                $(document.body).attr("class", "myIntrobg");
                break;
            case "myView":
                $(document.body).attr("class", "myViewbg");
                break;
            case "morePro":
                $(document.body).attr("class", "mymoreProbg");
                break;
            default:
                break;
        }
    }
}
//内容刷新
function boxRefresh() {
    var indexContent = conBox.children(".active");
    conDiv.each(function () {
        if ($(this).attr("data-hash") === hash) {
            var $this = $(this);
            indexContent.stop().animate({"height": 0}, toggleTime,function () {
                conDiv.removeClass("active");
                var oheight = $this.css("height", "auto").height();
                $this.css({"height": 0}).addClass("active").stop().animate({"height": oheight}, toggleTime,function () {
                    $this.css("height", "auto");
                });
            });
        }
    });
}
$(window).on('scroll',function () {
    var showDis = misBoard.offset().top - $(window).scrollTop();
    if(showDis <= 160){
        misBoard.css("background","rgba(26,26,26,0.5)");
    }else if(showDis >= 270){
        misBoard.css("background","none");
    }
});


//使用弹窗插件
contact.contactPop({isSorp: true, sorpRange: 30});

//复制提示
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $(".btn").on('touchend',function () {
        $(this).html('复制成功！');
    });
    $(".contact_close").on('touchend',function () {
        $(".btn").html('点我复制');
    });
}else{
    $(".btn").click(function () {
        $(this).html('复制成功！');
    });
    $(".contact_close").click(function () {
        $(".btn").html('点我复制');
    });
}
// //使用复制剪切板插件
new Clipboard('.btn');
//滚动条插件
$(".scrollBtn").scrollLine({scrollBtnHeight: 30, scrollLineHeight: 360});
//建议输入字数检测限制
$("#adviceInput").limitWord({limitLength: 140});


//ajax
//每日一览技术栏内容获取更新
$.getJSON("http://gank.io/api/random/data/前端/6", function (json) {
    if (typeof json === true) {
        myTechNews.html("<li>服务器开小差去啦~</li>");
    } else if (json.error === false) {
        $.each(json.results, function (index) {
            var oLi = $("<li>");
            var oDiv = $("<div class='techBox'></div>");
            if (json.results[index].images) {
                oDiv.html('<a href="' + json.results[index].url + '" target="_blank">' + decodeURI(json.results[index].desc) + '</a> <p> <span><a href="' + json.results[index].images + '" rel="noreferrer" target="_blank">图片(点击查看)</a></span> <span><a href="' + json.results[index].url + '" target="_blank">详细了解>></a></span> </p> <span>' + new Date().toLocaleDateString() + '</span><span>作者 / 来源：</span><i>' + decodeURI(json.results[index].who) + '</i>');
            } else {
                oDiv.html('<a href="' + json.results[index].url + '" target="_blank">' + decodeURI(json.results[index].desc) + '</a> <p><span><a href="' + json.results[index].url + '"  target="_blank">详细了解>></a></span> </p> <span>' + new Date().toLocaleDateString() + '</span><span>作者 / 来源：</span><i>' + decodeURI(json.results[index].who) + '</i>');
            }
            oDiv.appendTo(oLi);
            oLi.appendTo(myTechNews);
        });
    }
    //每日一览技术栏折叠
    $(".techMore").toggleShowMore({
        toggleNum: 2,
        btnName: "想看更多",
        btnToggleName: "收回"
    });

});

//每日一览休闲栏内容获取更新
$.getJSON("http://gank.io/api/random/data/休息视频/2", function (json) {
    if (json.error === true) {
        videoItems.html("<li>服务器开小差去啦~</li>");
    } else if (json.error === false) {
        $.each(json.results, function (index) {
            var oLi = $("<li class='col-md-6 col-sm-12'></li>");
            var oDiv = $("<div class='videoBox'></div>");
            var oRow = $("<div class='row'></div>");
            var oTitle = $("<div class='col-sm-9 col-xs-12'></div>");
            var oCont = $("<div class='col-sm-3 col-xs-12'></div>");
            var oImg = $("<img src='./images/play.png' alt='播放'>");
            oImg.attr("link-target", json.results[index].url);
            oTitle.html('<a href="javascript:;">' + decodeURI(json.results[index].desc) + '</a> <p><span>' + new Date().toLocaleDateString() + '</span><span>作者 / 来源：</span><i>' + decodeURI(json.results[index].who) + '</i></p>');
            oTitle.appendTo(oRow);
            oImg.appendTo(oCont);
            oCont.appendTo(oRow);

            oRow.appendTo(oDiv);
            oDiv.appendTo(oLi);
            oLi.appendTo(videoItems);
        });
        videoContent.find("img").click(function () {
            var $This = $(this);
            videoIframe.html('<iframe src="' + $This.attr("link-target") + '" height="100%" width="100%" allowfullscreen="true"></iframe>');
            videoIframe.bringins({
                "position": "center",
                "color": "black",
                "closeButton": "white",
                "width": "100%"
            });
        });
    }
});

//页面加载，建议列表加载
$.ajax({
    url:"advicePhp/data.php",
    method:"GET",
    dataType:"json",
    success:function (json) {
        $.each(json, function (index, value) {
            var oDiv = $("<div class='adviceContent clearfix'></div>");
            oDiv.html('<table><tr><td>' + decodeURI(value.comment) + '</td></tr></table><h6><span>By：' + decodeURI(value.user) + '</span><span>' + value.addtime + '</span></h6>');
            oDiv.prependTo(listBox);
        });
    },
    complete:function () {
        //检测是否需要出现滚动条并作相应调整
        scrollShow(400);
    }
});


//添加建议---点击方式
addAdviceBtn.click(function () {
    inputAdvice();
});
//添加建议 --- 回车方式
adviceInput.keyup(function (ev) {
    if (ev.keyCode === 13) {
        ev.preventDefault();
        inputAdvice();
    }
});


function inputAdvice() {
    var user = userName.val() || "路人";
    var txt = adviceInput.val();
    var txtLength;
    user = user.replace(/(^\s*)|(\s*$)/g, "");
    txt = txt.replace(/(^\s*)|(\s*$)/g, "");
    txtLength = txt.length;
    userLength = user.length;
    if (txtLength > 10) {
        if (userLength < 20) {
            var isAdviced = getCookie('isAdviced');
            if (isAdviced != null && isAdviced != "") {
                alert("您今天已经提交了一次建议，改日再来吧~");
                adviceInput.val("");
            } else {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    url: "advicePhp/comment.php",
                    data: "user=" + user + "&txt=" + txt,
                    success: function (json) {
                        //添加建议到列表
                        var oDiv = $("<div class='adviceContent clearfix'></div>");
                        oDiv.html('<table><tr><td>' + decodeURI(json.txt) + '</td></tr></table><h6><span>By：' + decodeURI(json.user) + '</span><span>' + getNowFormatDate() + '</span></h6>');
                        oDiv.prependTo(listBox);
                        //提交成功后，清空输入内容,设置cookie
                        adviceInput.val("");
                        userName.val("");
                        setCookie('isAdviced', "yes", 1);
                        //添加建议到列表后对滚动条进行相应调整
                        scrollShow(400);
                        scrollBtn.scrollLine("resetDrag");
                        //提醒用户提交成功
                        adviceInput.attr("placeholder", "提示：您的留言已经提交成功啦！");
                    },
                    error: function () {
                        alert("提交失败，拜托再提交一遍啦~");
                    }
                });
            }
        } else {
            userName.val("");
            alert("请输入长度小于20的名称！")
        }
    } else {
        adviceInput.val("");
        alert("请输入超过10个字数的有效内容~");
    }
}

function scrollShow(limitHeight) {
    if (listBox.height() < limitHeight) {
        $(".scrollLine").css("display", "none");
    } else {
        $(".scrollLine").css("display", "block");
        listBox.get(0).adListBoxHeight = listBox.height();
    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}