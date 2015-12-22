/*
    desc:定义自定义js脚本的全局变量
*/
var myapp = {};
$(function(){
    //api基础地址
    myapp.apibase = "http://125.211.202.141:8023/";
    //文件基础地址
    myapp.filebase = "http://125.211.202.141:8023/?cmd=file&name=";
    //控制列表的排序,数量
    myapp.by = "download";//download
    myapp.order = "down";//up
    myapp.item = 20;//10-20
    myapp.$mycontent = $("#mycontent .listcontent");
    //
    myapp.isfirst = true;
    //
    myapp.jpcoder = new Jpcoder("-","jps","jpe");
    //全局事件
    $(function(){
        //第一次对url进行一次uri解码,日文编码,如果有日文的话
        var href = window.location.href;
        //if(isff()){
        href = decodeURI(href);
        //}
        if(myapp.jpcoder.hasjp(href)){
            window.location.replace(myapp.jpcoder.encodejp(href));
        }
        //调整布局
          var $myvbox = $("#myvbox");
          var $mycontent = $("#mycontent");
          var $myplayer = $("#myplayer .myplayer");
          var $myright = $("#mycontent .right");
          var $divload = $("#divload");
          resize();
          window.onresize= resize;
          function resize(){
              console.log("resize");
              //修正在时使用的calc（css减法）,减法导致元素本身没有大小
              //无法正常继承给自元素
              $mycontent.height($myvbox.height()-120);
              $myplayer.width($myvbox.width()-200);
              $myright.width($myvbox.width()-200);
              $myright.height($mycontent.height());
              //动态计算歌曲排版
              var count = Math.floor(($myright.width()-220)/260);
              var leave = $myright.width() - count*280;
              var $mycontentWrap = $("#mycontent .listcontent .wrap");
              if($mycontentWrap[0]){
                 $mycontentWrap.css({"margin-left":"auto","margin-right":"auto","width":count*280}); 
              }
          }
    });
    //路由配置
    var router = Router({
        //帮助湿湿娘
        "/help":help,
        //留言板
        "/msgboard":msgboard,
        //列表全部曲目
        "/list/all/:page":all,
        //列表,tag筛选
        "/list/tag/:keyword/:page":tag,
        //列表,author筛选
        "/list/author/:keyword/:page":author,
        //列表，个人收藏列表
        "/list/myfav/:page":myfav,
        //列表,个人最近播放
        "/list/myrecent":myrecent,
        //单曲页面
        "/song/:sm":song,
        //个人设置，长期认证设置
        "/setting/token":token,
        //搬运功能
        "/retake":retake
        //,
        //节日祝福
        //节日祝福,中秋节
        //"/festival/moonDay":moonDay
    });
    //设置未匹配到路由时的回调函数
    router.configure({"notfound":notfound,"before":before});
    //设置初始路由
    router.init("/list/all/1");
    function notfound(){
        console.log("[miku:404]");
        loadpage2(myapp.$mycontent,"mypage/404.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
    function before(){
        console.log("[miku:before]");
    }
    function help(){
        console.log("[miku:帮助湿湿娘]");
        loadpage2(myapp.$mycontent,"mypage/help.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
    function msgboard(){
        console.log("[miku:留言板]");
        loadpage2(myapp.$mycontent,"mypage/msgboard.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
    function all(page){
        console.log("[miku:全部歌曲,page="+page+",by="+myapp.by+",order="+myapp.order+",item="+myapp.item+"]"); 
        loadpage2(myapp.$mycontent,"mypage/list.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
            loadsongpage({"cmd":"list","page":page,"item":myapp.item,
                       "by":myapp.by,"order":myapp.order});
        });
    }
    function tag(keyword,page){
//      keyword = decodeURI(keyword);
        keyword = myapp.jpcoder.getjp(myapp.jpcoder.decodejp(keyword));
        console.log("[miku:标签分类,keyword="+keyword+",page="+page+",by="+myapp.by+",order="+myapp.order+",item="+myapp.item+"]");
        loadpage2(myapp.$mycontent,"mypage/list.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
            loadsongpage({"cmd":"list","range":"tag","keyword":keyword,"page":page,"item":myapp.item,
                       "by":myapp.by,"order":myapp.order});
        });
    }
    function author(keyword,page){
        keyword = myapp.jpcoder.getjp(myapp.jpcoder.decodejp(keyword));
        console.log("[miku:up主分类,keyword="+keyword+",page="+page+",by="+myapp.by+",order="+myapp.order+",item="+myapp.item+"]");
        loadpage2(myapp.$mycontent,"mypage/list.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
            loadsongpage({"cmd":"list","range":"author","keyword":keyword,"page":page,"item":myapp.item,
                       "by":myapp.by,"order":myapp.order});
        });
    }
    function myfav(page){
        console.log("[miku:个人收藏,page="+page+"]");
        loadpage2(myapp.$mycontent,"mypage/list.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
            loadsongpage({"cmd":"favorite","act":"list","item":myapp.item,"page":page});
        });
    }
    function myrecent(){
        console.log("[miku:个人最近播放]");
        loadpage2(myapp.$mycontent,"mypage/list.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
            loadsongpage({"cmd":"history"});
        });
    }
    function song(sm){
        console.log("[miku:单曲页面,sm="+sm+"]");
        loadpage2(myapp.$mycontent,"mypage/song.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
    function token(){
        console.log("[ms:token设置]");
        loadpage2(myapp.$mycontent,"mypage/token.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
    function retake(){
        console.log("[ms:搬运页面]");
        loadpage2(myapp.$mycontent,"mypage/react-retake.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
    function moonDay(){
        console.log("[miku:湿湿娘祝福大家中秋快乐]");
        loadpage2(myapp.$mycontent,"mypage/moonDay.html",function(div,data){
            $(div).text("");
            $(div).append($(data));
        });
    }
});