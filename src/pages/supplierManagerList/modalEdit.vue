<template>
  <a-modal :width='1000' :dialogStyle="{'top': '30px'}" v-model="visibleEdit" :title="titleFlag == 'add' ? '新增' : '修改信息'" :maskClosable='false' :footer="null">
    <div class="modalTop">
      <a-row :gutter="[20, 10]">
        <a-col :span='12'>
          <span class="redfont marginRight">*</span><span>{{ pageType }}名称</span>
          <a-select
            v-model.trim="detailsInfo.partnerName"
            :placeholder="`请选择${pageType}名称`"
            show-search
            allowClear
            :show-arrow="false"
            :filter-option="false"
            style="width: 100%"
            @search="handleSupplierSearch"
            @focus="handleSupplierSearch"
            @change="handleSupplierOption"
          >
            <a-select-option v-for="item in select.supplier" :key="item.companyName">{{item.companyName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span='12'>
          <span class="redfont marginRight">*</span><span>联系地址</span>
          <a-input placeholder="省市区+详细地址" v-model="detailsInfo.address" disabled></a-input>
        </a-col>
        <a-col :span='12'>
          <span>{{pageType}}简称</span>
          <a-input :placeholder="`${pageType}简称`" v-model="detailsInfo.shortName"></a-input>
        </a-col>
        <a-col :span='12'>
          <span class="redfont marginRight" v-if="titleFlag == 'add' ? true : false">*</span><span>所属主体</span>
          <a-select class="inputWidth" placeholder="请选择运营主体" :value="detailsInfo.opName" @change="handleChange">
            <a-select-option v-for="item in opNameArray" :key="item.id" :value="item.opName+'&'+item.id">{{item.opName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span='12'>
          <span>对账日期</span>
          <a-date-picker class="inputWidth" valueFormat="YYYY-MM-DD HH:mm:ss" placeholder="对账日期" v-model="detailsInfo.checkDate">
            <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </a-col>
        <a-col :span='12'>
          <span>开户行Swift Code</span>
          <a-input placeholder="开户行Swift Code" v-model="detailsInfo.bankSwiftCode"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>结算类型</span>
          <a-select style="width: 100%;" v-model="detailsInfo.invcType" placeholder="请选择">
            <a-select-option value='2'>{{'统一结算'}}</a-select-option>
            <a-select-option value='3'>{{'独立结算'}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span='12'>
          <span>联系人</span>
          <a-input placeholder="联系人" v-model="detailsInfo.contactName" disabled></a-input>
        </a-col>
        <a-col :span='12'>
          <span>联系人电话</span>
          <a-input placeholder="联系人电话" v-model="detailsInfo.contactPhone"></a-input>
        </a-col>
        <a-col :span='12'>
          <p style="margin: 0;">结算周期</p>
          <a-select class="selectStyle" v-model="invcCycleType" placeholder="周期类型" disabled>
            <a-select-option :value='1'>{{'自然月底'}}<a-icon style="color: green;margin-left: 25px;" v-show="invcCycleType == 1 ? true : false" type="check"/></a-select-option>
            <a-select-option :value='3'>{{'固定日期'}}<a-icon style="color: green;margin-left: 25px;" v-show="invcCycleType == 3 ? true : false" type="check"/></a-select-option>
            <a-select-option :value='4'>{{'固定天数'}}<a-icon style="color: green;margin-left: 25px;" v-show="invcCycleType == 4 ? true : false" type="check"/></a-select-option>
          </a-select>
          <p v-if="invcCycleType == 1 || invcCycleType == '自然月底'? true : false" class="pMonth">每月月底</p>
          <p v-else-if="invcCycleType == undefined ? true : false" class="pMonth"></p>
          <a-select
            v-else-if="invcCycleType == 3 || invcCycleType == '固定日期'? true : false"
            class="datePicker"
            disabled
            v-model="dateWay.pickerDate"
          >
            <a-select-option v-for="(item, i) in dayList" :key="i" :value="/\d+/.exec(item)[0]">
              {{ item }}
            </a-select-option>
          </a-select>
          <a-input v-else class="inputStyle" disabled placeholder="天数" v-model="dateWay.inputDate"></a-input>
        </a-col>
        <a-col :span="24" v-if="detailsInfo.openSeaCompanyBankList && detailsInfo.openSeaCompanyBankList[0]">
          <a-table
            :data-source="detailsInfo.openSeaCompanyBankList"
            :columns="columnsBank"
            rowKey="id"
            size="small"
            :scroll="{y: detailsInfo.openSeaCompanyBankList[4] ? 800 : 0}"
            :pagination="false"
          >
          </a-table>
        </a-col>
        <a-col :span='24'>
          <span>经营简介</span>
          <a-textarea v-model="detailsInfo.description"/>
        </a-col>
        <a-col :span='24'>
          <span>备注信息</span>
          <a-textarea v-model="detailsInfo.remark"/>
        </a-col>
        <a-col :span="24">
          <div class="flex-ed">
            <a-button type="primary" @click="submitTable">{{titleFlag == 'add' ? "提交" : "保存"}}</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import {
  supplierUpdate,
  supplierAddSupplier,
  opSubjectList,
  supplier
} from "@/services/supplierManagerList.js";
import { addAgency } from "@/services/baseDataMa/agency";
import moment from "moment";
import { throttle } from "../../utils/tool";
const columnsBank = [
  {title: '银行户名', dataIndex: 'bankAccountName'},
  {title: '开户银行', dataIndex: 'bankBranch'},
  {title: '开户行名称', dataIndex: 'bankName'},
  {title: '银行账号', dataIndex: 'bankAccount'},
]
export default {
  name: 'modalEdit',
  data() {
    return {
      columnsBank,
      visibleEdit: false,
      titleFlag: 'add',
      pageType: '供应商',
      opNameArray: [],
      invcCycleType: undefined,
      dateWay: {
        pDate: '',
        inputDate: undefined,
        pickerDate: '1',
      },
      dayList: [
        '固定每月 1 日', '固定每月 2 日', '固定每月 3 日', '固定每月 4 日',
        '固定每月 5 日', '固定每月 6 日', '固定每月 7 日', '固定每月 8 日',
        '固定每月 9 日', '固定每月 10 日','固定每月 11 日','固定每月 12 日',
        '固定每月 13 日','固定每月 14 日','固定每月 15 日','固定每月 16 日',
        '固定每月 17 日','固定每月 18 日','固定每月 19 日','固定每月 20 日',
        '固定每月 21 日','固定每月 22 日','固定每月 23 日','固定每月 24 日',
        '固定每月 25 日','固定每月 26 日','固定每月 27 日','固定每月 28 日'
      ],
      detailsInfo: {
        invcCycle: undefined,
        invcCycleType: 1,
        accountName: undefined,
        address: undefined,
        bankAccount: undefined,
        bankBranch: undefined,
        bankSwiftCode: undefined,
        checkDate: null,
        contactName: undefined,
        contactPhone: undefined,
        description: undefined,
        invcType: '2',
        opId: undefined,
        opName: undefined,
        partnerName: undefined,
        regAddress: undefined,
        remark: undefined,
        shortName: undefined,
        openSeaCompanyBankList: [],
      },
      allMsg: undefined,
      refreshFun: undefined,
      params: undefined,
      select: {},
      supplierMaterial: undefined,
      type: {
        "自然月底": 1,
        "固定日期": 3,
        "固定天数": 4,
      }
    }
  },
  methods: {
    async openModal(flag, allMsg, refreshFun, params) {
      this.pageType = this.$parent.pageType == "supplier" ? "供应商" : "代理公司",
      this.params = params
      this.refreshFun = refreshFun
      this.titleFlag = flag
      this.dateWay.pDate = ''
      this.dateWay.inputDate = undefined
      this.dateWay.pickerDate = '1'
      if (flag == 'add') {
        let detailsInfo = {
          accountName: undefined, address: undefined,
          bankAccount: undefined, bankBranch: undefined,
          bankSwiftCode: undefined, checkDate: null,
          contactName: undefined, contactPhone: undefined,
          description: undefined, invcType: '2',
          invcCycleType: undefined,invcCycle: this.dateWay.pDate,
          opId: this.opNameArray[0]?.id, opName: this.opNameArray[0]?.opName,
          partnerName: undefined, regAddress: undefined, openSeaCompanyBankList: [],
          remark: undefined, shortName: undefined, openSeaCompanyPartnerId: undefined
        }
        this.detailsInfo = detailsInfo
      } else {
        this.allMsg = allMsg
        let opId = this.opNameArray.find( val => {return val.opName == allMsg.opName})?.id
        this.invcCycleType = allMsg.invcCycleType == 2 ? undefined : allMsg.invcCycleType
        if (allMsg.invcCycleType == 3) {
          this.dateWay.pickerDate = allMsg.invcCycle
        } else if (allMsg.invcCycleType == 4) {
          this.dateWay.inputDate = allMsg.invcCycle
        }
        let detailsInfo = {
          id: allMsg.id,
          accountName: allMsg.accountName,
          address: allMsg.address,
          bankAccount: allMsg.bankAccount,
          bankBranch: allMsg.bankBranch,
          bankSwiftCode: allMsg.bankSwiftCode,
          checkDate: allMsg.checkDate,
          invcCycleType: [1,3,4].includes(allMsg.invcCycleType) ? allMsg.invcCycleType : undefined,
          invcCycle: [1,3,4].includes(allMsg.invcCycleType) ? allMsg.invcCycle : this.pDate,
          contactName: allMsg.contactName,
          contactPhone: allMsg.contactPhone,
          description: allMsg.description,
          invcType: allMsg.invcType ?? '2',
          opId: opId || allMsg.orgId,
          opName: allMsg.opName,
          partnerName: allMsg.partnerName,
          regAddress: allMsg.regAddress,
          remark: allMsg.remark,
          shortName: allMsg.shortName,
          openSeaCompanyPartnerId: allMsg.openSeaCompanyPartnerId,
          openSeaCompanyBankList: allMsg.openSeaCompanyBankList ?? [],
        }
        this.detailsInfo = detailsInfo
        await this.handleSupplierSearch(this.detailsInfo.partnerName)
        this.handleSupplierOption(this.detailsInfo.partnerName)
      }
      this.visibleEdit = true
    },
    async handleSupplierSearch(keyword) {
      let params = {
        partnerType: this.pageType == '供应商'? undefined : "代理企业",
        companyType: 20,
        auditStatus: 3,
        keyword
      }
      await supplier(params).then(res => {
        this.select.supplier = res.data.data || []
        this.$forceUpdate()
      })
    },
    handleSupplierOption(value) {
      let n = undefined
      this.detailsInfo.partnerName = value
      this.customerMaterial = this.select.supplier.find(item => item.companyName == value) || {}
      this.detailsInfo.openSeaCompanyPartnerId = this.customerMaterial.id
      switch (this.customerMaterial.billingPeriod) {
        case '自然月底':
          this.invcCycleType = 1
          this.dateWay.pDate = ''
          break;
        case '固定日期':
          this.invcCycleType = 3
          this.dateWay.pickerDate = /\d+/.exec(this.customerMaterial.invcCycle)[0]
          break;
        case '固定天数':
          this.invcCycleType = 4
          this.dateWay.inputDate = this.customerMaterial.invcCycle
          break;
        default:
          break;
      }
      this.detailsInfo.invcCycleType = this.customerMaterial.billingPeriod
      this.invcCycleType = this.customerMaterial.billingPeriod
      this.detailsInfo.contactName = this.customerMaterial.contactOne
      this.detailsInfo.contactPhone = this.customerMaterial.contactOnePhone
      if (this.customerMaterial.officeOrRegistration?.includes('/')) {
        n = '/'
      }
      this.detailsInfo.address = (this.customerMaterial.officeOrRegistration ?? '') + (n || '') + (this.customerMaterial.address ?? '')
      this.detailsInfo.accountName = this.customerMaterial.companyName
      this.detailsInfo.bankBranch = this.customerMaterial.bankName
      this.detailsInfo.bankAccount = this.customerMaterial.bankAccount
      this.detailsInfo.openSeaCompanyBankList = this.customerMaterial.openSeaCompanyBankList ?? []
    },
    opSubjectList() {
      opSubjectList({}).then(val => val.data.code == 200 && (this.opNameArray = val.data.data))
    },
    handleChange(value) {
      this.detailsInfo.opName = value.split('&')[0]
      this.detailsInfo.opId = value.split('&')[1]
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YY-MM-DD") == moment(today).format("YY-MM-DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    deepClone(obj) {
      let objStorageBox = null;
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
    addSubmit() {
      const params = this.detailsInfo
      if (!params.partnerName || !params.opName || !params.address) {
        this.$message.warn('请填写必填项')
        return
      }
      params.invcCycleType = this.type[this.invcCycleType] || this.invcCycleType
      params.invcCycle = params.invcCycleType == 1 ? this.dateWay.pDate : params.invcCycleType == 3 ? this.dateWay.pickerDate : params.invcCycleType == 4 ? this.dateWay.inputDate : null
      Object.keys(params).map(key => params[key] = params[key] ?? '')
      let api = this.pageType == '供应商' ? supplierAddSupplier : addAgency
      api(params).then(val => {
        if (val.data.code == 200) {
          this.$parent.currentPage = 1
          this.$parent.pagination.currentPage = 1
          this.$parent.pagination.pageSize = 10
          this.refreshFun(this.params)
          this.$message.success(val.data.message)
          this.visibleEdit = false
        } else {
          this.$message.error(val.data.message, 3.5)
        }
      })
    },
    editSubmit() {
      const params = this.deepClone(this.detailsInfo)
      if (!params.partnerName || !params.opName) {
        this.$message.error('存在必填项未填写')
        return
      }
      params.checkDate = this.allMsg.checkDate,
      params.invcCycleType = this.type[this.invcCycleType] || this.invcCycleType
      params.invcCycle = params.invcCycleType == 1 ? this.dateWay.pDate : params.invcCycleType == 3 ? this.dateWay.pickerDate : params.invcCycleType == 4 ? this.dateWay.inputDate : null
      Object.keys(params).map(key => params[key] = params[key] ?? '')
      supplierUpdate(params).then(val => {
        if (val.data.code == 200) {
          this.refreshFun(this.params)
          this.$parent.pagination.pageSize = 10
          this.$message.success(val.data.message)
          this.visibleEdit = false
        } else {
          this.$message.error(val.data.message)
        }
      })
    },
    submitThrottle: throttle(function() {
      if (this.titleFlag == 'add') {
        this.addSubmit()
      } else {
        this.editSubmit()
      }
    },3500),
    submitTable() {
      this.submitThrottle()
    }
  },
  activated() {
    this.opSubjectList()
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  .modalTop{
    margin-top: 10px;
    /deep/.ant-row{
      margin-top: 10px;
      .marginRight{
        margin-right: 4px;
      }
      .inputWidth{
        width: 100%;
      }
      .selectStyle{
        display: block;
        width: 30%;
        float: left;
        border-radius: 0;
        .ant-select-selection--single{
          .ant-select-selection__rendered{
            .ant-select-selection-selected-value{
              i{
                width: 0;height: 0;
              }
            }
          }
        }
      }
      .datePicker .ant-calendar-picker-input{
        border-radius: 0 4px 4px 0;
        border-left: none;
      }
      .datePicker{
        float: left;
        width: 70%;
        .ant-select-selection{
          border-left-width: 0;
          border-radius: 0 4px 4px 0 !important;
        }
      }
      .pMonth{
        margin: 0;
        height: 32px;
        line-height: 32px;
        text-indent: 10px;
        border: 1px solid #d9d9d9;
        border-radius: 0 4px 4px 0;
        border-left: none;
        &:hover{
          cursor: not-allowed;
        }
      }
      .ant-select .ant-select-selection{
        border-radius: 4px 0 0 4px;
      }
      .inputStyle{
        float: left;
        width:70%;
        border-radius: 0 4px 4px 0;
        border-left: none;
      }
    }
  }
</style>