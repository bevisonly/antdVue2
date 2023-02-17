<template>
  <div class="topDiv">
    <div class="queryInfo" v-show="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['采购开始日期', '采购结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroup" @ok="changeDate" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%" placeholder="请输入商品名称" v-model.trim="form.itemCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%" placeholder="请输入采购单号" v-model.trim="form.poCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%" show-search :value="form.supplierId" placeholder="请搜索选择供应商名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" @search="handleSupplierSearch" @change="handleSupplierOption">
                <a-select-option v-for="item in option.supplierOption.filter(supplierStrategy)"
                  :key="item.id">{{ item.partnerName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%" show-search v-model="form.agencyId" placeholder="请搜索选择代理公司名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="filterOption"
                :not-found-content="null">
                <a-select-option v-for="item in option.supplierOption.filter(agencyStrategy)"
                  :key="item.id">{{ item.partnerName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select mode="multiple" style="width: 100%" show-search v-model="form.whIds" placeholder="请选择仓库(支持多选)"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" @search="handleWarehouseSearch">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in warehouseOptionFilter" :key="item.baseId">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%" show-search allowClear v-model.trim="form.orgId" placeholder="请选择业务单元(主体)"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" @search="opSearch">
                <a-select-option v-for="item in opList" :key="item.orgId">{{
                    item.opName
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%" allowClear show-search mode="multiple" v-model.trim="form.typeName"
                placeholder="请选择商品一级分类" :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" @search="typeNameSearch">
                <a-select-option v-for="(item, index) in typeNameList" :key="index" :value="item">{{ item }}
                </a-select-option>
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
    <div class="tableInfo" :style="{border: !fullScreen ? 0 : ''}">
      <p class="bottomTitle" v-show="fullScreen">账款列表</p>
      <div class="flex-sb heightDiv">
        <a-button type="primary" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('receivedDetails_export')">
          导出订单
        </a-button>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="dataColumns" width="400" col="3" />
        </a-button-group>
      </div>
      <a-table class="tableStyle" bordered :data-source="dataTable" :loading="loading" rowKey="id"
        :columns="dataColumns" :scroll="{x: 300, y: dataTable[10] ? 560 : 0 }" :pagination="false">
        <span slot="inputTaxRate" slot-scope="text, record">
          <span>
            {{record.invoiceBusinessType == 0 ? '应税 -' : record.invoiceBusinessType == 1 ? '免税 -' : ''}}
            {{record.invoiceType == 1 ? '普票 -' : record.invoiceType == 2 ? '专票 -' : record.invoiceType == 3 ? '普票(免税) -' : ''}}
            {{record.invoiceType == 3 ? '抵扣率' : record.invoiceType == 1 || record.invoiceType == 2 ? '税率' : ''}}
            {{record.inputTaxRate + '%'}}
          </span>
        </span>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination :pageSizeOptions="pageSizeOptions" v-model="pagination.page" :pageSize="pagination.size"
          :total="pagination.total" :show-total="() => `共 ${pagination.total} 条`" show-size-changer
          :show-quick-jumper="pagination.total >= 1000 ? true : false" @showSizeChange="paginationSize"
          @change="paginationPage" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  search,
  exportData,
  getWarehouse,
  GetOpList,
  GetPrimaryClassification
} from '@/services/pickUpOrder/receivedDetails'
import { partnerType } from "../../services/userMa";
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy'
const dataColumns = [
  { title: '业务单元(主体)', dataIndex: 'opName', width: 200 },
  { title: '采购订单时间', dataIndex: 'createDate', width: 180 },
  { title: '收货时间', dataIndex: 'deliveryTime', width: 180 },
  { title: '采购单号', dataIndex: 'poCode', width: 260 },
  { title: '商品名称', dataIndex: 'itemName', width: 260 },
  { title: '商品一级分类', dataIndex: 'typeName', width: 150 },
  { title: '商品规格', dataIndex: 'itemSpec', width: 120 },
  { title: '供应商名称', dataIndex: 'supplierName', width: 260 },
  { title: '代理公司名称', dataIndex: 'agencyName', width: 260 },
  { title: '客户名称', dataIndex: 'customerName', width: 260 },
  { title: '门店名称', dataIndex: 'storeName', width: 260 },
  { title: '采购数量', dataIndex: 'poQty', width: 120 },
  { title: '采购单价', dataIndex: 'poPrice', width: 160 },
  { title: '实收数量', dataIndex: 'deliveryQty', width: 120 },
  { title: '实际单价', dataIndex: 'puPrice', width: 160 },
  { title: '单位', dataIndex: 'priceUnit', width: 160 },
  { title: '柜号', dataIndex: 'containerCode', width: 160 },
  { title: '商品金额', dataIndex: 'puTotalAmount', width: 160 },
  { title: '其他费用', dataIndex: 'otherFeeAmount', width: 160 },
  { title: '成本分摊后单价', dataIndex: 'costAllocationUnitPrice', width: 160 },
  { title: '入库总成本', dataIndex: 'totalCostOfWarehousing', width: 160 },
  {
    title: '增值税',
    dataIndex: 'inputTaxRate',
    width: 200,
    scopedSlots: { customRender: 'inputTaxRate' }
  },
  {
    title: '税额',
    dataIndex: 'inputTax',
    width: 200,
    scopedSlots: { customRender: 'inputTax' }
  },
  { title: '税后金额', dataIndex: 'afterTaxAmount', width: 160 },
  { title: '采购人', dataIndex: 'poSubuserName', width: 160 },
  { title: '入库仓库', dataIndex: 'whName', width: 260 }
  // {title: "关联合同", dataIndex: "contractTitle", width: 240 },
  //! glht
]
export default {
  name: 'receivedDetails',
  data() {
    return {
      dataColumns,
      fullScreen: true,
      form: {
        dateGroup: [],
        beginTime: '',
        endTime: '',
        supplierId: undefined,
        agencyId: undefined,
        itemCode: undefined,
        poCode: undefined,
        whIds: undefined,
        orgId: undefined,
        typeName: undefined
      },
      option: {
        supplierOption: [],
        supplierMaterial: {}
      },
      warehouseOption: [],
      selectedRowKeys: [],
      dataTable: [],
      loadingExcel: false,
      loading: false,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: { total: 0, page: 1, size: 10 },
      opList: [],
      typeNameList: []
    }
  },
  computed: {
    warehouseOptionFilter() {
      this.getEmptyArr()
      return this.warehouseOption
    }
  },
  methods: {
    supplierStrategy: PARTNER_STRATEGY.SUPPLIER,
    agencyStrategy: PARTNER_STRATEGY.AGENCY,
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    typeNameSearch(value) { this.getTypeNameList(value) },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    async getTypeNameList(value) {
      const res = await GetPrimaryClassification({ typeName: value || '' })
      this.typeNameList = res.data.data || []
    },
    opSearch(value) {
      this.getOp(value)
    },
    async getOp(value) {
      const res = await GetOpList({ opName: value || '' })
      this.opList = res.data.data || []
    },
    changeDate() {
      this.form.beginTime = this.form.dateGroup[0] || ''
      this.form.endTime = this.form.dateGroup[1] || ''
    },
    getEmptyArr() {
      this.form.whIds?.includes('') && (this.form.whIds = [''])
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    resetBtn() {
      let nullParams = {
        dateGroup: [],
        beginTime: '',
        endTime: '',
        supplierId: undefined,
        agencyId: undefined,
        itemCode: undefined,
        poCode: undefined,
        whIds: undefined,
        orgId: undefined,
        typeName: undefined
      }
      this.option.supplierMaterial = {}
      this.form = nullParams
      this.handleSupplierSearch()
      this.getWarehouse()
    },
    redo() {
      this.pagination.page = 1
      this.pagination.size = 10
      let params = {
        page: 1,
        rows: 10,
        sort: 'id',
        order: 'DESC'
      }
      search(params).then(res => {
        this.loading = false
        this.pagination.total = res.data?.data?.total || res.data?.total || 0
        this.dataTable = res.data?.data?.list || res.data?.rows || []
      }).catch(() => (this.loading = false))
    },
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {
        type:
          'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof obj == 'object' && obj !== null) {
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
      partnerType({ partnerName: value?.trim(), partnerTypes: [30, 40] }).then(
        res =>
          res.data.code == '200' && (this.option.supplierOption = res.data.data)
      )
    },
    handleSupplierOption(value) {
      this.form.supplierId = value
      this.option.supplierMaterial =
        this.option.supplierOption.find(item => item.id == value) || {}
    },
    getWarehouse() {
      getWarehouse({}).then(
        res =>
          res.data.code == '200' && (this.warehouseOption = res.data.data || [])
      )
    },
    handleWarehouseSearch(value) {
      getWarehouse({ name: value?.trim() }).then(
        res =>
          res.data.code == '200' && (this.warehouseOption = res.data.data || [])
      )
    },
    exportData() {
      const params = {
        sort: 'id',
        order: 'DESC',
        beginTime: this.form.beginTime || undefined,
        endTime: this.form.endTime || undefined,
        itemCode: this.form.itemCode?.trim(),
        poCode: this.form.poCode?.trim(),
        supplierName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.supplierOption.find(partner => partner.id === this.form.agencyId)?.partnerName,
        whIds: this.form.whIds?.includes('') ? [] : this.form.whIds?.join(','),
        orgId: this.form.orgId,
        typeName: this.form.typeName ? this.form.typeName.join(',') : ''
      }
      this.loadingExcel = true
      exportData(params)
        .then(res => {
          if (res.status == '200') {
            let name = res.headers['content-disposition']
              ? decodeURIComponent(res.headers['content-disposition']).match(
                /(?<=filename=).*(?=\.xl)/gm
              )[0]
              : '已收货明细导出'
            this.getExcel(res.data, name)
            this.loadingExcel = false
          } else {
            this.loadingExcel = false
            this.$message.warn('下载失败')
          }
        })
        .catch(() => {
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
          sort: 'id',
          order: 'DESC',
          beginTime: this.form.beginTime || undefined,
          endTime: this.form.endTime || undefined,
          itemCode: this.form.itemCode?.trim(),
          poCode: this.form.poCode?.trim(),
          supplierName: this.option.supplierMaterial?.partnerName,
          agencyName: this.option.supplierOption.find(partner => partner.id === this.form.agencyId)?.partnerName,
          whIds: this.form.whIds?.includes('')
            ? []
            : this.form.whIds?.join(','),
          orgId: this.form.orgId,
          typeName: this.form.typeName ? this.form.typeName.join(',') : ''
        })
      }
      this.loading = true
      search(this.copyParams)
        .then(res => {
          this.loading = false
          this.pagination.total = res.data?.data?.total || res.data?.total || 0
          this.dataTable = res.data?.data?.list || res.data?.rows || []
        })
        .catch(() => (this.loading = false))
    },
    submitBtn(flag) {
      this.pagination.page = 1
      console.log(this.form.whIds)
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: 'id',
        order: 'DESC',
        beginTime: this.form.beginTime || undefined,
        endTime: this.form.endTime || undefined,
        itemCode: this.form.itemCode?.trim(),
        poCode: this.form.poCode?.trim(),
        supplierName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.supplierOption.find(partner => partner.id === this.form.agencyId)?.partnerName,
        whIds: this.form.whIds?.includes('') ? [] : this.form.whIds?.join(','),
        orgId: this.form.orgId,
        typeName: this.form.typeName ? this.form.typeName.join(',') : ''
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params)
        .then(res => {
          this.loading = false
          this.pagination.total = res.data?.data?.total || res.data?.total || 0
          this.dataTable = res.data?.data?.list || res.data?.rows || []
        })
        .catch(() => (this.loading = false))
    },
    paginationPage(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        document.querySelector('.paginationContainer')?.clientWidth > 1700
          ? (this.suitableTdWidth = '')
          : (this.suitableTdWidth = 160)
      })
    })
  },
  activated() {
    this.getWarehouse()
    this.handleSupplierSearch('')
    this.submitPagination()
    this.getOp()
    this.getTypeNameList()
  }
}
</script>

<style lang="less">
@import './index';
</style>
