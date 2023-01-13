<template>
  <div class="info-detail" v-loading="loading">
    <div class="titile bor-bot">体检报告详情</div>
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <div class="info-content bor-bot">
        <div class="car-title">基本信息</div>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-form-item label="患者姓名:">
              <span>{{ setName(patientInfo.name) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者性别:">
              <span>{{ patientInfo.gender }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者年龄:">
              <span>{{ patientInfo.age }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-form-item label="手机号码:">
              <span>{{ setPhone(patientInfo.phone) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户类型:">
              <span>{{ status[patientInfo.userType] }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info-content bor-bot">
        <div class="flex flex-between">
          <div class="car-title">体检结果汇总</div>
          <div v-show="options.length>1">
            <span>历史体检记录: </span>
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
          <el-col :span="6">
            <el-form-item label="体检医院:">
              <span>{{ form.hospital }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="体检报告编号:" label-width="120px">
              <span>{{form.reportCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报告时间:">
              <span>{{form.reportTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总检医生:">
              <span>{{ form.attendingDoctor }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info-content bor-bot">
        <h2 class="car-title">检查综述</h2>
        <div>
          {{
            form.summarize
          }}
        </div>
      </div>
      <div class="info-content bor-bot">
        <h2 class="car-title">医生建议</h2>
        <div>
          {{
            form.suggestion
          }}
        </div>
      </div>
      <div class="info-content">
        <h2 class="car-title">详细检查项目</h2>
        <div v-for="item in tableData">
          <div class="flex flex-between mb20">
            <div>{{ item.projectName }}</div>
            <div class="flex flex-between">
              <div class="mr20">检查日期：{{ item.examDate }}</div>
              <div>检查医生：{{ item.examDoctor }}</div>
            </div>
          </div>
          <el-table
            :data="item.littleProjectList"
            border
            :span-method="({ row, column, rowIndex, columnIndex })=>arraySpanMethod({ row, column, rowIndex, columnIndex },item.littleProjectList.length)"
            style="width: 100%;margin-bottom: 20px">
            <el-table-column prop="name" label="项目名称"/>
            <el-table-column prop="result" label="检查结果"/>
            <el-table-column prop="unit" label="单位" v-if="item.littleProjectList.filter(item=>item.unit).length>0"/>
            <el-table-column prop="referenceValue" label="参考值" v-if="item.littleProjectList.filter(item=>item.unit).length>0"/>
          </el-table>
        </div>
        <div style="text-align: right">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleExport"
            v-hasPermi="['manage:report:export']"
          >下载报告</el-button>
          <el-button
            plain
            size="mini"
            @click="handleGo"
          >返回</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getInfo,managExport} from "@/api/management/report";
import {getToken} from '@/utils/auth'
export default {
  name: "reportDetail",
  data() {
    return {
      loading:false,
      status: ['VIP个检用户', '普通个检用户', '团体体检用户', '非体检用户'],
      tableData: [],
      form: {},
      patientInfo: {},
      time: '',
      options: [],
    }
  },
  mounted() {
    let id = this.$route.params.id
    this.reportCode = id
    this.getInfoList(id)
  },
  methods: {
    handleExport(){
      this.$confirm('是否确认下载体检报告?', "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let url = process.env.VUE_APP_BASE_API+'/examReport/export?token='+getToken()+'&reportCode='+this.reportCode
        window.open(url)
      }).catch(() => {
        this.exportLoading = false;
      });
    },
    getInfoList(id) {
      this.loading = true
      getInfo({reportCode: id}).then(res => {
        if (res.code === 200) {
          this.options = res.data.historyExamReportList
          this.patientInfo = res.data.patientInfo
          this.form = res.data.mainPart
          this.setPart(res.data.mainPart.packageList)
          this.time = id
        }
      }).catch(() => {
        this.loading = false
      });
    },
    setPart(data) {
      if (data.length > 0) {
        data.map(item => {
          return item.littleProjectList.push({name: '小结', result: item.littleSummarize})
        })
        this.tableData = data
        this.loading = false
      }
    },
    handleChange(e) {
      this.getInfoList(e)
      this.reportCode = e
    },
    arraySpanMethod({row, column, rowIndex, columnIndex}, val) {
      if (rowIndex === val - 1) {
        if (columnIndex === 1) {
          return [1, 3]
        }
      }
    },
    handleGo(){
      this.$router.push('/management/report')
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
