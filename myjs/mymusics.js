$(function(){
    //歌曲链接的点击事件
    //使用事件代理重写
    $("#mycontent .listcontent").click(function(event){
          var $target = $(event.target);
          var $parent = $target.parent();
          //点击歌曲名也能播放（在缩略图失效的情况下使用）
          if($target.hasClass("songName")){
              var need = $target.parents(".musicitem").find(".mysong");
              var $this = need;
              var href = $this.attr("data-href");
              var title = $this.attr("title");
              addToMyPlaylist(title,href,true);
              //打开播放列表
              $("#playlist").addClass("open");
              //本地保存播放列表
              sp();
              return false;
          }
          //点击图片链接，添加当前歌曲到播放列表并且播放
          if($parent.hasClass("mysong")){
              var $this = $parent;
              var href = $this.attr("data-href");
              var title = $this.attr("title");
              addToMyPlaylist(title,href,true);
              //打开播放列表
              $("#playlist").addClass("open");
              //本地保存播放列表
              sp();
              return false;
          }
          //点击添加到列表按钮，添加当前歌曲到播放列表
          if($parent.hasClass("addList")){
          	  var imgurl=$parent.siblings(".picture").children("a").children("img").attr("src");
              var $a = $parent.siblings(".picture").children("a");
              var $this = $a;
              var href = $this.attr("data-href");
              var title = $this.attr("title");
              if(addToMyPlaylist(title,href,false)){
                 fly(event,imgurl);
              }
              //打开播放列表
              $("#playlist").addClass("open");
              //本地保存播放列表
              sp();
              return false;
          }
          //点击添加到收藏列表按钮，done
          if($parent.hasClass("addFav")){
              var isfav = $parent.attr("data-isfav");
              //未登录
              if(isfav==2){
                toastr.clear();
                toastr.info('请您登录来使用更多功能.','尚未登录');
                return false;
              }
              //在最近播放列表中有bug
              if(isfav=="undefined"){
                return false;
              }
              var $a = $parent.siblings(".picture").children("a");
              var $this = $a;
              var href = $this.attr("data-href");
              var title = $this.attr("title");
              console.log("添加:",title,href,"到收藏列表");
              if($this.attr("alt")=="0"){
              	addFav(href,$this,$parent);	  	
              }else{
              	delFav(href,$this,$parent);	 
              }
               return false;
          }
          //点击单曲页面
          if($parent.hasClass("toSong")){
              var $a = $parent.siblings(".picture").children("a");
              var href = $a.attr("data-href");
              var smMp3 = getQueryString("name",href).replace(".mp3","");;
              //模拟点击
              var $tempA = $("<a href='#/song/"+smMp3+"'></a>");
              $tempA[0].click();
              return false;
          }
          return true;
    });
});
function addToMyPlaylist(title,href,isplay){
      //当前播放列表去重复
      for(i in myPlaylist.playlist){
          var item = myPlaylist.playlist[i];
          //找到重复
          if(item.mp3 == href || item.title == title){
              //播放列表中已经存在的这首歌
              if(isplay){
                 //注意for in 语法的key是字符串
                 //会影响jplist
                 myPlaylist.play(parseInt(i));
                 return true;
              }else{
                //swal("这首歌已经在播放列表中了");
                toastr.clear();
                toastr.warning("这首歌已经在播放列表中了");
                return false;
              }
          }
      }
      //向jplayer播放列表中添加新歌曲
      myPlaylist.add({
            title:title,
            artist:"",
            mp3:href,
            poster:""
      });
      if(isplay){
        myPlaylist.play($("#jp-playlist ul").length-1);
      }
    return true;
}
function addFav(href,$this,$parent){
    var sm=getQueryString("name",href).replace(".mp3","");
    parmobj={"cmd":"favorite","act":"add","id":sm};
    var ret= $.get(myapp.apibase,parmobj,function(data){
        data = JSON.parse(data);
        if(data.STATUS=="[I]OK"){
            toastr.success("添加成功");
             $this.attr("alt","1");
             $parent.find(".addFavimg").attr("src","myimages/addFav-1.png");  
        }
        if(data.STATUS=="[E]AlreadyExists"){
            toastr.info("收藏夹已经存在该曲目");
        }
     });

}
function delFav(href,$this,$parent){
    var sm=getQueryString("name",href).replace(".mp3","");
    parmobj={"cmd":"favorite","act":"del","id":sm};
    $.get(myapp.apibase,parmobj,function(data){
        data = JSON.parse(data);
        if(data.STATUS=="[I]OK"){
            toastr.success("删除成功");
             $this.attr("alt","0");
             $parent.find(".addFavimg").attr("src","myimages/addFav-0.png");  

        }

     });
}
/*
    desc:加载歌曲列表的函数
    parms:api参数对象例如{"cmd":"list","page":1}
          注意默认配置item = 20
    author:miku,ms
    update:
          date:2015-8-12
          author:miku
          提取出ajax请求配置参数
    update:
          date:2015-8-12
          author:ms
           修正kkpager页面总数不刷新问题
	update:
          date:2015-8-12
          author:aodzip
          API增加总数直接输出成员，更换原来的乘法计算
		  更换循环判定，由真实页面包含数代替GET中请求的数目，避免null项的出现
		  修正循环逻辑，既然i从0开始，那么就应该在COUNTPERPAGE - 1 处结束循环
		  //=====>上面这条是屁话，是数据库出错了
*/
function loadsongpage(parmobj){
    //避免重复刷新
    if(myapp.isfirst){
        return false;
    }
    var $songsUl = $("#mycontent .listcontent ul");
    $("#kkpager").hide();
    $songsUl.text("");
    $songsUl.append('');
    $("#divload").stop();
    $("#divload").fadeIn(400);
    console.log(parmobj);
    $.get(myapp.apibase,parmobj,function(data){
        $("#divload").fadeOut(500);
        $songsUl.text("");
        //2015-9-7，收藏列表json有问题
        //console.log(data);
        data = JSON.parse(data);
        console.log(data);
		$li=getListHtml(data,myapp.mode);
        $songsUl.append($li);
        var $songdiv = $li.find(".songdiv");
        addSongNameHoverEvent($songdiv);
        //生成分页控件  
        kkpager.generPageHtml({
            isGoPage:false,
            pno :data.CURRENTPAGE,
            mode : 'link', //设置为click模式
            //总页码
            total : data.TOTALPAGE,  
            //总数据条数  
            totalRecords :data.TOTALAMOUNT,
            hrefFormer:window.location.href,
            getLink:function(n){
                var index = this.hrefFormer.lastIndexOf("/");
                var tempHrefFormer = this.hrefFormer.substring(0,index+1);
                return tempHrefFormer+n;
            }
        },true);
        $("#kkpager").show();
        window.onresize();
});
function getListHtml(data,mode){
      var $li;
      var htmlcode="";
      for(var i=0;i<data.COUNTPERPAGE;i++){
        var item = data[i];
        var title = item.TITLE;
        var id = item.ID;
        htmlcode+= ('<div class="musicitem">\
        <div class="mask' + id + ' loadmask"> <img class="maskimg" src="myvendor/svg-loaders/bars.svg" width="50" alt=""> </div>\
     <div class="picture">\
        <a  href="" alt="' + item.ISFAV +'" class="mysong" title="' + noSpace(item.TITLE) + '" data-href="'+myapp.filebase+id+'.mp3"><img class="songpic" onload="javascript:hideload(\''+ id +'\');" src="'+myapp.filebase+id+ ".jpg" +  '" ></a>\
     </div>	\
     <div class="songdiv">\
        <span class="songName">'+ noSpace(item.TITLE) + '</span>\
     </div>\
     <div class="artistdiv">\
        <span class="artistName">'+ noSpace(item.AUTHOR)  + '</span>\
     </div> \
     <div class="toSong">\
        <img class="addFavimg" src="myimages/next.png">\
     </div>\
     <div class="addFav '+ishidden(item.ISFAV)+'" data-isfav='+item.ISFAV+'>\
        <img class="addFavimg" src="myimages/addFav-' + item.ISFAV +'.png">\
     </div>\
     <div class="addList fly">\
        <img src="myimages/addList.png">\
    </div>\
     </div>');
        }
      $li=$(htmlcode);
      return $li;
    }
    function ishidden(isfav){
        if(!isfav){
            return "hidden";
        }
        else{
            return "";
        }
    }
};
function hideload(sm){
    $(".mask" + sm).fadeOut();
};
function fly(event,imgurl) {
    var offset = $('.end').offset(), flyer = $('<img class="flyer" src="'+ imgurl + '"/>');
    flyer.fly({
        start: {
            left: event.pageX,
            top: event.pageY
        },
        end: {
            left: offset.left,
            top: offset.top,
            width: 40,
            height: 32
    		},
        //autoPlay: false, //是否直接运动,默认true
    	speed: 1.5, //越大越快，默认1.2
    	vertex_Rtop:100,  //运动轨迹最高点top值，默认20
    	onEnd: function(){
    		$('.flyer').remove();
        }
    });
    
}
/**
    desc:添加歌曲名字的滚动特效
    author:MIKUScallion@hotmail.com
    date:2015年9月26日
*/
function addSongNameHoverEvent($songdiv){
    var wrapWidth = 260;
    var time = 1500;
    var orgleft = 9;
    $songdiv.hover(function(event){
        var $this = $(this);
        var $span = $this.children("span");
        var moveleft = -($span.width()-wrapWidth);
        if(moveleft>=orgleft){
            return false;
        }
        $this.stop();
        $this.animate({"left":moveleft},time);
    },function(event){
        var $this = $(this);
        $this.stop();
        $this.animate({"left":orgleft},time);
    });
}

