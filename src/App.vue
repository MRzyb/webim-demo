<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">登录</router-link> |
      <router-link to="/about">注册</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['isLogin'])
  },
  created() {
    let username = sessionStorage.getItem('username')
    let token = sessionStorage.getItem('token')
    if (!this.isLogin && username && token) {
      this.loginByToken({ username, token })
    }
  },
  methods: {
    ...mapActions(['loginByToken'])
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
