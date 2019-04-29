<template>
  <div class="home">
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-input placeholder="请输入账号" v-model="username" clearable></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-input placeholder="请输入密码"  v-model="password" type="password"></el-input>
      </el-col>
    </el-row>
    <el-button type="primary" @click="handleLogin">登录</el-button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      username: null,
      password: null
    }
  },
  computed: {
    ...mapState(['rouster'])
  },
  methods: {
    ...mapActions(['login', 'getRoster']),
    handleLogin() {
      this.login({
        username: this.username,
        password: this.password,
        success: () => {
          this.$message.success('登录成功')
          this.$router.push({ path: '/chat' })
        },
        error: e => {
          this.$message.error('登录失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
}
</style>
