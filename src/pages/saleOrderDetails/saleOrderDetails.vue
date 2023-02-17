<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker :placeholder="['送货开始日期', '送货结束日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroup" @ok="changeDate" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidthHalf">
              <a-select style="width: 100%;" placeholder="单据状态" allowClear v-model="form.state"
                @change="handleChangeStateOption">
                <a-select-option v-for="(item, i) in option.stateOption" :value="item.value" :key="i">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidthHalf">
              <a-select style="width: 100%;" placeholder="订单类型" allowClear v-model="form.type"
                @change="handleChangeTypeOption">
                <a-select-option v-for="(item, i) in option.typeOption" :value="item.value" :key="i">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search :value="form.opId" placeholder="请搜索选择 运营主体"
                :default-active-first-option="false" :filter-option="false" :not-found-content="null" allowClear
                @change="handleOpOption">
                <a-select-option v-for="item in option.opOption" :key="item.id">{{ item.opName }}</a-select-option>
              </a-select>
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
              <a-input style="width: 100%;" placeholder="请输入销售单号" allowClear v-model.trim="form.soSno"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入商品名称" allowClear v-model.trim="form.likeItemName"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入柜号,多个柜号用逗号(，)隔开" allowClear v-model.trim="form.containerCode">
              </a-input>
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
        <a-button type="primary" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('order_detail_export')">
          导出
        </a-button>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="columns" width="380" col="3" />
        </a-button-group>
      </div>
      <a-table class="tableStyle" bordered :columns="columns" :data-source="dataTable" :loading="loading"
        rowKey="id" :scroll="{ x: 300, y: dataTable[10] ? 560 : 0}" :pagination="false">
        <span title="包装收费类型" slot="packType" slot-scope="text">
          {{text == 1 ? '不收费' : '收费'}}
        </span>
        <span title="增值税" slot="vat" slot-scope="text, record">
          {{record.invoiceBusinessType == 0 ? '应税 -' : record.invoiceBusinessType == 1 ? '免税 -' : ''}}
          {{record.invoiceType == 1 ? '普票 -' : record.invoiceType == 2 ? '专票 -' : record.invoiceType == 3 ? '普票(免税) -' : ''}}
          {{record.invoiceType == 3 ? '抵扣率' : record.invoiceType == 1 || record.invoiceType == 2 ? '税率' : ''}}
          {{record.vat + '%'}}
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
  opMain,
  exportData,
  orderState,
  orderType
} from '@/services/enterSaleStore/sale/saleOrderDetails'
import { partnerType } from "@/services/userMa.js";
const columns = [
  { title: '送货日期', dataIndex: 'deliveryDate', width: 180 },
  { title: '销售单号', dataIndex: 'soSno', width: 220 },
  { title: '商品名称', dataIndex: 'itemName', width: 240 },
  { title: '商品编码', dataIndex: 'itemSno', width: 160 },
  { title: '柜号', dataIndex: 'containerCode', width: 160 },
  { title: '签收状态', dataIndex: 'stateDesc', width: 140 },
  { title: '客户名称', dataIndex: 'customerName', width: 360 },
  { title: '门店名称', dataIndex: 'storeName', width: 360 },
  { title: '数量', dataIndex: 'saleQty', width: 160 },
  { title: '采购价', dataIndex: 'supplyPrice', width: 160 },
  { title: '销售价', dataIndex: 'salePrice', width: 160 },
  { title: '单位', dataIndex: 'priceUnit', width: 120 },
  { title: '包装收费类型', dataIndex: 'packType', width: 180 },
  { title: '包装数量', dataIndex: 'packQty', width: 160 },
  { title: '包装费(元)', dataIndex: 'packAmount', width: 200 },
  { title: '创建日期', dataIndex: 'createDate', width: 200 },
  { title: '创建人', dataIndex: 'createUser', width: 180 },
  {
    title: '增值税',
    dataIndex: 'vat',
    width: 200,
    scopedSlots: { customRender: 'vat' }
  },
  { title: '关联合同', dataIndex: 'contractTitle', width: 240 }
]
export default {
  name: 'saleOrderDetails',
  data() {
    return {
      columns,
      form: {
        dateGroup: [],
        deliveryDateStart: undefined,
        deliveryDateEnd: undefined,
        state: undefined,
        type: undefined,
        customerNameId: undefined,
        storeNameId: undefined,
        opId: undefined,
        soSno: undefined,
        likeItemName: undefined,
        containerCode: undefined
      },
      option: {
        stateOption: [],
        typeOption: [],
        customerNameOption: [],
        storeNameOption: [],
        opOption: [],
        stateOptionMaterial: {},
        typeOptionMaterial: {},
        customerNameOptionMaterial: {},
        storeNameOptionMaterial: {},
        opOptionMaterial: {}
      },
      fullScreen: true,
      dataTable: [],
      loadingExcel: false,
      loading: false,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: { total: 0, page: 1, size: 10 }
    }
  },
  methods: {
    dataParams() {
      let params = {
        order: 'DESC',
        deliveryDateStart: this.form.deliveryDateStart,
        deliveryDateEnd: this.form.deliveryDateEnd,
        likeItemName: this.form.likeItemName || undefined,
        soSno: this.form.soSno || undefined,
        type: this.form.type,
        state: this.form.state,
        opId: this.form.opId,
        customerId: this.option?.customerNameOptionMaterial?.id,
        storeId: this.option?.storeNameOptionMaterial?.id,
        containerCode: this.form.containerCode?.replaceAll(',', '，')
      }
      return params
    },
    changeDate() {
      this.form.deliveryDateStart = this.form.dateGroup[0] || undefined
      this.form.deliveryDateEnd = this.form.dateGroup[1] || undefined
    },
    handleChangeStateOption(value) {
      this.form.state = value
    },
    handleChangeTypeOption(value) {
      this.form.type = value
    },
    resetBtn() {
      let nullParams = {
        dateGroup: [],
        deliveryDateStart: '',
        deliveryDateEnd: '',
        state: undefined,
        type: undefined,
        customerNameId: undefined,
        storeNameId: undefined,
        opId: undefined,
        soSno: undefined,
        likeItemName: undefined
      }
      this.option.stateOptionMaterial = {}
      this.option.typeOptionMaterial = {}
      this.option.customerNameOptionMaterial = {}
      this.option.storeNameOptionMaterial = {}
      this.option.opOptionMaterial = {}
      this.form = nullParams
      this.getOrderStateAndType()
      this.handleCustomerNameSearch('')
      this.handleStoreNameSearch('')
      this.handleOpSearch('')
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
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.totalNum
          this.dataTable = res.data.data
        } else {
          this.loading = false
        }
      }).catch(() => (this.loading = false))
    },
    fullScreenBtn() {
      this.fullScreen = !this.fullScreen
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
    getOrderStateAndType() {
      orderState().then(
        res => res.status == 200 && (this.option.stateOption = res.data)
      )
      orderType().then(
        res => res.status == 200 && (this.option.typeOption = res.data)
      )
    },
    handleCustomerNameSearch(partnerName) {
      partnerType({ partnerName, partnerType: 20 }).then(
        res => res.data.code == '200' && (this.option.customerNameOption = res.data.data)
      )
    },
    handleCustomerNameOption(value) {
      this.form.customerNameId = value
      this.option.customerNameOptionMaterial = this.option.customerNameOption.find(item => item.id == value) || {}
    },
    handleStoreNameSearch(partnerName) {
      partnerType({ partnerName, partnerType: 22 }).then(
        res => res.data.code == '200' && (this.option.storeNameOption = res.data.data)
      )
    },
    handleStoreNameOption(value) {
      this.form.storeNameId = value
      this.option.storeNameOptionMaterial = this.option.storeNameOption.find(item => item.id == value) || {}
    },
    handleOpSearch() {
      opMain({}).then(
        res => res.data.code == '200' && (this.option.opOption = res.data.data)
      )
    },
    handleOpOption(value) {
      this.form.opId = value
      this.option.opOptionMaterial = this.option.opOption.find(item => item.id == value) || {}
    },
    exportData() {
      const params = {
        sort: 'create_date',
        ...this.dataParams()
      }
      this.loadingExcel = true
      exportData(params)
        .then(res => {
          if (res.status == '200') {
            let name = res.headers['content-disposition']
              ? decodeURIComponent(res.headers['content-disposition']).match(
                /(?<=filename=).*(?=\.xl)/gm
              )[0]
              : '销售订单明细列表导出'
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
          ...this.dataParams()
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.totalNum
          this.dataTable = res.data.data
        } else {
          this.loading = false
        }
      }).catch(() => (this.loading = false))
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: 'id',
        ...this.dataParams()
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(res => {
        if (res.data.code == 200) {
          this.loading = false
          this.pagination.total = res.data.totalNum
          this.dataTable = res.data.data
        } else {
          this.loading = false
          this.$message.warn('查询失败...')
        }
      }).catch(() => (this.loading = false))
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
  activated() {
    this.getOrderStateAndType()
    this.handleCustomerNameSearch('')
    this.handleStoreNameSearch('')
    this.handleOpSearch('')
    this.submitPagination()
  }
}
</script>

<style lang="less">
@import './index';
</style>
