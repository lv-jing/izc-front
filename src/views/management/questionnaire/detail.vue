<template>
  <div class="info-detail">
    <div class="titile bor-bot">患者问卷详情</div>
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <div class="info-content bor-bot">
        <div class="car-title">基本信息</div>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-form-item label="患者姓名:">
              <span>{{ setName(form.name) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者性别:">
              <span>{{ form.gender }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者年龄:">
              <span>{{ form.age }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-form-item label="手机号码:">
              <span>{{ setPhone(form.phone) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评估部位:">
              <span>{{ positionList[form.position] }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评估时间:">
              <span>{{ form.evaluateTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-form-item label="评估结果:">
              <span
                :style="{ color:result[form.result]==='高风险人群'?'#ff4d4f':result[form.result]==='中风险人群'?'#e6a23c':'#409eff'}">{{
                  result[form.result]
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="form.emergencyContact">
            <el-form-item label="紧急联系人:" label-width="100px">
              <span>{{ form.emergencyContact }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="form.emergencyPhone">
            <el-form-item label="紧急联系人电话:" label-width="120px">
              <span>{{ form.emergencyPhone }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="info-content">
      <div class="flex flex-between">
        <div class="car-title">问卷信息</div>
        <div v-show="options.length>1">
          <span>历史问卷记录: </span>
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
      <ul>
        <li v-for="(item,index) in list">
          <div class="problem-title">{{ index + 1 + '.' + item.title }}</div>
          <div class="problem-text">{{ item.val }}</div>
        </li>
      </ul>
    </div>
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
import {getInfo} from "@/api/management/ques";

export default {
  name: "quesdetail",
  data() {
    return {
      result: ['低风险人群', '中风险人群', '高风险人群'],
      positionList: ['胃', '肺', '肠', '宫颈', '乳腺', '肝'],
      form: {},
      time: '',
      options: [],
      list: [],
    }
  },
  mounted() {
    let id = this.$route.params.id
    this.getList(id)
  },
  methods: {
    handleChange(e) {
      this.getList(e)
    },
    getList(id) {
      getInfo(id).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.list = res.data.qandA
          this.options = res.data.replyHistory
          this.time = id
        }
      })
    },
    handleGo(){
      this.$router.push('/management/questionnaire')
    }
  }
}
</script>

<style scoped lang="scss">
.info-detail {
  padding: 20px;
}


.info-content {
  padding: 20px;
  font-size: 14px;

  .el-form-item {
    margin-bottom: 0 !important;
  }
}

.titile {
  font-size: 18px;
  padding: 0 0 20px 20px;

}

.car-title {
  font-size: 16px;
}

.bor-bot {
  border-bottom: 1px solid #d3dce6;
}

ul {
  list-style: none;
  padding: 0;
  font-size: 14px;

  li {
    margin-bottom: 10px;

    .problem-title {
      margin-bottom: 10px;
    }

    .problem-text {
      color: #5a5e66;
    }
  }
}
</style>
