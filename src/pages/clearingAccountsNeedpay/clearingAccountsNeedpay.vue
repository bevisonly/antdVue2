<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="fullScreen">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['账单生成开始日期','账单生成结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.dateGroup" @ok="changeDate" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入结算单号" v-model.trim="form.apInvoiceCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.supplierId"
                placeholder="请搜索选择供应商名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
                @change="handleSupplierOption"
              >
                <a-select-option v-for="item in option.supplierOption" :key="item.id">{{ item.partnerName }}</a-select-option>
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
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select v-model="form.state" placeholder="请选择结算状态" allowClear>
                <a-select-option v-for="item in option.stateOption" :key="item.value"> {{item.name}} </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input v-model.trim="form.containerCode" placeholder="请输入柜号"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" icon="redo" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" icon="search" @click="submitBtn('search')">查询</a-button>
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
        <a-button-group>
          <a-button type="primary" :loading="loadingTemplate" @click="downloadTemplate" :disabled="!hasPermission('waitSettle_template')"> 下载模板 </a-button>
          <a-upload
            :show-upload-list="false"
            accept=".xlsx,.xls"
            :beforeUpload="beforeUpload"
            :disabled="uploadFile || !hasPermission('waitSettle_upload')"
          >
            <a-button type="primary" :disabled="uploadFile || !hasPermission('waitSettle_upload')"> 导入结算单 </a-button>
          </a-upload>
          <a-button type="primary" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('waitSettle_export')"> 导出列表 </a-button>
          <a-button type="primary" title="导出被勾选客户相同的数据" :loading="loadingExcelHight" @click="exportDataHight" :disabled="!hasPermission('waitSettle_idExport')"> 导出结算账单 </a-button>
        </a-button-group>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <checkboxList v-model="columns" width="260" />
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
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
        :scroll="{ x: 307.778 , y: dataTable.length < 50 && 340 }"
        :pagination='false'
      >
          <template title="单据编号" slot="apInvoiceCode" slot-scope="text, record">
            <div class="divBorder" :class="record.over3DaySettlement ? 'columnStyleRed' : ''" >
              {{ record.apInvoiceCode }}
            </div>
          </template>
          <span slot="dataType" slot-scope="text">{{dataType[text] || '尾款'}}</span>
          <template title="结算周期" slot="settleCycle" slot-scope="text, record">
            <div>
              {{
                record.settleCycle == 1 ? '自然月底' :
                record.settleCycle == 2 ? '每月15日' :
                record.settleCycle == 3 ? '自定义' :
                record.settleCycle == 4 ? '按周期' : record.settleCycle
              }}
            </div>
          </template>
          <template title="结算状态" slot="state" slot-scope="text, record">
            <div>
              {{
                record.state == 5 ? '预估结算' :
                record.state == 1 ? '未结算' :
                record.state == 2 ? '结算中' :
                record.state == 3 ? '部分结算' :
                record.state == 4 ? '已结算' : record.state
              }}
            </div>
          </template>
          <span title="应付金额" slot="settlementAmount" slot-scope="text, record">
            {{ formatPrice((+record.settlementAmount || ~~record.settlementAmount) - (+record.discountAmount || ~~record.discountAmount)) }}
          </span>
          <template title="操作" slot="operation" slot-scope="text, record">
            <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('waitSettle_view')" @click="changeComp('details', record)">详情</a-button>
            <a-popconfirm placement="bottom" title="确定撤销吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('waitSettle_revokeAic')" @confirm="cancel(record.id, record.issueState)">
              <a-icon slot="icon" type="delete" style="color: red" />
              <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('waitSettle_revokeAic')">撤销</a-button>
            </a-popconfirm>
            <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('waitSettle_settle')" @click="changeComp('edit', record)">结算</a-button>
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
  </div>
</template>

<script>
import {
  search,
  exportData,
  cancel,
  exportDataHight,
  templateExcel,
  uploadExcel,
} from '@/services/settlement/payable/clearingAccountsNeedpay'
import { partnerType } from "../../services/userMa"
import { organization } from '../../services/commonSaasApi'
const columns = [
  {title: '单据编号', dataIndex: 'apInvoiceCode', width: 240, scopedSlots: {customRender: "apInvoiceCode"}},
  {title: '结算类型', dataIndex: 'dataType', width: 140, scopedSlots: {customRender: "dataType"}},
  {title: '供应商名称', dataIndex: 'supplierName', width: 300},
  {title: '代理公司名称', dataIndex: 'agencyName', width: 250},
  {title: '柜号', dataIndex: 'containerCode', width: 200},
  {title: '结算周期', dataIndex: 'settleCycle', width: 180, scopedSlots: {customRender: "settleCycle"}},
  {title: '结算状态', dataIndex: 'state', width: 180, scopedSlots: {customRender: "state"}},
  {title: '折扣金额', dataIndex: 'discountAmount', width: 200},
  {title: '已付金额', dataIndex: 'payAmounted', width: 200},
  {title: '未付金额', dataIndex: 'noPayAmount', width: 200},
  {title: '应付金额', dataIndex: 'settlementAmount', width: 200, scopedSlots: {customRender: "settlementAmount"}},
  {title: '预付金额', dataIndex: 'payAmount', width: 200},
  {title: '账单日期', dataIndex: 'billDate', width: 280},
  {title: '账单生成日期', dataIndex: 'createDate', width: 180},
  {title: '付款日期', dataIndex: 'endDate', width: 180},
  // {title: '关联合同', dataIndex: 'contractTitle', width:  200},
  //! glht
  {title: '操作', dataIndex: 'operation', width: 260, align: 'center', scopedSlots: {customRender: "operation"}},
]
export default {
  name: 'clearingAccountsNeedpay',
  data() {
    return {
      columns,
      form: {
        dateGroup: [],
        createDateStart: '',
        createDateEnd: '',
        apInvoiceCode: undefined,
        supplierId: undefined,
        agencyId:undefined,
        state:undefined,
        containerCode:undefined
      },
      option: {
        supplierOption: [],
        supplierMaterial: {},
        agencyOption: [],
        agencyMaterial: {},
        stateOption:[{value:1,name:'未结算'},{value:2,name:'结算中'},{value:5,name:'预估结算'},]
      },
      organizationOption: [],
      dataType: {
        1: '尾款',
        2: '预付款',
        3: '退款',
        4: '尾款，退款',
      },
      fullScreen: true,
      selectedRowKeys: [],
      visibleSelectColumnPopover: false,
      disabledFlage: 0,
      dataTable: [],
      loadingExcel: false,
      loading: false,
      loadingExcelHight: false,
      loadingTemplate: !1,
      uploadFile: !1,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10}
    }
  },
  methods: {
    handleOrganizationSearch(value) {
      organization({opName: value?.trim()}).then(res => res.data.code == '200' && (this.organizationOption = res.data.data))
    },
    changeComp(flag, record) { this.$parent.changeComponent(flag, record) },
    changeDate() {
      this.form.createDateStart = this.form.dateGroup[0] || ""
      this.form.createDateEnd = this.form.dateGroup[1] || ""
    },
    beforeUpload(file) {
      //! 20971520 = 20*1024*1024
      if (file.size > 20971520) {
        this.$message.error("最大文件为20M", 4)
        return
      }
      let formData = new FormData()
      formData.set("excel", file)
      this.uploadFile = !0
      uploadExcel(formData).then((res) => {
        this.uploadFile = !1
        if (res.data.type.includes("application")) {
          this.$message.error("上传失败,详情请看下载的文件......", 3.5);
          let name = res.headers["content-disposition"] ? decodeURIComponent(res.headers["content-disposition"]).match(/(?<=filename=).*(?=\.xl)/gm)[0] : "Excel文件";
          this.getExcel(res.data, name);
        } else if (res.data.type.includes("text") || res.data.size == 0) {
          this.$message.success("上传成功");
          this.submitPagination()
        }
      }).catch((e) => {
        this.uploadFile = !1
        this.$message.error('上传请求异常'+e, 3.5)
      });
      return false;
    },
    downloadTemplate() {
      this.loadingTemplate = !0
      templateExcel({}).then(res => {
        this.loadingTemplate = !1
          if (res.data.type?.includes('excel') || res.data.type?.includes('sheet')) {
            this.getExcel(res.data, '应付待结算模板')
          } else {
            this.$message.warn('下载失败')
          }
      }).catch(() => this.loadingTemplate = !1)
    },
    detailsBtn(flag, record) { this.$refs.modalDetailsRef.openModal(flag, record) },
    cancel(id) {
      cancel({id}).then(res => {
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
        dateGroup: [],
        createDateStart: '',
        createDateEnd: '',
        apInvoiceCode: undefined,
        supplierId: undefined,
        agencyId:undefined,
        state:undefined,
        containerCode:undefined,
        orgId: undefined
      }
      this.option.supplierMaterial = {}
      this.option.agencyMaterial = {}
      this.form = nullParams
      this.handleSupplierSearch('')
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
    exportDataHight() {
      let supplierNameList = []
      if (!this.selectedRowKeys.length) {
        this.$message.warn('请先勾选要导出的数据', 2)
        return
      }
      this.selectedRowKeys.forEach(item => this.dataTable.some(val => {
        if (item == val.id) {
          supplierNameList.push(val.supplierName)
          return item == val.id
        }
      }))
      if (new Set(supplierNameList).size > 1) {
        this.$message.warn('请选择相同的供应商，供应商不相同不能导出', 3.5)
        return
      }
      this.loadingExcelHight = true
      exportDataHight({ids: this.selectedRowKeys.join(',')}).then(res => {
        this.loadingExcelHight = false
        this.selectedRowKeys = []
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
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '应付待结算账款列表'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('下载失败')
        }
      }).catch(() => {
        this.loadingExcelHight = false
        this.$message.warn('下载失败')
      })
    },
    exportData() {
      const params = {
        sort: "state",
        order: "desc",
        createDateStart: this.form.createDateStart,
        createDateEnd: this.form.createDateEnd,
        apInvoiceCode: this.form.apInvoiceCode,
        partnerName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.agencyMaterial?.partnerName,
        agencyId: this.option.agencyMaterial?.id,
        orgId:this.form.orgId,
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
          apInvoiceCode: this.form.apInvoiceCode,
          partnerName: this.option.supplierMaterial?.partnerName,
          agencyName: this.option.agencyMaterial?.partnerName,
          agencyId: this.option.agencyMaterial?.id,
          orgId:this.form.orgId,
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
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
        apInvoiceCode: this.form.apInvoiceCode,
        partnerName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.agencyMaterial?.partnerName,
        agencyId: this.option.agencyMaterial?.id,
        state:this.form.state,
        containerCode:this.form.containerCode,
        orgId:this.form.orgId,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(
        res => {
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
    this.handleSupplierSearch('')
    this.handleAgencySearch('')
    this.submitPagination()
    this.handleOrganizationSearch()
  },
}
</script>

<style lang="less" scoped>
  @import './index';
</style>