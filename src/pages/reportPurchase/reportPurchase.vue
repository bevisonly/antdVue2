<template>
  <div class="mainTop">
    <div class="queryInfo" v-if="screen">
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-button-group>
                <a-button class="a-btn" :type="primaryFlag == 'thisWeek' ? 'primary' : ''" @click="getWeekDate(0,'thisWeek')">本周</a-button>
                <a-button class="a-btn" :type="primaryFlag == 'lastWeek' ? 'primary' : ''" @click="getWeekDate(1,'lastWeek')">上周</a-button>
                <a-button class="a-btn" :type="primaryFlag == 'thisMonth' ? 'primary' : ''" @click="getMonthDate(0,'thisMonth')">本月</a-button>
                <a-button class="a-btn" :type="primaryFlag == 'lastMont' ? 'primary' : ''" @click="getMonthDate(1,'lastMont')">上月</a-button>
              </a-button-group>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-range-picker
                dropdownClassName="noShowTimeStyle"
                style="width: 100%"
                :show-time="{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="dateGroup"
                @ok="changeDate"
                @change="changeDate">
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                mode="multiple"
                v-model="form.orgId"
                placeholder="请选择业务单元"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
              >
                <a-select-option v-for="item in option.opOption" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.supplierName"
                placeholder="请搜索客户名称"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
                @search="handleCustomerNameSearch"
                @change="handleCustomerNameOption"
              >
                <a-select-option v-for="item in option.customerOption" :key="item.id">{{ item.partnerName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.itemName"
                placeholder="请搜索产品名称"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
                @search="handleItemNameSearch"
                @change="handleItemNameOption"
              >
                <a-select-option v-for="item in option.productOption" :key="item.id">{{ item.itemName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.typeName"
                placeholder="请搜索品类"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
                @search="handleTypeNameSearch"
              >
                <a-select-option v-for="item in option.classItemOption" :key="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入单据单号" v-model.trim="form.poCode" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="submitBtn('search')">查询</a-button>
              <a-button class="ant-button" @click="resetBtn">重置</a-button>
              <a-button class="ant-button" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('reportPurchase_export')">导出</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="flex-ed marginWidth">
      <a-button-group class="a-button-group">
        <checkboxList v-model="columns" width="400" />
        <a-button class="btnStyle" type="primary" :icon="screen ? 'fullscreen' : 'fullscreen-exit'" @click="screenBtn"></a-button>
      </a-button-group>
    </div>
    <div class="tableInfo">
      <a-table
        bordered
        size="middle"
        :columns="columns"
        :data-source="dataTable"
        :loading='loading'
        rowKey="indexAsc"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <span slot="signPrice" slot-scope="text,record">{{formatPrice(record.signPrice, 2)}}</span>
        <template tips='合计' slot="footer" slot-scope="currentPageData">
          合计：
          <span class="greyfont" v-if="currentPageData">采购数量</span>
          &lt;<span class="redfont">{{ mapMsg.sumPoQty || 0 }}</span>&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont" v-if="currentPageData">总退货数量</span>
          &lt;<span class="redfont">{{ mapMsg.sumReturnQty || 0 }}</span>&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont" v-if="currentPageData">总实际收货数量</span>
          &lt;<span class="redfont">{{ mapMsg.sumDeliveryQty || 0 }}</span>&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont" v-if="currentPageData">总入库金额</span>
          &lt;<span class="redfont">{{ mapMsg.sumPuTotalAmount || 0 }}</span>&gt;
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
import moment from "moment";
import {
  search,
  exportData,
  op,
  classItem,
  product
} from '@/services/report/reportPurchase'
import { partnerType } from "../../services/userMa"
const columns = [
  {title: '序号', dataIndex: 'indexAsc', width: 80, align: "center"},
  {title: '业务单元', dataIndex: 'opName', width: 200, align: "center"},
  {title: '供应商名称', dataIndex: 'supplierName', width: 300, align: "center"},
  {title: '下单日期', dataIndex: 'createTime', width: 200, align: "center"},
  {title: '收货日期', dataIndex: 'deliveryTime', width: 200, align: "center"},
  {title: '单据编号', dataIndex: 'poCode', width: 200, align: "center"},
  {title: '产品名称', dataIndex: 'itemName', width: 300, align: "center"},
  {title: '品类', dataIndex: 'typeName', width: 160, align: "center"},
  {title: '单位', dataIndex: 'priceUnit', width: 160, align: "center"},
  {title: '规格', dataIndex: 'itemSpec', width: 160, align: "center"},
  {title: '单价(元)', dataIndex: 'puPrice', width: 180, align: "center"},
  {title: '单价(不含税)(元)', dataIndex: 'noTaxPuPrice', width: 180, align: "center"},
  {title: '采购数量', dataIndex: 'poQty', width: 180, align: "center"},
  {title: '退货数量', dataIndex: 'returnQty', width: 180, align: "center"},
  {title: '实际收货数量', dataIndex: 'deliveryQty', width: 180, align: "center"},
  {title: '采购商品税额(元)', dataIndex: 'poRateAmount', width: 180, align: "center"},
  {title: '商品采购金额(元)', dataIndex: 'puTotalAmount', width: 180, align: "center"},
  {title: '商品采购金额(不含税)(元)', dataIndex: 'noTaxPuTotalAmount', width: 180, align: "center"},
  {title: '其他采购成本(元)', dataIndex: 'feeAmount', width: 180, align: "center"},
  {title: '其他采购成本(财务)(元)', dataIndex: 'noTaxOtherCost', width: 180, align: "center", scopedSlots: {customRender: "noTaxOtherCost"}},
  {title: '入库成本(元)', dataIndex: 'warehousingCosts', width: 180, align: "center"},
  {title: '入库成本(财务)(元)', dataIndex: 'noTaxWarehousingCosts', width: 180, align: "center", scopedSlots: {customRender: "noTaxWarehousingCosts"}},
]
export default {
  name: 'reportPurchase',
  data() {
    return {
      columns,
      dataTable: [],
      loading: false,
      loadingExcel: false,
      form: {},
      dateGroup: null,
      primaryFlag: undefined,
      screen: true,
      mapMsg: {},
      option: {
        opOption: [],
        customerOption: [],
        classItemOption: [],
        productOption: [],
        customerMaterial: {},
        classItemMaterial: {},
        productMaterial: {},
      },
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    }
  },
  methods: {
    moment,
    exportData() {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        deliveryTimeStart: this.form.deliveryTimeStart,
        deliveryTimeEnd: this.form.deliveryTimeEnd,
        typeName: this.form.typeName,
        supplierName: this.option.customerMaterial?.partnerName,
        itemName: this.option.productMaterial?.itemName,
        orgIds: this.form.orgId,
        poCode: this.form.poCode
      }
      this.loadingExcel = true
      exportData(params).then(res => {
        if (res.status == '200' && res.data.type != "application/json") {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '产品采购明细表'
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
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        deliveryTimeStart: this.form.deliveryTimeStart,
        deliveryTimeEnd: this.form.deliveryTimeEnd,
        typeName: this.form.typeName,
        supplierName: this.option.customerMaterial?.partnerName,
        itemName: this.option.productMaterial?.itemName,
        orgIds: this.form.orgId,
        poCode: this.form.poCode
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(res => {
        if (res.data.code == 200) {
          this.loading = false
          this.pagination.total = res.data.totalNum
          res.data.data.forEach((item, i) => item.indexAsc = ++i)
          this.dataTable = res.data.data
          this.mapMsg = res.data.map
        } else {
          this.loading = false
          this.$message.warn(res.data.message, 2)
        }
      }).catch(() => this.loading = false)
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          deliveryTimeStart: this.form.deliveryTimeStart,
          deliveryTimeEnd: this.form.deliveryTimeEnd,
          typeName: this.form.typeName,
          supplierName: this.option.customerMaterial?.partnerName,
          itemName: this.option.productMaterial?.itemName,
          orgIds: this.form.orgId,
          poCode: this.form.poCode
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.totalNum
          res.data.data.forEach((item, i) => item.indexAsc = ++i)
          this.dataTable = res.data.data
          this.mapMsg = res.data.map
        } else {
          this.loading = false
        }
      }).catch(() => this.loading = false)
    },
    resetBtn() {
      this.form = {}
      this.option.customerMaterial = {}
      this.option.classItemMaterial = {}
      this.option.productMaterial = {}
      this.dateGroup = null
      this.primaryFlag = undefined
      this.handleOrgIdSearch()
      this.handleCustomerNameSearch()
      this.handleItemNameSearch()
      this.handleTypeNameSearch()
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    handleOrgIdSearch() {
      op({}).then(res => this.option.opOption = res.data.data || [])
    },
    handleCustomerNameSearch(v) {
      partnerType({partnerName: v?.trim() || '', partnerType: 20}).then(res => this.option.customerOption = res.data.data || [])
    },
    handleCustomerNameOption(value) {
      this.form.supplierName = value
      this.option.customerMaterial = this.option.customerOption.find(item => item.id == value) || {}
    },
    handleItemNameSearch(v) {
      product({likeItemName: v?.trim() || '',rows: 50, page: 1}).then(res => this.option.productOption = res.data.data || [])
    },
    handleItemNameOption(value) {
      this.form.itemName = value
      this.option.productMaterial = this.option.productOption.find(item => item.id == value) || {}
    },
    handleTypeNameSearch(v) {
      classItem({typeName: v?.trim() || '', rows: 50}).then(res => this.option.classItemOption = res.data.data || [])
    },
    getWeekDate(weekFlag, primaryFlag) {
      this.primaryFlag = primaryFlag
      this.dateGroup = null
      if (weekFlag == "0") {
        this.form.deliveryTimeStart = moment('00:00:00', 'HH:mm:ss').startOf("week").format("YYYY-MM-DD HH:mm:ss")
        this.form.deliveryTimeEnd = moment('23:59:59', 'HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")
      } else {
        this.form.deliveryTimeStart = moment('00:00:00', 'HH:mm:ss').startOf("week").format("YYYY-MM-DD HH:mm:ss")
        this.form.deliveryTimeEnd = moment('23:59:59', 'HH:mm:ss').endOf("week").format("YYYY-MM-DD HH:mm:ss")
      }
    },
    getMonthDate(monthFlag, primaryFlag) {
      this.primaryFlag = primaryFlag
      this.dateGroup = null
      if (monthFlag == "0") {
        this.form.deliveryTimeStart = moment('00:00:00', 'HH:mm:ss').startOf("month").format("YYYY-MM-DD HH:mm:ss")
        this.form.deliveryTimeEnd = moment('23:59:59', 'HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")
      } else {
        this.form.deliveryTimeStart = moment('00:00:00', 'HH:mm:ss').startOf("month").format("YYYY-MM-DD HH:mm:ss")
        this.form.deliveryTimeEnd = moment('23:59:59', 'HH:mm:ss').endOf("month").format("YYYY-MM-DD HH:mm:ss")
      }
    },
    changeDate() {
      this.primaryFlag = undefined
      this.form.deliveryTimeStart = this.dateGroup[0] || undefined
      this.form.deliveryTimeEnd = this.dateGroup[1] || undefined
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
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
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
    this.primaryFlag = undefined
    this.handleOrgIdSearch()
    this.handleCustomerNameSearch()
    this.handleItemNameSearch()
    this.handleTypeNameSearch()
    this.submitPagination()
  },
}
</script>

<style lang="less" scoped>
  @import './index';
</style>