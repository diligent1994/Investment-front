<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-aside width="200px" style="background-color: #2e3b4e;">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#2e3b4e"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/product/list">
            <el-icon><Menu /></el-icon>
            <template #title>理财产品管理</template>
          </el-menu-item>
          <el-menu-item index="/profit/list">
            <el-icon><Document /></el-icon>
            <template #title>收益记录管理</template>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><PieChart /></el-icon>
              <span>报表分析</span>
            </template>
            <el-menu-item index="/report/comparison">产品收益对比</el-menu-item>
            <el-menu-item index="/report/trend">收益趋势曲线</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>个人理财系统</span>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { Menu, Document, PieChart } from '@element-plus/icons-vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e5e7eb;
}

.el-aside {
  color: #333;
}
</style>