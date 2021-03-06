// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

var conn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
});

conn.listen({
  onOpened: function ( message ) {          //连接成功回调
    var options = {
      success: function (resp) {
        console.log("Response: ", resp)
      },
      error: function (e){
      }
    };
    conn.getGroup(options);
      // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
      // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
      // 则无需调用conn.setPresence();
  },
  onClosed: function ( message ) {},         //连接关闭回调
  onTextMessage: function ( message ) {},    //收到文本消息
  onEmojiMessage: function ( message ) {},   //收到表情消息
  onPictureMessage: function ( message ) {}, //收到图片消息
  onCmdMessage: function ( message ) {},     //收到命令消息
  onAudioMessage: function ( message ) {},   //收到音频消息
  onLocationMessage: function ( message ) {},//收到位置消息
  onFileMessage: function ( message ) {},    //收到文件消息
  onVideoMessage: function (message) {
      var node = document.getElementById('privateVideo');
      var option = {
          url: message.url,
          headers: {
            'Accept': 'audio/mp4'
          },
          onFileDownloadComplete: function (response) {
              var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
              node.src = objectURL;
          },
          onFileDownloadError: function () {
              console.log('File down load error.')
          }
      };
      WebIM.utils.download.call(conn, option);
  },   //收到视频消息
  onPresence: function ( message ) {},       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onRoster: function ( message ) {},         //处理好友申请
  onInviteMessage: function ( message ) {},  //处理群组邀请
  onOnline: function () {},                  //本机网络连接成功
  onOffline: function () {},                 //本机网络掉线
  onError: function ( message ) { //失败回调
    console.log(message)
  },
  onBlacklistUpdate: function (list) {       //黑名单变动
      // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
      console.log(list);
  },
  onReceivedMessage: function(message){},    //收到消息送达服务器回执
  onDeliveredMessage: function(message){},   //收到消息送达客户端回执
  onReadMessage: function(message){},        //收到消息已读回执
  onCreateGroup: function(message){},        //创建群组成功回执（需调用createGroupNew）
  onMutedMessage: function(message){}        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

var username = "chidalu";
var password = "888888";
var encryptUsername = btoa(username);
    encryptUsername = encryptUsername.replace(/=*$/g, "");

var options = {
  apiUrl: WebIM.config.apiURL,
  user: username,
  pwd: password,
  appKey: WebIM.config.appkey,
  success: function (token) {
      var token = token.access_token;
      WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);
  },
  error: function(e){
    console.log(e)
  }
};
conn.open(options);




// var options = {
//   username: 'username',
//   password: 'password',
//   nickname: 'nickname',
//   appKey: WebIM.config.appkey,
//   success: function () { },
//   error: function () { },
//   apiUrl: WebIM.config.apiURL
// };
// conn.registerUser(options);
