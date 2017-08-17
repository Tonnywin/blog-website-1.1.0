
function foo(json) {
    var proList = $(".proList");
    for(var i=0;i<json.data.length;i++){
        var oLi = $("<li class='col-md-6 col-sm-12 col-xs-12'></li>");
        var oDiv = $("<div class='gitpro'></div>");
        var dotBg;
        switch (json.data[i].language){
            case "HTML":dotBg = "htmlColor";break;
            case "CSS":dotBg = "cssColor";break;
            case "JavaScript":dotBg = "jsColor";break;
            default:break;
        }
        if(json.data[i].fork){
            oDiv.html('<a href="'+json.data[i].html_url+'" class="text-bold">'+json.data[i].name+'</a><p class="text-fork">非原创，引自他人作品</p><p class="text-explain">'+json.data[i].description+'</p><p class="text-type"><span class="text-dot '+dotBg+'"></span>&nbsp;'+json.data[i].language+' </p>');
        }else{
            oDiv.html('<a href="'+json.data[i].html_url+'" class="text-bold">'+json.data[i].name+'</a><p class="text-explain">'+json.data[i].description+'</p><p class="text-type"><span class="text-dot '+dotBg+'" ></span>&nbsp;'+json.data[i].language+' </p>');
        }
        oDiv.appendTo(oLi);
        oLi.appendTo(proList);
    }
}

var oS = document.createElement("script");
oS.src= "https://api.github.com/users/Tonnywin/repos?callback=foo";
document.getElementsByTagName("body")[0].appendChild(oS);