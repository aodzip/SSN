$(function(){
    //侧边栏我的收藏点击事件
    //侧边栏我的最近播放点击事件
    $("#mycontent .left .myfav,#mycontent .left .myrecent").click(function(event){
        //1.获取链接信息
        var $this = $(this);
        //2.登录检测
        checkLogin2(function(){
            //2.1登录成功回调
            window.location.href = $this.attr("href");
            $this.closest(".nav").find("li").removeClass("active");
            $this.closest("li").addClass("active");
        });
        return false;
    });
    //侧边tag标签的点击事件
    $("#mycontent .left .taglink").click(function(event){
        console.log("[miku:jpcode转码]");
        var href = $(this).attr("href");
        window.location.href = myapp.jpcoder.encodejp(href);
        return false;
    });
});