FuckInternetExplorer();
var isNewSong=false;
$(function(){
    //登录表单的提交事件
    $("#loginForm").submit(function(event){
        login();
        return false;
    });
    //注册表单的提交事件
    $("#regForm").submit(function(event){
        reg();
        return false;
    });
});
$(document).ready(function(){
	//AJAX请求跨域许可修改
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
      options.crossDomain ={
        crossDomain: true
      };
      options.xhrFields = {
        withCredentials: true
      };
      if(localStorage["token"]!=null){
	      options.headers = {
	      	   "Token": localStorage["token"] 
	      };
	  }
});
    checkBrowser(); //检查是否为移动端
    checkLogin();   //检查是否登陆
    $("#reg-cap").bind("error",capErr);
    document.addEventListener("visibilitychange",stateChanged);   //检测窗口可见性变化
});    

function stateChanged(){     //窗口可见性改变
	console.log("窗口可见性:" + document.VisibilityState);    
	if(document.hidden || document.webkitHidden || document.msHidden){  
		    var currentSong = myPlaylist.playlist[myPlaylist.current]; 
	  		if(currentSong){
		        var songTitle = currentSong.title;
				document.title="▶ "+ songTitle; 
	  		}else{
				document.title="湿湿娘V4"; 
	  		}
	  		if(isNewSong){
			    if (window.Notification){
			        if(window.Notification.permission==='granted'){
				        var sm = getQueryString("name",currentSong.mp3).replace(".mp3","");
			            var notification = new Notification('正在播放',
			            {
			            	icon: myapp.filebase+sm+".jpg",
			            	body: currentSong.title,
			            });
			            
			        }else {
						Notification.requestPermission();
			        };
			    }
	  		}
        }else{    
 		document.title="湿湿娘V4"; 
        }    
 		isNewSong=false;
}    

function checkLogin(){
    var api =myapp.apibase;
//	toastr.info('正在检测您的登陆状态.','登录检测');
    $.get(api,{"cmd":"user","act":"info","t":getRandom(9999999)},function(data){
    	data = JSON.parse(data);
        //解除第一次启动状态
        myapp.isfirst = false;
    	if(data.STATUS=="[E]NotLogin"){
    		toastr.clear();
    		toastr.info('请您登录来使用更多功能.','尚未登录');
    		changeloginDOM(0,"");
            //利用时间戳登录成功刷新页面
            reFlashHash();
    	};
    	if(data.STATUS=="[I]OK"){
    		toastr.clear();
    		toastr.success('欢迎回来: ' + data.SESS_USR);
    		changeloginDOM(1,data.SESS_USR);
            //利用时间戳登录成功刷新页面
            reFlashHash();
    	};
    });
}

function checkLogin2(callback){
    $.get(myapp.apibase,{"cmd":"user","act":"info","t":getRandom(9999999)},function(data){
        data = JSON.parse(data);
        if(data.STATUS=="[E]NotLogin"){
            toastr.clear();
            toastr.info('请您登录来使用更多功能.','尚未登录');
            changeloginDOM(0,"");
            return false;
        };
        if(data.STATUS=="[I]OK"){
            toastr.clear();
            changeloginDOM(1,data.SESS_USR);
            callback();
        };
    });
}
/*
		desc:修改右上角用户状态显示
		author:ms
		update: 2015/8/15

 */
function changeloginDOM(islogin,username){
	if(islogin){
		$("#useravatar").attr("src","myimages/head_default.jpg");
		$(".username").text(username);
		$("#loginmenu").html('<li>\
                <span class="arrow top"></span>\
              </li>\
              <!--<li>\
                <a href="#/setting/token">长期认证</a>\
              </li>-->\
              <li>\
                <a href="#/retake">搬运</a>\
              </li>\
              <li>\
                <a href="javascript:void(0);" onclick="logout();">注销</a>\
              </li>');
	}else{
		$("#useravatar").attr("src","myimages/head_unlogin.jpg");
		$(".username").text("尚未登录");
		$("#loginmenu").html("             <li>\
	                <span class='arrow top'></span>\
	                <a href='javascript:void(0);' onclick='poplogin();'>登录</a>\
	              </li>\
	              <li>\
	                <a href='javascript:void(0);' onclick='popreg();'>注册</a>\
	              </li>");
    
	}
}


function getRandom(n){
        return Math.floor(Math.random()*n+1);
}
//登录函数
function login(){
	var usr;
	var pwd;
	usr=$("#user-name").val();
	pwd=$("#pass-word").val();
	$("pass-word").attr("text","");
	    $.get(myapp.apibase,{"cmd":"user","act":"login","usr":usr,"pwd":pwd},function(data){ 
	    	//console.log(data);
	    	data = JSON.parse(data);
	    	//checkLogin();
	    	if(data.STATUS=="[E]LoginFailed"){
	    		toastr.error('用户名或密码错误!');
	    	}
	    	if(data.STATUS=="[E]NoUserPassword"){
	    		toastr.error('请输入用户名密码!');
	    	}
	    	if(data.STATUS=="[I]OK"){
                $("#loginModal").modal("hide");
	    		checkLogin();
	    	}
	    });
}

