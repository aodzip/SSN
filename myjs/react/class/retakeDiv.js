window.RetakeDiv = React.createClass({
    getInitialState: function() {
        return {sm:"",ic:"",info:"赶紧尝试一下搬运吧！","isLoading":false,"isError":false};
    },
    componentDidMount:function(){
        //模拟点击验证码
        this.refs.icImg.click();
    },
    render: function() {
        var sm = this.state.sm;
        var ic = this.state.ic;
        var info = this.state.info;
        var isLoading = this.state.isLoading;
        var isError = this.state.isError;
        
          return (
            <div className="retakeDiv container">
                <h1 className="page-header">搬运</h1>
                <div className="alert alert-info">
                    <h2>如何搬运nico上的歌曲？</h2>
                    <ol>
                        <li>在nico上找到你喜欢的歌曲（V家限定），记录sm号（看nico的链接）。</li>
                        <li>把sm号输入下面的文本框中，输入正确的验证码。</li>
                        <li>点击搬运，即可提交搬运请求。</li>
                        <li>耐心等待系统返回结果哦。</li>
                        <li>成功的话，就可以在搬运进度页看到搬运情况啦。</li>
                        <li>失败的话，失败的原因有很多，认真修正之后，再尝试下。</li>
                        <li>一定要注意，有版权纠纷的资源一定不要搬运，我们也不想招惹是非哈。</li>
                    </ol>
                </div>
                <div className={"isLoading-"+isLoading+" "+"isError-"+isError}>
                    <form className="">
                        <div className="form-group">
                            <label htmlFor="smInput">输入番号(如sm7241361)</label>
                            <input ref="smInput" id="smInput" value={sm} onChange={this.handleSmInputChange} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="icInput">输入验证码</label>
                           
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                <input ref="icInput" id="icInput" value={ic} onChange={this.handleIcInputChange} className="form-control"/>                      </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                <img className="img-responsive" ref="icImg" onClick={this.handleIcImgChange} src="" alt=""/>
                                </div>
                            </div>
                        </div>
                        <button ref="retakeBtn" className="btn btn-primary" type="button" onClick={this.handleRetakeBtnClick}>搬运</button>
                    </form>
                    <br/>
                    <div className="alert alert-warning"><h3>{info}</h3></div>
                </div>
                <div><a href={globals.apibase+"/proclist.php"} target="_blank">查看搬运进度</a></div>
            </div>
          );
    },
    handleSmInputChange:function(event){
      this.setState({sm: event.target.value});
    },
    handleIcImgChange:function(event){
        var ic = event.target;
        ic.src = globals.apibase+"?cmd=captcha&t="+new Date().getTime();
    },
    handleIcInputChange:function(event){
        this.setState({ic: event.target.value});
    },
    handleRetakeBtnClick:function(){
        var sm = this.refs.smInput.value;
        var ic = this.refs.icInput.value;
        var retakeBtn = this.refs.retakeBtn;
        console.log(retakeBtn);
        var promise = $.getJSON(globals.apibase,{"cmd":"retake","id":sm,"cap":ic});
        this.setState({isLoading:true});
        this.setState({info:"请稍等，正在提交搬运请求...",isError:false});
        $(retakeBtn).attr("disabled","true");
        //注意作用域的变化
        var self = this;
        promise.done(function(data){
            self.setState({isLoading:false,isError:false});
            $(retakeBtn).removeAttr("disabled");
            var status = data.STATUS;
            console.log(status);
            if(status == "[E]RequireLogin"){
                
                self.setState({info:"要登录才能搬运",isError:true});
                
            }else if(status == "[E]CaptchaError"){
                
                self.setState({info:"验证码错误",isError:true});
                
            }else if(status == "[E]IsFinished"){
                
                self.setState({info:"这首歌已经有人搬运过了，直接去听吧。",isError:true});
                
            }else if(status == "[E]FliterREFUSED:Not a Vocaloid-like request"){
                
                self.setState({info:"这个sm号对应的资源好像不是V家的。",isError:true});
                
            }else if(data.STATUS=="[E]FliterREFUSED:MMD -> Not a original song detected"){
                
                self.setState({info:"歌曲范围只能是V家原创或者翻唱歌曲哦。",isError:true});
                
	    	}else if(data.STATUS == "[E]IsProcessing"){
                
                self.setState({info:"这首歌正在搬运中，湿娘很努力了。",isError:true});
                
            }else if(data.STATUS == "[E]SyetemError(FailedtoDowloadThumbnail)"){
                
                self.setState({info:"湿娘刚才没找到缩略图，请你再试一次搬这个sm号的资源吧",isError:true});
                
            }else if(data.STATUS=="[I]RequestAdded"){
                
                self.setState({info:"成功！搬运请求已经添加到了后台",isError:false});
                
	    	}else{
                self.setState({info:status,isError:true});
            }
        });
        promise.fail(function(error){
            self.setState({isLoading:false,isError:true});
        });
    },
});