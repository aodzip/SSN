loadjs("js/jquery.min.js");
loadjs("js/bootstrap.js");
loadjs("js/slimscroll/jquery.slimscroll.min.js");
loadjs("js/jPlayer/jquery.jplayer2.9.1.js");
loadjs("js/jPlayer/add-on/jplayer.playlist.min.js");
loadjs("js/app.js");
loadjs("js/app.plugin.js");

loadjs("myvendor/toastr/toastr.js");
loadjs("myvendor/kkpager/kkpager.js");
loadjs("myvendor/fly/jquery.fly.js");
loadjs("myvendor/director/director.js");
loadjs("myvendor/sweet-alert/sweet-alert.min.js");
loadjs("myvendor/qrcode/qrcode.js");
loadjs("myvendor/qrcode/jquery.qrcode.js");
loadjs("myvendor/react/react.js");
loadjs("myvendor/react/react-dom.js");
loadjs("myvendor/react/browser.min.js");

//jsx
loadjsx("myjs/react/class/retakeDiv.js");
loadjs("myjs/myfunction.js");
loadjs("myjs/myjpcoder.js");
loadjs("myjs/myapp.js");
loadjs("myjs/myleftnav.js");
loadjs("myjs/mymusics.js");
loadjs("myjs/myplayer.js");
loadjs("myjs/mysearch.js");
loadjs("myjs/mylogin.js");
loadjs("myjs/react/globals.js");

function loadjs(src){
    document.write("<script src="+src+"></script>");
}
function loadjsx(src){
    document.write("<script type='text/babel' src="+src+"></script>");
}