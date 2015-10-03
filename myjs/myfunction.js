//
function sp(){
    console.log("update"+myPlaylist);
    localStorage.setItem("myPlaylist",JSON.stringify(myPlaylist));
}
//加载页面模板
function loadpage(div,path,callback){
    $(div).load(path,{},function(){
        callback();
    });
}
//去除字符串的所有空格
function noSpace(str){ 
    //if(str!=null) return str.replace(/\s+/g, "");
    return str;
}
//获得url上拼接的参数
function getQueryString(name,url) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //如果没有自己指定url字符串,则使用浏览器当前url
    if(!url){    
        var r = window.location.search.substr(1).match(reg); 
        if (r != null){
            return unescape(r[2]);
        }
    }
    //如果没有自己指定url字符串,则使用浏览器当前url
    else{
        var r = url.substr(1).match(reg); 
        if (r != null){
            return unescape(r[2]);
        }
    }
	return null; 
}
//截取某符号（第一个）之前的地址
//添加上时间撮做强制刷新
//如果没有某符号的话就直接刷新页
function reFlashHash(flag){
    if(!flag){
        flag = "?";
    }
    var href = window.location.href;
    var index = href.indexOf(flag);
    if(index>0){
        href = href.substring(0,href.indexOf(flag));   
    }
    window.location.href = href + flag+"time="+new Date().getTime();
}
function isff(){
    var bname = isBrowser();
    if(bname == "firefox"){
        return true;
    }else{
        return false;
    }
}
function isBrowser(){
	var Sys={};
	var ua=navigator.userAgent.toLowerCase();
	var s;
	(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1]:
	(s=ua.match(/firefox\/([\d.]+)/))?Sys.firefox=s[1]:
	(s=ua.match(/chrome\/([\d.]+)/))?Sys.chrome=s[1]:
	(s=ua.match(/opera.([\d.]+)/))?Sys.opera=s[1]:
	(s=ua.match(/version\/([\d.]+).*safari/))?Sys.safari=s[1]:0;
	if(Sys.ie){//Js判断为IE浏览器
		if(Sys.ie=='9.0'){//Js判断为IE 9
		}else if(Sys.ie=='8.0'){//Js判断为IE 8
		}else{
		}
	}
	if(Sys.firefox){//Js判断为火狐(firefox)浏览器
        return "firefox";
	}
	if(Sys.chrome){//Js判断为谷歌chrome浏览器
	}
	if(Sys.opera){//Js判断为opera浏览器
	}
	if(Sys.safari){//Js判断为苹果safari浏览器
	}
}
