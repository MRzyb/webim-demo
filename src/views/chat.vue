<template>
  <div class="chat-container">
    <el-container v-if="rouster.length > 0">
      <el-aside class="roster_list" style="width: 200px">
        <el-menu :default-active="$route.fullPath" router>
          <!-- 这里default-active可以用$route.path, 因为:index的?username 只是为了方便看是哪个用户 并无其他作用-->
          <template v-for="item in rouster" v-if="rouster.length > 0">
            <el-menu-item :key="item.jid" :index="'/chat/'+ item.name + '?username=' + username">{{item.name}}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main class="chat-main">
        <router-view></router-view>
      </el-main>
    </el-container>
    <p v-else>暂无好友列表,可用user,user1或func1登陆，密码都为123</p>
    <video ref='localVideo' id="localVideo" muted autoPlay playsInline/>
    <video ref='remoteVideo' id="remoteVideo" muted autoPlay playsInline/>
  </div>
</template>

<script>
  // 在chat页面初始化视频部分
  import {mapState} from 'vuex'
  import initWebRTC from '../webrtc/WebRtcModal'

  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['rouster', 'username'])
    },
    mounted() {
      initWebRTC()
    }
  }
</script>

<style scoped lang="scss">
  .chat-container {
    width: 900px;
    height: 600px;
  }

  .el-container {
    width: 100%;
    height: 100%;
  }

  .chat-main {
    width: 100%;
    height: 100%;
    background-color: #e9eef3;
    color: #333;
    min-height: 300px;
    padding: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>
