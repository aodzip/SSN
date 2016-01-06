#!/usr/bin/env node
var fs = require("fs");
var request = require('request');
var shell = require("shelljs");
//周刊配置文件
var zkno = "001";
var zktitle = "周刊"+zkno;
var smArray = ["sm27893177","sm16492591","sm27895303","sm27892350"];

var api = "http://125.211.202.141:8023";

//模版头文件
var mdHead = 
"\
---\n\
layout: default\n\
title: "+zktitle+"\n\
---\n\
";

var containerDiv = "<div class='container'>";
var _4uDivHtmlArray = new Array();
for(var i=0;i<smArray.length;i++){
    var rowDiv = "<div class='row'>";
    var sm = smArray[i];
    request(api+"/?cmd=query&id="+sm, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var _4uDivHtml = make4uDivHtml(data.ID,data.TITLE,data.AUTHOR);
            _4uDivHtmlArray.push(_4uDivHtml);
            //console.log(data.ID,data.TITLE,data.AUTHOR);
        }
    });
}
var loadTimer = setInterval(function(){
    console.log(_4uDivHtmlArray.length,smArray.length);
    if(_4uDivHtmlArray.length == smArray.length){
        clearInterval(loadTimer);
        onLoaddone();
    }
},1000);
function onLoaddone(){
    var rowDiv = "<div class='row'>";
    for(var i= 0;i<_4uDivHtmlArray.length;i++){
        var _4uDivHtml = _4uDivHtmlArray[i];
        rowDiv = rowDiv + _4uDivHtml;
        if((i+1)%3 == 0){
            rowDiv = rowDiv + "</div>";
            containerDiv = containerDiv +rowDiv;
            rowDiv = "<div class='row'>";
        }
    }
    if(!_4uDivHtmlArray.length%3 == 0){
        //console.log(rowDiv);
        rowDiv = rowDiv + "</div>";
        containerDiv = containerDiv +rowDiv;  
    }
    containerDiv = containerDiv +"</div>";
    //输出到文件
    var filename = zkno+".html";
    fs.writeFileSync(filename,mdHead+containerDiv);
    //重新编译项目
    shell.exec("jekyll build");
    console.log("done");
}



//
function make4uDivHtml(sm,title,author){
    var filebase = "http://125.211.202.141:8023/?cmd=file&name=";
    var pvurl = filebase+sm+".mp4";
    var imgurl = filebase+sm+".jpg";
    
    var _4uDivHtml =
    "<div class='4u'>\
        <article class='box box-style2'>\
                <a href='"+pvurl+"' class='image image-full'>\
                    <img src='"+imgurl+"' alt=''>\
                </a>\
                <h3><a href='"+pvurl+"'>"+title+"</a></h3>\
                <p>"+author+"</p>\
            </article>\
        </div>\
    ";
    return _4uDivHtml;
}