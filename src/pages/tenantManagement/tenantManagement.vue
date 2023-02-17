<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-form-model>
      <a-row>
        <a-col :span="22">
          <a-form-model-item class="formItemStyle formItemStylewidth">
            <a-input-search style="width: 100%;" placeholder="请输入租户名称" v-model.trim="form.opName" @search="onSearch"></a-input-search>
          </a-form-model-item>
        </a-col>
        <a-col :span="2">
          <div class="top-btn">
            <a-button type="primary" :disabled="!hasPermission('tenantMa_add')" @click="showModal(0, null)" >新增</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="table-item">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        row-key="id"
        :pagination="false"
        bordered
        size="middle"
      >
        <div slot="status" slot-scope="text, record">
          <a-icon v-if="record.status == 1" type="check" />
        </div>
        <div slot="relation" slot-scope="text, record">
          <a-icon v-if="record.relation == 1" type="check" />
        </div>
        <div slot="state" slot-scope="text, record">
          <a-switch
            :checked="record.state == 1 ? true : false"
            checked-children="启用"
            un-checked-children="禁用"
            :disabled="!hasPermission('tenantMa_onOff')"
            @click="switchClick(record)"
          >
          </a-switch>
        </div>
        <div slot="opreation" slot-scope="text, record">
          <a-button
            type="link"
            :disabled="!hasPermission('tenantMa_edit')"
            @click="showModal(1, record)"
            >编辑</a-button
          >
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
    <a-modal
      v-model="visible"
      :title="titleState ? '编辑' : '新增'"
      cnetered
      destroyOnClose
      :width="1100"
      :maskClosable='false'
    >
      <a-form-model :model="tenantForm" ref="form" :rules="formRules">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item label="租户标识id" prop="orgId">
              <a-input
                v-model.trim="tenantForm.orgId"
                :disabled="titleState == 1"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="运营主体编号" prop="opCode">
              <a-input v-model.trim="tenantForm.opCode"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="运营主体名称" prop="opName">
              <a-input v-model.trim="tenantForm.opName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="简称" prop="shortName">
              <a-input v-model.trim="tenantForm.shortName"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item label="英文名">
              <a-input v-model.trim="tenantForm.engName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="激活状态" prop="state">
              <a-select v-model="tenantForm.state">
                <a-select-option
                  v-for="(item, index) in stateList"
                  :key="index"
                  :value="item.value"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="公司资质">
              <a-input v-model.trim="tenantForm.qualification"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="行业简介">
              <a-input v-model.trim="tenantForm.description"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item label="联系人">
              <a-input v-model.trim="tenantForm.contactName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="联系电话" prop="contactPhone">
              <a-input v-model="tenantForm.contactPhone"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="电子邮箱">
              <a-input v-model="tenantForm.contactEmail"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="城市">
              <a-input v-model.trim="tenantForm.cityId"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item label="地址" prop="address">
              <a-input v-model.trim="tenantForm.address"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="邮编">
              <a-input v-model="tenantForm.postCode"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="开票抬头">
              <a-input v-model.trim="tenantForm.invcTitle"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="社会信用代码" prop="regCode">
              <a-input v-model="tenantForm.regCode"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item label="银行账户名" prop="bankAccountName">
              <a-input v-model.trim="tenantForm.bankAccountName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="银行账号" prop="bankAccount">
              <a-input v-model="tenantForm.bankAccount"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="开户行" prop="bankBranch">
              <a-input v-model.trim="tenantForm.bankBranch"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="财务联系人">
              <a-input v-model.trim="tenantForm.financialContact"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item label="财务联系电话" prop="financialPhone">
              <a-input v-model="tenantForm.financialPhone"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="注册地址" prop="regAddress">
              <a-input v-model.trim="tenantForm.regAddress"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="经营主体" prop="operateEntity">
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
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="OA组织">
              <a-cascader
                :field-names="{ label: 'subCompanyDesc', value: 'id', children: 'branches' }"
                :options="oaOption"
                :show-search="{ filter }"
                v-model="tenantForm.organizationIds"
                placeholder="请选则OA组织"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="出入库成本计算口进：" prop="statementSelect">
              <a-radio-group v-model="tenantForm.statementSelect">
                <a-radio :value="1">月度加权平均单价</a-radio>
                <a-radio :value="0">按入库批次独立计算</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="备注">
              <a-input type="textarea" v-model="tenantForm.remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-checkbox :checked="tenantForm.status == 1" @change="statusChange"
              >小程序使用是否发布</a-checkbox
            >
          </a-col>
          <a-col :span="6">
            <a-checkbox
              :checked="tenantForm.relation == 1"
              @change="relationChange"
              >首页商品展示是否跟销售价格相关</a-checkbox
            >
          </a-col>
          <a-col :span="6">
            <a-checkbox
              :checked="tenantForm.fromSdongpo == 1"
              @change="fromSdongpoChange"
              >是否来自苏东坡市场</a-checkbox
            >
          </a-col>
          <a-col :span="6">
            <a-checkbox
              :checked="tenantForm.nCState == 1"
              @change="nCStateChange"
              >是否需要进入NC系统打印凭证</a-checkbox
            >
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <div>
          <a-button type="primary" @click="handleOk" :loading='submitLoading'>提交</a-button>
          <a-button
            v-if="titleState == 0"
            style="margin-left: 10px"
            @click="handleReset"
            >清空</a-button
          >
          <a-button
            v-if="titleState == 1"
            style="margin-left: 10px"
            @click="handleCancel"
            >取消</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import {
  GetDefaultOrgId,
  GetTenantList,
  UpdateOpSubjectState,
  UpdateTenant,
  AddTenant,
  oa
} from "../../services/stage/tenantManagement";
import { searchList } from "@/services/stage/businessEntity"
const columns = [
  {
    title: "运营主体编号",
    dataIndex: "opCode",
    align: "center",
  },
  {
    title: "简称",
    dataIndex: "shortName",
    align: "center",
  },
  {
    title: "租户简介",
    dataIndex: "description",
    align: "center",
  },
  {
    title: "运营主体名称",
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
    title: "是否在小程序发布",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "首页商品展示是否与价格相关",
    dataIndex: "relation",
    align: "center",
    scopedSlots: { customRender: "relation" },
  },

  {
    title: "启用/禁用租户",
    dataIndex: "state",
    align: "center",
    scopedSlots: { customRender: "state" },
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
      submitLoading:false,
      tenantForm: {},
      visible: false,
      select: {},
      tableLoading: false,
      form: {},
      // //--分页
      // pagination: {
      //   rows: 10,
      //   total: 0,
      //   page: 1,
      // },
      columns,
      tableData: [],
      titleState: "",
      stateList: [
        { value: 1, name: "激活" },
        { value: 2, name: "未激活" },
      ],
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
        operateEntity: [{ required: true, message: "请输入经营主体" }],
        financialPhone: [{ required: true, message: "请输入财务联系电话" }],
        bankAccount: [{ required: true, message: "请输入银行账号" }],
        bankAccountName: [{ required: true, message: "请输入银行账户名" }],
        bankBranch: [{ required: true, message: "请输入开户行" }],
        statementSelect: [{ required: true, message: "出入库成本计算口径必选" }],
      },
      oaOption: [],
      copyParams: {},
      pageSizeOptions: ['10','20','50','100'],
      pagination: {total: 0, page: 1, size: 10},
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
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    recursionChild(newArr, arr) {
      if (this.typeis(arr) != 'array') return []
      arr.forEach(item => {
        let tepBox = {}
        tepBox.value = item.id
        tepBox.label = item.subCompanyDesc
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
      oa({}).then(res => {
        // let newArr = []
        // this.recursionChild(newArr, res.data.data);
        // this.oaOption = newArr;
        this.oaOption = res.data.data;
      })
    },
    statusChange(e) {
      this.tenantForm.status = e.target.checked ? 1 : 0;
    },
    relationChange(e) {
      this.tenantForm.relation = e.target.checked ? 1 : 0;
    },
    fromSdongpoChange(e) {
      this.tenantForm.fromSdongpo = e.target.checked ? 1 : 0;
    },
    nCStateChange(e) {
      this.tenantForm.nCState = e.target.checked ? 1 : 0;
    },
    handleCancel() {
      this.visible = false;
    },
    handleReset() {
      this.tenantForm = {
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
        status: 0,
        relation: 0,
        fromSdongpo: 0,
        nCState: 0,
        bankAccountName:'',
        statementSelect: 1,
      };
      this.getDefaultOrgId();
    },
    switchClick(record) {
      const params = {
        id: record.id,
        state: record.state,
      };
      params.state = params.state == 1 ? 2 : 1;
      UpdateOpSubjectState(params).then((res) => {
        if (res.data.code == 200) {
          switch (params.state) {
            case 1:
              this.getList();
              this.$message.success("该租户启用成功");
              break;
            case 2:
              this.getList();
              this.$message.success("该租户已禁用");
              break;

            default:
              break;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSearch() {
      this.getList("search")
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
    getList(flag) {
      this.pagination.page = 1
      this.tableLoading = true;
      let params = {
        opName: this.form.opName,
        page: this.pagination.page,
        rows: this.pagination.size,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      GetTenantList(params).then((res) => {
        this.tableLoading = false;
        const data = res.data.rows;
        this.tableData = JSON.parse(JSON.stringify(data));
      });
    },
    getDefaultOrgId() {
      GetDefaultOrgId().then((res) => {
        if (res.data.code == 200) {
          this.tenantForm.orgId = res.data.data;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取默认租户标识id错误"
          );
        }
      });
    },
    showModal(state, row) {
      this.visible = true;
      this.titleState = state;
      if (state) {
        this.tenantForm = {
          id: row.id,
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
          bankAccountName: row.bankAccountName,
          bankAccount: row.bankAccount,
          bankBranch: row.bankBranch,
          remark: row.remark,
          status: row.status,
          relation: row.relation,
          fromSdongpo: row.fromSdongpo,
          nCState: row.nCState,
          operateEntity: row.operateEntity,
          organizationIds: row.organizationIds?.split('/').map(item => item = +item)
        };
      } else {
        this.tenantForm = {
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
          bankAccountName: "",
          bankAccount: "",
          bankBranch: "",
          remark: "",
          status: 0,
          relation: 0,
          fromSdongpo: 0,
          nCState: 0,
          operateEntity: undefined,
          statementSelect: 1
        };
        this.getDefaultOrgId();
      }
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.tenantForm);
          const params = { ...this.tenantForm };
          params.organizationIds = params.organizationIds?.join('/')
          switch (this.titleState) {
            case 0:
              this.submitLoading=true
              AddTenant(params).then((res) => {
                this.submitLoading=false
                if (res.data.code == 200) {
                  this.visible = false;
                  this.getList();
                  this.$message.success(
                    res.data.message == "OK" ? "新增租户成功" : res.data.message
                  );
                } else {
                  this.$message.error(
                    res.data.message ? res.data.message : "新增租户失败"
                  );
                }
              });
              break;
            case 1:
              this.submitLoading=true
              UpdateTenant(params).then((res) => {
                this.submitLoading=false
                if (res.data.code == 200) {
                  this.visible = false;
                  this.getList();
                  this.$message.success(
                    res.data.message == "OK"
                      ? "修改租户信息成功"
                      : res.data.message
                  );
                } else {
                  this.$message.error(
                    res.data.message ? res.data.message : "修改租户信息失败"
                  );
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
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          opName: this.form.opName,
        })
      }
      this.tableLoading = true
      GetTenantList(this.copyParams).then(res => {
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
  activated() {
    this.form.opName = undefined
    this.pagination.page = 1;
    this.pagination.size = 10;
    this.pagination.total = 10;
    this.getList();
    this.handleOpSearch();
    this.oa();
    this.submitPagination();
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>


  <style scoped lang="less">
// /deep/.ant-form-item {
//   margin-bottom: 0;
// }
// /deep/ .ant-modal-body {
//   padding-bottom: 0 !important;
// }
@import "index.less";
</style>