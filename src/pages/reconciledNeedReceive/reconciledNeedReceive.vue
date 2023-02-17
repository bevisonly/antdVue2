<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="fullScreen">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-range-picker
                :placeholder="['订单开始日期', '订单结束日期']"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroupOrder"
                @ok="changeDatePurchase"
                @change="changeDatePurchase"
              ></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-range-picker
                :placeholder="['签收开始日期', '签收结束日期']"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroupReceipt"
                @ok="changeDateWeekly"
                @change="changeDateWeekly"
              ></a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input
                style="width: 100%;"
                placeholder="请输入销售单据号"
                v-model.trim="form.sno"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                :value="form.opId"
                placeholder="请选择运营主体"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
                @change="handleSupplierOption"
              >
                <a-select-option
                  v-for="item in option.supplierOption"
                  :key="item.id"
                  >{{ item.opName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入客户名称" v-model.trim="form.customerName"/>
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
      <p class="bottomTitle">已对账列表 <a-icon type="book" /></p>
      <div class="flex-sb heightDiv">
        <div>
          <a-button-group>
            <a-button type="primary" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('reconciliated_export')">
              导出数据
            </a-button>
            <a-button type="primary" :loading="loadingSet" title="可批量生成" @click="settlementList" :disabled="!hasPermission('reconciliated_generate')">
              生成结算单
            </a-button>
          </a-button-group>
        </div>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo" ></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn" ></a-button>
          <checkboxList v-model="tableColumns" width="300" />
        </a-button-group>
      </div>
      <a-table
        class="tableStyle"
        bordered
        :columns="tableColumns"
        ref="tableRef"
        :data-source="dataTable"
        :loading="loading"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :scroll="{
          x: 307.778,
          y: dataTable.length < 50 && pagination.size < 50 ? 0 : 1300
        }"
        :pagination="false"
      >
        <template slot="sno" slot-scope="text, record">
          <div
            class="columnStyle"
            :class="record.overInvc ? 'columnStyleRed' : ''"
          >
            {{ record.sno }}
          </div>
        </template>
        <template slot="settleState" slot-scope="text, record">
          <div>
            {{
              record.settleState == 1
                ? '未收款'
                : record.settleState == 2
                ? '部分收款'
                : record.settleState == 3
                ? '已收款'
                : record.settleState == 4
                ? '已核销'
                : record.settleState
            }}
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button
            class="greenfont bluefonthover"
            type="link"
            :disabled="!hasPermission('reconciliated_detail')"
            @click="detailsBtn(record)"
            >详情</a-button
          >
          <a-popconfirm
            placement="bottom"
            title="确定撤销吗？"
            ok-text="确定"
            cancel-text="取消"
            :disabled="!hasPermission('reconciliated_undo')"
            @confirm="cancel(record)"
          >
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button
              class="greenfont redfonthover"
              type="link"
              :disabled="!hasPermission('reconciliated_undo')"
              >撤销</a-button
            >
          </a-popconfirm>
        </template>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination
          :pageSizeOptions="pageSizeOptions"
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
    <modal-details ref="modalDetailsRef" />
  </div>
</template>

<script>
import modalDetails from './modalDetails'
import {
  getOperatorList,
  getPageList,
  exportData,
  orderUndo,
  createSettlement
} from '@/services/settlement/receive/reconciliatedNeedPay'

const tableColumns = [
  {title: '销售单号', dataIndex: 'sno', width: 240, scopedSlots: {customRender: 'sno'}},
  {title: '订单日期', dataIndex: 'createDate', width: 240},
  {title: '签收日期', dataIndex: 'signDate', width: 240},
  {title: '客户', dataIndex: 'customerName', width: 360},
  {title: '门店名称', dataIndex: 'storeName', width: 160},
  {title: '数量', dataIndex: 'totalSignQty', width: 120},
  {title: '结算状态', dataIndex: 'settleState', width: 160, scopedSlots: {customRender: 'settleState'}},
  {title: '单据金额', dataIndex: 'totalSignAmount', width: 160},
  {title: '扣点金额', dataIndex: 'totalDeductionAmount', width: 160},
  {title: '应收金额', dataIndex: 'totalReceivableAmount', width: 160},
  {title: '税额', dataIndex: 'totalTaxAmount', width: 160},
  {title: '不含税金额', dataIndex: 'totalIncludingTaxAmount', width: 160},
  {title: '对账日期', dataIndex: 'reconciliaDate', width: 280},
  {title: '关联合同', dataIndex: 'contractTitle', width: 280},
  {title: '操作', dataIndex: 'operation', width: 180, align: 'center', fixed: 'right', scopedSlots: {customRender: 'operation'}}]
export default {
  name: 'reconciledNeedReceive',
  components: { modalDetails },
  data() {
    return {
      tableColumns,
      form: {
        dateGroupOrder: [],
        dateGroupReceipt: [],
        createDateStart: undefined,
        createDateEnd: undefined,
        sno: undefined,
        opId: undefined,
        signDateStart: undefined,
        signDateEnd: undefined,
        customerName: undefined
      },
      option: {
        supplierOption: [],
        supplierMaterial: {}
      },
      fullScreen: true,
      selectedRowKeys: [],
      selectedRows: [],
      dataTable: [],
      loadingExcel: false,
      loading: false,
      loadingSet: false,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: { total: 0, page: 1, size: 10 }
    }
  },
  methods: {
    changeDatePurchase() {
      this.form.createDateStart = this.form.dateGroupOrder[0] || undefined
      this.form.createDateEnd = this.form.dateGroupOrder[1] || undefined
    },
    changeDateWeekly() {
      this.form.signDateStart = this.form.dateGroupReceipt[0] || undefined
      this.form.signDateEnd = this.form.dateGroupReceipt[1] || undefined
    },
    detailsBtn(record) {
      this.$refs.modalDetailsRef.openModal(record)
    },
    cancel(record) {
      orderUndo(record).then(res => {
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
        dateGroupOrder: [],
        dateGroupReceipt: [],
        createDateStart: undefined,
        createDateEnd: undefined,
        sno: undefined,
        opId: undefined,
        signDateStart: undefined,
        signDateEnd: undefined
      }
      this.option.supplierMaterial = {}
      this.form = nullParams
      this.handleSupplierSearch('')
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
      getPageList(params)
        .then(res => {
          this.loading = false
          this.pagination.total =
            this.typeis(res.data.total) == 'number' ? res.data.total : 0
          this.dataTable =
            this.typeis(res.data.rows) == 'array' ? res.data.rows : []
        })
        .catch(() => (this.loading = false))
    },
    fullScreenBtn() {
      this.fullScreen = !this.fullScreen
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
      getOperatorList({ opName: value || '' }).then(
        res =>
          res.data.code == '200' && (this.option.supplierOption = res.data.data)
      )
    },
    handleSupplierOption(value) {
      this.form.opId = value
      this.option.supplierMaterial =
        this.option.supplierOption.find(item => item.id == value) || {}
    },
    exportData() {
      const params = {
        createDateStart: this.form.createDateStart,
        createDateEnd: this.form.createDateEnd,
        signDateStart: this.form.signDateStart,
        signDateEnd: this.form.signDateEnd,
        sno: this.form.sno?.trim(),
        customerName: this.form.customerName?.trim(),
        opId: this.option.supplierMaterial?.id
      }
      this.loadingExcel = true
      exportData(params)
        .then(res => {
          if (res.status == '200') {
            let name = res.headers['content-disposition']
              ? decodeURIComponent(res.headers['content-disposition']).match(
                  /(?<=filename=).*(?=\.xl)/gm
                )[0]
              : '已对账列表导出'
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
    settlementList() {
      if (!this.selectedRows[0]) {
        this.$message.error("请先勾选要生成结算单的数据")
        return
      }
      let obj=this.selectedRows[0]
      if (this.selectedRows.some(item=>item.customerType!=obj.customerType||item.customerName!=obj.customerName
      ||item.payType!=obj.payType||item.customerId!=obj.customerId
      )) {
        this.$message.warn('该订单客户或收款方式不同，不可合并结算')
        return
      }
      let onlyContract = []
      this.selectedRows.forEach((item) => {
        !onlyContract.includes(item.contractId) && onlyContract.push(item.contractId)
      });
      if (onlyContract.length>1) {
        this.$message.error("当前订单的关联合存在不一致，不可以合并操作")
        return
      }
      if (
        !this.validateUniqueProp(this.selectedRows, 'invcSeparate') ||
        !this.validateUniqueProp(this.selectedRows, 'storeName')
      ) {
        this.$message.warn(
          '选择单据中含有单独结算门店，请选择相同的门店的对账单生成结算单'
        )
        return
      }
      if (this.validateUniqueProp(this.selectedRows, 'customerId')) {
        let soIds = []
        let initRow = this.selectedRows[0]
        let formatParams = {
          customerId: initRow.customerId,
          customerName: initRow.customerName,
          invcSeparate: 0,
          opCode: initRow.opCode,
          opId: initRow.opId,
          opName: initRow.opName,
          orgId: initRow.orgId,
          settleCycleEnd: initRow.signDate,
          settleCycleStart: initRow.signDate,
          storeName: initRow.storeName,
          storeType: initRow.storeType
        }
        this.selectedRows.forEach(item => {
          soIds.push(item.id)
        })
        let params = {
          ...formatParams,
          soIds
        }
        this.loadingSet = !0
        createSettlement(params).then(res => {
          this.loadingSet = !1
          this.selectedRows = []
          this.selectedRowKeys = []
          if (res.data.code == 200) {
            this.submitPagination()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message, 3.5)
          }
        }).catch(e => {
          this.loadingSet = !1
          this.$message.error('error'+e, 3.5)
        })
      } else {
        this.$message.warn('当前选择的对账单客户不一致！')
      }
    },
    validateUniqueProp(rows, propName) {
      let emptyObj = Object.create(null)
      if (Array.isArray(rows)) {
        rows.forEach(item => {
          if (!emptyObj[item[propName]]) {
            emptyObj[item[propName]] = true
          }
        })
      }
      let keys = Object.keys(emptyObj).length
      if (keys > 1) {
        return false
      } else {
        return true
      }
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
          createDateStart: this.form.createDateStart,
          createDateEnd: this.form.createDateEnd,
          signDateStart: this.form.signDateStart,
          signDateEnd: this.form.signDateEnd,
          sno: this.form.sno?.trim(),
          opId: this.option.supplierMaterial?.id
        })
      }
      this.loading = true
      getPageList(this.copyParams)
        .then(res => {
          this.loading = false
          this.pagination.total =
            this.typeis(res.data.total) == 'number' ? res.data.total : 0
          this.dataTable =
            this.typeis(res.data.rows) == 'array' ? res.data.rows : []
        })
        .catch(() => (this.loading = false))
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: 'id',
        order: 'DESC',
        createDateStart: this.form.createDateStart,
        createDateEnd: this.form.createDateEnd,
        signDateStart: this.form.signDateStart,
        signDateEnd: this.form.signDateEnd,
        sno: this.form.sno?.trim(),
        customerName: this.form.customerName?.trim(),
        opId: this.option.supplierMaterial?.id
      }
      if (flag == 'search') {
        this.pagination.page = 1
        params.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      getPageList(params)
        .then(res => {
          this.loading = false
          this.pagination.total =
            this.typeis(res.data.total) == 'number' ? res.data.total : 0
          this.dataTable =
            this.typeis(res.data.rows) == 'array' ? res.data.rows : []
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
  activated() {
    this.handleSupplierSearch('')
    this.submitPagination()
  }
}
</script>

<style lang="less">
@import './index';
</style>
