/*************************************************************
desc:湿湿娘react组件－歌曲列表                               
author:miku,1358583728@qq.com
depend:globals(全局变量，里面记录了湿娘全局API与文件地址)
update:
    2015.12.22,miku
        1.创建组件
*************************************************************/
//注意作用域（使用全局），注意命名（大写开头）
//JSX浏览器编译之后会形成闭包
window.SongsList = React.createClass({
  //设定初始化状态，这些状态会随着用户交互而改变
  getInitialState: function() {
    return {
      loading: true,
      error: null,
      data: null
    };
  },
  //已经真实地插入dom后（did）调用
  componentDidMount() {
    //根据promise状态改变state
    //promise是props提供的，注意与state的差别
    //在我的demo中，对象由jquery提供
    this.props.promise.then(
      //state改变，触发重新渲染
      value => this.setState({loading: false, data: value}),
      error => this.setState({loading: false, error: error}));
  },
  render: function() {
    if (this.state.loading) {
      return (
          <div className="loading">
            <span>Loading...</span>
          </div>
      );
    }
    else if (this.state.error !== null) {
      return (
        <div className="error">
            <span>Error...</span>
        </div>
      );
    }
    else {
      var data = this.state.data;
      var songArray = new Array();
      for(var i=0;i<data.COUNTPERPAGE;i++){
        //console.log(data[i]);
        var song = data[i];
        songArray.push(song);
      }
      var songList = songArray.map(function (song) {
        return (
          <li key={song.ID}><a href={globals.filebase+song.ID+".mp3"}>{song.TITLE}</a></li>
        );
      });
      return (
        <div className="success">
          <ul>{songList}</ul>
        </div>
      );
    }
  }
});