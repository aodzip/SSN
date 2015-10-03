$(function(){
    var timespace = 500;
    var lasttime = new Date().getTime();
    var $keywordInput = $("#myheader .search input");
    var $rangeSelect = $("#myheader .search .rangeSelect");
    var $searchForm = $("#myheader .search");
    var $searchResult = $("#myheader .search .searchResult");
    var $searchResultContentLG = $("#myheader .search .searchResult .content .list-group");
    //点击myvbox内部任何地方，即可关闭搜索框＼（○＾ω＾○）／
    $("#myvbox").click(function(){
        $searchResult.hide();
    });
    //搜索表单提交事件，显示搜索结果框，清空上次搜索结果，获取搜索范围，搜索关键字
    //进行搜索哦o(≧∇≦o)(o≧∇≦)o
    $searchForm.submit(function(){
        $searchResult.show();
        $searchResultContentLG.text("");
        var tag = $rangeSelect.val();
        var keyword = $keywordInput.val();
        dosearch(tag,keyword);
        return false;
    });
    //尝试进行监听键盘输入搜索，效果不好哦(。┰ω┰。)
//    $keywordInput.on("keyup",function(event){
//        $searchResult.show();
//        $searchResultContent.text("");
//        var currentTime = new Date().getTime();
//        if(currentTime - lasttime > timespace){
//            lasttime = currentTime;
//            //done
//            var keyword = $keywordInput.val();
//            dosearch("tag",keyword);
//        }
//    });
    //搜索获得关键词的主方法
    //参数：range（搜索范围），keyword（搜索关键字）
    //搜索得到的标准化关键子会插入到一个列表中，点击列表项就可以进行显示结果了ヾ(*Ő౪Ő*)
    function dosearch(range,keyword){
        $.get(myapp.apibase,{"cmd":"search","range":range,"keyword":keyword},function(data){
            if(!data){
                return false;
            }
            data = JSON.parse(data);
            if(!data.COUNT){
                return false;
            }
            var range = data.RANGE.toLowerCase();
            for(var i=0;i<data.COUNT;i++){
                var item = data[i];
                var href = "#/list/"+range+"/jps"+noSpace(item.TITLE)+"jpe/1";
                var $a = $("<a class='taglink media list-group-item'\
                            href="+href+">"+noSpace(item.TITLE)+"</a>");
                $searchResultContentLG.append($a);
                $a.click(function(event){
                    console.log("[miku:jpcode转码]");
                    var href = $(this).attr("href");
                    window.location.href = myapp.jpcoder.encodejp(href);
                    return false;
                });
            }   
        });
    }
});