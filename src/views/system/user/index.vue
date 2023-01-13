<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!--部门数据-->
      <!--      <el-col :span="4" :xs="24">-->
      <!--        <div class="head-container">-->
      <!--          <el-input-->
      <!--            v-model="deptName"-->
      <!--            placeholder="请输入部门名称"-->
      <!--            clearable-->
      <!--            size="small"-->
      <!--            prefix-icon="el-icon-search"-->
      <!--            style="margin-bottom: 20px"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <div class="head-container">-->
      <!--          <el-tree-->
      <!--            :data="deptOptions"-->
      <!--            :props="defaultProps"-->
      <!--            :expand-on-click-node="false"-->
      <!--            :filter-node-method="filterNode"-->
      <!--            ref="tree"-->
      <!--            default-expand-all-->
      <!--            @node-click="handleNodeClick"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </el-col>-->
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用户名称" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--          <el-form-item label="所属角色" prop="status">-->
          <!--            <el-select-->
          <!--              v-model="queryParams.status"-->
          <!--              placeholder="所属角色"-->
          <!--              clearable-->
          <!--              size="small"-->
          <!--              style="width: 240px"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="dict in statusOptions"-->
          <!--                :key="dict.dictValue"-->
          <!--                :label="dict.dictLabel"-->
          <!--                :value="dict.dictValue"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增用户
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column label="序号" align="center" type="index"/>
          <el-table-column label="用户姓名" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true"/>
          <el-table-column label="登陆名" align="center" key="userName" prop="userName" :show-overflow-tooltip="true"/>
          <!--          <el-table-column label="所属角色" align="center" key="deptName" prop="dept.deptName"-->
          <!--                           :show-overflow-tooltip="true"/>-->
          <el-table-column label="状态" align="center" key="status">
            <template slot-scope="scope">
              {{ scope.row.status === '0' ? '正常' : '停用' }}
            </template>
          </el-table-column>
          <el-table-column label="最后更新时间" align="center" prop="updateTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleStatusChange(scope.row)"
                v-hasPermi="['system:user:stop']"
              >{{ scope.row.status === "0" ? "停用" : "启用" }}
              </el-button>
              <!--              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"-->
              <!--                           v-hasPermi="['system:user:resetPwd']">-->
              <!--                <span class="el-dropdown-link">-->
              <!--                  <i class="el-icon-d-arrow-right el-icon&#45;&#45;right"></i>更多-->
              <!--                </span>-->
              <!--                <el-dropdown-menu slot="dropdown">-->
              <!--                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key"-->
              <!--                                    v-hasPermi="['system:user:resetPwd']">重置密码-->
              <!--                  </el-dropdown-item>-->
              <!--                  &lt;!&ndash;                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"&ndash;&gt;-->
              <!--                  &lt;!&ndash;                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>&ndash;&gt;-->
              <!--                </el-dropdown-menu>-->
              <!--              </el-dropdown>-->
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户姓名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户名称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="登陆名" prop="userName">
              <el-input v-model="form.userName" :disabled="form.userId !== undefined" placeholder="请输入用户手机号"
                        maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
          <!--     默认一个角色       -->
            <el-form-item label="所属角色" prop="roleIds" style="display: none">
              <el-select style="width: 100%;" v-model="form.roleIds" disabled multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="form.userId !== undefined?'密码':'初始密码'" prop="password">
              <el-input v-model="form.password" show-password :placeholder="form.userId !== undefined?'请输入密码':'请输入初始密码'" type="text"
                        maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数据范围" prop="userTypeRange">
              <el-select
                v-model="form.userTypeRange"
                placeholder="请选择数据范围"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="dict in options"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息">
              <el-input v-model="form.remark" maxlength="200" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport"/>
            是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate
} from "@/api/system/user";
import {getToken} from "@/utils/auth";
import {treeselect} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: {Treeselect},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      options: [
        {
          dictValue: 99,
          dictLabel: '全部'
        },
        {
          dictValue: 0,
          dictLabel: 'VIP个检用户'
        }, {
          dictValue: 1,
          dictLabel: '普通个检用户'
        }, {
          dictValue: 2,
          dictLabel: '团体体检用户'
        }, {
          dictValue: 3,
          dictLabel: '非体检用户'
        }
      ],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        password: ''
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined
      },
      // 表单校验
      rules: {
        nickName: [
          {required: true, message: "用户姓名不能为空", trigger: "blur"}
        ],
        userTypeRange: [
          {required: true, message: "请选择数据范围", trigger: "blur"}
        ],
        roleIds: [
          {required: true, message: "所属角色不能为空", trigger: "change"}
        ],
        password: [
          {required: true, message: "用户密码不能为空", trigger: "blur"},
          {min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: "登陆名不能为空", trigger: "blur"},
          {
            pattern: /^1[3|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let _this = this
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let status = row.status === '0' ? '1' : '0'
        changeUserStatus(row.userId, status).then(res => {
          console.log(res);
          if (res.code === 200) {
            _this.getList()
          }
        })
      }).then(() => {
        this.msgSuccess(text + "成功");
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        userTypeRange: 99,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [2],
        roleIds: [2]
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "新增用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.form.userTypeRange = response.data.userTypeRange === null ? 99 : response.data.userTypeRange;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.title = "编辑用户";
        this.open = true;
        console.log(this.form);
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      }).then(({value}) => {
        resetUserPwd(row.userId, value).then(response => {
          this.msgSuccess("修改成功");
        });
      }).catch(() => {
      });
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId !== undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除?', "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportUser(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
