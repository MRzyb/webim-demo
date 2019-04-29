import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/scss/common.scss'
import WebIM from './config/WebIM'

Vue.use(ElementUI)
console.log(WebIM, 'WebIMs')

Vue.config.productionTip = false
WebIM.conn.listen({
  // 连接成功回调
  onOpened: msg => {
    // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
    // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
    // 则无需调用conn.setPresence();
    // 获取一下好友
    store.dispatch('getRoster')
  },
  // 连接关闭回调
  onClosed: msg => {},
  //收到文本消息
  onTextMessage: message => {

    // let { from, to, type } = message
    // let username = store.state.username
    // let bySelf = from === username
    // let chatId = bySelf || type !== 'chat' ? to : from

    store.commit('addMessage', {message, bodyType:'txt'})
  },
  //收到表情消息
  onEmojiMessage: message => {
    console.log('onEmojiMessage', message)
  },
  //收到图片消息
  onPictureMessage: message => {
    store.commit('addMessage', {message, bodyType:'img'})
  },
  //收到命令消息
  onCmdMessage: message => {},
  //收到音频消息
  onAudioMessage: message => {
    console.log('收到音频消息', message)
  },
  //收到位置消息
  onLocationMessage: message => {},
  //收到文件消息
  onFileMessage: message => {},
  //收到视频消息
  onVideoMessage: message => {
    console.log('收到视频消息', message)
  },
  //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onPresence: message => {},
  //处理好友申请
  onRoster: message => {},
  //处理群组邀请
  onInviteMessage: message => {},
  //本机网络连接成功
  onOnline: () => {},
  //本机网络掉线
  onOffline: () => {},
  //失败回调
  onError: message => {},
  //黑名单变动
  // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
  onBlacklistUpdate: list => {
    console.log(list)
  },
  //收到消息送达服务器回执
  onReceivedMessage: message => {},
  //收到消息送达客户端回执
  onDeliveredMessage: message => {},
  //收到消息已读回执
  onReadMessage: message => {},
  //创建群组成功回执（需调用createGroupNew）
  onCreateGroup: message => {},
  //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
  onMutedMessage: message => {}
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


