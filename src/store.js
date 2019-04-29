import Vue from 'vue'
import Vuex from 'vuex'
import WebIM from './config/WebIM'
import { parseFromServer, parseFromLocal } from './config/msgFormat'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null,
    password: null,
    isLogin: false,
    hasToken: false,
    token: null,
    rouster: [], //好友列表
    message_list: []
  },
  mutations: {
    setLoginInfo(state, { username, password, token }) {
      state.username = username
      state.password = password
      state.token = token
      state.isLogin = true
      sessionStorage.setItem('username', username)
      sessionStorage.setItem('token', token)
    },
    // 存储好友列表
    setRoster(state, list) {
      state.rouster = list
    },
    addMessage(state, { message, bodyType }) {
      // 处理服务端接收来的数据，本地发送的时候数据已经被parseFromLocal处理,这样的话本地发送和接收来的数据格式就为一样的
      !message.status && (message = parseFromServer(message, bodyType))
      let username = state.username
      let from = message.from || username
      let bySelf = from === username
      let { status } = message
      var _message = {
        ...message,
        bySelf,
        status,
        from,
        time: +new Date()
      }
      state.message_list = [...state.message_list, _message]
    }
  },
  actions: {
    login({ commit }, { username, password, success, error }) {
      if (WebIM.conn.isOpened()) {
        WebIM.conn.close('logout')
      }
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: username.trim().toLowerCase(),
        pwd: password,
        appKey: WebIM.config.appkey,
        success: token => {
          commit('setLoginInfo', {
            username,
            password,
            token: token.access_token
          })
          success()
        },
        error: e => {
          error(e)
        }
      })
    },
    // 通过token登录
    loginByToken({ commit }, { username, token, success, error }) {
      if (WebIM.conn.isOpened()) {
        WebIM.conn.close('logout')
      }
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: username.trim().toLowerCase(),
        pwd: token,
        accessToken: token,
        appKey: WebIM.config.appkey,
        // there is no success callback when login by token
      })
      commit('setLoginInfo', {
        username,
        password: null,
        token
      })
    },

    register({ commit }, { username, password, nickname, success, error }) {
      var options = {
        username: username,
        password: password,
        nickname: nickname,
        appKey: WebIM.config.appkey,
        apiUrl: WebIM.config.apiURL,
        success: function() {
          console.log('注册成功')
          success()
        },
        error: function(e) {
          console.log('注册失败', e)
          error(e)
        }
      }
      WebIM.conn.registerUser(options)
    },

    // 获取联系人
    getRoster({ commit }) {
      WebIM.conn.getRoster({
        success: data => {
          console.log('获取联系人成功', data)
          commit('setRoster', data)
        },
        error: e => {
          console.log('获取联系人失败')
        }
      })
    },
    // 发送文本消息 群聊和单聊
    sendTextMessage({ commit }, { chatType, chatId, message }) {
      const pMessage = parseFromLocal(chatType, chatId, { msg: message }, 'txt')

      const id = WebIM.conn.getUniqueId() // 生成本地消息id
      const type = 'txt'
      var msgObj = new WebIM.message(type, id) // 创建文本消息

      const chatroom = chatType === 'chatroom'
      msgObj.set({
        msg: message,
        to: chatId, // 接收消息对象（用户id）
        roomType: chatroom,
        success: (id, serverMsgId) => {
          console.log('消息发送成功', id, serverMsgId)
        },
        fail: e => {
          console.log(e, '消息发送失败')
          // 失败的处理
        }
      })
      if (chatType === 'groupchat' || chatType === 'chatroom') {
        msgObj.setGroup('groupchat') // 群聊类型
      }
      WebIM.conn.send(msgObj.body)

      console.log('zzz', msgObj.body, chatType, chatId, message)
      commit('addMessage', { message: pMessage, bodyType: 'txt' })
    },
    /**
     * 发送图片
     *  chatType 聊天的类型 单人聊天还是群组
     *  chatid  接收者的id
     *  source  图片地址
     */
    sendImgMessage({ commit }, { chatType, chatId, source }) {
      const id = WebIM.conn.getUniqueId()
      const type = 'img'
      const to = chatId
      const msgObj = new WebIM.message(type, id)
      msgObj.set({
        apiUrl: WebIM.config.apiURL,
        file: source,
        to: chatId,
        roomType: chatType === 'chatroom',
        onFileUploadError: function(data) {
          // 消息上传失败
          console.log('图片上传失败')
        },
        onFileUploadComplete: function() {
          // 消息上传成功
          console.log('图片上传成功')
        },
        success: function() {
          // 消息发送成功
          console.log('图片发送成功')
        },
        flashUpload: WebIM.flashUpload
      })

      if (chatType === 'groupchat' || chatType === 'chatroom') {
        msgObj.setGroup('groupchat')
      }

      WebIM.conn.send(msgObj.body)
      var pMessage = parseFromLocal(chatType, chatId, msgObj.body, 'img')
      pMessage.body.url = source.url
      commit('addMessage', { message: pMessage, bodyType: 'img' })
    }
  }
})
