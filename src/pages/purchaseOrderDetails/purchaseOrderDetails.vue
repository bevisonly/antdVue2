<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['采购开始日期', '采购结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroup" @ok="changeDate" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search :value="form.customerNameId" placeholder="请搜索选择 客户名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" allowClear @search="handleCustomerNameSearch"
                @change="handleCustomerNameOption">
                <a-select-option v-for="item in option.customerNameOption" :key="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search :value="form.storeNameId" placeholder="请搜索选择 门店名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" allowClear @search="handleStoreNameSearch" @change="handleStoreNameOption">
                <a-select-option v-for="item in option.storeNameOption" :key="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search :value="form.supplierId" placeholder="请搜索选择 供应商"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" allowClear @search="handleSupplierSearch" @change="handleSupplierOption">
                <a-select-option v-for="item in option.supplierOption" :key="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search v-model="form.agencyId" placeholder="请输入代理公司名称"
                :show-arrow="false" :filter-option="filterOption" allowClear>
                <a-select-option v-for="item in partnerList.filter(agencyStrategy)" :key="item.id"
                  :value="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入采购单号" allowClear v-model="form.poCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入需求单号" allowClear v-model="form.roCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入销售单号" allowClear v-model="form.soCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入商品名称" allowClear v-model="form.itemCode"></a-input>
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
        <a-button type="primary" :loading="loadingExcel" @click="exportData"
          :disabled="!hasPermission('purchaseOrderDetail_export')"> 导出 </a-button>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="columns" width="380" col="3" />
        </a-button-group>
      </div>
      <a-table class="tableStyle" bordered ref="tableRef" :columns="columns" :data-source="dataTable" :loading='loading'
        rowKey="id" :scroll="{ x: 300, y: dataTable[10] ? 560 : 0 }"
        :pagination='false'>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination :pageSizeOptions='pageSizeOptions' v-model="pagination.page" :pageSize="pagination.size"
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
} from '@/services/enterSaleStore/purchase/purchaseOrderDetails'
import { partnerType } from "../../services/userMa"
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy'
const columns = [
  { title: '采购日期', dataIndex: 'createDate', width: 180 },
  { title: '采购单号', dataIndex: 'poCode', width: 220 },
  { title: '需求单号', dataIndex: 'roCode', width: 220 },
  { title: '销售单号', dataIndex: 'soCode', width: 220 },
  { title: '商品名称', dataIndex: 'itemName', width: 240 },
  { title: '商品规格', dataIndex: 'itemSpec', width: 160 },
  { title: '供应商名称', dataIndex: 'supplierName', width: 360 },
  { title: '代理公司名称', dataIndex: 'agencyName', width: 360 },
  { title: '客户名称', dataIndex: 'customerName', width: 360 },
  { title: '门店名称', dataIndex: 'storeName', width: 360 },
  { title: '商品金额', dataIndex: 'saleAmount', width: 160 },
  { title: '采购数量', dataIndex: 'poQty', width: 160 },
  { title: '采购单价', dataIndex: 'poPrice', width: 160 },
  { title: '销售件数', dataIndex: 'soQty', width: 160 },
  { title: '包装', dataIndex: 'packingName', width: 120 },
  { title: '包装费用', dataIndex: 'packingCost', width: 180 },
  { title: '采购总金额', dataIndex: 'poTotalAmount', width: 160 },
  { title: '采购人', dataIndex: 'poSubuserName', width: 160 },
  { title: '关联合同', dataIndex: 'contractTitle', width: 240 },
]
export default {
  name: 'purchaseOrderDetails',
  data() {
    return {
      columns,
      form: {
        dateGroup: [],
        beginTime: undefined,
        endTime: undefined,
        customerNameId: undefined,
        storeNameId: undefined,
        supplierId: undefined,
        agencyId: undefined,
        poCode: undefined,
        roCode: undefined,
        soCode: undefined,
        itemCode: undefined
      },
      option: {
        customerNameOption: [],
        storeNameOption: [],
        supplierOption: [],
        customerNameOptionMaterial: {},
        storeNameOptionMaterial: {},
        supplierOptionMaterial: {}
      },
      fullScreen: true,
      disabledFlage: 0,
      dataTable: [],
      loadingExcel: false,
      loading: false,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: { total: 0, page: 1, size: 10 },
      partnerList: [] //收款主体,供应商/代理公司
    }
  },
  methods: {
    agencyStrategy: PARTNER_STRATEGY.AGENCY,
    dataParams() {
      let pamrams = {
        order: "DESC",
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        itemCode: this.form.itemCode?.trim() || undefined,
        soCode: this.form.soCode?.trim() || undefined,
        roCode: this.form.roCode?.trim() || undefined,
        poCode: this.form.poCode?.trim() || undefined,
        customerName: this.form.customerNameId ? this.option.customerNameOptionMaterial.partnerName : undefined,
        storeId: this.form.storeNameId ? this.option.storeNameOptionMaterial.id : undefined,
        supplierName: this.form.supplierId ? this.option.supplierOptionMaterial.partnerName : undefined,
        agencyName: this.form.agencyId ? this.partnerList.find(partner => partner.id === this.form.agencyId)?.partnerName : undefined
      }
      return pamrams
    },
    changeDate() {
      this.form.beginTime = this.form.dateGroup[0] || undefined
      this.form.endTime = this.form.dateGroup[1] || undefined
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    resetBtn() {
      let nullParams = {
        dateGroup: [],
        beginTime: undefined,
        endTime: undefined,
        customerNameId: undefined,
        storeNameId: undefined,
        supplierId: undefined,
        agencyId: undefined,
        poCode: undefined,
        roCode: undefined,
        soCode: undefined,
        itemCode: undefined
      }
      this.option.customerNameOptionMaterial = {}
      this.option.storeNameOptionMaterial = {}
      this.option.supplierOptionMaterial = {}
      this.form = nullParams
      this.handleCustomerNameSearch("")
      this.handleStoreNameSearch("")
      this.handleSupplierNameSearch("")
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
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], { type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof (obj) == 'object' && obj !== null) {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i])
        }
      } else {
        objStorageBox = obj
      }
      return objStorageBox
    },
    handleCustomerNameSearch(value) {
      partnerType({ partnerName: value?.trim(), partnerType: 20 }).then(res => res.data.code == '200' && (this.option.customerNameOption = res.data.data))
    },
    handleCustomerNameOption(value) {
      this.form.customerNameId = value
      this.option.customerNameOptionMaterial = this.option.customerNameOption.find(item => item.id == value) || {}
    },
    handleStoreNameSearch(value) {
      partnerType({ partnerName: value?.trim(), partnerType: 22 }).then(res => res.data.code == '200' && (this.option.storeNameOption = res.data.data))
    },
    handleStoreNameOption(value) {
      this.form.storeNameId = value
      this.option.storeNameOptionMaterial = this.option.storeNameOption.find(item => item.id == value) || {}
    },
    handleSupplierSearch(value) {
      partnerType({ partnerName: value?.trim(), partnerType: 30 }).then(res => res.data.code == '200' && (this.option.supplierOption = res.data.data))
    },
    handleSupplierOption(value) {
      this.form.supplierId = value
      this.option.supplierOptionMaterial = this.option.supplierOption.find(item => item.id == value) || {}
    },
    getPartnerList() {
      // 收款主体，全量供应商/代理公司
      const params = {
        partnerTypes: [30, 40],
      };
      partnerType(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.partnerList = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    exportData() {
      const params = {
        sort: "create_date",
        ...this.dataParams()
      }
      this.loadingExcel = true
      exportData(params).then(res => {
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '采购订单明细列表导出'
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
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          sort: "id",
          ...this.dataParams()
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
        ...this.dataParams()
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
    paginationPage(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
  },
  activated() {
    this.handleCustomerNameSearch("")
    this.handleStoreNameSearch("")
    this.handleSupplierSearch("")
    this.submitPagination()
    this.getPartnerList()
  },
}
</script>

<style lang="less">
@import './index';
</style>