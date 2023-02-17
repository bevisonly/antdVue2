<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <vxe-toolbar style="width: 100%; text-align: left">
      <template #buttons>
        <vxe-button status="primary" @click="addTenant()">新增</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      show-overflow
      row-id="id"
      :loading="loading"
      :data="tableData"
      border
      align="center"
    >
      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
      <vxe-table-column type="seq" width="60" title=""></vxe-table-column>
      <vxe-table-column
        field="opName"
        title="租户名称"
        sortable
      ></vxe-table-column>
      <vxe-table-column field="description" title="租户简介"></vxe-table-column>
      <vxe-table-column field="createDate" title="创建时间"></vxe-table-column>
      <vxe-table-column field="status" title="是否在小程序发布">
        <template #default="{ row }">
          <div v-if="row.status == 1">✔</div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="relation" width="210" title="首页商品展示是否跟价格相关">
        <template #default="{ row }">
          <div v-if="row.relation == 1">✔</div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="state" title="启用/禁用租户">
        <template #default="{ row }">
          <vxe-switch
            v-model="row.state"
            size="medium"
            :open-value="1"
            :close-value="0"
            open-label="启用"
            close-label="禁用"
            @change="tenantState(row)"
          ></vxe-switch>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <vxe-button status="primary" @click="editEvent(row)">编辑</vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-modal
      ref="xModal"
      v-model="showEdit"
      :title="selectRow ? '编辑' : '新增'"
      width="1000"
      resize
      destroy-on-close
    >
      <template #default>
        <vxe-form
          :data="formData"
          :rules="formRules"
          title-align="left"
          title-width="120"
          @submit="submitEvent"
        >
          <vxe-form-item
            title="租户标识id"
            field="orgId"
            span="12"
            :item-render="{
              name: 'input',
              attrs: {
                placeholder: '请输入id',
                disabled: selectRow ? true : false,
              },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="运营主体编号"
            field="opCode"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入运营主体编号' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="运营主体名称"
            field="opName"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请输入运营主体名称' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="公司资质"
            field="qualification"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写公司资质' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="激活状态"
            field="state"
            span="12"
            :item-render="{ name: '$select', options: stateList }"
          ></vxe-form-item>

          <vxe-form-item
            title="行业简介"
            field="description"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写行业简介' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="英文名"
            field="engName"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写英文名' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="简称"
            field="shortName"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写公司简称' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="联系人"
            field="contactName"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写联系人' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="联系电话"
            field="contactPhone"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写联系电话' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="电子邮箱"
            field="contactEmail"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写电子邮箱' },
            }"
          ></vxe-form-item>

          <vxe-form-item
            title="城市"
            field="cityId"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写城市' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="地址"
            field="address"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写地址' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="邮编"
            field="postCode"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写邮政编号' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="开票抬头"
            field="invcTitle"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写开票抬头' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="社会信用代码"
            field="regCode"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写社会信用代码' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="注册地址"
            field="regAddress"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写注册地址' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="财务联系人"
            field="financialContact"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写财务联系人' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="财务联系电话"
            field="financialPhone"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写财务联系电话' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="银行账号"
            field="bankAccount"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写银行账号' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="开户行"
            field="bankBranch"
            span="12"
            :item-render="{
              name: 'input',
              attrs: { placeholder: '请填写开户行' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="备注"
            field="remark"
            span="12"
            :item-render="{
              name: 'textarea',
              attrs: { placeholder: '请输入备注' },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="小程序使用是否发布"
            title-width="200"
            title-align="center"
            field="status"
            span="12"
            :item-render="{
              name: '$checkbox',
              props: { checkedValue: 1, uncheckedValue: 0 },
            }"
          ></vxe-form-item>
          <vxe-form-item
            title="首页商品展示是否跟销售价格相关"
            title-width="250"
            title-align="center"
            field="relation"
            span="12"
            :item-render="{
              name: '$checkbox',
              props: { checkedValue: 1, uncheckedValue: 0 },
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
    <!-- <vxe-pager
      border
      size="medium"
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
    </vxe-pager> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  TenantSearch,
  TenantUpdate,
  TenantAdd,
  TenantChange,
  TenantGetId,
} from "@/services/tenant.js";
// import { TenantAdd, TenantSearch } from "@/services/tenant.js";
export default {
  name: "NewPage",
  data() {
    return {
      loading: false,
      tableData: [],
      // tablePage: {
      //   currentPage: 1,
      //   pageSize: 10,
      //   totalResult: 0,
      // },
      selectRow: null,
      showEdit: false,
      stateList: [
        { label: "未激活", value: 0 },
        { label: "激活", value: 1 },
      ],
      formData: {
        orgId: null,
        opCode: "",
        opName: "",
        qualification: "",
        description: "",
        engName: "",
        shortName: "",
        state: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        cityId: "",
        address: "",
        postCode: "",
        invcTitle: "",
        regCode: "",
        regAddress: "",
        financialContact: "",
        financialPhone: "",
        bankAccount: "",
        bankBranch: "",
        remark: "",
        status: "",
        relation: "",
      },
      formRules: {
        orgId: [
          { required: true, message: "请输入租户id" },
          // { min: 1, max: 20, message: "长度在 1 到 20 个字符" },
        ],
        opCode: [
          { required: true, message: "请输入运营主体编号" },
          // { min: 2, max: 20, message: "长度在2到20个字符" },
        ],
        opName: [
          { required: true, message: "请输入运营主体名称" },
          // { min: 2, max: 20, message: "长度在2到20个字符" },
        ],
        shortName: [
          { required: true, message: "请输入简称" },
          // { max: 20, message: "长度不超过20个字符" },
        ],
        state: [{ required: true, message: "请选择激活状态" }],
        contactPhone: [{ required: true, message: "请输入手机号码" }],
        address: [{ required: true, message: "请输入地址" }],
        regCode: [{ required: true, message: "请输入社会信用代码" }],
        regAddress: [{ required: true, message: "请输入注册地址" }],
        financialPhone: [{ required: true, message: "请输入财务联系电话" }],
        bankAccount: [{ required: true, message: "请输入银行账号" }],
        bankBranch: [{ required: true, message: "请输入开户行" }],
      },
    };
  },
  created() {
    this.findList();
  },
  methods: {
    //启用/禁用
    tenantState(row) {
      this.$XModal
        .confirm(row.state == 1 ? "您确定要启用该账户" : "您确定要禁用该账户")
        .then((type) => {
          if (type == "confirm") {
            let stateParams = {
              id: row.id,
              state: row.state,
            };
            TenantChange(stateParams).then((res) => {
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
              this.findList();
            });
          }
          if (type == "cancel" || type == "close") {
            if (row.state == 1) {
              row.state = 0;
            } else {
              row.state = 1;
            }
          }
        });
    },
    //编辑按钮
    editEvent(row) {
      this.selectRow = row;
      this.showEdit = true;
      this.formData = {
        id:row.id,
        orgId: row.orgId,
        opCode: row.opCode,
        opName: row.opName,
        qualification: row.qualification,
        description: row.description,
        engName: row.engName,
        shortName: row.shortName,
        state: row.state,
        contactName: row.contactName,
        contactPhone: row.contactPhone,
        contactEmail: row.contactEmail,
        cityId: row.cityId,
        address: row.address,
        postCode: row.postCode,
        invcTitle: row.invcTitle,
        regCode: row.regCode,
        regAddress: row.regAddress,
        financialContact: row.financialContact,
        financialPhone: row.financialPhone,
        bankAccount: row.bankAccount,
        bankBranch: row.bankBranch,
        remark: row.remark,
        status: row.status,
        relation: row.relation,
      };
    },
    //新增按钮
    addTenant() {
      this.showEdit = true;
      this.selectRow = null;
      this.formData = {
        orgId: null,
        opCode: "",
        opName: "",
        qualification: "",
        description: "",
        engName: "",
        shortName: "",
        state: 1,
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        cityId: "",
        address: "",
        postCode: "",
        invcTitle: "",
        regCode: "",
        regAddress: "",
        financialContact: "",
        financialPhone: "",
        bankAccount: "",
        bankBranch: "",
        remark: "",
        status: "",
        relation: "",
      };
      //获取默认的orgid
      TenantGetId().then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.formData.orgId = res.data.data;
        }
      });
    },
    findList() {
      this.loading = true;
      setTimeout(() => {
        TenantSearch().then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.tableData = res.data.data;
          } else {
            this.$XModal.message({
              content: res.data.message,
              status: "error",
            });
          }
        });
        this.loading = false;
      }, 300);
    },
    // handlePageChange({ currentPage, pageSize }) {
    //   this.tablePage.currentPage = currentPage;
    //   this.tablePage.pageSize = pageSize;
    //   this.findList();
    // },
    submitEvent() {
      if (this.selectRow) {
        delete this.formData.orgId;
        // delete this.formData.createDate;
        // delete this.formData.createUser;
        // delete this.formData.updateDate;
        // delete this.formData.updateUser;
        TenantUpdate(this.formData).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$XModal.message({
              content: res.data.message,
              status: "success",
            });
            this.showEdit = false;
            this.findList();
          } else {
            this.$XModal.message({
              content: res.data.message,
              status: "error",
            });
            this.showEdit = false;
          }
        });
      } else {
        this.formData.orgId = Number(this.formData.orgId);
        TenantAdd(this.formData).then((resAdd) => {
          console.log(resAdd);
          if (resAdd.data.code == 200) {
            this.$XModal.message({
              content: resAdd.data.message,
              status: "success",
            });
            this.showEdit = false;
            this.findList();
          } else {
            this.showEdit = false;
            this.$XModal.message({
              content: resAdd.data.message,
              status: "error",
            });
          }
        });
      }
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