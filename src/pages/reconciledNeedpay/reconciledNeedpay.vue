<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="fullScreen">
      <p class="queryInfoP">筛选查询
        <a-icon type="search" />
      </p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['采购开始日期', '采购结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroupPurchase" @ok="changeDatePurchase" @change="changeDatePurchase"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['周期开始日期', '周期结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroupWeekly" @ok="changeDateWeekly" @change="changeDateWeekly"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入单据号" v-model.trim="form.poCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入柜号" v-model.trim="form.containerCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search :value="form.supplierId" placeholder="请搜索选择供应商名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" @search="handleSupplierSearch" @change="handleSupplierOption">
                <a-select-option v-for="item in option.supplierOption" :key="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.agencyId"
                placeholder="请搜索选择代理公司名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleAgencySearch"
                @change="handleAgencyOption"
              >
                <a-select-option v-for="item in option.agencyOption" :key="item.id">{{ item.partnerName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.feeName"
                placeholder="请搜索选择费用项"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="filterOption"
                :not-found-content="null"
                @select="onSelectFee"
              >
                <a-select-option v-for="item in option.receiveMsgOption" :key="item.id">
                  {{ item.type == 2 ? item.name + "(国际)" : item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                v-model="form.orgId"
                show-search
                placeholder="请搜索选择运营主体"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleOrganizationSearch"
              >
                <a-select-option v-for="item in organizationOption" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" @click="submitBtn('search')">查询</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <p class="bottomTitle">
        账款列表
        <a-icon type="book" />
      </p>
      <div class="flex-sb heightDiv">
        <div>
          <a-button-group>
            <a-button type="primary" :loading="loadingExcel" @click="exportData"
              :disabled="!hasPermission('reconciled_export')"> 导出数据 </a-button>
            <a-button type="primary" :loading="loadingSet" title="可批量生成" @click="settlementList"
              :disabled="!hasPermission('create_settlement')"> 生成结算单 </a-button>
          </a-button-group>
        </div>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="tableColumns" width="300" />
        </a-button-group>
      </div>
      <a-table class="tableClass" bordered :columns="tableColumns" ref="tableRef" :data-source="dataTable"
        :loading='loading' :rowKey="(record,index)=>{return index}" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 307.778, y: dataTable.length < 50 && pagination.size < 50 ? 0 : 1300 }" :pagination='false'>
        <template slot="poCode" slot-scope="text, record">
          <div class="columnStyle" :class="record.overInvc ? 'columnStyleRed' : ''" >{{record.poCode}}</div>
        </template>
        <template slot="reconciliaState" slot-scope="text, record">
          <div>
            {{
              record.reconciliaState == 610 ? '未对账' :
              record.reconciliaState == 620 || record.reconciliaState == 520 ? '已对账' : record.reconciliaState
            }}
          </div>
        </template>
        <template slot="settleState" slot-scope="text, record">
          <div>
            {{
              record.settleState == 1 ? '未结算' :
              record.settleState == 2 ? '部分结算' :
              record.settleState == 3 ? '已结算' : record.settleState
            }}
          </div>
        </template>
        <span slot="inPastIsNoPayAmount" slot-scope="text, record">{{ formatPrice((+record.puTotalAmount ||
            ~~record.puTotalAmount) - (+record.deductions || ~~record.deductions))
        }}</span>
        <template slot="operation" slot-scope="text, record">
          <a-button class="greenfont bluefonthover" type="link"
            :disabled="!hasPermission('reconciled_details')" @click="detailsBtn(record)">详情</a-button>
          <a-popconfirm placement="bottom" title="确定撤销吗？" ok-text="确定" cancel-text="取消"
            :disabled="!hasPermission('reconciled_delete')" @confirm="cancel(record)">
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button class="greenfont redfonthover" type="link"
              :disabled="!hasPermission('reconciled_delete')">撤销</a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination :pageSizeOptions='pageSizeOptions' v-model="pagination.page" :pageSize="pagination.size"
          :total="pagination.total" :show-total="() => `共 ${pagination.total} 条`" show-size-changer
          :show-quick-jumper="pagination.total >= 1000 ? true : false" @showSizeChange="paginationSize"
          @change="paginationPage" />
      </div>
    </div>
    <modal-details ref="modalDetailsRef"/>
  </div>
</template>

<script>
import modalDetails from './modalDetails'
import {
  search,
  exportData,
  cancel,
  settlement
} from '@/services/settlement/payable/reconciledNeedpay'
import { partnerType } from "../../services/userMa"
import {receiveMsg} from '@/services/pickUpOrder/receivedList'
import { organization } from '../../services/commonSaasApi'
const tableColumns = [
  {title: '单据号', dataIndex: 'poCode', width: 240, scopedSlots: { customRender: "poCode" }},
  {title: '供应商名称', dataIndex: 'supplierName', width: 360},
  {title: '代理公司名称', dataIndex: 'agencyName', width: 360},
  {title: '费用项', dataIndex: 'feeName', width: 160},
  {title: '对账状态', dataIndex: 'reconciliaState', width: 160, scopedSlots: { customRender: "reconciliaState" }},
  {title: '结算状态', dataIndex: 'settleState', width: 120, scopedSlots: { customRender: "settleState" }},
  {title: '采购日期', dataIndex: 'poSubtime', width: 220},
  {title: '柜号', dataIndex: 'containerCode', width: 160},
  {title: '扣供应商款', dataIndex: 'deductions', width: 160},
  {title: '预付款金额', dataIndex: 'payAmount', width: 160},
  {title: '尾款', dataIndex: 'noPayAmount', width: 160},
  {title: '应付金额', dataIndex: 'inPastIsNoPayAmount', width: 160, scopedSlots: { customRender: "inPastIsNoPayAmount" }},
  {title: '对账金额', dataIndex: 'copyMoney', width: 160},
  {title: '对账日期', dataIndex: 'reconciliaDate', width: 280},
  {title: '关联合同', dataIndex: 'contractTitle', width: 360},
  {title: '操作', dataIndex: 'operation', width: 180, align: 'center', fixed: "right", scopedSlots: { customRender: "operation" }},
]
export default {
  name: 'reconciledNeedpay',
  components: { modalDetails },
  data() {
    return {
      tableColumns,
      form: {
        dateGroupPurchase: [],
        dateGroupWeekly: [],
        deliveryTimeStart: undefined,
        deliveryTimeEnd: undefined,
        poCode: undefined,
        supplierId: undefined,
        beginTime: undefined,
        endTime: undefined,
        containerCode: undefined,
        feeName: []
      },
      option: {
        supplierOption: [],
        agencyOption: [],
        receiveMsgOption: [],
        supplierMaterial: {},
        agencyMaterial:{},
      },
      organizationOption: [],
      fullScreen: true,
      selectedRowKeys: [],
      selectedRows: [],
      dataTable: [],
      loadingExcel: false,
      loading: false,
      loadingSet: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    handleOrganizationSearch(value) {
      organization({opName: value?.trim()}).then(res => res.data.code == '200' && (this.organizationOption = res.data.data))
    },
    onSelectFee(id) {
      let feeObj = this.option.receiveMsgOption.find(x => x.id == id)
      this.form.feeName = feeObj.name
      this.form.feeType = feeObj.type
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    receiveMsg() { receiveMsg({ orderType: null }).then(res => res.data.code == 200 && (this.option.receiveMsgOption = res.data.data)) },
    changeDatePurchase() {
      this.form.deliveryTimeStart = this.form.dateGroupPurchase[0] || undefined
      this.form.deliveryTimeEnd = this.form.dateGroupPurchase[1] || undefined
    },
    changeDateWeekly() {
      this.form.beginTime = this.form.dateGroupWeekly[0] || undefined
      this.form.endTime = this.form.dateGroupWeekly[1] || undefined
    },
    detailsBtn(record) { this.$refs.modalDetailsRef.openModal(record) },
    cancel(record) {
      cancel(record).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message)
          this.submitPagination()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    resetBtn() {
      let nullParams = {
        dateGroupPurchase: [],
        dateGroupWeekly: [],
        deliveryTimeStart: undefined,
        deliveryTimeEnd: undefined,
        poCode: undefined,
        supplierId: undefined,
        beginTime: undefined,
        endTime: undefined,
        orgId: undefined,
        feeName: [],
      }
      this.option.supplierMaterial = {}
      this.option.agencyMaterial = {}
      this.form = nullParams
      this.handleSupplierSearch("")
    },
    redo() {
      this.pagination.page = 1
      this.pagination.size = 10
      let params = {
        page: 1,
        rows: 10,
        sort: "id",
        order: "DESC",
      }
      search(params).then(res => {
        this.loading = false
        this.pagination.total = this.typeis(res.data.total) == 'number' ? res.data.total : 0
        res.data?.rows.forEach(item => item.copyMoney = item.puTotalAmount)
        this.dataTable = this.typeis(res.data.rows) == 'array' ? res.data.rows : []
      }).catch(() => this.loading = false)
    },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
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
    handleSupplierSearch(value) {
      partnerType({partnerName: value?.trim(), partnerType: 30}).then(res => res.data.code == '200' && (this.option.supplierOption = res.data.data))
    },
    handleSupplierOption(value) {
      this.form.supplierId = value
      this.option.supplierMaterial = this.option.supplierOption.find(item => item.id == value) || {}
    },
    handleAgencySearch(value) {
      partnerType({partnerName: value?.trim(), partnerType: 40}).then(res => res.data.code == '200' && (this.option.agencyOption = res.data.data))
    },
    handleAgencyOption(value) {
      this.form.agencyId = value
      this.option.agencyMaterial = this.option.agencyOption.find(item => item.id == value) || {}
      this.$forceUpdate()
    },
    exportData() {
      const params = {
        sort: "state",
        order: "desc",
        deliveryTimeStart: this.form.deliveryTimeStart,
        deliveryTimeEnd: this.form.deliveryTimeEnd,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        poCode: this.form.poCode?.trim(),
        containerCode: this.form.containerCode?.trim(),
        supplierName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.agencyMaterial?.partnerName,
        agencyId: this.option.agencyMaterial?.id,
        feeName: this.form.feeName,
        feeType: this.form.feeType,
        orgId: this.form.orgId
      }
      this.loadingExcel = true
      exportData(this.selectedRowKeys.length ? {ids: this.selectedRowKeys.join(',')} : params ).then(res => {
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '已对账列表导出'
          this.getExcel(res.data, name)
          this.loadingExcel = false
        } else {
          this.loadingExcel = false
          this.$message.warn('下载失败')
        }
      }).catch(() => {
        this.loadingExcel = false
        this.$message.warn('下载失败')
      })
    },
    settlementList() {
      if (this.isUndef(this.selectedRows[0])) {
        this.$message.error('请先勾选要生成的结算单')
        return
      }
      if (this.selectedRows?.length>1&&this.selectedRows.some(item=>item.poType!=this.selectedRows[0].poType)) {
        this.$message.info('普通单与国际单不能合并结算',3)
          return
      }
      if (this.selectedRows?.length>1&&this.selectedRows.some(item=>item.docType==30)) {
        if (this.selectedRows.some(item=>item.docType!=30)) {
          this.$message.info('只有预付款费用才能合并结算',3)
          return
        }
      }
      if (this.selectedRows.length>0&&this.selectedRows.every(item=>item.poType==2)) {
        let obj=this.selectedRows[0]
        if (this.selectedRows.some(item=>item.agencyId!=obj.agencyId||item.supplierId!=obj.supplierId
        ||item.currency!=obj.currency||item.exchangeRate!=obj.exchangeRate)) {
          this.$message.info('代理公司、供应商名称、币种、汇率均一致才可合并结算',3)
          return
        }
      }
      let onlyContract = []
      this.selectedRows.forEach((item) => {
        !onlyContract.includes(item.contractId) && onlyContract.push(item.contractId)
      });
      if (onlyContract.length>1) {
        this.$message.error("当前订单的关联合同存在不一致，不可以合并操作")
        return
      }
      this.loadingSet = !0
      settlement(this.selectedRows).then(res => {
        this.loadingSet = !1
        this.selectedRowKeys = []
        this.selectedRows = []
        if (res.data.code == 200) {
          this.submitPagination()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message, 3.5)
        }
      }).catch(e => {
        this.loadingSet = !1
        this.$message.error("error"+e, 3.5)
      })
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          sort: "id",
          order: "DESC",
          deliveryTimeStart: this.form.deliveryTimeStart,
          deliveryTimeEnd: this.form.deliveryTimeEnd,
          beginTime: this.form.beginTime,
          endTime: this.form.endTime,
          poCode: this.form.poCode?.trim(),
          supplierName: this.option.supplierMaterial?.partnerName,
          agencyName: this.option.agencyMaterial?.partnerName,
          agencyId: this.option.agencyMaterial?.id,
          feeName: this.form.feeName,
          feeType: this.form.feeType,
          orgId: this.form.orgId
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        this.loading = false
        this.pagination.total = this.typeis(res.data.total) == 'number' ? res.data.total : 0
        res.data?.rows.forEach(item => item.copyMoney = item.puTotalAmount)
        this.dataTable = this.typeis(res.data.rows) == 'array' ? res.data.rows : []
      }).catch(() => this.loading = false)
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        deliveryTimeStart: this.form.deliveryTimeStart,
        deliveryTimeEnd: this.form.deliveryTimeEnd,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        poCode: this.form.poCode?.trim(),
        containerCode: this.form.containerCode?.trim(),
        supplierName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.agencyMaterial?.partnerName,
        agencyId: this.option.agencyMaterial?.id,
        feeName: this.form.feeName,
        feeType: this.form.feeType,
        orgId: this.form.orgId
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(res => {
        this.loading = false
        this.pagination.total = this.typeis(res.data.total) == 'number' ? res.data.total : 0
        res.data?.rows.forEach(item => item.copyMoney = item.puTotalAmount)
        this.dataTable = this.typeis(res.data.rows) == 'array' ? res.data.rows : []
      }).catch(() => this.loading = false)
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
    this.handleSupplierSearch('')
    this.handleAgencySearch('')
    this.submitPagination()
    this.receiveMsg()
    this.handleOrganizationSearch()
  },
}
</script>

<style lang="less">
  @import './index';
</style>