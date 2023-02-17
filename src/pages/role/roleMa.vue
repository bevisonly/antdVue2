<template>
  <div class="role-management" :style="`min-height: ${pageMinHeight}px`">
    <a-form-model>
      <a-row>
        <a-col :span="22">
          <a-form-model-item class="formItemStyle formItemStylewidth">
            <a-input-search style="width: 100%;" placeholder="请输入角色名称/所属租户" v-model.trim="form.keyWord" @search="onSearch"></a-input-search>
          </a-form-model-item>
        </a-col>
        <a-col :span="2">
          <div class="add-btn">
            <a-button type="primary" :disabled="!hasPermission('roleMa_add')" @click="editRole(null, 0)">新增</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="role-table">
      <a-table
        bordered
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="tableLoading"
        rowKey="id"
        size="middle"
        :scroll="{ x: 910 }"
      >
        <div slot="opreation" slot-scope="text, record">
          <a-button type="link" :disabled="!hasPermission('roleMa_permissions')" @click="permissionBtn(record)"
            >分配权限</a-button
          >
          <a-button type="link" :disabled="!hasPermission('roleMa_edit')" @click="editRole(record, 1)">编辑</a-button>
          <a-popconfirm
            title="确定删除该角色吗?"
            ok-text="确定"
            cancel-text="取消"
            :disabled="!hasPermission('roleMa_delete')"
            @confirm="delRole(record)"
          >
            <a-button type="link" :disabled="!hasPermission('roleMa_delete')">删除</a-button>
          </a-popconfirm>
        </div>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination
          :pageSizeOptions='pageSizeOptions'
          v-model="pagination.page"
          :pageSize="pagination.size"
          :total="pagination.total"
          :show-total="() => `共 ${pagination.total} 条`"
          show-size-changer
          :show-quick-jumper="pagination.total >= 1000 ? true : false"
          @showSizeChange="paginationSize"
          @change="paginationPage"
        />
      </div>
    </div>
    <RolePermission ref="rolePermission" />
    <a-modal
      v-model="visible"
      :title="editTitle == 1 ? '编辑角色' : '新增角色'"
      destroyOnClose
      :footer="null"
    >
      <a-form-model
        :model="roleForm"
        :rules="formRules"
        ref="roleForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="选择租户" prop="orgId">
              <a-select v-model="roleForm.orgId" style="width: 100%">
                <a-select-option
                  v-for="item in tenantList"
                  :key="item.id"
                  :value="item.orgId"
                >
                  {{ item.opName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              label="角色名称"
              prop="roleName"
              style="margin-top: 10px"
            >
              <a-input v-model="roleForm.roleName"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="角色描述">
              <a-input v-model="roleForm.description"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-form-model-item
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
            "
          >
            <a-button type="primary" @click="handleOk">提交</a-button>
            <a-button style="margin-left: 10px" @click="handleCancel"
              >取消</a-button
            >
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
  <script>
import { mapState } from "vuex";
import {
  roleList,
  tenantList,
  InsertRole,
  UpdateRole,
  DelRole,
} from "../../services/stage/roleMa";
const columns = [
  {
    align: "center",
    title: "角色名称",
    dataIndex: "roleName",
  },
  {
    align: "center",
    title: "角色描述",
    dataIndex: "description",
  },
  {
    align: "center",
    title: "归属市场",
    dataIndex: "orgName",
  },
  {
    align: "center",
    title: "创建时间",
    dataIndex: "created",
  },
  {
    align: "center",
    title: "修改时间",
    dataIndex: "modified",
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "opreation",
    width: 250,
    fixed: "right",
    scopedSlots: { customRender: "opreation" },
  },
];
import RolePermission from "./rolePermission.vue";
import { mixin } from "../../utils/mixins";
export default {
  name: "roleManagement",
  components: { RolePermission },
  mixins: [mixin],
  data() {
    return {
      columns,
      tableData: [],
      tableLoading: false,
      tenantList: [],
      form: {},
      visible: false,
      editTitle: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      roleForm: {},
      formRules: {
        roleName: [
          { required: true, message: "请输入角色名称" },
          { min: 1, max: 11, message: "长度不超过10 个字" },
        ],

        orgId: [{ required: true, message: "请选择租户" }],
      },
      copyParams: {},
      pageSizeOptions: ['10','20','50','100'],
      pagination: {total: 0, page: 1, size: 10},
    };
  },

  activated() {
    this.form.roleName = undefined
    this.pagination.page = 1;
    this.pagination.size = 10;
    this.pagination.total = 10;
    this.getRoleList();
    this.submitPagination();
  },

  methods: {
    delRole(record) {
      console.log(record);
      DelRole({ id: record.id }).then((res) => {
        if (res.data.code == 200) {
          this.getRoleList();
          this.$message.success("角色删除成功");
        } else {
          this.$message.error("角色删除失败");
        }
      });
    },
    editRole(record, state) {
      this.visible = true;
      this.editTitle = state;
      this.getTenant();
      if (record) {
        this.roleForm = {
          roleName: record.roleName,
          description: record.description,
          orgId: record.orgId,
          id: record.id,
        };
      } else {
        this.roleForm = {
          roleName: "",
          description: "",
          orgId: "",
        };
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      console.log();

      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          console.log(1);
          const params = { ...this.roleForm };
          switch (this.editTitle) {
            case 0:
              InsertRole(params).then((res) => {
                if (res.data.code == 200) {
                  this.visible = false;
                  this.$message.success("新增角色成功");
                  this.getRoleList();
                } else {
                  this.$message.error("新增角色失败");
                }
              });
              break;
            case 1:
              UpdateRole(params).then((res) => {
                if (res.data.code == 200) {
                  this.visible = false;
                  this.$message.success("修改角色信息成功");
                  this.getRoleList();
                } else {
                  this.$message.error("修改角色信息失败");
                }
              });
              break;

            default:
              break;
          }
        } else {
          return false;
        }
      });
    },
    //租户
    getTenant() {
      tenantList().then((res) => {
        if (res.data.code == 200) {
          this.tenantList = res.data.data;
        } else {
          this.tenantList = [];
          this.$message.error("获取租户数据失败");
        }
      });
    },
    //分配权限的按钮
    permissionBtn(record) {
      this.$refs.rolePermission.showModal(record.id);
    },
    //角色列表
    onSearch() {
      this.getRoleList("search")
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof(obj) == 'object' && obj !== null)  {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i])
        }
      } else {
        objStorageBox = obj
      }
      return objStorageBox
    },
    getRoleList(flag) {
      this.pagination.page = 1
      this.tableLoading = true;
      let params = {
        keyWord: this.form.keyWord,
        page: this.pagination.page,
        rows: this.pagination.size,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      roleList(params).then((res) => {
        this.tableLoading = false;
        this.pagination.total = res.data.total || 0;
        this.tableData = res.data.rows;
      });
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          keyWord: this.form.keyWord,
        })
      }
      this.tableLoading = true
      roleList(this.copyParams).then(res => {
        this.tableLoading = false;
        this.pagination.total = res.data.total || 0;
        this.tableData = res.data.rows;
      }).catch(() => this.tableLoading = false)
    },
    paginationPage(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    }
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>
  <style scoped lang="less">
@import "index.less";
</style>