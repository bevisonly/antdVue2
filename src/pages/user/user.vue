<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <!-- 搜索 -->
    <vxe-toolbar style="text-align: left">
      <template #buttons>
        <vxe-input
          v-model="filterName"
          type="search"
          placeholder="输入搜索字段"
          @keyup="searchEvent"
        ></vxe-input>
        <vxe-button
          style="margin-left: 200px"
          status="primary"
          content="新增账户"
          @click="addAccount()"
        ></vxe-button>

        <vxe-button
          status="primary"
          content="关联账户"
          @click="accountLinking"
        ></vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      border
      resizable
      show-overflow
      highlight-hover-row
      ref="xTable"
      :data="searchList"
      style="margin-top: 20px"
    >
      <vxe-table-column
        field="accountId"
        title="用户账号"
        type="html"
      ></vxe-table-column>
      <vxe-table-column
        field="realName"
        title="真实姓名"
        type="html"
      ></vxe-table-column>
      <vxe-table-column
        field="opCode"
        title="主体"
        type="html"
      ></vxe-table-column>
      <vxe-table-column
        field="customerName"
        title="客户名称"
        width="250"
        type="html"
      ></vxe-table-column>
      <vxe-table-column
        field="supplierName"
        title="供应商名称"
        type="html"
      ></vxe-table-column>
      <vxe-table-column
        field="cellphone"
        title="手机号码"
        type="html"
      ></vxe-table-column>
      <vxe-table-column
        field="createDate"
        title="创建时间"
        type="html"
      ></vxe-table-column>
      <vxe-table-column title="是否启用" width="100">
        <template #default="{ row }">
          <vxe-switch
            v-model="row.state"
            size="medium"
            :open-value="1"
            :close-value="2"
            open-label="开启"
            close-label="关闭"
            @change="userState(row)"
          ></vxe-switch>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="200" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="editEvent(row)">编辑</vxe-button>
          <vxe-button
            status="primary"
            content="分配角色"
            @click="assignRoles(row)"
          ></vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 分页器 -->
    <vxe-pager
      :loading="loading"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.totalResult"
      :layouts="[
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump',
        'Sizes',
        'Total',
      ]"
      @page-change="handlePageChange"
    >
    </vxe-pager>
    <!-- 账户编辑的弹框 -->
    <vxe-modal
      ref="xModal"
      v-model="showEdit"
      width="800"
      resize
      destroy-on-close
      :title="
        selectRow
          ? selectRow == 1
            ? '关联UAP&保存'
            : '编辑&保存'
          : '新增&保存'
      "
    >
      <template #default>
        <dropdown
          :itemlist="uapUserList"
          v-if="selectRow == 1"
          v-on:chooseItem="selectedItem"
        ></dropdown>
        <vxe-form
          :data="formData"
          :rules="formRules"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        >
          <vxe-form-item
            title="账号名称"
            field="userName"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入账户名称', disabled: userBan },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="真实姓名"
            field="realName"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入真实姓名' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="手机号码"
            field="phone"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入手机号码' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="租户选择"
            field="orgId"
            span="13"
            :item-render="{
              name: '$select',
              options: tenantList,
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="用户类型"
            field="userType"
            span="13"
            :item-render="{
              name: '$select',
              options: partnerTypeList,
            }"
          ></vxe-form-item>
          <vxe-form-item
            v-if="formData.userType == 3"
            title="供应商"
            field="supplierId"
            span="13"
            :item-render="{
              name: '$select',
              attrs: { placeholder: '请输入供应商' },
              options: supplierList,
            }"
          ></vxe-form-item>
          <vxe-form-item
            v-if="formData.userType == 1"
            title="客户"
            field="customerId"
            span="13"
            :item-render="{
              name: '$select',
              attrs: { placeholder: '请选择客户' },
              options: customerList,
              events: { change: storeChange },
            }"
          ></vxe-form-item>
          <vxe-form-item
            v-if="formData.userType == 1"
            title="门店"
            field="storeId"
            span="13"
            :item-render="{
              name: '$select',
              attrs: { placeholder: '请选择门店' },
              options: storeList,
            }"
          ></vxe-form-item>
          <vxe-form-item
            v-if="selectRow == 1 || selectRow == null"
            title="邮箱"
            field="email"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入邮箱' },
            }"
          ></vxe-form-item>

          <vxe-form-item
            v-if="selectRow == null"
            title="密码"
            field="password"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { type: 'password', placeholder: '请设置密码' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            v-if="selectRow == null"
            title="确认密码"
            field="confirmPassword"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { type: 'password', placeholder: '请再次输入密码确认' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="描述"
            field="description"
            span="13"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入账号描述' },
            }"
          ></vxe-form-item>

          <vxe-form-item align="center" span="24">
            <template #default>
              <vxe-button type="submit" status="primary">保存</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
    <!-- 角色分配 -->
    <vxe-modal
      ref="xModal"
      v-model="showRoles"
      title="角色分配"
      width="800"
      min-width="600"
      min-height="300"
      destroy-on-close
      @close="closeRoles"
    >
      <vxe-table
        border
        ref="roleTable"
        :data="roleData"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        row-id="id"
        :checkbox-config="{ checkRowKeys: defaultSelecteRows, highlight: true }"
      >
        <vxe-table-column type="checkbox" width="50"></vxe-table-column>
        <vxe-table-column field="roleName" title="角色名称"></vxe-table-column>
        <vxe-table-column
          field="description"
          title="角色描述"
        ></vxe-table-column>
        <vxe-table-column field="orgName" title="归属市场"></vxe-table-column>
        <vxe-table-column field="created" title="创建时间"></vxe-table-column>
      </vxe-table>
      <vxe-toolbar style="text-align: center; margin-top: 40px">
        <template #buttons>
          <vxe-button status="primary" @click="saveAssign">保存</vxe-button>
          <vxe-button @click="cancelEvent">取消</vxe-button>
        </template>
      </vxe-toolbar>
    </vxe-modal>
  </div>
</template>

<script>
import dropdown from "../../components/dropdown/dropdown.vue";
import { tenantQuery, searchUserRoles } from "@/services/roleMa.js";
import XEUtils from "xe-utils";
// import {dateFormat} from '../../utils/treeData'
import { mapState } from "vuex";
import {
  getUapUserList,
  UserListPage,
  UserInsert,
  UpdateUserState,
  UserUpdate,
  UserDistribution,
  UserAssociate,
  partnerType,
} from "../../services/userMa";

export default {
  components: { dropdown },
  data() {
    return {
      //门店的数组
      storeList: [],
      //选中的数组
      chooseingList: [],
      //uap账户列表
      uapUserList: [],
      //禁用
      userBan: false,
      // 角色分配
      defaultSelecteRows: [], //默认选中的key
      roleData: [],
      rolesParam: {
        mainId: "",
        resourceIds: [],
      },
      //----------------
      //弹框显示
      showEdit: false,
      showRoles: false,
      selectRow: null,
      //表单提交
      //租户
      tenantList: [],
      //客户列表
      customerList: [],
      //供应商列表
      supplierList: [],
      partnerTypeList: [
        { label: "客户", value: 1 },
        { label: "内部用户", value: 2 },
        { label: "供应商", value: 3 },
      ],
      formData: {
        accountId: "",
        userName: "",
        realName: "",
        phone: "",
        cellphone: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
        userType: "",
        orgId: "",
        opId: "",
        opCode: "",
        opName: "",
        customerId: "",
        customerCode: "",
        customerName: "",
        supplierId: "",
        storeId: "",
        storeCode: "",
        storeName: "",
      },
      formRules: {
        // userName: [
        //   { required: true, message: "请输入账号名称" },
        //   { min: 2, max: 20, message: "长度在 2 到 20 个字" },
        // ],
        realName: [
          { required: true, message: "请输入真实姓名" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字" },
          { pattern: "^[\u4e00-\u9fa5]{2,5}$", message: "请输入正确的格式" },
        ],
        userName: [
          { required: true, message: "请输入账号名称" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字" },
          {
            pattern: "^[a-zA-Z0-9_\\u4e00-\\u9fa5]{2,20}$",
            message: "请输入正确的格式",
          },
        ],
        phone: [
          { required: true, message: "请填写手机号码" },
          { pattern: "^[1][3-9][0-9]{9}$", message: "请输入正确的手机号格式" },
        ],
        email: [
          // { required: true, message: "请绑定邮箱号码" },
          {
            pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
            message: "请输入正确的邮箱号码",
          },
        ],
        password: [
          { required: true, message: "请设置密码" },
          { pattern: "^.{6,20}$", message: "请输入正确的密码格式" },
        ],
        orgId: [{ required: true, message: "请选择租户" }],
        confirmPassword: [
          { required: true, message: "请再次输入密码" },
          { pattern: "^.{6,20}$", message: "请输入正确的密码格式" },
        ],
        userType: [{ required: true, message: "请选择要创建的用户类型" }],
      },
      searchList: [],
      filterName: "",
      tableData: [],
      totals: "",
      loading: false,
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
    };
  },
  created() {
    //获取初始数据
    this.getUserList();
    this.getTenantList();
  },
  methods: {
    // formatterSex({ cellValue }) {
    //   let item = this.partnerTypeList.find((item) => item.value === cellValue);
    //   return item ? item.label : "";
    // },
    storeChange() {
      console.log(9);
      console.log(this.formData.customerId);
      if (this.formData.customerId) {
        this.storeList = [];
        let params = {
          partnerType: 22,
          parentId: this.formData.customerId,
        };
        partnerType(params).then((res) => {
          console.log(res.data.data);
          res.data.data.forEach((v) => {
            v.label = v.shortName;
            v.value = v.id;
            this.storeList.push(v);
          });
        });
      }
    },
    closeRoles() {
      this.$refreshPage("/stage/stageCenter/userManagement");
    },
    //关联账户的按钮
    accountLinking() {
      this.showEdit = true;
      this.selectRow = 1;
      this.userBan = true;
      this.formData = {
        userName: "",
        realName: "",
        phone: "",
        cellphone: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
        userType: "",
        orgId: "",
        opId: "",
        opCode: "",
        opName: "",
        customerId: "",
        customerCode: "",
        customerName: "",
        supplierId: "",
        storeId: "",
        storeCode: "",
        storeName: "",
      };
      getUapUserList().then((res) => {
        console.log(res);
        if (res.data.code == "200") {
          this.uapUserList = res.data.data;
        }
      });
    },
    //关联账户搜索选中的逻辑
    selectedItem(value) {
      this.uapUserList.forEach((item) => {
        if (item.id == value) {
          this.formData = {
            userName: item.userName,
            accountId: item.userName,
            realName: item.realName,
            phone: item.cellphone,
            cellphone: item.cellphone,
            email: item.email,
            password: "",
            confirmPassword: "",
            description: item.description,
            userType: "",
            orgId: "",
            opId: "",
            opCode: "",
            opName: "",
            customerId: "",
            customerCode: "",
            customerName: "",
            supplierId: "",
            supplierCode: "",
            supplierName: "",
            storeId: "",
            storeCode: "",
            storeName: "",
          };
        }
      });
    },

    //分配角色的逻辑
    //保存分配角色
    saveAssign() {
      // this.rolesParam.resourceIds = [];
      if (this.chooseingList.length > 0) {
        this.rolesParam.resourceIds = [];
        this.chooseingList.forEach((item) => {
          this.rolesParam.resourceIds.push(item.id);
        });
      } else {
        this.rolesParam.resourceIds = [];
      }
      if (this.rolesParam) {
        UserDistribution(this.rolesParam).then((res) => {
          if (res.data.code == 200) {
            this.$XModal.message({
              content: "分配角色成功",
              status: "success",
            });
            this.showRoles = false;
            this.$refreshPage("/stage/stageCenter/userManagement");
          } else if (res.data.code == 5000) {
            this.$XModal.message({
              content: res.data.message,
              status: "error",
            });
          }
        });
      }
    },
    cancelEvent() {
      this.showRoles = false;
      this.rolesParam.resourceIds = [];
      this.$refreshPage("/stage/stageCenter/userManagement");
    },
    //全选事件
    selectAllEvent({ records }) {
      console.log(records);
      this.chooseingList = records;
    },

    //多选事件
    selectChangeEvent({ records }) {
      console.log(records);
      this.chooseingList = records;
    },
    //分配角色
    assignRoles(row) {
      this.rolesParam.mainId = row.id;
      this.showRoles = true;
      let role = {
        userId: row.id,
      };
      searchUserRoles(role).then((res) => {
        if (res.data.code == "200") {
          this.roleData = res.data.data;
          res.data.data.forEach((item) => {
            if (item.selected == true) {
              this.defaultSelecteRows.push(item.id);
              this.rolesParam.resourceIds = this.defaultSelecteRows;
            }
          });
        }
      });
    },

    //租户详情&&客户和供应商
    getTenantList() {
      tenantQuery().then((res) => {
        res.data.data.forEach((item) => {
          item.label = item.shortName;
          item.value = item.orgId;
        });

        this.tenantList = res.data.data;
      });
    },
    //表格的搜索功能
    searchEvent() {
      const filterName = XEUtils.toValueString(this.filterName)
        .trim()
        .toLowerCase();
      if (filterName) {
        const filterRE = new RegExp(filterName, "gi");
        const searchProps = [
          "accountId",
          "realName",
          "customerName",
          "supplierName",
          "cellphone",
          "createDate",
        ];
        const rest = this.tableData.filter((item) =>
          searchProps.some(
            (key) =>
              XEUtils.toValueString(item[key])
                .toLowerCase()
                .indexOf(filterName) > -1
          )
        );
        this.searchList = rest.map((row) => {
          const item = Object.assign({}, row);
          searchProps.forEach((key) => {
            item[key] = XEUtils.toValueString(item[key]).replace(
              filterRE,
              (match) => `<span class="keyword-lighten">${match}</span>`
            );
          });
          return item;
        });
        this.tablePage.totalResult = this.searchList.length;
      } else {
        this.searchList = this.tableData;
        this.tablePage.totalResult = this.totals;
      }
    },
    //初始化数据
    getUserList() {
      let params = {
        page: this.tablePage.currentPage,
        rows: this.tablePage.pageSize,
      };
      //获取分页的数据
      UserListPage(params).then((res) => {
        this.tablePage.totalResult = res.data.total;
        this.totals = res.data.total;
        this.tableData = res.data.rows;
        this.searchEvent();
      });
      //获取客户和供应商的数据
      partnerType().then((typeRes) => {
        typeRes.data.data.forEach((item) => {
          if (item.partnerType == "20") {
            item.customerId = item.id;
            item.customerName = item.partnerName;
            item.customerCode = item.partnerCode;
            item.label = item.customerName;
            item.value = item.customerId;
            this.customerList.push(item);
          }
          if (item.partnerType == "30") {
            item.supplierId = item.id;
            item.supplierName = item.partnerName;
            item.supplierCode = item.partnerCode;
            item.label = item.supplierName;
            item.value = item.supplierId;
            this.supplierList.push(item);
          }
        });
      });
    },

    //分页
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.getUserList();
    },
    //用户的状态修改
    userState(row) {
      this.$XModal
        .confirm(row.state == 1 ? "您确定要启用该账户" : "您确定要禁用该账户")
        .then((type) => {
          if (type == "confirm") {
            let stateParams = {
              id: row.id,
              state: row.state,
            };
            UpdateUserState(stateParams).then((res) => {
              if (res.data.code == "200") {
                this.$XModal.message({
                  content: "该账户状态修改成功",
                  status: "success",
                });
              } else if (res.data.code == "5000") {
                this.$XModal.message({
                  content: res.data.message,
                  status: "error",
                });
              }
            });
          }
          if (type == "cancel" || type == "close") {
            if (row.state == 1) {
              row.state = 2;
            } else {
              row.state = 1;
            }
          }
        });
    },
    //新增账户的按钮事件
    addAccount() {
      this.showEdit = true;
      this.selectRow = null;
      this.userBan = false;
      this.formData = {
        userName: "",
        realName: "",
        phone: "",
        cellphone: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
        userType: "",
        orgId: "",
        opId: "",
        opCode: "",
        opName: "",
        customerId: "",
        customerCode: "",
        customerName: "",
        supplierId: "",
        supplierCode: "",
        supplierName: "",
        storeId: "",
        storeCode: "",
        storeName: "",
      };
    },
    //表单弹框的提交操作
    submitEvent() {
      if (this.formData.password != this.formData.confirmPassword) {
        this.$XModal.message({
          content: "两次输入的密码不一致",
          status: "error",
        });
        return;
      }
      if (this.formData.customerId) {
        this.customerList.forEach((item) => {
          if (this.formData.customerId == item.id) {
            this.formData.customerCode = item.partnerCode;
            this.formData.customerName = item.partnerName;
          }
        });
      }
      if (this.formData.orgId) {
        this.tenantList.forEach((item) => {
          if (this.formData.orgId == item.orgId) {
            this.formData.opId = item.id;
            this.formData.opCode = item.opCode;
            this.formData.opName = item.opName;
          }
        });
      }
      if (this.selectRow == null) {
        UserInsert(this.formData).then((res) => {
          if (res.data.code == "200") {
            this.$XModal.message({
              content: "新增账户成功",
              status: "success",
            });
            this.showEdit = false;
            this.$refreshPage("/stage/stageCenter/userManagement");
          } else if (res.data.code == "5000") {
            this.$XModal.message({
              content: res.data.message,
              status: "error",
            });
          }
        });
      }
      if (this.selectRow && this.selectRow != "1") {
        UserUpdate(this.formData).then((uRes) => {
          if (uRes.data.code == "200") {
            this.$XModal.message({
              content: "修改用户信息成功",
              status: "success",
            });
            this.showEdit = false;
            this.$refreshPage("/stage/stageCenter/userManagement");
          } else if (uRes.data.code == "5000") {
            this.$XModal.message({
              content: uRes.data.message,
              status: "error",
            });
          }
        });
      }
      if (this.selectRow == "1") {
        UserAssociate(this.formData).then((uapRes) => {
          if (uapRes.data.code == "200") {
            this.$XModal.message({
              content: "关联用户成功",
              status: "success",
            });
            this.showEdit = false;
            this.$refreshPage("/stage/stageCenter/userManagement");
          } else if (uapRes.data.code == "5000") {
            this.$XModal.message({
              content: uapRes.data.message,
              status: "error",
            });
          }
        });
      }
    },
    //编辑账户事件
    editEvent(row) {
      if (row.customerName) {
        this.customerList.forEach((item) => {
          if (item.customerName == row.customerName) {
            row.customerId = item.customerId;
          }
        });
      }
      if (row.supplierName) {
        this.supplierList.forEach((item) => {
          if (item.supplierName == row.supplierName) {
            row.supplierId = item.supplierId;
          }
        });
      }

      this.showEdit = true;
      this.selectRow = row;
      this.userBan = true;
      this.formData = {
        id: row.id,
        userName: row.accountId,
        realName: row.realName,
        phone: row.cellphone,
        cellphone: row.cellphone,
        email: "",
        password: "",
        confirmPassword: "",
        description: row.description,
        userType: row.userType,
        orgId: row.orgId,
        opId: "",
        opCode: "",
        opName: "",
        customerId: row.customerId,
        customerCode: "",
        customerName: row.customerName,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        supplierCode: "",
        storeId: "",
        storeCode: "",
        storeName: "",
      };
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>


  <style scoped lang="less">
@import "index.less";
</style>