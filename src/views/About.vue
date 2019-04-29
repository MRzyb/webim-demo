<template>
  <div class="about">
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-input placeholder="请输入账号" v-model="username" clearable></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-input placeholder="请输入密码" v-model="password" type="password"></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-input placeholder="请输入用户名" v-model="nickname" type="password"></el-input>
      </el-col>
    </el-row>
    <el-button type="primary" @click="handleRegister">注册</el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      username: null,
      password: null,
      nickname: null
    }
  },
  methods: {
    ...mapActions(['register']),
    handleRegister() {
      this.register({
        username: this.username,
        password: this.password,
        nickname: this.nickname,
        success: () => {
          this.$message.success('注册成功')
        },
        error: () => {
          this.$message.error('注册失败')
        }
      })
    }
  }
}
</script>
