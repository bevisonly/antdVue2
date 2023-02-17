<template>
  <div class="topDiv">
    <div class="queryInfo" v-show="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-row>
        <a-col :span="24">
          <a-form-model>
            <a-form-model-item class="formItemStyle" label="创建日期">
              <a-range-picker dropdownClassName="noShowTimeStyle" show-time valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.dateGroup" @change="changeDate"></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth" label="商品名称">
              <a-input v-model.trim="form.itemName" placeholder="请输入商品名称"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth" label="商品编码">
              <a-input v-model.trim="form.itemCode" placeholder="请输入商品编码"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle typeSelectWidth" label="库存分类">
              <a-select v-model="form.invAvailableType" placeholder="请选择库存种类">
                <a-select-option value=''>全部</a-select-option>
                <a-select-option value='1'>{{'在库库存'}}</a-select-option>
                <a-select-option value='2'>{{'在途库存'}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle stockSelectWidth" label="仓库名称">
              <a-select
                mode="multiple"
                show-search
                v-model="form.whIds"
                placeholder="请选择仓库"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleWarehouseSearch"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in warehouseOptionFilter" :key="item.baseId">{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle widthStyle" label="供应商名称">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.supplierName"
                placeholder="请输入供应商名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
                @change="handleSupplierOption"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in supplierNameOption" :key="item.id">{{ item.partnerName }}</a-select-option>
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
                @search="handleSubjectSearch"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in supplierOptionFilter" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
              <a-button class="ant-button" type="primary" @click="clearForm"> 清空 </a-button>
              <a-button type="primary" @click="onSubmit('search')"> 查询 </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
    <div class="tableInfo" :style="{border: !fullScreen ? 0 : ''}">
      <div class="pTittle" v-show="fullScreen">查询列表</div>
      <div class="flex-sb heightDiv">
        <a-button type="primary" :disabled="!hasPermission('item_invlot_export')" :loading="loadingBtn" @click="downloadBtn">导出</a-button>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="columns" width="220" />
        </a-button-group>
      </div>
      <a-table bordered :columns="columns" :scroll="{ y: dataTable[10] ? 560 : 0 }" :data-source="dataTable" :loading='loading' rowKey="id" :pagination='false'>
        <template tips="库存分类" slot="invAvailableType" slot-scope="text, record">
          <span>{{record.invAvailableType == '1' ? '在库库存' :  '在途库存'}}</span>
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
  opSubjectList,
  itemInvLotExportList,
  itemInvLotListPage,
  getWarehouse
} from '@/services/productStock.js'
import { partnerType } from "@/services/userMa.js";
import moment from 'moment';
const columns = [
  {title: '商品名称', dataIndex: 'itemName', sorter: (a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime()},
  {title: '商品编码', dataIndex: 'itemCode', sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('')},
  {title: '规格', dataIndex: 'itemSpec', sorter: (a, b) => a.balance.length - b.balance.length},
  {title: '库存分类', dataIndex: 'invAvailableType', scopedSlots: {customRender: "invAvailableType"},},
  {title: '可用数量', dataIndex: 'balance', sorter: (a, b) => a.balance - b.balance},
  {title: '锁定数量', dataIndex: 'locked', sorter: (a, b) => a.spec - b.spec},
  {title: '库存总数', dataIndex: 'stockTotalNum', sorter: (a, b) => a.stockTotalNum - b.stockTotalNum},
  {title: '计价单位', dataIndex: 'measureUnit',},
]
export default {
  name: 'productStock',
  data() {
    return {
      columns,
      form: {
        orgId: [],
        dateGroup: [],
        createDateStart: '',
        createDateEnd: '',
        itemName: undefined,
        itemCode: undefined,
        supplierName: undefined,
        invAvailableType: '',
        whIds: []
      },
        whIds: [],
      supplierNameMaterial: {},
      copyParams: undefined,
      warehouseOption: [],
      supplierOption: [],
      supplierNameOption: [],
      fullScreen: true,
      disabledFlage: 0,
      dataTable: [],
      loading: false,
      loadingBtn: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    }
  },
  computed: {
    warehouseOptionFilter() {
      this.getEmptyArr()
      return this.warehouseOption
    },
    supplierOptionFilter() {
      this.getEmptyArrOrgId()
      return this.supplierOption
    }
  },
  methods: {
    changeDate() {
      this.form.createDateStart = this.form.dateGroup[0] || ""
      this.form.createDateEnd = this.form.dateGroup[1] || ""
    },
    getEmptyArr() {
      this.form.whIds.includes("") && (this.form.whIds = [""])
    },
    getEmptyArrOrgId() {
      this.form.orgId.includes("") && (this.form.orgId = [""])
    },
    getWarehouse() {
      getWarehouse({}).then(res => res.data.code == '200' && (this.warehouseOption = res.data.data || []))
    },
    handleWarehouseSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, '')
      getWarehouse({name: v}).then(res => res.data.code == '200' && (this.warehouseOption = res.data.data || []))
    },
    getSupplierName() {
      opSubjectList({}).then(res => res.data.code == '200' && (this.supplierOption= res.data.data))
    },
    getSupplierForName() {
      partnerType({partnerType: 30, partnerName: ''}).then(res => res.data.code == '200' && (this.supplierNameOption = res.data.data))
    },
    handleSubjectSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, '')
      opSubjectList({opName: v}).then(res => res.data.code == '200' ? this.supplierOption = res.data.data : '')
    },
    handleSupplierSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, '')
      partnerType({partnerName: v, partnerType: 30}).then(res => res.data.code == '200' && (this.supplierNameOption = res.data.data))
    },
    handleSupplierOption(value) {
      this.form.supplierName = value
      this.supplierNameMaterial = this.supplierNameOption.find(item => item.id == value) || {}
    },
    clearForm() {
      const value = {
        dateGroup: [],
        createDateStart: '',
        createDateEnd: '',
        itemName: undefined,
        itemCode: undefined,
        supplierName: undefined,
        invAvailableType: '',
        priceUnit: undefined,
        whIds: [],
        orgId: []      }
      this.supplierNameMaterial = {}
      this.form.createDateStart = ""
      this.form.createDateEnd = ""
      this.form = value
      this.getWarehouse()
      this.getSupplierName()
      this.getSupplierForName()
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
        supplierName: this.supplierNameMaterial.partnerName === "" ? undefined : this.supplierNameMaterial.partnerName,
        supplierId: this.supplierNameMaterial.id === "" ? undefined : this.supplierNameMaterial.id,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        invAvailableType: this.form.invAvailableType,
        whIds: this.form.whIds.includes("") ? undefined : this.form.whIds,
        createDateStart: this.form.dateGroup[0] || '',
        createDateEnd: this.form.dateGroup[1] || ''
      }
      this.loadingBtn = true
      itemInvLotExportList(params).then(
        res => {
          if (res.data.type == 'application/vnd.ms-excel' || res.data.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '库存商品列表导出'
            this.getErrExcel(res.data, name)
            this.loadingBtn = false
          } else {
            this.loadingBtn = false
            this.$message.warn('导出失败')
          }
        }
      ).catch(() => {
        this.loadingBtn = false
        this.$message.warn('导出失败')
      })
    },
    redo() {
      this.pagination.page = 1
      this.pagination.size = 10
      const params = {
        sort: "id",
        order: "desc",
        page: 1,
        rows: 10,
        orgIds: this.form.orgId
      }
      this.loading = true
      itemInvLotListPage(params).then(
        res => {
          this.loading = false
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
        }
      ).catch(() => {this.loading = false})
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone(
          {
            sort: "id",
            order: "desc",
            page: this.pagination.page,
            rows: this.pagination.size,
            supplierName: this.supplierNameMaterial.partnerName === "" ? undefined : this.supplierNameMaterial.partnerName,
            supplierId: this.supplierNameMaterial.id === "" ? undefined : this.supplierNameMaterial.id,
            itemName: this.form.itemName,
            itemCode: this.form.itemCode,
            orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
            invAvailableType: this.form.invAvailableType,
            createDateStart: this.form.dateGroup[0] || '',
            createDateEnd: this.form.dateGroup[1] || '',
            whIds: this.form.whIds.includes("") ? undefined :this.form.whIds
          }
        )
      }
      this.loading = true
      itemInvLotListPage(this.copyParams).then(
        res => {
          this.loading = false
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
        }
      ).catch(() => {this.loading = false})
    },
    onSubmit(value) {
      const params = {
        sort: "id",
        order: "desc",
        page: this.pagination.page,
        rows: this.pagination.size,
        supplierName: this.supplierNameMaterial.partnerName == "" ? undefined : this.supplierNameMaterial.partnerName,
        supplierId: this.supplierNameMaterial.id == "" ? undefined : this.supplierNameMaterial.id,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        invAvailableType: this.form.invAvailableType,
        createDateStart: this.form.dateGroup[0] || '',
        createDateEnd: this.form.dateGroup[1] || '',
        whIds: this.form.whIds.includes("") ? undefined :this.form.whIds
      }
      if (value == 'search') {
        this.pagination.page = 1
        params.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      itemInvLotListPage(params).then(
        res => {
          this.loading = false
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
        }
      ).catch(() => {this.loading = false})
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
    this.getSupplierName()
    this.getSupplierForName()
    this.submitPagination()
    this.getWarehouse()
  },
  created() {
    this.form.dateGroup = [
      moment('00:00:00', 'HH:mm:ss').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      moment('23:59:59', 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    ]
    this.form.createDateStart = this.form.dateGroup[0]
    this.form.createDateEnd = this.form.dateGroup[1]
    this.form.orgId = [+localStorage.getItem('orgId')]
  }
}
</script>

<style lang="less">
  @import './index';
</style>