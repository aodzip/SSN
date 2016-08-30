webpackJsonp([2,0],[function(t,e,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}o(40);var s=o(46),n=i(s),a=o(47),c=i(a),u=o(54),d=i(u),r=o(16),l=i(r);n["default"].use(c["default"]),new n["default"]({el:"body",components:{App:d["default"]},store:new c["default"].Store(l["default"])})},,,,,function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.API_SHI_WILDDOG="shi-shi.wilddogio.com"},,,,,,,,,,,function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o={user:{isLogin:!1},mod:{beActiveMod:"shiLogin"}},i={USER_TO_LOGIN:function(t){t.user.isLogin=!0},USER_TO_LOGOUT:function(t){t.user.isLogin=!1},MOD_TO_ACTIVE_MOD:function(t,e){t.mod.beActiveMod=e}},s={state:o,mutations:i};e["default"]=s},function(t,e,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var s=o(6),n=i(s),a=o(57),c=i(a),u=o(56),d=i(u),r=o(55),l=i(r),v=o(5),f=new n["default"](v.API_SHI_WILDDOG),p=window.Materialize;e["default"]={vuex:{getters:{modBeActiveMod:function(t){return t.mod.beActiveMod}},actions:{modToActiveMod:function(t,e){var o=t.dispatch;t.state;o("MOD_TO_ACTIVE_MOD",e)},userToLogin:function(t){var e=t.dispatch;t.state;e("USER_TO_LOGIN")}}},data:function(){return{beActiveMod:"shiLogin"}},ready:function(){function t(t){t?(console.log("User "+t.uid+" is logged in with "+t.provider),e.userToLogin(),p.toast("欢迎回来",3e3),e.modToActiveMod("shiHome")):(console.log("User is logged out"),p.toast("需要登录",3e3),e.modToActiveMod("shiLogin"))}var e=this;f.onAuth(t)},methods:{isActiveMod:function(t){return this.modBeActiveMod===t?"active":""}},components:{ShiNavbar:c["default"],ShiLogin:d["default"],ShiHome:l["default"]}}},function(t,e){"use strict"},function(t,e,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var s=o(6),n=i(s),a=o(5),c=window.Materialize,u=new n["default"](a.API_SHI_WILDDOG);e["default"]={vuex:{getters:{userIsLogin:function(t){return t.user.isLogin}},actions:{userToLogin:function(t){var e=t.dispatch;t.state;e("USER_TO_LOGIN")},modToActiveMod:function(t,e){var o=t.dispatch;t.state;o("MOD_TO_ACTIVE_MOD",e)}}},data:function(){return{email:"",password:""}},methods:{toLogin:function(){u.authWithPassword({email:this.email,password:this.password},this._authHandler)},_authHandler:function(t,e){t?(console.log("Login Failed!",t),c.toast("登录失败",1e3)):(console.log("Authenticated successfully with payload:",e),this.userToLogin())}}}},function(t,e,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var s=o(6),n=i(s),a=o(5),c=window.$,u=new n["default"](a.API_SHI_WILDDOG);e["default"]={vuex:{getters:{modBeActiveMod:function(t){return t.mod.beActiveMod},userIsLogin:function(t){return t.user.isLogin}},actions:{modToActiveMod:function(t,e){var o=t.dispatch;t.state;o("MOD_TO_ACTIVE_MOD",e)},userToLogout:function(t){var e=t.dispatch;t.state;u.unauth(),e("USER_TO_LOGOUT")}}},computed:{isHideMenu:function(){return!("shiLogin"===this.modBeActiveMod)},isHideLogin:function(){return!this.userIsLogin}},methods:{isActiveMod:function(t){return this.modBeActiveMod===t?"active":""},toActiveMod:function(t){this.modToActiveMod(t)},toLogout:function(){this.userToLogout()}},ready:function(){c(function(){c(".button-collapse").sideNav({closeOnClick:!0})})}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e){},function(t,e){t.exports=" <shi-navbar :data-be-active-mod.sync=beActiveMod></shi-navbar> <shi-login v-if=\"isActiveMod('shiLogin')\"></shi-login> <shi-home v-if=\"isActiveMod('shiHome')\"></shi-home> "},function(t,e){t.exports=" <h2>首页</h2> "},function(t,e){t.exports=' <div class=shi-login> <div class=row> <form class="col s12"> <div class=row> <div class="input-field col s12"> <input v-model=email id=email type=email class=validate> <label for=email>邮件</label> </div> </div> <div class=row> <div class="input-field col s12"> <input v-model=password id=password type=password class=validate> <label for=password>密码</label> </div> </div> <div class=row> <div class="col s12"> <button @click=toLogin class="btn waves-effect waves-light" type=button>登录 <i class="material-icons right">send</i> </button> <button class="btn waves-effect waves-light" type=reset>重置</button> </div> </div> </form> </div> </div> '},function(t,e){t.exports=' <div class=shi-navbar> <nav> <div class=nav-wrapper> <a href=javascript:; class=brand-logo>湿湿娘</a> <a v-show=isHideMenu href=javascript:; data-activates=mobile-menu class=button-collapse><i class=material-icons>menu</i></a> <ul v-show=isHideMenu class="right hide-on-med-and-down"> <li :class="isActiveMod(\'shiHome\')"><a href=javascript:; @click="toActiveMod(\'shiHome\')">主页</a></li> <li v-show=isHideLogin :class="isActiveMod(\'shiLogin\')"><a href=javascript:; @click="toActiveMod(\'shiLogin\')">登录</a></li> <li><a href=javascript:; @click=toLogout()>退出</a></li> </ul> <ul v-show=isHideMenu class=side-nav id=mobile-menu> <li :class="isActiveMod(\'shiHome\')"><a href=javascript:; @click="toActiveMod(\'shiHome\')">主页</a></li> <li v-show=isHideLogin :class="isActiveMod(\'shiLogin\')"><a href=javascript:; @click="toActiveMod(\'shiLogin\')">登录</a></li> <li><a href=javascript:; @click=toLogout()>退出</a></li> </ul> </div> </nav> </div> '},function(t,e,o){var i,s;o(49),i=o(17),s=o(50),t.exports=i||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)},function(t,e,o){var i,s;i=o(18),s=o(51),t.exports=i||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)},function(t,e,o){var i,s;i=o(19),s=o(52),t.exports=i||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)},function(t,e,o){var i,s;i=o(20),s=o(53),t.exports=i||{},t.exports.__esModule&&(t.exports=t.exports["default"]),s&&(("function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports).template=s)},function(t,e){}]);
//# sourceMappingURL=app.af6ad7cc68362c451356.js.map