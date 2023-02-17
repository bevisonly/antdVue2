<template>
  <a-modal :width='1000' :dialogStyle="{'top': '30px'}" v-model="visibleEdit" :title="titleFlag == 'add' ? '新增用户门店表' : '门店信息修改'" :maskClosable='false' :footer="null">
    <div class="modalTop">
      <a-row :gutter="[20, 10]">
        <a-col :span='12'>
          <span class="aRequired">门店名称</span>
          <a-input v-model.trim="detailsInfo.partnerName"></a-input>
        </a-col>
        <a-col :span='12'>
          <span class="aRequired">所属客户</span>
          <a-select class="inputWidth" :value="detailsInfo.parentName" @change="handleChangeParentName">
            <a-select-option v-for="item in parentNameArray" :key="item.id" :value="item.partnerName+'&'+item.id+'&'+item.orgId">{{item.partnerName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span='12'>
          <span class="aRequired">门店简称</span>
          <a-input v-model.trim="detailsInfo.shortName"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>联系人</span>
          <a-input v-model.trim="detailsInfo.contactName"></a-input>
        </a-col>
        <a-col :span='12'>
          <p style="margin: 0;">结算周期</p>
          <a-select class="selectStyle" v-model="invcCycleType" placeholder="请选择">
            <a-select-option :value='1'>{{'自然月底'}}<a-icon style="color: green;margin-left: 25px;" v-show="invcCycleType == 1 ? true : false" type="check"/></a-select-option>
            <a-select-option :value='3'>{{'固定日期'}}<a-icon style="color: green;margin-left: 25px;" v-show="invcCycleType == 3 ? true : false" type="check"/></a-select-option>
            <a-select-option :value='4'>{{'固定天数'}}<a-icon style="color: green;margin-left: 25px;" v-show="invcCycleType == 4 ? true : false" type="check"/></a-select-option>
          </a-select>
          <p v-if="invcCycleType == 1 ? true : false" class="pMonth"></p>
          <p v-else-if="invcCycleType == undefined ? true : false" class="pMonth"></p>
          <a-select
            v-else-if="invcCycleType == 3 ? true : false"
            class="datePicker"
            v-model="dateWay.pickerDate"
          >
            <a-select-option v-for="(item, i) in dayList" :key="i" :value="/\d+/.exec(item)[0]">
              {{ item }}
            </a-select-option>
          </a-select>
          <a-input v-else class="inputStyle" placeholder="请输入天数" v-model="dateWay.inputDate"></a-input>
        </a-col>
        <a-col :span='12'>
          <span class="aRequired">结算类型</span>
          <a-select style="width: 100%;" v-model="detailsInfo.invcType">
            <a-select-option value='2'>{{'统一结算'}}</a-select-option>
            <a-select-option value='3'>{{'独立结算'}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span='12'>
          <span>省市区</span>
          <a-input v-model.trim="detailsInfo.cityId"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>详细地址</span>
          <a-input placeholder="省市区+详细地址" v-model.trim="detailsInfo.address"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>手机号码</span>
          <a-input v-model.trim="detailsInfo.contactPhone"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>开户行</span>
          <a-input v-model.trim="detailsInfo.bankBranch"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>账号名称</span>
          <a-input v-model.trim="detailsInfo.accountName"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>门店类型</span>
          <a-input v-model.trim="detailsInfo.category"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>银行账号</span>
          <a-input v-model.trim="detailsInfo.bankAccount"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>财务联系人</span>
          <a-input v-model.trim="detailsInfo.financialContact"></a-input>
        </a-col>
        <a-col :span='12'>
          <span>邮箱</span>
          <a-input v-model.trim="detailsInfo.contactEmail"></a-input>
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
          <span>开票日期</span>
          <a-date-picker class="inputWidth" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="detailsInfo.invcDate">
            <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
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
  partnerUpdateStore,
  partnerAddPartnerStore,
  partnerList
} from "@/services/customerStoreManageList.js";
import { throttle } from "../../utils/tool";
import moment from "moment";
import deepClone from 'lodash.clonedeep'
export default {
  name: 'modalEdit',
  data() {
    return {
      visibleEdit: false,
      titleFlag: 'add',
      parentNameArray: [{parentName: undefined}],
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
        partnerName: undefined,
        parentId: undefined,
        orgId: undefined,
        shortName: undefined,
        contactName: undefined,
        contactPhone: undefined,
        parentName: undefined,
        accountName: undefined,
        address: undefined,
        bankAccount: undefined,
        bankBranch: undefined,
        category: undefined,
        cityId: undefined,
        contactEmail: undefined,
        financialContact: undefined,
        checkDate: null,
        invcDate: null,
        repayDate: null,
        remark: undefined,
      },
      allMsg: undefined,
      paramsFun: undefined,
    }
  },
  methods: {
    openModal(flag, allMsg, params) {
      this.allMsg = undefined
      this.paramsFun = params
      this.titleFlag = flag
      this.dateWay.pDate = ''
      this.dateWay.inputDate = undefined
      this.dateWay.pickerDate = '1'
      if (flag == 'add') {
        this.invcCycleType = undefined
        let detailsInfo = {
          partnerName: undefined, orgId: this.parentNameArray[0]?.orgId,
          shortName: undefined, parentId: this.parentNameArray[0]?.id,
          contactName: undefined, contactPhone: undefined,
          invcCycleType: undefined, invcCycle: this.dateWay.pDate,
          accountName: undefined, address: undefined,
          bankAccount: undefined, bankBranch: undefined,
          category: undefined, cityId: undefined,
          contactEmail: undefined, financialContact: undefined,
          checkDate: null, invcDate: null, invcType: '2',
          repayDate: null, remark: undefined,
          parentName: this.parentNameArray[0]?.partnerName
        }
        this.detailsInfo = detailsInfo
      } else {
        this.allMsg = {...allMsg}
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
        }
        this.detailsInfo = detailsInfo
      }
      this.visibleEdit = true
    },
    partnerList() {
      const params = {partnerType: 20, isEnable: 1}
      partnerList(params).then( val => val.data.code == 200 ? this.parentNameArray = val.data.data : '' )
    },
    handleChangeParentName(value) {
      this.detailsInfo.parentName = value.split('&')[0]
      this.detailsInfo.parentId = value.split('&')[1]
      this.detailsInfo.orgId = value.split('&')[2]
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YY-MM-DD") == moment(today).format("YY-MM-DD")) {
        style.border = '1px solid #ff3737'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "#ff3737"
      }
      return style;
    },
    addSubmit() {
      const params = this.detailsInfo
      if (this.isUndef(params.invcType, params.parentName, params.partnerName, params.shortName)) {
        this.$message.error('门店名称，门店简称，所属客户，结算类型为必填项...')
        return
      }
      params.invcCycleType = this.invcCycleType
      params.invcCycle = this.invcCycleType == 1 ? this.dateWay.pDate : this.invcCycleType == 3 ? this.dateWay.pickerDate : this.invcCycleType == 4 ? this.dateWay.inputDate : null
      Object.keys(params).map(key => params[key] == undefined ? params[key] = '' : '')
      partnerAddPartnerStore(params).then(val => {
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
    okSubmit() {
      const params = deepClone(this.detailsInfo)
      if (this.isUndef(params.invcType, params.parentName, params.partnerName, params.shortName)) {
        this.$message.error('门店名称，门店简称，所属客户，结算类型为必填项...')
        return
      }
      params.invcCycleType = this.invcCycleType
      params.invcCycle = this.invcCycleType == 1 ? this.dateWay.pDate : this.invcCycleType == 3 ? this.dateWay.pickerDate : this.invcCycleType == 4 ? this.dateWay.inputDate : null
      Object.keys(params).map(key => params[key] == undefined ? params[key] = '' : '')
      partnerUpdateStore(params).then(val => {
        if (val.data.code == 200) {
          this.$parent.refresh(this.paramsFun)
          this.$message.success(val.data.message)
          this.visibleEdit = false
        } else {
          this.$message.warn(val.data.message)
        }
      })
    },
    submitTableBtn: throttle(function() {
      if (this.titleFlag == 'add') {
        this.addSubmit()
      } else {
        this.okSubmit()
      }
    },3500),
    submitTable() {
      this.submitTableBtn()
    }
  },
  activated() {
    this.partnerList()
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