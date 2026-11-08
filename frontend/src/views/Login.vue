<template>
  <div class="login-box">
    <h2>档案管理系统登录</h2>
    <div class="item">
      <label>账号</label>
      <input v-model="form.username" placeholder="请输入账号" />
    </div>
    <div class="item">
      <label>密码</label>
      <input v-model="form.password" type="password" placeholder="请输入密码" />
    </div>
    <button @click="handleLogin">登录</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  if (!form.value.username || !form.value.password) {
    alert('账号密码不能为空')
    return
  }
  localStorage.setItem('isLogin', '1')
  alert('登录成功')
  router.push('/archive')
}
</script>

<style scoped>
.login-box {
  width: 320px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.item {
  margin-bottom: 16px;
}
label {
  display: block;
  margin-bottom: 4px;
}
input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
}
button {
  width: 100%;
  padding: 10px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
