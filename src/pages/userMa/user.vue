<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="top-item">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input-search v-model.trim="searchWords" placeholder="搜索账户" @search="onSearch" allow-clear />
        </a-col>
        <a-col :span="6">
          <a-tree-select
            style="width: 90%"
            v-model="organizationIds"
            :dropdown-style="{ maxHeight: '460px', overflow: 'auto' }"
            :tree-data="gData"
            @select="onSelectTree"
            show-search
            placeholder="所属部门"
            allowClear
          />
          <span class="cursorPin spanStyle" @click="onSearch"><a-icon type="search"></a-icon></span>
          <!-- <a-input-search placeholder="所属部门" @change="onTreeSearch" @focus="visibleTree = !0"/>
          <div class="tree" v-show="visibleTree">
            <div class="flex-ed closeBtn">
              <a-icon type="close" style="font-size: 20px;" @click="visibleTree = !1;organizationIds = {}.a"></a-icon>
            </div>
            <div class="treeHeight">
              <h1 v-show="!gData.length" style="text-align: center;color: grey;margin-top: 40px;">没有数据</h1>
              <a-tree showLine :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand" @select="onSelectTree">
                <a-icon slot="switcherIcon" type="down" />
                <template slot="title" slot-scope="{title}">
                  <span v-if="title.indexOf(searchValue) > -1">
                    {{title.substr(0, title.indexOf(searchValue))}}
                    <span style="color: green;font-size: 1.05rem">{{searchValue}}</span>
                    {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
                  </span>
                  <span v-else>{{ title }}</span>
                </template>
              </a-tree>
            </div>
          </div> -->
        </a-col>
        <a-button-group style="margin-left: 50px">
          <a-button type="primary" :disabled="!hasPermission('userMa_add')" @click="editRoles('', 0)">新增账户</a-button>
          <a-button type="primary" :disabled="!hasPermission('userMa_relation')" @click="editRoles('', 2)">关联账户</a-button>
          <a-button type="primary" :disabled="!hasPermission('userMa_oaAdd')" @click="editRoles('', 3)">关联OA账户</a-button>
        </a-button-group>
      </a-row>
      <a-row> </a-row>
    </div>
    <div class="user-table" style="margin-top: 30px">
      <a-table
        bordered
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="tableLoading"
        rowKey="id"
        size="middle"
        :scroll="{ x: 1450 }"
      >
        <span slot="userType" slot-scope="text">
          {{text == 1 ? '供应商' : text == 3 ? '供应商' : '内部用户'}}
        </span>
        <span slot="state" slot-scope="text, record">
          <a-switch
            :checked="record.state == 1 ? true : false"
            :disabled="!hasPermission('userMa_onOff')"
            checked-children="启用"
            un-checked-children="禁用"
            @click="switchClick(record)"
          >
          </a-switch>
        </span>
        <span slot="opreation" slot-scope="text, record">
          <a-button type="link" :disabled="!hasPermission('userMa_edit')" @click="editRoles(record, 1)">编辑</a-button>
          <a-button type="link" :disabled="!hasPermission('userMa_roles')" @click="assignRoles(record)">分配角色</a-button>
          <a-button type="link" :disabled="!hasPermission('userMa_dataAuthority')" @click="toDataPermission(record)"
            >数据权限</a-button
          >
        </span>
      </a-table>
      <!-- 分页 -->
      <div class="pagination">
        <a-pagination
          :page-size-options="['10', '20', '30', '40', '50']"
          :total="pagination.total"
          show-size-changer
          :page-size="pagination.rows"
          show-quick-jumper
          :current="pagination.page"
          :show-total="(total) => `共 ${total} 条记录`"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        >
        </a-pagination>
      </div>
    </div>
    <a-modal :width="800" v-model="visible" title="角色分配">
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :loading="rolesLoading"
        rowKey="id"
        :pagination="false"
        :columns="rolesColumns"
        :data-source="rolesTable"
        bordered
      ></a-table>
      <template slot="footer">
        <div>
          <a-button type="primary" @click="saveRoles">保存分配</a-button>
        </div>
      </template>
    </a-modal>
    <EditUser ref="editUser" />
    <DataPermission ref="dataPermission" />
    <modalOA ref="modalOARef" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import {
  UserListPage,
  UpdateUserState,
  GetUserRoles,
  UserDistribution,
} from "../../services/stage/userMa";
import EditUser from "./editUser.vue";
import DataPermission from "./dataPermission.vue";
import modalOA from "./modalOA";
import { oa } from "../../services/stage/tenantManagement";
const columns = [
  {
    align: "center",
    title: "用户账号",
    dataIndex: "accountId",
    width: 120,
  },
  {
    align: "center",
    title: "真实姓名",
    dataIndex: "realName",
    width: 120,
  },
  {
    align: "center",
    title: "用户类型",
    dataIndex: "userType",
    width: 120,
    scopedSlots: {customRender: "userType"}
  },
  {
    align: "center",
    title: "主体名称",
    dataIndex: "opName",
    width: 300,
  },
  {
    align: "center",
    title: "主体编码",
    dataIndex: "opCode",
    width: 150,
  },
  {
    align: "center",
    title: "客户名称",
    dataIndex: "customerName",
    width: 200,
  },
  {
    align: "center",
    title: "供应商名称",
    dataIndex: "supplierName",
    width: 200,
  },
  {
    align: "center",
    title: "手机号码",
    dataIndex: "cellphone",
    width: 150,
  },
  {
    align: "center",
    title: "创建时间",
    dataIndex: "createDate",
    width: 200,
  },
  {
    align: "center",
    title: "是否启用",
    dataIndex: "state",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "opreation",
    width: 300,
    scopedSlots: { customRender: "opreation" },
    fixed: "right",
  },
];
const rolesColumns = [
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
];
const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    const title = node.title
    dataList.push({key, title})
    if (node.children) generateList(node.children)
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
export default {
  components: { EditUser, DataPermission, modalOA },
  mixins: [mixin],
  data() {
    return {
      visibleTree: false,
      organizationIds: undefined,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: [],
      mainId: "",
      rolesLoading: false,
      selectedRowKeys: [],
      rolesColumns,
      rolesTable: [],
      visible: false,
      tableLoading: false,
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
      },
      columns,
      searchWords: "",
      supplierList: [],
      tableData: [],
    };
  },
  methods: {
    recursionChild(newArr, arr) {
      if (this.typeis(arr) != 'array') return []
      arr.forEach(item => {
        let tepBox = {}
        tepBox.key = item.id
        tepBox.id = item.id
        tepBox.value = item.subCompanyDesc+'||'+item.id
        tepBox.title = item.subCompanyDesc
        tepBox.scopedSlots = {title: "title"}
        if (item.branches?.length) {
          tepBox.children = []
          newArr.push(tepBox)
          this.recursionChild(tepBox.children, item.branches)
        } else {
          newArr.push(tepBox)
        }
      })
    },
    oa() {
      oa({}).catch(res => {
        let data = []
        let treeData = res.data?.data || []
        this.recursionChild(data, treeData)
        this.gData = data
        generateList(data)
      })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onSelectTree(v) {
      this.organizationIds = v
      this.getUserList()
    },
    onTreeSearch(e) {
      let value = e.target.value;
      if (!value?.trim()) return
      let expandedKeys = []
      expandedKeys = dataList.map(item => {
        if (item.title.indexOf(value) > -1) return getParentKey(item.key, this.gData);
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {expandedKeys, searchValue: value, autoExpandParent: !0});
    },
    //跳转数据权限
    toDataPermission(record) {
      this.$refs.dataPermission.showPermissionModal(record);
    },
    //角色编辑新增
    editRoles(record, state) {
      record.insertType == 1 || state == 3?
      this.$refs.modalOARef.openModalOA(record, state) :
      this.$refs.editUser.showUserModal(record, state)
    },
    //分配角色保存
    saveRoles() {
      const params = {
        mainId: this.mainId,
        resourceIds: [...this.selectedRowKeys],
      };
      UserDistribution(params).then((res) => {
        if (res.data.code == 200) {
          this.visible = false;
          this.$message.success(res.data.message);
          this.getUserList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //角色分配
    assignRoles(record) {
      this.mainId = record.id;
      this.selectedRowKeys = [];
      this.rolesLoading = true;
      GetUserRoles({ userId: record.id }).then((res) => {
        this.rolesLoading = false;
        if (res.data.code == 200) {
          this.rolesTable = res.data.data;
          this.rolesTable.forEach((item) => {
            if (item.selected == true) {
              this.selectedRowKeys.push(item.id);
            }
          });
          this.visible = true;
        }
      });
    },
    //状态切换
    switchClick(record) {
      const params = {
        id: record.id,
        state: record.state,
      };
      params.state = params.state == 1 ? 2 : 1;
      // this.switchLoading = true;

      UpdateUserState(params).then((res) => {
        // this.switchLoading = false;
        if (res.data.code == 200) {
          switch (params.state) {
            case 1:
              this.$message.success("该用户账号启用成功");
              break;
            case 2:
              this.$message.success("该用户账号已禁用");
              break;

            default:
              break;
          }
          this.getUserList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSearch() {
      this.getUserList();
    },
    //分页
    pageChange(index) {
      this.pagination.page = index;
      this.getUserList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.page = 1;
      this.pagination.rows = pageSize;
      this.getUserList();
    },
    getUserList() {
      const params = {
        keywords: this.searchWords,
        organizationIds: !this.organizationIds ? undefined : this.organizationIds?.split("||")[1] + "",
        ...this.pagination,
      };
      this.tableLoading = true;
      UserListPage(params).then((res) => {
        this.tableLoading = false;
        this.tableData = res.data.rows;
        this.pagination.total = res.data.total;
      });
    },
  },
  activated() {
    this.getUserList()
    this.oa()
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>


<style scoped lang="less">
@import "index.less";
</style>