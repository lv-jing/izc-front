<template>
  <div class="info-detail" v-loading="loading">
    <div class="titile bor-bot">患者信息详情</div>
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <div class="info-content bor-bot">
        <div class="car-title">基本信息</div>
        <el-row :gutter="18">
          <el-col :span="8" >
            <el-form-item label="患者姓名:">
              <span>{{ setName(form.name) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者性别:">
              <span>{{ form.gender }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者年龄:">
              <span>{{ form.age }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="8">
            <el-form-item label="手机号码:">
              <span>{{ setPhone(form.phone) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.height">
            <el-form-item label="身高:" label-width="50px">
              <span>{{ form.height?form.height+'cm':'' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.weight">
            <el-form-item label="体重:" label-width="50px">
              <span>{{ form.weight?form.weight+'kg':'' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.address">
            <el-form-item label="常住地址:">
              <span>{{ form.address }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.emergencyContact">
            <el-form-item label="紧急联系人:" label-width="100px">
              <span>{{ form.emergencyContact }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.emergencyPhone">
            <el-form-item label="紧急联系人电话:" label-width="120px">
              <span>{{ form.emergencyPhone }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.hospitalName">
            <el-form-item label="指定社区康复中心:" label-width="130px">
              <span>{{ form.hospitalName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.registTime">
            <el-form-item label="注册时间:">
              <span>{{ form.registTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="form.userType!==null">
            <el-form-item label="用户类型:">
              <span>{{ status[form.userType] }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info-content">
        <div class="flex flex-between">
          <div class="car-title" v-show="options.length>0">体检信息</div>
          <div v-show="options.length>1">
            <span>历史体检报告: </span>
            <el-select v-model="time" placeholder="请选择" size="small" @change="handleChange">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.date"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>

        <el-row :gutter="18">
          <el-col :span="8" v-show="formTwo.examTime">
            <el-form-item label="最近一次体检时间:" label-width="130px">
              <span>{{ formTwo.examTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="formTwo.packageName">
            <el-form-item label="体检套餐:">
              <span>{{ formTwo.packageName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="formTwo.result">
            <el-form-item label="体检结果:">
              <span>{{ formTwo.result }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="8" v-show="formTwo.doctor">
            <el-form-item label="总负责医生:" label-width="90px">
              <span>{{ formTwo.doctor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="formTwo.reportTime">
            <el-form-item label="体检报告生成时间:" label-width="140px">
              <span>{{ formTwo.reportTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="formTwo.reportCode">
            <el-form-item label="报告单编号:" label-width="90px">
              <span>{{ formTwo.reportCode }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18" v-show="formTwo.summarize">
          <el-col :span="18">
            <el-form-item label="终检结论:">
              <span>{{ formTwo.summarize }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div style="text-align: right" class="return-but">
      <el-button
        plain
        size="mini"
        @click="handleGo"
      >返回</el-button>
    </div>
  </div>
</template>

<script>
import {getInfo, getInfoReport} from "../../../api/management/infor";

export default {
  name: "detail",
  data() {
    return {
      loading: true,
      form: {},
      formTwo: {},
      value: '',
      options: [],
      time: '',
      status: ['VIP个检用户', '普通个检用户', '团体体检用户', '非体检用户'],
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    handleChange(e) {
      this.loading= true
      this.getInfoReport(e)
    },
    getInfo() {
      let id = this.$route.params.id
      let code = this.$route.params.code
      getInfo(id).then(res => {
        this.form = {
          ...res.data
        }
        this.options = res.data.historyReportList
      })
      this.loading= false
      if(code==='null') return
      this.getInfoReport(code)

    },
    getInfoReport(code) {
      getInfoReport(code).then(res => {
        if (res.code === 200) {
          this.loading= false
          this.formTwo = res.data
          this.time = res.data.reportCode
        }
      })
    },
    handleGo(){
      this.$router.push('/management/information')
    }
  }
}
</script>

<style scoped lang="scss">
.info-detail {
  padding: 20px;
}

.titile {
  font-size: 18px;
  padding: 0 0 20px 20px;

}

.info-content {
  padding: 20px;

  .el-form-item {
    margin-bottom: 0 !important;
  }
}

.bor-bot {
  border-bottom: 1px solid #d3dce6;
}
</style>
