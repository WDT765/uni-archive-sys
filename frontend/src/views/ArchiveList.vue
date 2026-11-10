<template>
  <div class="container">
    <h2>档案列表</h2>
    <div class="search">
      <input v-model="keyword" placeholder="搜索档案名称" />
      <button>查询</button>
      <button>新增档案</button>
    </div>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>档案名称</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.time }}</td>
          <td>
            <button>编辑</button>
            <button>删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const keyword = ref('')
const tableData = ref([
  { id: 1, name: "学生档案001", time: "2026-11-01" },
  { id: 2, name: "学生档案002", time: "2026-11-02" },
  { id: 3, name: "学生档案003", time: "2026-11-03" },
])
</script>

<style scoped>
.container {
  width: 900px;
  margin: 40px auto;
}
.search {
  margin-bottom: 16px;
}
button {
  margin-left: 8px;
  padding: 4px 10px;
}
</style>
