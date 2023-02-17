<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="top-btn">
      <a-button
        type="primary"
        @click="showModal(0)"
        :disabled="!hasPermission('tenant_organization_topadd')"
        >新增</a-button
      >
    </div>
    <div class="table-item" style="margin-top: 20px">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        row-key="id"
        :pagination="false"
        :expandIcon='expandIcon'
      >
        <div slot="opreation" slot-scope="text, record">
          <a-button
            type="link"
            @click="showModal(2, record)"
            :disabled="!hasPermission('tenant_organization_add')"
            >新增</a-button
          >
          <a-button
            type="link"
            @click="showModal(1, record)"
            :disabled="!hasPermission('tenant_organization_edit')"
            >编辑</a-button
          >
          <!-- <a-button
            type="link"
            @click="delDepartment(record)"
            :disabled="!hasPermission('tenant_organization_delete')"
            >删除</a-button
          > -->
          <a-popconfirm
            title="确定作废该部门吗?"
            ok-text="确定"
            cancel-text="取消"
            :disabled="!hasPermission('tenant_organization_delete')"
            @confirm="delDepartment(record)"
          >
            <a-button
              type="link"
              :disabled="!hasPermission('tenant_organization_delete')"
              >作废</a-button
            >
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <a-modal
      v-model="visible"
      :title="titleState ? '编辑' : '新增'"
      cnetered
      destroyOnClose
      :footer="null"
    >
      <a-form-model :model="tenantForm" ref="form" :rules="formRules">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="选择租户" prop="orgId">
              <a-select
                v-model="tenantForm.orgId"
                style="width: 100%"
                :disabled="titleState == 2 || titleState == 1"
              >
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
          <a-col :span="12">
            <a-form-model-item label="级别">
              <a-input v-model="tenantForm.level" :disabled="true"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="部门名称" prop="name">
              <a-input v-model="tenantForm.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="经营主体">
              <a-select
                v-model="tenantForm.operateEntity"
                show-search
                allowClear
                :show-arrow="false"
                :filter-option="false"
                style="width: 100%"
                @search="handleOpSearch"
                @focus="handleOpSearch"
                @change="handleOpOption"
              >
                <a-select-option v-for="item in select.operateEntity" :key="item.operateEntityName">{{item.operateEntityName}}</a-select-option>
              </a-select>
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
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import {
  GetOrganization,
  GetTenant,
  AddTenant,
  UpdateTenant,
  DelTenant,
  searchList
} from "../../services/stage/tenantOrganization";
const columns = [
  {
    title: "部门名称",
    dataIndex: "name",
  },
  {
    title: "部门级别",
    dataIndex: "level",
    align: "center",
  },
  {
    title: "所属租户",
    dataIndex: "opName",
    align: "center",
  },
  {
    title: "经营主体",
    dataIndex: "operateEntity",
    align: "center",
  },

  {
    title: "创建时间",
    dataIndex: "createDate",
    align: "center",
  },
  {
    title: "修改时间",
    dataIndex: "updateDate",
    align: "center",
  },

  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    scopedSlots: { customRender: "opreation" },
  },
];

export default {
  mixins: [mixin],
  data() {
    return {
      select: {},
      isAdmin: localStorage.getItem("isAdmin"),
      tenantForm: {
        name: "",
        parentId: "",
        level: "",
        orgId: "",
      },
      visible: false,
      tableLoading: false,
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
      },
      columns,
      expandedRowKeys: [],

      tableData: [],
      titleState: "",
      tenantList: [],
      editId: "",
      formRules: {
        name: [{ required: true, message: "请输入部门名称" }],
        orgId: [{ required: true, message: "请选择租户" }],
      },
    };
  },
  methods: {
    handleOpSearch(value) {
      searchList({operateEntityName: value?.trim()}).then(res => {
        this.select.operateEntity = res.data.data
        this.$forceUpdate()
      })
    },
    handleOpOption(value) {
      this.tenantForm.operateEntity = value
      this.operateEntityMaterial = this.select.operateEntity.find(item => item.operateEntityName == value) || {}
      this.tenantForm.operateEntityId = this.operateEntityMaterial.id
    },
     expandIcon(props) {
      // console.log(props);
      if (props.record.children.length > 0) {
        if (props.expanded) {
          //有数据-展开时候图标
          return (
            <a
              style="color: 'black',margin-right:0px"
              onClick={(e) => {
                props.onExpand(props.record, e);
              }}
            >
              <a-icon type="down" />{" "}
            </a>
          );
        } else {
          //有数据-未展开时候图标
          return (
            <a
              style="color: 'black' ,margin-right:0px"
              onClick={(e) => {
                props.onExpand(props.record, e);
              }}
            >
              <a-icon type="right" />
            </a>
          );
        }
      } else {
        //无数据-图标
        return (
          <span style="margin-right:0px">
            <a-icon />
          </span>
        );
      }
    },
    handleCancel() {
      this.visible = false;
    },
    delDepartment(record) {
      DelTenant({ id: record.id }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else if (res.data.code == 5000) {
          this.$message.warning(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getTenantList() {
      GetTenant().then((res) => {
        if (res.data.code == 200) {
          this.tenantList = res.data.data;
        } else {
          this.$message.error(res.data.$message);
        }
      });
    },
    getList() {
      this.tableLoading = true;
      GetOrganization().then((res) => {
        this.tableLoading = false;
        console.log(res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
    showModal(state, record) {
      this.visible = true;
      this.titleState = state;
      this.getTenantList();
      //顶级新增
      if (!record) {
        this.tenantForm.level = 1;
        this.tenantForm.parentId = 0;
        this.tenantForm = {
          name: "",
          parentId: 0,
          level: 1,
          orgId: "",
        };
      }
      //子级新增
      if (record && state == 2) {
        // this.tenantForm.level = Number(record.level) + 1;
        // this.tenantForm.parentId = record.id;
        this.tenantForm = {
          name: "",
          parentId: record.id,
          level: Number(record.level) + 1,
          orgId: record.orgId,
          operateEntity: record.operateEntity,
          operateEntityId: record.operateEntityId,
        };
      }
      //编辑
      if (record && state == 1) {
        this.editId = record.id;
        this.tenantForm = {
          name: record.name,
          parentId: record.parentId,
          level: record.level,
          orgId: record.orgId,
          operateEntity: record.operateEntity,
          operateEntityId: record.operateEntityId,
        };
      }
    },
    handleOk(e) {
      console.log(e);
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.titleState == 0 || this.titleState == 2) {
            const params = { ...this.tenantForm };
            AddTenant(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.message);
                this.visible = false;
                this.getList();
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
          if (this.titleState == 1) {
            const querys = {
              id: this.editId,
              name: this.tenantForm.name,
              operateEntity: this.tenantForm.operateEntity,
              operateEntityId: this.tenantForm.operateEntityId
            };
            UpdateTenant(querys).then((response) => {
              if (response.data.code == 200) {
                this.$message.success(response.data.message);
                this.visible = false;
                this.getList();
              } else {
                this.$message.error(response.data.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
  },
  activated() {
    this.handleOpSearch()
    this.getList();
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>


  <style scoped lang="less">
/deep/ .ant-modal-body {
  padding-bottom: 0 !important;
}
@import "index.less";
</style>