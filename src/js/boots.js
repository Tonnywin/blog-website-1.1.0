$(function(){
    $("#ab").carousel({
        interval:2000
    });
    $("a.left").click(function(){
        $(".carousel").carousel("prev");
    });
    $("a.right").click(function(){
        $(".carousel").carousel("next");
    });

});