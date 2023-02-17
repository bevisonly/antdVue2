<template>
  <div class="mainTop">
    <div class="queryInfo" v-if="screen">
      <a-form-model :model="form" :rules="formRules" ref="ruleForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle monthWidth" prop="selectTime" >
              <a-date-picker
                style="width: 100%"
                dropdownClassName="noShowTimeStyle"
                show-time
                placeholder="出入库年月日"
                v-model="form.selectTime"
                valueFormat="YYYY-MM-DD 00:00:00"
              />
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth">
              <a-input placeholder="入库单号" v-model.trim="form.rkCode "></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth">
              <a-input placeholder="柜号" v-model.trim="form.containerCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle inputWidth">
              <a-input placeholder="批次号" v-model.trim="form.batchCode"></a-input>
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
                @search="handleOrgIdSearch"
                @change="handleOrgIdOption"
              >
                <a-select-option v-for="item in option.opOption" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                mode="multiple"
                v-model="form.itemId"
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
            <a-form-model-item class="formItemStyle">
              <a-space :size="15">
                <a-button type="primary" @click="submitBtn('search')">查询</a-button>
                <a-button @click="resetBtn">重置</a-button>
              </a-space>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="flex-ed marginWidth">
      <a-button-group>
        <checkboxList v-model="columns" width="200" />
        <a-button class="btnStyle" type="primary" icon="fullscreen" @click="screenBtn" />
      </a-button-group>
    </div>
    <div>
      <a-table
        bordered
        size="small"
        :columns="columns"
        :data-source="dataTable"
        :loading="loading"
        rowKey="indexAsc"
        :scroll="{ y: 600, x: 300 }"
        :pagination="false"
      >
        <span slot="beginAmount" slot-scope="text, record">
          <span>{{numberToFixed(record.beginAmount, 2)}}</span>
        </span>
        <span slot="containerCode" slot-scope="text, record">
          <span>{{record.containerCode ? record.containerCode : record.batchCode}}</span>
        </span>
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
  </div>
</template>

