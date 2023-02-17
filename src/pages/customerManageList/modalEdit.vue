<template>
  <a-modal :width='1000' :dialogStyle="{'top': '30px'}" v-model="visibleEdit" :title="titleFlag == 'add' ? '新增用户表' : '客户信息修改'" :maskClosable='false' :footer="null">
    <div class="modalTop">
      <a-row :gutter="[20, 10]">
        <a-col :span='12'>
          <span class="aRequired">名称</span>
          <a-select
            v-model.trim="detailsInfo.partnerName"
            placeholder="请输入名称"
            show-search
            allowClear
            :show-arrow="false"
            :filter-option="false"
            style="width: 100%"
            @search="handleCustomerSearch"
            @focus="handleCustomerSearch"
            @change="handleCustomerOption"
          >
            <a-select-option v-for="item in select.customer" :key="item.companyName">{{item.companyName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span='12'>
          <span class="aRequired">公司简称</span>
          <a-input v-model="detailsInfo.shortName" disabled></a-input>
        </a-col>
        <a-col :span='12'>
          <span>公司资质</span>
          <a-input v-model.trim="detailsInfo.qualification"></a-input>
        </a-col>
        <a-col :span='12'>
          <span class="aRequired">运营主体</span>
          <a-select class="inputWidth" :value="detailsInfo.opName" @change="handleChange">
            <a-select-option v-for="item in opNameArray" :key="item.id" :value="item.opName+'&'+item.id">{{item.opName}}</a-select-option>
          </a-select>
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
            v-else-if="invcCycleType == 3 || invcCycleType == '固定日期' ? true : false"
            class="datePicker"
            disabled
            v-model="dateWay.pickerDate"
          >
            <a-select-option v-for="(item, i) in dayList" :key="i" :value="/\d+/.exec(item)[0]">
              {{ item }}
            </a-select-option>
          </a-select>
          <a-input v-else class="inputStyle" disabled v-model.trim="dateWay.inputDate"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>联系人</span>
          <a-input v-model.trim="detailsInfo.contactName" disabled></a-input>
        </a-col>
        <a-col :span='12'>
          <span>手机号码</span>
          <a-input v-model.trim="detailsInfo.contactPhone"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>联系地址</span>
          <a-input placeholder="省市区+详细地址" v-model.trim="detailsInfo.address" disabled></a-input>
        </a-col>
        <a-col :span='12'>
          <span>财务联系人</span>
          <a-input v-model.trim="detailsInfo.financialContact"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>财务联系电话</span>
          <a-input v-model.trim="detailsInfo.financialPhone"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>法人</span>
          <a-input v-model.trim="detailsInfo.person"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>开票日期</span>
          <a-date-picker class="inputWidth" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="detailsInfo.invcDate">
            <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </a-col>
        <a-col :span='12'>
          <span>回款日期</span>
          <a-date-picker class="inputWidth" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="detailsInfo.repayDate">
            <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </a-col>
        <a-col :span='12'>
          <span>对账日期</span>
          <a-date-picker class="inputWidth" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="detailsInfo.checkDate">
            <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </a-col>
        <a-col :span='12' v-if="titleFlag == 'add' ? false :true">
          <span>客户类型</span>
          <a-input value='客户' disabled>客户</a-input>
        </a-col>
        <a-col :span='12'>
          <span class="aRequired">审批额度（万元）</span>
          <a-input-number :min='0' :max='999999.9999' v-model="detailsInfo.approvalLimit" :precision="4" />
        </a-col>
        <a-col v-if="detailsInfo.openSeaCompanyBankList && detailsInfo.openSeaCompanyBankList[0]" :span="24">
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
          <span>行业简介</span>
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
  partnerUpdatepartner,
  partnerAddcustomer,
  opSubjectListIn,
  customer
} from "@/services/customerManageList.js";
import moment from "moment";
import { throttle } from "../../utils/tool";
import deepClone from 'lodash.clonedeep'
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
      opNameArray: [{opName: undefined}],
      monthEnd: 30,
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
        partnerType: '20',
        invcCycle: undefined,
        invcCycleType: 1,
        partnerName: undefined,
        opId: undefined,
        opName: undefined,
        shortName: undefined,
        contactName: undefined,
        contactPhone: undefined,
        accountName: undefined,
        address: undefined,
        bankAccount: undefined,
        bankBranch: undefined,
        qualification: undefined,
        financialContact: undefined,
        financialPhone: undefined,
        person: undefined,
        checkDate: null,
        invcDate: null,
        repayDate: null,
        description: undefined,
        remark: undefined,
        openSeaCompanyBankList: [],
        approvalLimit: undefined,
      },
      paramsFun: undefined,
      allMsg: undefined,
      select: {},
      customerMaterial: undefined,
      type: {
        "自然月底": 1,
        "固定日期": 3,
        "固定天数": 4,
      }
    }
  },
  methods: {
    async openModal(flag, allMsg, params) {
      this.paramsFun = params
      this.titleFlag = flag
      this.dateWay.pDate = ''
      this.dateWay.inputDate = undefined
      this.dateWay.pickerDate = '1'
      if (flag == 'add') {
        this.invcCycleType = undefined
        let detailsInfo = {
          partnerType: '20',
          partnerName: undefined,opId: this.opNameArray[0]?.id,
          opName: this.opNameArray[0]?.opName,shortName: undefined,
          contactName: undefined,contactPhone: undefined,
          invcCycleType: undefined,invcCycle: this.dateWay.pDate,
          address: undefined,bankAccount: undefined,
          bankBranch: undefined,qualification: undefined,
          financialContact: undefined,financialPhone: undefined,
          person: undefined,checkDate: null, openSeaCompanyBankList: [],
          invcDate: null,repayDate: null,accountName: undefined,
          description: undefined,remark: undefined, openSeaCompanyPartnerId: undefined,
          approvalLimit: undefined
        }
        this.detailsInfo = detailsInfo
      } else {
        this.allMsg = {...allMsg}
        let opId = this.opNameArray.find(val => val.opName == allMsg.opName)?.id
        this.invcCycleType = allMsg.invcCycleType == 2 ? undefined : allMsg.invcCycleType
        if (allMsg.invcCycleType == 3) {
          this.dateWay.pickerDate = allMsg.invcCycle
        } else if (allMsg.invcCycleType == 4) {
          this.dateWay.inputDate = allMsg.invcCycle
        }
        let detailsInfo = {
          ...allMsg,
          invcCycleType: [1,3,4].includes(allMsg.invcCycleType) ? allMsg.invcCycleType : undefined,
          invcCycle: [1,3,4].includes(allMsg.invcCycleType) ? allMsg.invcCycle : this.pDate,
          opId: opId || allMsg.orgId,
          openSeaCompanyBankList: allMsg.openSeaCompanyBankList ?? [],
        }
        this.detailsInfo = detailsInfo
        await this.handleCustomerSearch(this.detailsInfo.partnerName)
        this.handleCustomerOption(this.detailsInfo.partnerName)
      }
      this.visibleEdit = true
    },
    async handleCustomerSearch(value) {
      await customer({keyword: value, companyType: 30, auditStatus: 3}).then(res => {
        this.select.customer = res.data.data || []
        this.$forceUpdate()
      })
    },
    handleCustomerOption(value) {
      let n = undefined
      this.detailsInfo.partnerName = value
      this.customerMaterial = this.select.customer.find(item => item.companyName == value) || {}
      this.detailsInfo.openSeaCompanyPartnerId = this.customerMaterial.id
      this.detailsInfo.shortName = this.customerMaterial.companyName
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
      if (this.customerMaterial.officeOrRegistration?.includes('/')) {
        n = '/'
      }
      this.detailsInfo.invcCycleType = this.customerMaterial.billingPeriod
      this.invcCycleType = this.customerMaterial.billingPeriod
      this.detailsInfo.contactName = this.customerMaterial.contactOne
      this.detailsInfo.contactPhone = this.customerMaterial.contactOnePhone
      this.detailsInfo.address = (this.customerMaterial.officeOrRegistration ?? '') + (n || '') + (this.customerMaterial.address ?? '')
      this.detailsInfo.accountName = this.customerMaterial.companyName
      this.detailsInfo.bankBranch = this.customerMaterial.bankName
      this.detailsInfo.bankAccount = this.customerMaterial.bankAccount
      this.detailsInfo.openSeaCompanyBankList = this.customerMaterial.openSeaCompanyBankList
      this.detailsInfo.approvalLimit = this.customerMaterial.approvalLimit
    },
    opSubjectListIn() {
      opSubjectListIn({}).then(val => val.data.code == 200 ? this.opNameArray = val.data.data : '')
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
    addSubmit() {
      const params = this.detailsInfo
      if (this.isUndef(params.partnerName, params.shortName, params.opName, params.approvalLimit)) {
        this.$message.error('名称，公司简称，运营主体，审核额度为必填项...')
        return
      }
      params.invcCycleType = this.type[this.invcCycleType] || this.invcCycleType
      params.invcCycle = params.invcCycleType == 1 ? this.dateWay.pDate : params.invcCycleType == 3 ? this.dateWay.pickerDate : params.invcCycleType == 4 ? this.dateWay.inputDate : null
      if (!this.typeis(params.approvalLimit, 'number')) delete params.approvalLimit
      Object.keys(params).map(key => params[key] == undefined ? params[key] = '' : '')
      partnerAddcustomer(params).then(val => {
        if (val.data.code == 200) {
          this.$parent.currentPage = 1
          this.$parent.pagination.currentPage = 1
          this.$parent.refresh(this.paramsFun)
          this.$message.success(val.data.message)
          this.visibleEdit = false
        } else {
          this.$message.warn(val.data.message)
        }
      })
    },
    editSubmit() {
      const params = deepClone(this.detailsInfo)
      if (this.isUndef(params.partnerName, params.shortName, params.opName, params.approvalLimit)) {
        this.$message.error('名称，公司简称，运营主体，审核额度为必填项...')
        return
      }
      params.invcCycleType = this.type[this.invcCycleType] || this.invcCycleType
      params.invcCycle = params.invcCycleType == 1 ? this.dateWay.pDate : params.invcCycleType == 3 ? this.dateWay.pickerDate : params.invcCycleType == 4 ? this.dateWay.inputDate : null
      if (!this.typeis(params.approvalLimit, 'number')) delete params.approvalLimit
      Object.keys(params).map(key => params[key] == undefined ? params[key] = '' : '')
      partnerUpdatepartner(params).then(val => {
        if (val.data.code == 200) {
          this.$parent.refresh(this.paramsFun)
          this.$message.success(val.data.message)
          this.visibleEdit = false
        } else {
          this.$message.warn(val.data.message)
        }
      })
    },
    submitThrottle: throttle(function() {
      if (this.titleFlag == 'add') {
        this.addSubmit()
      } else {
        this.editSubmit()
      }
    }, 3500),
    submitTable() {
      this.submitThrottle()
    }
  },
  activated() {
    this.opSubjectListIn()
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  .modalTop{
    padding-top: 10px;
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