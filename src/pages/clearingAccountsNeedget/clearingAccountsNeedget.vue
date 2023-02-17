<template>
  <div class="topDiv">
    <div class="queryInfo" v-show="fullScreen">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['账单生成开始日期','账单生成结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.dateGroup" @ok="changeDate" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入结算单号" v-model.trim="form.arInvoiceCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.customerId"
                placeholder="请搜索选择客户名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleCustomerSearch"
                @change="handleCustomerOption"
              >
                <a-select-option v-for="item in option.customerOption" :key="item.id">{{ item.partnerName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.storeId"
                placeholder="请搜索选择门店名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleStoreSearch"
                @change="handleStoreOption"
              >
                <a-select-option v-for="item in option.storeOption" :key="item.id">{{ item.partnerName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.issueState"
                placeholder="请选择开票状态"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @change="refreshValue"
              >
                <a-select-option :value="0">待申请（未开票）</a-select-option>
                <a-select-option :value="1">全部开票 </a-select-option>
                <a-select-option :value="2">已红冲 </a-select-option>
                <a-select-option :value="3">已蓝补 </a-select-option>
                <a-select-option :value="4">部分开票 </a-select-option>
                <a-select-option :value="5">待开票 </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.collectState"
                placeholder="请选择领票状态"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @change="refreshValue"
              >
                <a-select-option v-for="item in option.collectOption" :key="item.value">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.opId"
                placeholder="请搜索选择运营主体"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleOrganizationSearch"
                @change="handleOrganizationOption"
              >
                <a-select-option v-for="item in option.organizationOption" :key="item.id">{{ item.opName }}</a-select-option>
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
    <div class="tableInfo" :style="{border: fullScreen ? undefined : 0}">
      <p v-show="fullScreen" class="bottomTitle">
        账款列表 <a-icon type="book" />
      </p>
      <div class="flex-sb heightDiv">
        <div>
          <a-button-group>
            <a-button type="primary" :loading="loadingTemplate" @click="downloadTemplate" :disabled="!hasPermission('waitSettlement_template')"> 下载模板 </a-button>
            <a-upload
              :show-upload-list="false"
              accept=".xlsx,.xls"
              :beforeUpload="beforeUpload"
              :disabled="uploadFile || !hasPermission('waitSettlement_upload')"
            >
              <a-button type="primary" :disabled="uploadFile || !hasPermission('waitSettlement_upload')"> 导入结算单 </a-button>
            </a-upload>
            <!-- <a-button type="primary" title="可批量打印" @click="printBtn" :disabled="!hasPermission('waitSettlement_print')"> 打印发票 </a-button> -->
            <a-button type="primary" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('waitSettlement_export')"> 导出列表 </a-button>
            <a-button type="primary" title="导出被勾选客户相同的数据" :loading="loadingExcelHight" @click="exportDataHight" :disabled="!hasPermission('waitSettlement_idExport')"> 导出结算账单 </a-button>
          </a-button-group>
          <span class="spanStyle">红色为已开票未收款预警数据;蓝色为未开票未收款预警数据</span>
        </div>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="columns" width="400" col="3" />
        </a-button-group>
      </div>
      <a-table
        class="tableStyle"
        bordered
        ref="tableRef"
        :columns="columns"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 307.778 , y: 340 }"
        :pagination='false'
      >
        <template tips="单据编号" slot="arInvoiceCode" slot-scope="text, record">
          <div
            class="divBorder"
            :class="record.over3DayNoSettlement && !record.over3DayTicketed ? 'columnRed' : record.over3DayTicketed ? 'columnBlue': ''"
          >
            {{ record.arInvoiceCode }}
          </div>
        </template>
        <template tips="结算周期" slot="settleCycleType" slot-scope="text, record">
          <div>
            {{
              record.settleCycleType == 1 ? '自然月底' :
              record.settleCycleType == 2 ? '每月15日' :
              record.settleCycleType == 3 ? '自定义' :
              record.settleCycleType == 4 ? '按周期' : record.settleCycleType
            }}
          </div>
        </template>
        <template tips="开票状态" slot="issueState" slot-scope="text, record">
          <div>
            {{
              record.issueState == 5 ? '待开票' :
              record.issueState == 0 ? '待申请' :
              record.issueState == 1 ? '全部开票' :
              record.issueState == 2 ? '已红冲' :
              record.issueState == 3 ? '已蓝补' :
              record.issueState == 4 ? '部分开票' : record.issueState
            }}
          </div>
        </template>
        <span slot="collectState" slot-scope="text">
          {{collectStateTxt[text]}}
        </span>
        <template tips="状态" slot="state" slot-scope="text, record">
          <div>{{ record.state == 1 ? '未收款' : record.state == 2 ? '部分收款' : record.state }}</div>
        </template>
        <template tips="操作" slot="operationBase" slot-scope="text, record">
          <a-button class="greenfont bluefonthover" type="link" title="打印结算单" :disabled="!hasPermission('waitSettlement_printOrder')" @click="printSaleOrderBtn(record.id)">打印</a-button>
          <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('waitSettlement_detail')" @click="changeComp('details', record)">详情</a-button>
          <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('waitSettlement_collect_confirm')" @click="changeComp('edit', record)">收款确认</a-button>
          <a-popconfirm placement="bottom" title="确定撤销吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('waitSettlement_undo')" @confirm="cancel(record.id, record.issueState)">
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('waitSettlement_undo')">撤销</a-button>
          </a-popconfirm>
        </template>
        <template tips="发票管理" slot="operationState" slot-scope="text, record">
          <a-button class="greenfont redfonthover" type="link" v-if="record.issueState==0||record.issueState==5" :disabled="!hasPermission('waitSettlement_invoice')" @click="toInvoiceInfo(record)">开票</a-button>
          <a-button class="greenfont redfonthover" type="link" v-if="record.issueState==3||record.issueState==1||record.issueState==4" :disabled="!hasPermission('waitSettlement_invoice')" @click="toInvoiceInfo(record)">领票</a-button>
          <a-popconfirm placement="bottom" title="确定红冲吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('waitSettlement_reverse')" @confirm="redGo(record.id, record.issueState)">
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('waitSettlement_reverse')">红冲</a-button>
          </a-popconfirm>
          <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('waitSettlement_compensate')" @click="ticketBtn('bluePlus', record, record.issueState)">蓝补</a-button>
        </template>
        <template tips='合计' slot="footer" slot-scope="currentPageData">
          本页合计：
          <span v-if="currentPageData">
            <span v-for="(item, i) in totalSum" :key="i">
              <span class="greyfont">{{item[1]}}</span>
              &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(+t + +c[item[0]]), 0) }}</span>&gt;
              <a-divider type="vertical" style="background: #000000a6;" v-show="i != totalSum.length - 1" />
            </span>
          </span>
        </template>
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
    <modal-Print ref="modalPrintRef"/>
    <modal-print-sale-order ref="modalPrintSaleOrderRef"/>
    <invoice-apply ref="invoiceApply"></invoice-apply>
  </div>
</template>

<script>
import modalPrint from './modalPrint'
import modalPrintSaleOrder from './modalPrintSaleOrder'
import InvoiceApply from "@/pages/ArInvoiceCollected/invoiceApply";
import {
  exportData,
  search,
  organization,
  cancel,
  redGo,
  exportDataHight,
  templateExcel,
  uploadExcel,
} from '@/services/settlement/receive/clearingAccountsNeedget'
import { partnerType } from "@/services/userMa.js";
const columns = [
  {title: '单据编号', dataIndex: 'arInvoiceCode', width:  220, scopedSlots: {customRender: "arInvoiceCode"}},
  {title: '账单日期', dataIndex: 'billDate', width: 280},
  {title: '账单生成日期', dataIndex: 'createDate', width: 180},
  {title: '回款日期', dataIndex: 'deadline', width: 180},
  {title: '客户', dataIndex: 'customerName', width: 340},
  {title: '门店名称', dataIndex: 'storeName', width:  340},
  {title: '单据金额', dataIndex: 'totalAmount', width:  160},
  {title: '结算周期', dataIndex: 'settleCycleType', width:  140, scopedSlots: {customRender: "settleCycleType"}},
  {title: '税额', dataIndex: 'taxAmount', width:  160},
  {title: '不含税金额', dataIndex: 'includingTaxAmount', width: 160},
  {title: '扣点金额', dataIndex: 'deductionAmount', width:  160},
  {title: '应收金额', dataIndex: 'receivableAmount', width: 160},
  {title: '包装金额', dataIndex: 'packTotalAmount', width:  160},
  {title: '开票状态', dataIndex: 'issueState', width: 140, scopedSlots: {customRender: "issueState"}},
  {title: '领票状态', dataIndex: 'collectState', width:140, scopedSlots: {customRender: "collectState"}},
  {title: '状态', dataIndex: 'state', width:  140, scopedSlots: {customRender: "state"}},
  // {title: '关联合同', dataIndex: 'contractTitle', width:  200},
  //! glht
  {title: '操作', dataIndex: 'operationBase', width:  320, align: 'center', scopedSlots: {customRender: "operationBase"}},
  {title: '发票管理', dataIndex: 'operationState', width: 240, align: 'center', scopedSlots: {customRender: "operationState"}},
]
export default {
  name: 'clearingAccountsNeedget',
  components: {modalPrint, modalPrintSaleOrder,InvoiceApply},
  data() {
    return {
      columns,
      form: {
        dateGroup: [],
        createDateStart: '',
        createDateEnd: '',
        arInvoiceCode: undefined,
        opId: undefined,
        storeId: undefined,
        customerId: undefined,
        issueState:undefined,
        collectState:undefined,
      },
      option: {
        organizationOption: [],
        customerOption: [],
        storeOption: [],
        organizationMaterial: {},
        customerMaterial: {},
        storeMaterial: {},
        collectOption:[{value:1,name:'待领票'},{value:2,name:'部分领票'},{value:3,name:'全部领票'},]
      },
      totalSum: [
        ["totalAmount", "单据金额"],["taxAmount", "税额"],["includingTaxAmount", "不含税金额"],
        ["deductionAmount", "扣点金额"],["receivableAmount", "应收金额"],["packTotalAmount", "包装金额"]
      ],
      loadingExcelHight: !1,
      fullScreen: true,
      selectedRowKeys: [],
      visibleSelectColumnPopover: !1,
      disabledFlage: 0,
      dataTable: [],
      loadingExcel: !1,
      loading: !1,
      loadingTemplate: !1,
      uploadFile: !1,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
      collectStateTxt:['','待领票','部分领票','全部领票'],
    }
  },
  methods: {
    //20221024--应收发票需求
    refreshValue(){
      this.$forceUpdate()
    },
    toInvoiceInfo(record){
    this.$router.push({
        path: "/balance/receiveable/arInvoiceInfo",
        query: {
          titleState: 1,
          id:record.id,
          arInvoiceCode:record.arInvoiceCode,
        },
      });
    },
    changeDate() {
      this.form.createDateStart = this.form.dateGroup[0] || ""
      this.form.createDateEnd = this.form.dateGroup[1] || ""
    },
    changeComp(flag, record) { this.$parent.changeComponent(flag, record) },
    printSaleOrderBtn(id) { this.$refs.modalPrintSaleOrderRef.openModal(id) },
    downloadTemplate() {
      this.loadingTemplate = !0
      templateExcel({}).then(res => {
        this.loadingTemplate = !1
        if (res.data.type?.includes('excel')) {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '应收待结算模板'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('下载模板失败', 3.5)
        }
      }).catch(() => this.loadingTemplate = !1)
    },
    beforeUpload(file) {
      //! 20971520 = 20*1024*1024
      if (file.size > 20971520) {
        this.$message.error("最大文件为20M", 4)
        return
      }
      let formData = new FormData()
      formData.set("file", file)
      this.uploadFile = !0
      uploadExcel(formData).then((res) => {
        console.log(res);
        this.uploadFile = !1
        if (res.data.type.includes("excel")) {
          this.$message.error("上传失败,详情请看下载的文件......", 3.5);
          let name = res.headers["content-disposition"] ? decodeURIComponent(res.headers["content-disposition"]).match(/(?<=filename=).*(?=\.xl)/gm)[0] : "Excel文件";
          this.getExcel(res.data, name);
        } 
        else if (res.data.type.includes("application/json")) {
          const reader=new FileReader()
          reader.readAsText(res.data,'utf-8')
          reader.onload=()=>{
            let result=JSON.parse(reader.result)
            if (result.code==200) {
              this.$message.success(result.message);
              this.submitPagination()
            }else{
              this.$message.error(result.message);
            }

          }
          
        }
      }).catch((e) => {
        this.uploadFile = !1
        this.$message.error('上传请求异常'+e, 3.5)
      });
      return false;
    },
    cancel(id, issueState) {
      if (issueState != 0) {
        this.$message.warn('该单据已开票，不能撤销')
        return
      }
      cancel({id: id}).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message)
          this.submitPagination()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    printBtn() {
      if (!this.selectedRowKeys.length) {
        this.$message.warn('请先勾选要打印的数据', 2)
        return
      }
      this.$refs.modalPrintRef.openModal(this.selectedRowKeys)
     },
    ticketBtn(flag, record, issueState) {
      if (flag == 'ticket' && issueState != 0 && issueState != 4) {
        this.$message.warn('该单据已经开过发票了', 2)
        return
      } else if (flag == 'bluePlus' && issueState != 2) {
        this.$message.warn('该单据还未红冲，请先红冲')
        return
      }
      // this.changeComp(flag, record)
      //20221024发票需求
      this.$refs.invoiceApply.showModal(1, record,'',true);
    },
    redGo(id, issueState) {
      if (!issueState) {
        this.$message.warn("该单据还未开票，请先开票", 2)
        return
      } else if (issueState == 2){
        this.$message.warn("该单据已经红冲过了", 2)
        return
      }
      redGo({id: id}).then(res => {
        if (res.data.code == 200) {
          this.submitPagination()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message, 3)
        }
      })
    },
    resetBtn() {
      let nullParams = {
        dateGroup: [],
        createDateStart: '',
        createDateEnd: '',
        arInvoiceCode: undefined,
        opId: undefined,
        storeId: undefined,
        customerId: undefined,
        issueState:undefined,
        collectState:undefined,
      }
      this.option.organizationMaterial = {}
      this.option.customerMaterial = {}
      this.option.storeMaterial = {}
      this.form = nullParams
      this.handleCustomerSearch("")
      this.handleStoreSearch("")
      this.handleOrganizationSearch("")
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
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.data.total
          this.dataTable = res.data.data.list
        } else {
          this.loading = false
        }
      }).catch(() => this.loading = false)
    },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
    clearOption() { this.selectedRowKeys = [] },
    openSelectColumnPopover() { this.visibleSelectColumnPopover = true },
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
    handleCustomerSearch(value) {
      partnerType({partnerName: value?.trim(), partnerType: 20}).then(res => res.data.code == '200' && (this.option.customerOption = res.data.data))
    },
    handleCustomerOption(value) {
      this.form.customerId = value
      this.option.customerMaterial = this.option.customerOption.find(item => item.id == value) || {}
    },
    handleStoreSearch(value) {
      partnerType({partnerName: value?.trim(), partnerType: 22}).then(res => res.data.code == '200' && (this.option.storeOption = res.data.data))
    },
    handleStoreOption(value) {
      this.form.storeId = value
      this.option.storeMaterial = this.option.storeOption.find(item => item.id == value) || {}
    },
    handleOrganizationSearch(value) {
      organization({opName: value?.trim()}).then(res => res.data.code == '200' && (this.option.organizationOption = res.data.data))
    },
    handleOrganizationOption(value) {
      this.form.opId = value
      this.option.organizationMaterial = this.option.organizationOption.find(item => item.id == value) || {}
    },
    exportData() {
      const params = {
        //221024 发票需求-yyb
        issueState: this.form.issueState,
        collectState: this.form.collectState,
        createDateStart: this.form.createDateStart,
        createDateEnd: this.form.createDateEnd,
        arInvoiceCode: this.form.arInvoiceCode,
        opId: this.option.organizationMaterial?.id,
        storeName: this.option.storeMaterial?.partnerName,
        customerName: this.option.customerMaterial?.partnerName
      }
      this.loadingExcel = true
      exportData(params).then(res => {
        this.loadingExcel = false
        if (res.data?.type?.includes("application/json")) {
          let reader = new FileReader();
          let This = this
          reader.addEventListener("loadend", function () {
            let res = JSON.parse(reader.result);
            if (res.code == '200') {
              This.$message.success(res.message, 3)
            } else {
              This.$message.error(res.message, 3)
            }
          });
          reader.readAsText(res.data, 'utf-8');
          return
        }
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '应收待结算账款列表'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('下载失败')
        }
      }).catch(() => {
        this.loadingExcel = false
        this.$message.warn('下载失败')
      })
    },
    exportDataHight() {
      let customerNameList = []
      if (!this.selectedRowKeys.length) {
        this.$message.warn('请先勾选要导出的数据', 2)
        return
      }
      this.selectedRowKeys.forEach(item => this.dataTable.some(val => {
        if (item == val.id) {
          customerNameList.push(val.customerName)
          return item == val.id
        }
      }))
      if (new Set(customerNameList).size > 1) {
        this.$message.warn('请选择相同的客户，客户不相同不能导出', 2)
        return
      }
      this.loadingExcelHight = true
      exportDataHight({ids: this.selectedRowKeys.join(',')}).then(res => {
        this.selectedRowKeys = []
        this.loadingExcelHight = false
        if (res.data?.type?.includes("application/json")) {
          let reader = new FileReader();
          let This = this
          reader.addEventListener("loadend", function () {
            let res = JSON.parse(reader.result);
            if (res.code == '200') {
              This.$message.success(res.message, 3)
            } else {
              This.$message.error(res.message, 3)
            }
          });
          reader.readAsText(res.data, 'utf-8');
          return
        }
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '应收待结算账款列表'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('下载失败')
        }
      }).catch(() => {
        this.loadingExcelHight = false
        this.$message.warn('下载失败')
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
          createDateStart: this.form.createDateStart,
          createDateEnd: this.form.createDateEnd,
          arInvoiceCode: this.form.arInvoiceCode,
          opId: this.option.organizationMaterial?.id,
          storeName: this.option.storeMaterial?.partnerName,
          customerName: this.option.customerMaterial?.partnerName,
           //221024 发票需求-yyb
          issueState: this.form.issueState,
          collectState: this.form.collectState,
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        this.clearOption()
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.data.total
          this.dataTable = res.data.data.list
        } else {
          this.loading = false
        }
      }).catch(() => this.loading = false)
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        createDateStart: this.form.createDateStart,
        createDateEnd: this.form.createDateEnd,
        arInvoiceCode: this.form.arInvoiceCode,
        opId: this.option.organizationMaterial?.id,
        storeName: this.option.storeMaterial?.partnerName,
        customerName: this.option.customerMaterial?.partnerName,
         //221024 发票需求-yyb
        issueState: this.form.issueState,
        collectState: this.form.collectState,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(
        res => {
          this.clearOption()
          if (res.data.code == 200) {
            this.loading = false
            this.pagination.total = res.data.data.total
            this.dataTable = res.data.data.list
          } else {
            this.loading = false
            this.$message.warn('查询失败...')
          }
        }
      ).catch(() => this.loading = false)
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
  mounted() {
    this.$nextTick(()=>{
      window.addEventListener('resize', () => {
        document.querySelector('.paginationContainer')?.clientWidth > 1700 ? this.suitableTdWidth = '' : this.suitableTdWidth = 160
      });
    })
  },
  activated() {
    this.handleCustomerSearch()
    this.handleStoreSearch()
    this.handleOrganizationSearch()
    this.submitPagination()
  },
}
</script>

<style lang="less">
  @import './index';
</style>