//弹出登录框
function poplogin(event){
//修改弹出框位置
//	$("#loginModal").modal().css({
//                 "margin-top": function () {
//                     return  (200);
//                 }
//             });
	$('#loginModal').modal();
}
//弹出注册框
function popreg(event){
//修改弹出框位置
//	$("#regModal").modal().css({
//                 "margin-top": function () {
//                     return  (50);
//                 }
//             });
    recap();
	$('#regModal').modal();
}
//验证码图片加载失败
function capErr(){
    $.get(myapp.apibase,{"cmd":"user","act":"recap"},function(data){
            recap();
        }    
    );
}

function capErr2(){
    $.get(myapp.apibase,{"cmd":"user","act":"recap"},function(data){
            recap2();
        }    
    );
}
//提交注册请求
function reg(){
	var usr;
	var pwd;
	var pwd2;
	var txtcap;
	usr=$("#reg-user-name").val();
	pwd=$("#reg-pass-word").val();
	pwd2=$("#reg-pass-word2").val();
	if(pwd!=pwd2){
		alert("前后密码不一致!");
		return;
	}
	txtcap=$("#reg-cap").val();
	$("pass-word").attr("text","");
	    $.get(myapp.apibase,{"cmd":"user","act":"reg","usr":usr,"pwd":pwd,"cap":txtcap,},function(data){ 
	    	//console.log(data);
	    	data = JSON.parse(data);
	    	//checkLogin();
	    	if(data.STATUS=="[E]NoUserPassword"){
	    		toastr.error('密码为空!');
	    	}
	    	if(data.STATUS=="[E]NoUserName"){
	    		toastr.error('用户名为空!');
	    	}
	    	if(data.STATUS=="[E]CaptchaIncorrect"){
	    		toastr.error('验证码错误!');
	    	}
	    	if(data.STATUS=="[W]CaptchaRequired"){
	    		toastr.error('需要验证码!');
	    	}
	    	if(data.STATUS=="[E]UserAlreadyExists"){
	    		toastr.warning('用户已经存在，请尝试其他用户名!');
	    	}
	    	if(data.STATUS=="[I]OK"){
                $("#regModal").modal("hide");
	    		toastr.success('注册成功，您可以尝试登录!');
	    	}
	    });
	   
		
}

function recap(){
    $('#imgRegcap').attr("src",myapp.apibase + "?cmd=captcha&t=" + getRandom(999999));
}

function recap2(){
    $('#imgretakecap').attr("src",myapp.apibase + "?cmd=captcha&t=" + getRandom(999999));
}

function logout(){
    $.get(myapp.apibase,{"cmd":"user","act":"logout"},function(data){
        //console.log(data);
        checkLogin();
    });
}
//检查是否为移动端
function checkBrowser(){
	if(localStorage.getItem("nodetect")=="1"||window.location.hash=="#nodetect"){
		return;
	}
	if(/AppleWebKit.*Mobile/i.test(navigator.userAgent)
	|| /Android/i.test(navigator.userAgent)
	|| /BlackBerry/i.test(navigator.userAgent)
	|| /IEMobile/i.test(navigator.userAgent)
	|| (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
	    if(/iPad/i.test(navigator.userAgent)){
	        //alert("iPad平板");
	        window.location.href="m/sorry.html#iPad";
	    }else{
	        //alert("其他移动设备 ");
	        window.location.href="m/sorry.html";
	    }
	}else{
	    //alert("非移动设备");
	}
	
}
//针对IE9一下的用户进行检测跳转
function FuckInternetExplorer() {
        var browser = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
  if (version.length > 1) {
            var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
            if (trim_Version < 9) {
	        	window.location.href="m/sorry.html#IE";
                return false;
            }
        }
        //alert(true);
        return true;
    }

 //token相关，因为服务器负载问题暂时不考虑
function tk(act){
	if(act=="regen"){
	    $.get(myapp.apibase,{"cmd":"token","act":"regen"},function(data){
			
	    });
	}
}


function post_retake(){ //搬运按钮按下
	var smnum= $("#txtretake").val();
	var retakecap= $("#txtretakecap").val();
	    $.get(myapp.apibase,{"cmd":"retake","id":smnum,"cap":retakecap},function(data){
	    	data = JSON.parse(data);
	    	console.log(data);
	    	if(data.STATUS=="[E]FliterREFUSED:MMD -> Not a original song detected"){
	    		toastr.error("歌曲范围只能是V家原创或者翻唱歌曲哦");
	    	}
	    	if(data.STATUS=="[E]IsFinished"){
	    		toastr.info("嘿，这首曲子有人搬运过了的说");	
	    	}
	    	if(data.STATUS=="[I]RequestAdded"){
	    		toastr.sucess("成功！搬运请求已经添加到了后台");	
	    	}
	    	
	    });
}
