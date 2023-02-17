<template>
  <div class="topDiv">
    <div class="queryInfo" v-show="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-row>
        <a-col :span="24">
          <a-form-model>
            <a-form-model-item class="formItemStyle" label="库存日期">
              <a-range-picker dropdownClassName="noShowTimeStyle" show-time valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.dateGroup" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth" label="商品名称">
              <a-input v-model.trim="form.itemName" placeholder="请输入商品名称"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth" label="商品编码">
              <a-input v-model.trim="form.itemCode" placeholder="请输入商品编码"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth" label="商品规格">
              <a-input v-model.trim="form.itemSpec" placeholder="请输入商品规格"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle typeSelectWidth" label="库存分类">
              <a-select v-model="form.invAvailableType" placeholder="请选择库存种类">
                <a-select-option value=''>{{'全部'}}</a-select-option>
                <a-select-option value='1'>{{'在库库存'}}</a-select-option>
                <a-select-option value='2'>{{'在途库存'}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle typeSelectWidth" label="计价单位">
              <a-select v-model="form.priceUnit" placeholder="请选择计价单位">
                <a-select-option v-for="(item, i) in priceUnitOption" :key="i" :value='item.dicText'>{{item.dicText}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle supplierWidth" label="运营主体">
              <a-select
                mode="multiple"
                style="width: 56%;"
                show-search
                v-model="form.orgId"
                placeholder="请搜索选择运营主体"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in supplierOptionFilter" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
              <a-button class="ant-button" type="primary" @click="clearForm">清空</a-button>
              <a-button type="primary" @click="onSubmit('search')">查询</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
    <div class="tableInfo" :style="{border: !fullScreen ? 0 : ''}">
      <div class="pTittle" v-show="fullScreen">结果列表</div>
      <div class="flex-sb heightDiv">
        <a-button type="primary" title="导出全部数据" :disabled="!hasPermission('product_futures_stock_export')" :loading="loadingDownload" @click="downloadBtn"> 导出 </a-button>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="columns" width="400" col="3" />
        </a-button-group>
      </div>
      <a-table bordered :columns="columns" :scroll="{ x: 300, y: dataTable[10] ? 560 : 0 }" :data-source="dataTable" :loading='loading' rowKey="id" :pagination='false'>
        <span tips="库存分类" slot="invAvailableType" slot-scope="text, record">
          <span>{{record.invAvailableType == '1' ? '在库库存' :  '在途库存'}}</span>
        </span>
        <span tips="入库数量" slot="inboundQty" slot-scope="text, record">
          <a-button type="link" class="greenfont cursorPin bluefonthover" title="查看入库明细" :disabled="!hasPermission('inventoryDailyReport_inbound')" @click="detailsBtn('inStock', record.id)">{{ record.inboundQty }}</a-button>
        </span>
        <span  tips="出库数量" slot="outboundQty" slot-scope="text, record">
          <a-button type="link" class="greenfont cursorPin bluefonthover" title="查看出库明细" :disabled="!hasPermission('inventoryDailyReport_outbound')" @click="detailsBtn('outStock', record.id)">{{ record.outboundQty }}</a-button>
        </span>
        <template tips='合计' slot="footer" slot-scope="currentPageData">
          本页合计:
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
    <modal-details ref="modalDetailsRef"/>
  </div>
</template>

<script>
import {
  dictionaryList,
  opSubjectList,
  inventoryDailyReportListDailyPage,
  exportIsFinished
} from '@/services/enterSaleStore/store/productFuturesStock.js'
import modalDetails from './modalDetails'
import moment from 'moment';
const columns = [
  {title: '日期', dataIndex: 'inventoryDate', width: 160, sorter: (a, b) => new Date(a.inventoryDate).getTime() - new Date(b.inventoryDate).getTime()},
  {title: '商品名称', dataIndex: 'itemName', width: 260, sorter: (a, b) => a.itemName.length - b.itemName.length},
  {title: '商品编码', dataIndex: 'itemCode', width: 160, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('')},
  {title: '规格', dataIndex: 'itemSpec', width: 110, sorter: (a, b) => a.itemSpec.length - b.itemSpec.length},
  {title: '计价单位', dataIndex: 'priceUnit', width: 160},
  {title: '库存分类', dataIndex: 'invAvailableType', width: 166, scopedSlots: {customRender: "invAvailableType"}},
  {title: '期初数量', dataIndex: 'beginningQty', width: 166, sorter: (a, b) => a.beginningQty - b.beginningQty},
  {title: '期末数量', dataIndex: 'endingQty', width: 166, sorter: (a, b) => a.endingQty - b.endingQty},
  {title: '入库数量', dataIndex: 'inboundQty', width: 166, sorter: (a, b) => a.inboundQty - b.inboundQty, scopedSlots: {customRender: "inboundQty"}},
  {title: '出库数量', dataIndex: 'outboundQty', width: 166, sorter: (a, b) => a.outboundQty - b.outboundQty, scopedSlots: {customRender: "outboundQty"}},
  {title: '损耗数量', dataIndex: 'lossQty', width: 166, sorter: (a, b) => a.inventoryQty - b.inventoryQty},
  {title: '库存数量增量', dataIndex: 'inventoryQty', width: 166, sorter: (a, b) => a.inventoryQty - b.inventoryQty},
  {title: '库存重量增量', dataIndex: 'inventoryWeight', width: 166, sorter: (a, b) => a.inventoryWeight - b.inventoryWeight},
  {title: '库存商品物值', dataIndex: 'itemWorthValue', width: 166, sorter: (a, b) => a.itemWorthValue - b.itemWorthValue},
]
export default {
  name: 'productFuturesStock',
  components: { modalDetails },
  data() {
    return {
      columns,
      form: {
        dateGroup: [],
        inventoryDateStart: '',
        inventoryDateEnd: '',
        itemName: undefined,
        itemCode: undefined,
        itemSpec: undefined,
        invAvailableType: '',
        priceUnit: undefined,
        orgId: [],
      },
      totalSum: [
        ["beginningQty", "期初数量"],["endingQty", "期末数量"],["inboundQty", "入库数量"],
        ["outboundQty", "出库数量"],["lossQty", "损耗数量"],["inventoryQty", "库存数量增量"],
        ["inventoryWeight", "库存重量增量"],["itemWorthValue", "库存商品物值"]
      ],
      copyParams: undefined,
      priceUnitOption: [],
      supplierOption: [],
      fullScreen: true,
      disabledFlage: 0,
      dataTable: [],
      loading: false,
      loadingDownload: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    }
  },
  computed: {
    supplierOptionFilter() {
      this.getEmptyArrOrgId()
      return this.supplierOption
    }
  },
  methods: {
    getEmptyArrOrgId() {
      this.form.orgId.includes("") && (this.form.orgId = [""])
    },
    changeDate() {
      this.form.inventoryDateStart = this.form.dateGroup[0] || ""
      this.form.inventoryDateEnd = this.form.dateGroup[1] || ""
    },
    getPriceUnit() {
      dictionaryList({type: 10}).then(
        res => {
          if (res.data.code == '200') {
            res.data.data.unshift({dicText:'全部'})
            this.priceUnitOption= res.data.data
            this.form.priceUnit = res.data.data[0]?.dicText
          }
        }
      )
    },
    getSupplierName() {
      opSubjectList({}).then(res => this.supplierOption = res.data.data && (this.supplierOption= res.data.data))
    },
    handleSupplierSearch(value) {
      opSubjectList({opName: value}).then(res => res.data.code == '200' ? this.supplierOption= res.data.data : '')
    },
    clearForm() {
      const value = {
        dateGroup: [],
        inventoryDateStart: '',
        inventoryDateEnd: '',
        itemName: undefined,
        itemCode: undefined,
        itemSpec: undefined,
        invAvailableType: '',
        priceUnit: undefined,
        orgId: []
      }
      this.form.inventoryDateStart = ""
      this.form.inventoryDateEnd = ""
      this.form = value
      this.getSupplierName()
    },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
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
    redo() {
      this.pagination.page = 1
      this.pagination.size = 10
      const params = {
        sort: "id",
        order: "desc",
        page: 1,
        rows: 10,
      }
      this.loading = true
      inventoryDailyReportListDailyPage(params).then(
        res => {
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
          this.loading = false
        }
      ).catch(() => this.loading = false)
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone(
          {
            rows: this.pagination.size,
            page: this.pagination.page,
            sort: 'id',
            order: 'desc',
            orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
            itemName: this.form.itemName,
            itemCode: this.form.itemCode,
            itemSpec: this.form.itemSpec,
            priceUnit: this.form.priceUnit == '全部' ? undefined : this.form.priceUnit,
            invAvailableType: this.form.invAvailableType,
            inventoryDateStart: this.form.dateGroup[0] || '',
            inventoryDateEnd: this.form.dateGroup[1] || ''
          }
        )
      }
      this.loading = true
      inventoryDailyReportListDailyPage(this.copyParams).then(
        res => {
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
          this.loading = false
        }
      ).catch(() => this.loading = false)
    },
    onSubmit(flag) {
      const params = {
        rows: this.pagination.size,
        page: this.pagination.page,
        sort: 'id',
        order: 'desc',
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        itemSpec: this.form.itemSpec,
        priceUnit: this.form.priceUnit == '全部' ? undefined : this.form.priceUnit,
        invAvailableType: this.form.invAvailableType,
        inventoryDateStart: this.form.dateGroup[0] || '',
        inventoryDateEnd: this.form.dateGroup[1] || ''
      }
      if (flag === 'search') {
        this.pagination.page = 1
        params.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      inventoryDailyReportListDailyPage(params).then(
        res => {
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
          this.loading = false
        }
      ).then(() => this.loading = false)
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    downloadBtn() {
      let params = {
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        itemSpec: this.form.itemSpec,
        priceUnit: this.form.priceUnit == '全部' ? undefined : this.form.priceUnit,
        invAvailableType: this.form.invAvailableType,
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        inventoryDateStart: this.form.dateGroup[0] || '',
        inventoryDateEnd: this.form.dateGroup[1] || ''
      }
      this.loadingDownload = true
      exportIsFinished(params).then(
        res => {
          if (res.data.type == 'application/vnd.ms-excel' || res.data.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '商品期货列表导出'
            this.getErrExcel(res.data, name)
            this.loadingDownload = false
          } else {
            this.loadingDownload = false
            this.$message.warn('导出失败')
          }
        }
      ).catch(() => {
        this.loadingDownload = false
        this.$message.warn('导出失败')
      })
    },
    detailsBtn(flag, id) {
      this.$refs.modalDetailsRef.openModal(flag, id)
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
    },
  },
  activated() {
    this.getPriceUnit()
    this.getSupplierName()
    this.submitPagination()
  },
  created() {
    this.form.dateGroup = [
      moment('00:00:00', 'HH:mm:ss').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      moment('23:59:59', 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    ]
    this.form.inventoryDateStart = this.form.dateGroup[0]
    this.form.inventoryDateEnd = this.form.dateGroup[1]
    this.form.orgId = [+localStorage.getItem('orgId')]
  }
}
</script>

<style lang="less">
  @import './index';
</style>