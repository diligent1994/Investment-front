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

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="交易类型" prop="transactionType">
        <el-select v-model="form.transactionType" placeholder="请选择交易类型">
          <el-option label="申购" value="申购"></el-option>
          <el-option label="赎回" value="赎回"></el-option>
          <el-option label="收益更新" value="收益更新"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申赎金额" prop="transactionAmount">
        <el-input 
          v-model="form.transactionAmount" 
          type="number" 
          step="0.01" 
          placeholder="申购+，赎回-，收益更新填0"
        ></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <!-- 只读指标字段 -->
  <el-row :gutter="20">
    <el-col :span="8">
      <el-form-item label="年化收益率(%)">
        <el-input v-model="form.annualizedReturn" disabled placeholder="系统自动计算"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="最大回撤(%)">
        <el-input v-model="form.maxDrawdown" disabled placeholder="系统自动计算"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="夏普比率">
        <el-input v-model="form.sharpeRatio" disabled placeholder="系统自动计算"></el-input>
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

// 表单数据新增字段
const form = reactive({
  id: '',
  productId: route.query.productId || '',
  profitAmount: '',
  profitRate: '',
  recordDate: '',
  transactionType: '收益更新', // 默认为收益更新
  transactionAmount: 0,        // 默认为0
  annualizedReturn: '',        // 只读
  maxDrawdown: '',             // 只读
  sharpeRatio: ''              // 只读
})

// 表单校验规则新增
const rules = reactive({
  productId: [{ required: true, message: '请输入产品ID', trigger: 'blur' }],
  profitAmount: [{ required: true, message: '请输入收益金额', trigger: 'blur' }],
  recordDate: [{ required: true, message: '请选择记录日期', trigger: 'change' }],
  transactionType: [{ required: true, message: '请选择交易类型', trigger: 'change' }],
  transactionAmount: [{ required: true, message: '请输入申赎金额', trigger: 'blur' }]
})

// 原有getDetail方法中新增字段赋值
const getDetail = () => {
  getProfitById(route.params.id).then(res => {
    form.id = res.id
    form.productId = res.productId
    form.profitAmount = res.profitAmount
    form.profitRate = res.profitRate
    form.recordDate = res.recordDate
    form.transactionType = res.transactionType
    form.transactionAmount = res.transactionAmount
    form.annualizedReturn = res.annualizedReturn
    form.maxDrawdown = res.maxDrawdown
    form.sharpeRatio = res.sharpeRatio
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