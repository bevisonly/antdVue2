<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-date-picker placeholder="送货开始时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.deliveryDateStart" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
              至
              <a-date-picker placeholder="送货结束时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.deliveryDateEnd" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%;"
                show-search
                :value="form.supplierName"
                placeholder="请输入选择 供应商名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
                @change="handleSupplierChange"
              >
                <a-select-option v-for="item in optionArr.optionSupplier" :key="item.id">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%;"
                show-search
                :value="form.customerName"
                placeholder="请输入选择 客户名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleCustomerSearch"
                @change="handleCustomerChange"
              >
                <a-select-option v-for="item in optionArr.optionCustomer" :key="item.id">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%;"
                show-search
                :value="form.storeName"
                placeholder="请输入选择 门店名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleStoreSearch"
                @change="handleStoreChange"
              >
                <a-select-option v-for="item in optionArr.optionStore" :key="item.id">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input class="autoCompleteStyle" v-model.trim="form.saleOrderId" placeholder="请输入销售订单号"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" icon="redo" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" icon="search" @click="submitBtn('search')">查询</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <div class="btnGrp">
        <a-button type="primary" :loading="loadingBtn" :disabled="!hasPermission('returnCommdityWaitInStock_export')" @click="downloadData()">导出</a-button>
      </div>
      <a-table
        bordered
        ref="tableRef"
        size="middle"
        :columns="columns"
        :data-source="dataTable"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :loading='loading'
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <template slot="state" slot-scope="text, record">
          <a-tag color="blue" v-if="record.state == 103">待签收</a-tag>
          <a-tag color="green" v-else-if="record.state == 104">已签收</a-tag>
          <a-tag color="purple" v-else-if="record.state == 210103">待收货待签收</a-tag>
          <a-tag color="cyan" v-else-if="record.state == 210104">待收货已签收</a-tag>
          <a-tag color="red" v-else-if="record.state == 220103">已收货待签收</a-tag>
          <a-tag color="orange" v-else-if="record.state == 220104">已收货已签收</a-tag>
          <a-tag v-else>{{ record.state }}</a-tag>
        </template>
        <template slot="type" slot-scope="text, record">
          <span>
            {{
              record.type == 1 ? "销售单" :
              record.type == 2 ? "库存单" :
              record.type == 3 ? "服务单" :
              record.type == 4 ? "换货单" :
              record.type == 5 ? "直送单" :
              record.type == 6 ? "采销一体单" : record.type
            }}
          </span>
        </template>
        <template slot="payType" slot-scope="text, record">
          <span>{{ record.payType == 1 ? '现结' : record.payType == '2' ? '周期结算' : record.payType }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button class="greenfont bluefonthover" type='link' :disabled="!hasPermission('returnCommdityWaitInStock_details')" @click="detailsBtn(record)">详情</a-button>
          <a-button class="greenfont bluefonthover" type='link' :disabled="!hasPermission('returnCommdityWaitInStock_returnConfrim')" @click="eidtBtn(record)">退货确认</a-button>
          <a-popconfirm
            placement="bottom"
            title="是否转退供应商?"
            ok-text="确定"
            cancel-text="取消"
            :disabled="!hasPermission('returnCommdityWaitInStock_delete') || record.type == 2 || record.type == 4 || record.type == 5"
            @confirm="deleteSupplier(record.id, record.sno, record.imItemId, record.imItemCode)"
          >
            <a-button
              class="greenfont redfonthover"
              type='link'
              :disabled="!hasPermission('returnCommdityWaitInStock_delete') || record.type == 2 || record.type == 4 || record.type == 5"
            >
              转退供应商
            </a-button>
          </a-popconfirm>
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
    <modalInStock ref="modalInStockRef"/>
    <modalDetails ref="modalDetailsRef"/>
  </div>
</template>

<script>
import {
  searchInfo,
  returnSupplier,
  exportData
} from '@/services/transport/signed/returnCommdityWaitInStock'
import moment from 'moment';
import modalInStock from './modalInStock'
import modalDetails from './modalDetails'
import { partnerType } from "@/services/userMa.js";
const columns = [
  {title: '入库单号', dataIndex: 'imItemCode', width: 200},
  {title: '销售单号', dataIndex: 'sno', width: 200},
  {title: '订单状态', dataIndex: 'state', width: 160, scopedSlots: { customRender: 'state' }},
  {title: '订单类型', dataIndex: 'type', width: 140, scopedSlots: { customRender: 'type' }},
  {title: '退货数量', dataIndex: 'totalReturnQty', width: 140},
  {title: '退货金额', dataIndex: 'totalReturnAmount', width: 170},
  {title: '创建人', dataIndex: 'createUser', width: 120},
  {title: '客户名称', dataIndex: 'customerName', width: 260},
  {title: '门店名称', dataIndex: 'storeName', width: 260},
  {title: '创建时间', dataIndex: 'createDate', width: 165},
  {title: '送货日期', dataIndex: 'deliveryDate', width: 165},
  {title: '付款方式', dataIndex: 'payType', width: 100, scopedSlots: { customRender: 'payType' }},
  {title: '供应商名称', dataIndex: 'supplierName', width: 280},
  {title: '操作', dataIndex: 'operation', fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' }, width: 300},
]
export default {
  name: 'returnCommdityWaitInStock',
  components: { modalInStock, modalDetails },
  data() {
    return {
      columns,
      form: {
        deliveryDateStart: '',
        deliveryDateEnd: '',
        supplierName: undefined,
        customerName: undefined,
        storeName: undefined,
        saleOrderId: undefined,
      },
      optionArr: {
        optionSupplier: [{id: 1, itemName: '全部供应商'}],
        optionCustomer: [{id: 1, itemName: '全部客户'}],
        optionStore: [{id: 1, itemName: '全部客户门店'}],
        optionSaleOrder: [{id: 1, itemName: '全部销售订单'}],
      },
      supplierMaterial: undefined,
      customerMaterial: undefined,
      storeMaterial: undefined,
      selectedRowKeys: [],
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
  methods: {
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YY-MM-DD") == moment(today).format("YY-MM-DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    partnerName(type, partnerStr, arrOptionFlag) {
      partnerType({partnerType: type, partnerName: partnerStr}).then(
        res => {
          res.data.data?.unshift({id: -99, partnerName: '全部'})
          arrOptionFlag == '30' ? this.optionArr.optionSupplier = res.data.data :
          arrOptionFlag == '20' ? this.optionArr.optionCustomer = res.data.data :
          arrOptionFlag == '22' ? this.optionArr.optionStore = res.data.data : ''
        }
      )
    },
    handleSupplierSearch(value) {
      this.partnerName(30, value, 30)
    },
    handleCustomerSearch(value) {
      this.partnerName(20, value, 20)
    },
    handleStoreSearch(value) {
      this.partnerName(22, value, 22)
    },
    handleSupplierChange(value) {
      this.form.supplierName = value
      this.supplierMaterial = this.optionArr.optionSupplier.find( item => item.id == value )
    },
    handleCustomerChange(value) {
      this.form.customerName = value
      this.customerMaterial = this.optionArr.optionCustomer.find( item => item.id == value )
    },
    handleStoreChange(value) {
      this.form.storeName = value
      this.storeMaterial = this.optionArr.optionStore.find( item => item.id == value )
    },
    resetBtn() {
      let nullParams = {
        deliveryDateStart: '',
        deliveryDateEnd: '',
        supplierName: undefined,
        customerName: undefined,
        storeName: undefined,
        saleOrderId: undefined,
        customerOrg: undefined,
      }
      this.form = nullParams
      this.supplierMaterial = undefined
      this.customerMaterial = undefined
      this.storeMaterial = undefined
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
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.currentPage = this.pagination.page
        this.copyParams.pageSize = this.pagination.size
      } else {
        this.copyParams = this.deepClone(
          {
            currentPage: this.pagination.page,
            pageSize: this.pagination.size,
            queryParam: {
              deliveryDateStart: moment(this.form.deliveryDateStart).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.deliveryDateStart).format("YYYY-MM-DD HH:mm:ss"),
              deliveryDateEnd: moment(this.form.deliveryDateEnd).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.deliveryDateEnd).format("YYYY-MM-DD HH:mm:ss"),
              supplierId: this.supplierMaterial?.id == -99 ? '' : this.supplierMaterial?.id,
              customerId: this.customerMaterial?.id == -99 ? '' : this.customerMaterial?.id,
              storeId: this.storeMaterial?.id == -99 ? '' : this.storeMaterial?.id,
              sno: this.form.saleOrderId,
              // deptId: ,
            }
          }
        )
      }
      this.loading = true
      searchInfo(this.copyParams).then(res => {
        this.loading = false
        if (this.typeis(res.data?.rows) == 'array') {
          this.pagination.total = res.data?.total || 0
          this.dataTable = res.data?.rows
        } else {
          this.$message.warn('查询退货待入库列表失败...')
        }
      }).catch(() => {
        this.loading = false
        this.$message.warn('获取退货待入库列表数据失败')
      })
    },
    submitBtn(flag) {
      const params = {
        deliveryDateStart: moment(this.form.deliveryDateStart).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.deliveryDateStart).format("YYYY-MM-DD HH:mm:ss"),
        deliveryDateEnd: moment(this.form.deliveryDateEnd).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.deliveryDateEnd).format("YYYY-MM-DD HH:mm:ss"),
        supplierId: this.supplierMaterial?.id == -99 ? '' : this.supplierMaterial?.id,
        customerId: this.customerMaterial?.id == -99 ? '' : this.customerMaterial?.id,
        storeId: this.storeMaterial?.id == -99 ? '' : this.storeMaterial?.id,
        sno: this.form.saleOrderId,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      searchInfo(params).then(res => {
        this.loading = false
        if (this.typeis(res.data?.rows) == 'array') {
          this.pagination.total = res.data?.total || 0
          this.dataTable = res.data?.rows
        } else {
          this.$message.warn('查询退货待入库列表失败...')
        }
      }).catch(() => {
        this.loading = false
        this.$message.warn('获取退货待入库列表数据失败')
      })
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    downloadData() {
      const params = {
        deliveryDateStart: moment(this.form.deliveryDateStart).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.deliveryDateStart).format("YYYY-MM-DD HH:mm:ss"),
        deliveryDateEnd: moment(this.form.deliveryDateEnd).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.deliveryDateEnd).format("YYYY-MM-DD HH:mm:ss"),
        supplierId: this.supplierMaterial?.id == -99 ? '' : this.supplierMaterial?.id,
        customerId: this.customerMaterial?.id == -99 ? '' : this.customerMaterial?.id,
        storeId: this.storeMaterial?.id == -99 ? '' : this.customerMaterial?.id,
        sno: this.form.saleOrderId,
      }
      const params2 = {
        idList: this.selectedRowKeys?.join(',').length == 0 ? undefined : this.selectedRowKeys?.join(','),
      }
      this.loadingBtn = true
      exportData(params2.idList ? params2 : params).then(
        res => {
          if (res.status == '200') {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '退货待入库列表导出'
            this.getErrExcel(res.data, name)
            this.loadingBtn = false
          } else {
            this.loadingBtn = false
            this.$message.warn('下载失败')
          }
        }
      ).catch(() => {
        this.loadingBtn = false
        this.$message.warn('下载失败')
      })
    },
    detailsBtn(record) {
      this.$refs.modalDetailsRef.openModal(record)
    },
    eidtBtn(record) {
      this.$refs.modalInStockRef.openModal(record)
    },
    deleteSupplier(id, sno, imItemId, imItemCode) {
      const params = {
        id: id,
        sno: sno,
        imItemId: imItemId,
        imItemCode: imItemCode
      }
      returnSupplier(params).then(res => {
        res.data?.code == "200" ? (this.submitPagination(), this.$message.success('转退供应商成功')) : this.$message.warn('转退失败')
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
    [20,22,30].forEach(item => this.partnerName(item, '', item))
    this.submitPagination()
  },
}
</script>

<style lang="less">
  @import './index';
</style>