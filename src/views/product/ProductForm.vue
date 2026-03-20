<template>
  <div class="product-form">
    <PageHeader :title="isEdit ? '编辑理财产品' : '新增理财产品'">
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
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品类型" prop="type">
            <el-input v-model="form.type" placeholder="如：基金、股票、理财通"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="预期年化收益率(%)" prop="expectedYield">
            <el-input v-model="form.expectedYield" type="number" step="0.01" placeholder="请输入预期收益率"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风险等级" prop="riskLevel">
            <el-select v-model="form.riskLevel" placeholder="请选择风险等级">
              <el-option label="低风险" value="低风险"></el-option>
              <el-option label="中风险" value="中风险"></el-option>
              <el-option label="高风险" value="高风险"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="购买金额" prop="investAmount">
            <el-input v-model="form.investAmount" type="number" step="0.01" placeholder="请输入购买金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购买日期" prop="buyDate">
            <el-date-picker
              v-model="form.buyDate"
              type="date"
              placeholder="请选择购买日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="产品状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择产品状态">
          <el-option label="持有" value="持有"></el-option>
          <el-option label="已赎回" value="已赎回"></el-option>
          <el-option label="已到期" value="已到期"></el-option>
        </el-select>
      </el-form-item>

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
import { getProductById, addProduct, updateProduct } from '@/api/product'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

// 判断是否编辑
const isEdit = ref(!!route.params.id)

// 表单数据
const form = reactive({
  id: '',
  name: '',
  type: '',
  expectedYield: '',
  riskLevel: '',
  investAmount: '',
  buyDate: '',
  status: '持有'
})

// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入产品类型', trigger: 'blur' }],
  investAmount: [{ required: true, message: '请输入购买金额', trigger: 'blur' }],
  buyDate: [{ required: true, message: '请选择购买日期', trigger: 'change' }]
})

// 获取详情（编辑模式）
const getDetail = () => {
  getProductById(route.params.id).then(res => {
    form.id = res.id
    form.name = res.name
    form.type = res.type
    form.expectedYield = res.expectedYield
    form.riskLevel = res.riskLevel
    form.investAmount = res.investAmount
    form.buyDate = res.buyDate
    form.status = res.status
  })
}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        updateProduct(form).then(() => {
          ElMessage.success('编辑成功')
          goBack()
        })
      } else {
        addProduct(form).then(() => {
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
  router.push({ name: 'ProductList' })
}

onMounted(() => {
  if (isEdit.value) {
    getDetail()
  }
})
</script>