<script>
import moment from 'moment'
import XEUtils from 'xe-utils'
import {
  getItemTransactionReport,
  op,
  product
} from '@/services/report/reportBatchAccounting'
const columns = [
  {title: '序号', dataIndex: 'indexAsc', width: 80, align: 'center'},
  {title: '业务单元', dataIndex: 'opCode', width: 220, align: 'center'},
  {title: '产品名称', dataIndex: 'itemName', width: 240, align: 'center'},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
  {title: '规格', dataIndex: 'spec', width: 100, align: 'center'},
  {title: '入库单号', dataIndex: 'rkCode', width: 180, align: 'center'},
  {title: '柜号/批次号', dataIndex: 'containerCode', width: 120, align: 'center', scopedSlots: { customRender: 'containerCode'}},
  // {title: '批次号', dataIndex: 'batchCode', width: 120, align: 'center'},
  {title: '期初', dataIndex: 'start', children: [
    {title: '数量', dataIndex: 'beginNum', width: 160, align: 'center'},
    {title: '单价', dataIndex: 'beginPrice', width: 160, align: 'center'},
    {title: '金额', dataIndex: 'beginAmount', width: 160, align: 'center', scopedSlots: { customRender: 'beginAmount'}}
  ]},
  {title: '入库', dataIndex: 'instock', children: [
    {title: '数量', dataIndex: 'inNum', width: 120, align: 'center', scopedSlots: { customRender: 'inNum' }},
    {title: '单价',dataIndex: 'inPrice',width: 120,align: 'center',scopedSlots: { customRender: 'inPrice' }},
    {title: '金额',dataIndex: 'inAmount',width: 140,align: 'center',scopedSlots: { customRender: 'inAmount' }}
  ]},
  {title: '出库',dataIndex: 'outstock', children: [
    {title: '数量',dataIndex: 'outNum',width: 120,align: 'center',scopedSlots: { customRender: 'outNum' }},
    {title: '单价',dataIndex: 'outPrice',width: 120,align: 'center',scopedSlots: { customRender: 'outPrice' }},
    {title: '金额',dataIndex: 'outAmount',width: 140,align: 'center',scopedSlots: { customRender: 'outAmount' }}
  ]},
  {title: '期末',dataIndex: 'finish', children: [
    {title: '数量',dataIndex: 'endNum',width: 120,align: 'center',scopedSlots: { customRender: 'endNum' }},
    {title: '单价',dataIndex: 'endPrice',width: 120,align: 'center',scopedSlots: { customRender: 'endPrice' }},
    {title: '金额',dataIndex: 'endAmount',width: 140,align: 'center',scopedSlots: { customRender: 'endAmount' }}
  ]}
]
export default {
  name: 'reportBatchAccounting',
  data() {
    return {
      columns,
      dataTable: [],
      tableDetail: {},
      loading: false,
      loadingExcel: false,
      form: {
        selectTime: null,
      },
      formRules: {
        selectTime: [
          {required: true, message: '必填项', trigger: 'change'}
        ]
      },
      screen: true,
      option: {
        opOption: [],
        productOption: [],
      },
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10
      }
    }
  },
  methods: {
    numberToFixed: XEUtils.toFixed,
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        selectTime: this.form.selectTime,
        itemIds: this.form.itemId,
        orgIds: this.form.orgId,
        rkCode: this.form.rkCode,
        containerCode: this.form.containerCode,
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          getItemTransactionReport(params).then(res => {
            console.log('res.data: ', res.data);
            if (res.data.code == 200) {
              this.loading = false
              this.pagination.total = res.data.data.totalNum
              res.data.data.data.forEach((item, i) => (item.indexAsc = ++i))
              this.dataTable = res.data.data.data
            } else {
              this.loading = false
              this.$message.error(res.data.message, 2)
            }
          })
          .catch(() => (this.loading = false))
        } else {
          this.$message.error('请先选择出入库日期')
        }
      }
      )
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          selectTime: this.form.selectTime,
          itemIds: this.form.itemId,
          orgIds: this.form.orgId,
          rkCode: this.form.rkCode,
          containerCode: this.form.containerCode,
        })
      }
      this.loading = true
      getItemTransactionReport(this.copyParams).then(res => {
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.data.totalNum
          res.data.data.data.forEach((item, i) => (item.indexAsc = ++i))
          this.dataTable = res.data.data.data
        } else {
          this.loading = false
        }
      }).catch(() => (this.loading = false))
    },
    resetBtn() {
      this.form = {}
      this.$refs.ruleForm.clearValidate()
      this.handleOrgIdSearch()
      this.handleItemNameSearch()
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    handleOrgIdSearch(v) {
      op({ opName: v || '' }).then(res => (this.option.opOption = res.data.data || []))
    },
    handleOrgIdOption(value) {
      this.form.orgId = value
    },
    handleItemNameSearch(v) {
      product({ likeItemName: v || '', rows: 50, page: 1 }).then(
        res => (this.option.productOption = res.data.data || [])
      )
    },
    handleItemNameOption(value) {
      this.form.itemId = value
      this.option.productMaterial = this.option.productOption.find(item => item.id == value) || {}
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
    setQueryDate() {
      if (!this.form.selectTime) {
        this.form.selectTime = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
      }
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
    this.handleOrgIdSearch()
    this.handleItemNameSearch()
    this.setQueryDate()
    this.submitPagination()
  }
}
</script>

<style lang="less" scoped>
@import './index';
.noShowTimeStyle .ant-calendar-today-btn {
  display: none!important;
}
</style>
<style scoped>
.noShowTimeStyle .ant-calendar-footer .ant-calendar-footer-btn .ant-calendar-today-btn {
  display: none!important;
}
</style>