<template>
  <el-container class="container">
    <el-main class="main">
      <ul>
        <li v-for="msg in msgList" :key="msg.id" :class="{'self': msg.bySelf }">
          <div class="msg">
            <span v-if="msg.body.type === 'txt' ">{{msg.body.msg}}</span>
            <img  v-if="msg.body.type === 'img' " :src="msg.body.url" alt="">
          </div>
        </li>
      </ul>
    </el-main>
    <el-footer class="footer" height="160px">
      <input type="file" @change="pictureChange" ref="file" />
      <el-button @click="sendVideo">发送视频</el-button>
      <el-button @click="sendVoice">发送音频</el-button>
      <textarea v-model="value" placeholder="消息" ref="textarea"></textarea>
      <el-button class="btn" @click="sendMessage">发送</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import config from '@/config/config.js'
import rtcCall from '../webrtc/WebRtcModal.js'

export default {
  data() {
    return {
      value: '',
      image: {},
      chatId: null  //聊天用戶
    }
  },
  created () {
    this.chatId = this.$route.params.id
  },
  computed: {
    ...mapState(['message_list', 'username']),
    msgList() {
      // 过滤 拿去当前两个用户的聊天记录
      let user = this.username // 当前用户
      let chatUser = this.chatId // 聊天用户
      let list = this.message_list.filter(v => {
        return (
          (v.from === user || v.from === chatUser) &&
          (v.to === user || v.to === chatUser)
        )
      })
      return list
    }
  },
  methods: {
    ...mapActions(['sendTextMessage', 'sendImgMessage']),
    sendMessage() {
      if (!this.value) return
      let msgObj = {
        chatType: 'chat',
        chatId: this.chatId,
        message: this.value
      }
      this.sendTextMessage(msgObj)
      this.emitEmpty()
    },
    // 选择图片
    pictureChange(e) {
      let file = WebIM.utils.getFileUrl(e.target)
      if (!file.filename) {
        this.image.value = null
        return false
      }
      if (!config.imgType[file.filetype.toLowerCase()]) {
        this.image.value = null
        this.$message.error('不支持的图片类型')
        return false
      }
      let msgObj = {
        chatType: 'chat',
        chatId: this.chatId,
        source: file
      }
      this.sendImgMessage(msgObj)
      this.$refs.file.value = ''
    },
    // 清空消息
    emitEmpty() {
      this.value = ''
      this.$refs.textarea.focus()
    },
    // 发视频
    sendVideo() {
      rtcCall.caller = this.username
      rtcCall.makeVideoCall(this.chatId)
    },
    // 发语音
    sendVoice() {
      rtcCall.caller = this.username
      rtcCall.makeVoiceCall(this.chatId)
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  min-height: 400px;
  li {
    padding: 0 10px;
    display: block;
    margin-top: 20px;
    overflow: hidden;
    .msg {
      float: left;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #fff;
      img {
        width: 300px;
      }
    }
    &.self {
      text-align: right;
      .msg {
        float: right;
      }
    }
  }
}
.footer {
  position: relative;
  background: #fff;
  padding: 0;
  margin: 0;
  textarea {
    width: 100%;
    height: 110px;
    margin: 0;
    padding: 0;
    font-size: 16px;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
  .btn {
    position: absolute;
    bottom: 5px;
    right: 10px;
    // height: 50px;
  }
}
</style>
