<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="患者姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入患者姓名"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="完成时间">
        <el-date-picker
          unlink-panels
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="评估结果" prop="result">
        <el-select
          v-model="queryParams.result"
          placeholder="请选择评估结果"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in resultOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-select
          v-model="queryParams.userType"
          placeholder="请选择用户类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['manage:ques:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="roleList" border>
      <el-table-column label="序号" type="index" width="120" align="center"/>
      <el-table-column label="患者姓名" prop="name" align="center">
        <template slot-scope="scope">
          {{ setName(scope.row.name) }}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" prop="phone" align="center">
        <template slot-scope="scope">
          {{ setPhone(scope.row.phone) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" align="center"/>
      <el-table-column label="年龄" prop="age" align="center"/>
      <el-table-column label="用户类型" prop="userType" align="center">
        <template slot-scope="scope">
          {{ type[scope.row.userType] }}
        </template>
      </el-table-column>
      <el-table-column label="评估部位" prop="roleSort2" align="center">
        <template slot-scope="scope">
          {{ positionList[scope.row.position] }}
        </template>
      </el-table-column>
      <el-table-column label="最近一次完成时间" align="center" prop="time"/>
      <el-table-column label="评估结果" prop="result" align="center">
        <template slot-scope="scope">
          <span
            :style="{ color:result[scope.row.result]==='高风险人群'?'#ff4d4f':result[scope.row.result]==='中风险人群'?'#e6a23c':''}">{{
              result[scope.row.result]
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
            v-hasPermi="['management:info:list']"
          >查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {getList} from "@/api/management/ques";
import {getToken} from '@/utils/auth'

export default {
  name: "Questionnaire",
  data() {
    return {
      exportLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 日期范围
      dateRange: [],
      roleList: [],
      // 状态数据字典
      statusOptions: [
        {
          dictValue: '',
          dictLabel: '全部'
        }, {
          dictValue: '0',
          dictLabel: 'VIP个检用户'
        }, {
          dictValue: '1',
          dictLabel: '普通个检用户'
        }, {
          dictValue: '2',
          dictLabel: '团体体检用户'
        }, {
          dictValue: '3',
          dictLabel: '非体检用户'
        }
      ],
      resultOptions: [
        {
          dictValue: '',
          dictLabel: '全部'
        }, {
          dictValue: '0',
          dictLabel: '低风险人群'
        }, {
          dictValue: '1',
          dictLabel: '中风险人群'
        }, {
          dictValue: '2',
          dictLabel: '高风险人群'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        phone: '',
        userType: '',
        result: '',
        beginTime: '',
        endTime: ''
      },
      result: ['低风险人群', '中风险人群', '高风险人群'],
      positionList: ['胃', '肺', '肠', '宫颈', '乳腺', '肝'],
      type: ['VIP个检用户', '普通个检用户', '团体体检用户', '非体检用户'],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      delete queryParams.params
      delete queryParams.pageNum
      delete queryParams.pageSize
      this.$confirm('是否确认导出所有患者问卷数据项?', "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var params = Object.keys(queryParams).map(function (key) {
          return encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key]);
        }).join("&");
        let url = process.env.VUE_APP_BASE_API + '/questionnaireReplyRecord/export?token=' + getToken() + '&' + params
        window.open(url)
      }).catch(() => {
        this.exportLoading = false;
      });
    },
    /** 查询角色列表 */
    getList() {
      this.loading = false;
      getList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查看详情 */
    handleDetail(row) {
      const {id} = row
      this.$router.push({path: '/management/ques/detail/' + id})
    },
  }
};
</script>
