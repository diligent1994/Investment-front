<template>
  <div class="profit-form">
    <PageHeader :title="isEdit ? '编辑收益记录' : '新增收益记录'">
      <template #action>
        <el-button @click="goBack">返回</el-button>
      </template>
    </PageHeader>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="max-width: 800px; margin: 0 auto"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品ID" prop="productId">
            <el-input v-model="form.productId" type="number" placeholder="请输入产品ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录日期" prop="recordDate">
            <el-date-picker
              v-model="form.recordDate"
              type="date"
              placeholder="请选择记录日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="收益金额" prop="profitAmount">
            <el-input v-model="form.profitAmount" type="number" step="0.01" placeholder="请输入收益金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收益率(%)" prop="profitRate">
            <el-input v-model="form.profitRate" type="number" step="0.01" placeholder="请输入收益率"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="text-align: center">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { getProfitById, addProfit, updateProfit } from '@/api/profit'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

// 判断是否编辑
const isEdit = ref(!!route.params.id)

// 表单数据
const form = reactive({
  id: '',
  productId: route.query.productId || '',
  profitAmount: '',
  profitRate: '',
  recordDate: ''
})

// 表单校验规则
const rules = reactive({
  productId: [{ required: true, message: '请输入产品ID', trigger: 'blur' }],
  profitAmount: [{ required: true, message: '请输入收益金额', trigger: 'blur' }],
  recordDate: [{ required: true, message: '请选择记录日期', trigger: 'change' }]
})

// 获取详情（编辑模式）
const getDetail = () => {
  getProfitById(route.params.id).then(res => {
    form.id = res.id
    form.productId = res.productId
    form.profitAmount = res.profitAmount
    form.profitRate = res.profitRate
    form.recordDate = res.recordDate
  })
}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        updateProfit(form).then(() => {
          ElMessage.success('编辑成功')
          goBack()
        })
      } else {
        addProfit(form).then(() => {
          ElMessage.success('新增成功')
          goBack()
        })
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
}

// 返回列表页
const goBack = () => {
  router.push({ 
    name: 'ProfitList',
    query: { productId: form.productId }
  })
}

onMounted(() => {
  if (isEdit.value) {
    getDetail()
  }
})
</script>