<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="search-item">
      <a-col :span="6">
        <a-input-search
          v-model.trim="keyword"
          style="width: 100%"
          placeholder="请输入搜索"
          @search="getList('one')"
          allowerClear
        ></a-input-search>
      </a-col>
      <a-space>
        <a-button
          type="primary"
          @click="editPartner('', 'add')"
          :disabled="!hasPermission('enterprise_add')"
          >新增</a-button
        >
        <a-button
          type="primary"
          @click="batchDel"
          :disabled="!hasPermission('enterprise_batch_delete')"
          >删除</a-button
        >
      </a-space>
    </div>
    <div class="table-item" style="margin-top: 10px">
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :loading="loading"
        rowKey="id"
        :pagination="false"
        :columns="columns"
        :data-source="tableList"
      >
        <div slot="opreation" slot-scope="text, record">
          <a-button
            type="link"
            @click="editPartner(record, 'edit')"
            :disabled="!hasPermission('enterprise_edit')"
            >编辑</a-button
          >
          <a-popconfirm
            title="确定要删除这条数据吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="delItem(record)"
            :disabled="!hasPermission('enterprise_delete')"
          >
            <a-button
              type="link"
              :disabled="!hasPermission('enterprise_delete')"
              >删除</a-button
            >
          </a-popconfirm>
        </div></a-table
      >
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
    <a-modal
      :width="1200"
      destroyOnClose
      v-model="visible"
      :title="editTit"
      :maskClosable="false"
      :footer="false"
    >
      <a-form-model :model="form" :rules="rules" ref="form">
        <a-row :gutter="[20, 10]">
          <a-col :span="12">
            <a-form-model-item
              label="企业名称"
              prop="companyName"
              class="form-required"
            >
              <a-input
                v-model.trim="form.companyName"
                :maxLength="50"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="英文名称" prop="englishName">
              <a-input
                v-model.trim="form.englishName"
                :maxLength="100"
                @input="
                  form.englishName = form.englishName.replace(
                    /[^\a-\z\A-\Z\s\@\.\-\+\=\~\!\#\$\%\^\&\*\(\)\,\?\<\>\/]/g,
                    ''
                  )
                "
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="法人代表"
              prop="legalRepresentative"
              class="form-required"
            >
              <a-input
                v-model.trim="form.legalRepresentative"
                :maxLength="20"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="境内外"
              prop="domesticOrForeign"
              class="form-required"
            >
              <a-select placeholder="" v-model="form.domesticOrForeign">
                <a-select-option value="境内"> 境内 </a-select-option>
                <a-select-option value="境外"> 境外 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="统一信用代码"
              prop="uniformCreditCode"
              :class="form.domesticOrForeign == '境外' ? '' : 'form-required'"
            >
              <a-input
                v-model.trim="form.uniformCreditCode"
                :maxLength="18"
                @input="
                  form.uniformCreditCode = form.uniformCreditCode.replace(
                    /[\W]/g,
                    ''
                  )
                "
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="联系人1"
              prop="contactOne"
              class="form-required"
            >
              <a-input v-model.trim="form.contactOne" :maxLength="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="联系人1电话"
              class="form-required"
            >
              <a-input v-model.trim="form.contactOnePhone" :maxLength="11" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人2" prop="contactTwo">
              <a-input v-model.trim="form.contactTwo" :maxLength="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人2电话">
              <a-input v-model.trim="form.contactTwoPhone" :maxLength="11" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="form.domesticOrForeign === '境内'">
            <a-form-model-item
              label="办公注册地"
              prop="officeOrRegistration"
              class="form-required"
            >
              <a-select
                v-model="pcd.province"
                style="width: 30%"
                @change="provinceChange"
                showSearch
              >
                <a-select-option
                  v-for="item in provinceList"
                  placeholder="选择省份"
                  :key="item.id"
                  :value="item.name"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
              <a-select
                v-model="pcd.city"
                style="width: 30%; margin-left: 10px"
                placeholder="选择城市"
                :disabled="!pcd.province"
                @change="cityChange"
                showSearch
              >
                <a-select-option
                  v-for="item in cityList"
                  :key="item.id"
                  :value="item.name"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
              <a-select
                v-model="pcd.district"
                style="width: 30%; margin-left: 10px"
                placeholder="选择区县"
                :disabled="!pcd.province && !pcd.district"
                showSearch
              >
                <a-select-option
                  v-for="item in districtList"
                  :key="item.id"
                  :value="item.name"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="详细地址"
              prop="address"
              class="form-required"
            >
              <a-input v-model.trim="form.address"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="fontStyle flex-sb">
          <span>银行账户信息</span>
          <a-button type="primary" icon="plus" @click="addBank" title="最多10条">添加</a-button>
        </div>
        <a-row>
          <a-col :span="24">
            <a-table
              :data-source="form.openSeaCompanyBankList"
              :columns="columnsBank"
              rowKey="fakeId"
              size="small"
              :scroll="{y: form.openSeaCompanyBankList[4] ? 800 : 0}"
              :pagination="false"
            >
              <span slot="bankAccountNameTitle" class="required"> 银行户名 </span>
              <div tips="银行户名" slot="bankAccountName" slot-scope="text, record">
                <a-input v-model.trim="record.bankAccountName" :maxLength="50"></a-input>
              </div>
              <span slot="bankBranchTitle" class="required"> 开户银行 </span>
              <div tips="开户银行" slot="bankBranch" slot-scope="text, record">
                <a-select
                  v-model="record.bankBranch"
                  placeholder="请搜索选择开户银行"
                  @search="bankName"
                  @focus="bankName('null')"
                  showSearch
                  @select="selectBnak(record)"
                >
                  <a-select-option v-for="item in bankBranchList" :key="item.bankBranch" >{{ item.bankBranch }}</a-select-option>
                </a-select>
              </div>
              <span slot="bankNameTitle" class="required"> 开户行名称 </span>
              <div tips="开户行名称" slot="bankName" slot-scope="text, record">
                <a-input v-if="record.bankBranch == '其他银行'" :maxLength="50" v-model.trim="record.bankName"></a-input>
                <a-select
                  v-else
                  v-model="record.bankName"
                  @search="bankBranch"
                  @focus="bankBranchFocus(record.bankBranch)"
                  :disabled="!record.bankBranch"
                  @select="selectBnakName"
                  showSearch
                >
                  <a-select-option v-for="item in bankNameList" :key="item.bankName" >{{ item.bankName }}</a-select-option>
                </a-select>
              </div>
              <span slot="bankAccountTitle" class="required"> 银行账号 </span>
              <div tips="银行账号" slot="bankAccount" slot-scope="text, record">
                <a-input v-model.trim="record.bankAccount" @input="record.bankAccount = record.bankAccount.replace(/[^0-9A-z]/g, '')" :maxLength="50"/>
              </div>
              <div tips="操作" slot="operation" slot-scope="text, record, index">
                <a-button type="primary" shape="circle" icon="delete" v-if="index != 0" @click="deleteItem(index)"></a-button>
              </div>
            </a-table>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-form-model-item style="text-align: center">
            <a-button type="primary" @click="saveEdit">保存</a-button>
            <a-button style="margin-left: 10px" @click="handleClose"
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
  DeleteCompany,
  GetList,
  GetProvinceList,
  GetCityOrDistrictList,
  InsertCompany,
  UpdateCompany,
  DeleteCompanyBatch,
  BankName
} from "../../services/resourceCenter/resourceCenter";
const columnsBank = [
  {slots: { title: "bankAccountNameTitle" }, titleTips: '银行户名', dataIndex: 'bankAccountName', width: 120, scopedSlots: { customRender: "bankAccountName" }},
  {slots: { title: "bankBranchTitle" }, titleTips: '开户银行', dataIndex: 'bankBranch', width: 160, scopedSlots: { customRender: "bankBranch" }},
  {slots: { title: "bankNameTitle" }, titleTips: '开户行名称', dataIndex: 'bankName', width: 260, scopedSlots: { customRender: "bankName" }},
  {slots: { title: "bankAccountTitle" }, titleTips: '银行账号', dataIndex: 'bankAccount', width: 200, scopedSlots: { customRender: "bankAccount" }},
  {title: '操作', dataIndex: 'operation', width: 80, align: "center", scopedSlots: { customRender: "operation" }},
]
export default {
  name: "highseasEnterprise",

  data() {
    return {
      columnsBank,
      bankBranchValue: undefined,
      pcd: {
        province: undefined,
        city: undefined,
        district: undefined,
      },
      columns: [
        {
          align: "center",
          title: "序号",
          dataIndex: "keyIndex",
        },
        {
          align: "center",
          title: "合作商ID",
          dataIndex: "companyCode",
        },
        {
          align: "center",
          title: "合作商名称",
          dataIndex: "companyName",
        },
        {
          align: "center",
          title: "所在地",
          dataIndex: "city",
        },
        {
          align: "center",
          title: "操作",
          dataIndex: "opreation",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      tableList: [],
      keyword: "",
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
      },
      selectedRowKeys: [],
      loading: false,
      visible: false,
      editTit: "基本信息",
      form: {
        companyName: "",
        englishName: "",
        legalRepresentative: "",
        uniformCreditCode: "",
        contactOne: "",
        contactOnePhone: "",
        contactTwo: "",
        contactTwoPhone: "",
        officeOrRegistration: "",
        address: "",
        domesticOrForeign: "境内",
        bankBranch: "",
        bankAccount: "",
        bankName: "",
        openSeaCompanyBankList: [],
      },
      rules: {
        // uniformCreditCode: [
        //   {
        //     pattern:
        //       "^([0-9A-HJ-NPQRTUWXY]{2}d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]d{14})$",
        //     message: "统一信用代码格式有误",
        //   },
        // ],

        contactOnePhone: [
          { pattern: "^[1][3-9][0-9]{9}$", message: "手机号格式有误" },
        ],
        // englishName: [
        //   {
        //     pattern: "^[a-zA-Z0-9_\\u4e00-\\u9fa5]{2,20}$",
        //     message: "请输入正确的格式",
        //   },
        // ],
      },
      provinceList: [],
      cityList: [],
      districtList: [],
      editState: "",
      bankList: [],
      bankBranchList: [],
      bankNameList: [],
    };
  },
  activated() {
    console.log(this.$route);
    this.getList();
  },
  methods: {
    selectBnak(record) {
      record.bankName = undefined
    },
    selectBnakName() {
      this.$forceUpdate()
    },
    addBank() {
      if (this.form.openSeaCompanyBankList.length == 10) {
        this.$message.error("银行账户信息为最多10条")
        return
      }
      this.form.openSeaCompanyBankList.push({fakeId: this.form.openSeaCompanyBankList.length})
    },
    deleteItem(index) {
      this.form.openSeaCompanyBankList.forEach((vip, i) => {vip.fakeId = i})
      this.form.openSeaCompanyBankList.splice(index, 1)
    },
    bankName(value) {
      if (value === "null") {
        value = undefined
      } else if (!value?.trim()){
        return
      }
      BankName({type: "bankBranch", bankBranch: value}).then(res => {
        if (res.data.code === "200") {
          this.bankBranchList = res.data.data
        }
      })
    },
    bankBranchFocus(bankBranch) {
      this.bankBranchValue = bankBranch
      BankName({type: "bankName", bankBranch}).then(res => {
        if (res.data.code === "200") {
          this.bankNameList = res.data.data
        }
      })
    },
    bankBranch(value) {
      if (value === "null") value = undefined;
      let parmas = {
        type: "bankName",
        bankBranch: this.bankBranchValue,
        bankName: value
      }
      BankName(parmas).then(res => {
        if (res.data.code === "200") {
          this.bankNameList = res.data.data
        }
      })
    },
    //开户银行
    batchDel() {
      if (this.selectedRowKeys && this.selectedRowKeys.length === 0) {
        this.$warning({
          title: "未选中内容",
          centered: true,
          cancelText: "关闭",
        });
        return;
      }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        let temp = JSON.parse(JSON.stringify(this.selectedRowKeys));
        let _this = this;
        this.$confirm({
          title: "删除提示",
          content: "确定要删除吗?",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            const params = [...temp];
            DeleteCompanyBatch(params).then((res) => {
              const data = res.data;
              if (data.code === "200") {
                _this.$message.success(data.message);
                _this.getList('one');
              } else {
                _this.$message.error(data.message);
              }
            });
          },
        });
      }
    },
    //城市改变
    cityChange(value, option) {
      console.log(option);
      this.getCityOrDistrictList(option.data.key || "", "district");
    },
    //省份改变
    provinceChange(value, option) {
      console.log(option);
      this.getCityOrDistrictList(option.data.key || "", "city");
      this.pcd.city = undefined;
      this.pcd.district = undefined;
    },
    getCityOrDistrictList(id, state) {
      GetCityOrDistrictList({ parentId: id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          switch (state) {
            case "city":
              this.cityList = [];
              this.pcd.city = undefined;
              this.cityList = data.data || [];
              break;
            case "district":
              this.districtList = [];
              this.pcd.district = undefined;
              this.districtList = data.data || [];
              break;

            default:
              break;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    delItem(record) {
      DeleteCompany({ id: record.id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(data.message);
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getProvince() {
      GetProvinceList().then((res) => {
        if (res.data.code === "200") {
          this.provinceList = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getList(v) {
      if (v == "one") this.pagination.page = 1
      const params = {
        ...this.pagination,
        keyword: this.keyword,
      };
      GetList(params).then((res) => {
        this.tableList = res.data.rows || [];
        this.pagination.total = res.data.total;
        if (this.tableList && this.tableList.length > 0) {
          this.tableList.forEach((item, index) => {
            item.keyIndex = index + 1;
            if (this.form.domesticOrForeign === "境内") {
              item.city =
                item.officeOrRegistration.split("/")[1] ||
                item.officeOrRegistration;
            }
          });
        }
      });
    },
    saveEdit() {
      if (this.form.openSeaCompanyBankList.some((vip) => !vip.bankAccountName || !vip.bankBranch || !vip.bankName ||  !vip.bankAccount)) {
        this.$message.error('请检查银行账户信息列表是否都已填写')
        return
      }
      let str = "";
      let temp = JSON.parse(JSON.stringify(this.form));
      if (this.pcd && this.form.domesticOrForeign === "境内") {
        str = `${this.pcd.province}/${this.pcd.city}/${this.pcd.district}`;
        temp.officeOrRegistration = str;
      } else {
        temp.officeOrRegistration = "";
      }
      let errorState = false;
      let errorData = [
        "companyName",
        "legalRepresentative",
        "domesticOrForeign",
        "contactOne",
        "contactOnePhone",
        "address",
        "officeOrRegistration",
        "uniformCreditCode",
      ];
      if (this.form.domesticOrForeign === "境外") {
        errorData.splice(-2, 2);
      }
      errorData.forEach((item) => {
        if (!temp[item]) {
          errorState = true;
        }
        if (
          temp[item] === "境内" &&
          (!this.pcd.province || !this.pcd.city || !this.pcd.district)
        ) {
          errorState = true;
        }
      });
      if (errorState) {
        this.$warning({
          title: "存在必填项为空请核对",
          centered: true,
          okText: "关闭",
        });
        return;
      }
      let openSeaCompanyBankList = []
      openSeaCompanyBankList = this.deepClone(this.form.openSeaCompanyBankList) || []
      openSeaCompanyBankList?.forEach((vip) => delete vip.fakeId)
      const params = {
        ...temp,
        openSeaCompanyBankList,
      };
      if (this.editState === "add") {
        InsertCompany(params).then((res) => {
          const data = res.data;
          if (data.code === "200") {
            this.$message.success(data.message);
            this.$refreshPage(
              "/resourceCenter/partnersManagement/highseasEnterprise"
            );
            this.visible = false;
          } else {
            this.$message.error(data.message);
          }
        });
      }
      if (this.editState === "edit") {
        delete params.keyIndex;
        UpdateCompany(params).then((res) => {
          const data = res.data;
          if (data.code === "200") {
            this.$message.success(data.message);
            // this.getList();
            this.$refreshPage(
              "/resourceCenter/partnersManagement/highseasEnterprise"
            );
            this.visible = false;
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    handleClose() {
      this.visible = false;
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
    editPartner(record, state) {
      this.visible = true;
      this.editState = state;
      this.bankBranchValue = undefined;
      if (state === "edit") {
        record.openSeaCompanyBankList.forEach((vip, i) => vip.fakeId = i)
        this.form = this.deepClone(record);
        this.pcd.province = this.deepClone(this.form.officeOrRegistration.split("/")[0] || "");
        this.pcd.city = this.deepClone(this.form.officeOrRegistration.split("/")[1] || "");
        this.pcd.district = this.deepClone(this.form.officeOrRegistration.split("/")[2] || "");
        console.log(this.pcd);
      }
      if (state === "add") {
        this.form = {
          companyName: "",
          englishName: "",
          legalRepresentative: "",
          uniformCreditCode: "",
          contactOne: "",
          contactOnePhone: "",
          contactTwo: "",
          contactTwoPhone: "",
          officeOrRegistration: "",
          address: "",
          domesticOrForeign: "境内",
          bankBranch: "",
          bankAccount: "",
          bankName: "",
          openSeaCompanyBankList: [
            {
              fakeId: 0,
              bankAccountName: undefined,
              bankBranch: undefined,
              bankName: undefined,
              bankAccount: undefined,
            }
          ]
        };
        this.pcd = {
          province: undefined,
          city: undefined,
          district: undefined,
        };
      }
      this.getProvince();
      this.bankName("null")
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    pageChange(index) {
      this.pagination.page = index;
      this.getList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.page = 1;
      this.pagination.rows = pageSize;
      this.getList();
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>
<style scoped lang="less">
@import "index";
/deep/.ant-form-item {
  margin-bottom: 0;
  line-height: 1;
}
/deep/.ant-form-item-label {
  line-height: 1;
}
.fontStyle {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
}
</style>