<template>
  <div class="mainTop">
    <div class="queryInfo" v-if="screen">
      <a-form-model :model="form" :rules="formRules" ref="ruleForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              class="formItemStyle monthWidth"
              prop="timeRange"
            >
              <a-month-picker
                style="width: 100%"
                placeholder="请选择记录月份"
                v-model="form.timeRange"
                valueFormat="YYYY-MM"
              />
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
                <a-select-option
                  v-for="item in option.opOption"
                  :key="item.orgId"
                  >{{ item.opName }}</a-select-option
                >
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
                <a-select-option
                  v-for="item in option.productOption"
                  :key="item.id"
                  >{{ item.itemName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button
                class="ant-button"
                type="primary"
                @click="submitBtn('search')"
                >查询</a-button
              >
              <a-button class="ant-button" @click="resetBtn">重置</a-button>
              <a-button
                class="ant-button"
                :loading="loadingExcel"
                @click="exportData"
                :disabled="!hasPermission('reportInventorySummary_export')"
                >导出</a-button
              >
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="flex-ed marginWidth">
      <a-button-group class="a-button-group">
        <checkboxList
          v-model="columns"
          width="200"
        />
        <a-button
          class="btnStyle"
          type="primary"
          :icon="screen ? 'fullscreen' : 'fullscreen-exit'"
          @click="screenBtn"
        >
        </a-button>
      </a-button-group>
    </div>
    <div class="tableInfo">
      <a-table
        bordered
        size="small"
        :columns="columns"
        :data-source="dataTable"
        :loading="loading"
        rowKey="indexAsc"
        :scroll="{ x: 307.778 }"
        :pagination="false"
      >
        <template slot="beginAmount" slot-scope="text, record">
          <span>{{ numberToFixed(record.beginAmount, 2) }}</span>
        </template>
        <template slot="inNum" slot-scope="text, record">
          <a-button
            v-if="record.map.inNum"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record,'inNum')"
            >{{ record.inNum }}</a-button
          >
          <span v-else>{{ record.inNum }}</span>
        </template>
        <template slot="inPrice" slot-scope="text, record">
          <a-button
            v-if="record.map.inPrice"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record,'inPrice')"
            >{{ record.inPrice }}</a-button
          >
          <span v-else>{{ record.inPrice }}</span>
        </template>
        <template slot="inAmount" slot-scope="text, record">
          <a-button
            v-if="record.map.inAmount"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record,'inAmount')"
            >{{ numberToFixed(record.inAmount, 2) }}</a-button
          >
          <span v-else>{{ numberToFixed(record.inAmount, 2) }}</span>
        </template>
        <template slot="outNum" slot-scope="text, record">
          <a-button
            v-if="record.map.outNum"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record,'outNum')"
            >{{ record.outNum }}</a-button
          >
          <span v-else>{{ record.outNum }}</span>
        </template>
        <template slot="outPrice" slot-scope="text, record">
          <a-button
            v-if="record.map.outPrice"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record,'outPrice')"
            >{{ record.outPrice }}</a-button
          >
          <span v-else>{{ record.outPrice }}</span>
        </template>
        <template slot="outAmount" slot-scope="text, record">
          <a-button
            v-if="record.map.outAmount"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record,'outAmount')"
            >{{ numberToFixed(record.outAmount, 2) }}</a-button
          >
          <span v-else>{{ numberToFixed(record.outAmount, 2) }}</span>
        </template>
        <template slot="endNum" slot-scope="text, record">
          <a-button
            v-if="record.map.endNum"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record)"
            >{{ record.endNum }}</a-button
          >
          <span v-else>{{ record.endNum }}</span>
        </template>
        <template slot="endPriceNew" slot-scope="text, record">
          <a-button
            v-if="record.map.endPriceNew"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record)"
            >{{ record.endPriceNew }}</a-button
          >
          <span v-else>{{ record.endPriceNew }}</span>
        </template>
        <template slot="endAmountNew" slot-scope="text, record">
          <a-button
            v-if="record.map.endAmountNew"
            type="link"
            class="redfont cursorPin bluefonthover"
            title="查看红冲记录"
            @click="toRecordPage(record)"
            >{{ numberToFixed(record.endAmountNew, 2) }}</a-button
          >
          <span v-else>{{ numberToFixed(record.endAmountNew, 2) }}</span>
        </template>
        <template tips="合计" slot="footer">
          合计：
          <span class="greyfont">期初数量</span>
          &lt;<span class="redfont">{{ tableDetail.BeginNum || 0 }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">期初金额</span>
          &lt;<span class="redfont">{{
            numberToFixed(tableDetail.BeginAmount, 2) || 0
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">入库数量</span>
          &lt;<span class="redfont">{{ tableDetail.InNum || 0 }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">入库金额</span>
          &lt;<span class="redfont">{{
            numberToFixed(tableDetail.InAmount, 2) || 0
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">出库数量</span>
          &lt;<span class="redfont">{{ tableDetail.OutNum || 0 }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">出库金额</span>
          &lt;<span class="redfont">{{
            numberToFixed(tableDetail.OutAmount, 2) || 0
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">期末数量</span>
          &lt;<span class="redfont">{{ tableDetail.EndNum || 0 }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">期末金额</span>
          &lt;<span class="redfont">{{
            numberToFixed(tableDetail.EndAmount, 2) || 0
          }}</span
          >&gt;
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
  </div>
</template>

<script>
import moment from 'moment'
import XEUtils from 'xe-utils'
import {
  getItemTransactionReport,
  exportData,
  op,
  product
} from '@/services/report/reportInventorySummary'
const columns = [
  { title: '序号', dataIndex: 'indexAsc', width: 80, align: 'center' },
  { title: '业务单元', dataIndex: 'opName', width: 200, align: 'center' },
  { title: '产品名称', dataIndex: 'itemName', width: 300, align: 'center' },
  { title: '单位', dataIndex: 'unit', width: 200, align: 'center' },
  {
    title: '规格',
    dataIndex: 'spec',
    width: 200,
    align: 'center'
  },
  {
    title: '期初',
    dataIndex: 'd',
    children: [
      {
        title: '数量',
        dataIndex: 'beginNum',
        width: 160,
        align: 'center'
      },
      {
        title: '单价',
        dataIndex: 'beginPrice',
        width: 160,
        align: 'center'
      },
      {
        title: '金额',
        dataIndex: 'beginAmount',
        width: 160,
        align: 'center',
        scopedSlots: { customRender: 'beginAmount' }
      }
    ]
  },
  {
    title: '入库',
    dataIndex: 'p',
    children: [
      {
        title: '数量',
        dataIndex: 'inNum',
        width: 180,
        align: 'center',
        scopedSlots: { customRender: 'inNum' }
      },
      {
        title: '单价',
        dataIndex: 'inPrice',
        width: 180,
        align: 'center',
        scopedSlots: { customRender: 'inPrice' }
      },
      {
        title: '金额',
        dataIndex: 'inAmount',
        width: 160,
        align: 'center',
        scopedSlots: { customRender: 'inAmount' }
      }
    ]
  },
  {
    title: '出库',
    dataIndex: 's',
    children: [
      {
        title: '数量',
        dataIndex: 'outNum',
        width: 180,
        align: 'center',
        scopedSlots: { customRender: 'outNum' }
      },
      {
        title: '单价',
        dataIndex: 'outPrice',
        width: 180,
        align: 'center',
        scopedSlots: { customRender: 'outPrice' }
      },
      {
        title: '金额',
        dataIndex: 'outAmount',
        width: 160,
        align: 'center',
        scopedSlots: { customRender: 'outAmount' }
      }
    ]
  },
  {
    title: '期末',
    dataIndex: 'g',
    children: [
      {
        title: '数量',
        dataIndex: 'endNum',
        width: 180,
        align: 'center',
        scopedSlots: { customRender: 'endNum' }
      },
      {
        title: '单价',
        dataIndex: 'endPriceNew',
        width: 180,
        align: 'center',
        scopedSlots: { customRender: 'endPriceNew' }
      },
      {
        title: '金额',
        dataIndex: 'endAmountNew',
        width: 160,
        align: 'center',
        scopedSlots: { customRender: 'endAmountNew' }
      }
    ]
  }
]
export default {
  name: 'reportInventorySummary',
  data() {
    return {
      columns,
      dataTable: [],
      tableDetail: {},
      loading: false,
      loadingExcel: false,
      form: {
        timeRange: undefined,
        redFlashTime: ''
      },
      formRules: {
        timeRange: [
          {
            required: true,
            message: '请选择查询的出入库月份',
            trigger: 'change'
          }
        ]
      },
      screen: true,
      option: {
        opOption: [],
        productOption: [],
        opMaterial: {},
        productMaterial: {}
      },
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    redFlashTime() {
      return this.form.timeRange
        ? moment(this.form.timeRange)
            .startOf('month')
            .format('YYYY-MM-DD HH:mm:ss')
        : ''
    },
    endFlashTime() {
      return this.form.timeRange
        ? moment(this.form.timeRange)
            .endOf('month')
            .format('YYYY-MM-DD HH:mm:ss')
        : ''
    }
  },
  methods: {
    numberToFixed: XEUtils.toFixed,
    exportData() {
      const params = {
        startTime: this.redFlashTime,
        endTime: this.endFlashTime,
        itemIds: this.form.itemId,
        orgIds: this.form.orgId
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loadingExcel = true
          exportData(params)
            .then(res => {
              if (res.status == '200' && res.data.type != 'application/json') {
                let name = res.headers['content-disposition']
                  ? decodeURIComponent(
                      res.headers['content-disposition']
                    ).match(/(?<=filename=).*(?=\.xl)/gm)[0]
                  : '出入库汇总表'
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
        } else {
          return false
        }
      })
    },
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        startTime: this.redFlashTime,
        endTime: this.endFlashTime,
        itemIds: this.form.itemId,
        orgIds: this.form.orgId
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          getItemTransactionReport(params)
            .then(res => {
              if (res.data.code == 200) {
                this.loading = false
                this.pagination.total = res.data.totalNum
                res.data.data.forEach((item, i) => (item.indexAsc = ++i))
                this.dataTable = res.data.data
                this.tableDetail = res.data.map || {}
              } else {
                this.loading = false
                this.$message.warn(res.data.message, 2)
              }
            })
            .catch(() => (this.loading = false))
        } else {
          return false
        }
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
          startTime: this.redFlashTime,
          endTime: this.endFlashTime,
          itemIds: this.form.itemId,
          orgIds: this.form.orgId
        })
      }
      this.loading = true
      getItemTransactionReport(this.copyParams)
        .then(res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.totalNum
            res.data.data.forEach((item, i) => (item.indexAsc = ++i))
            this.dataTable = res.data.data
            this.tableDetail = res.data.map || {}
          } else {
            this.loading = false
          }
        })
        .catch(() => (this.loading = false))
    },
    resetBtn() {
      this.form = {}
      this.option.opMaterial = {}
      this.option.productMaterial = {}
      this.$refs.ruleForm.clearValidate()
      this.handleOrgIdSearch()
      this.handleItemNameSearch()
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    handleOrgIdSearch(v) {
      op({ opName: v?.trim() || '' }).then(
        res => (this.option.opOption = res.data.data || [])
      )
    },
    handleOrgIdOption(value) {
      this.form.orgId = value
      this.option.opMaterial =
        this.option.opOption.find(item => item.orgId == value) || {}
    },
    handleItemNameSearch(v) {
      product({ likeItemName: v?.trim() || '', rows: 50, page: 1 }).then(
        res => (this.option.productOption = res.data.data || [])
      )
    },
    handleItemNameOption(value) {
      this.form.itemId = value
      this.option.productMaterial =
        this.option.productOption.find(item => item.id == value) || {}
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
      if (!this.form.timeRange) {
        this.form.timeRange = moment()
          .subtract(1, 'months')
          .format('YYYY-MM')
      }
    },
    toRecordPage(record, docField) {
      let storeInFields = ['inNum', 'inPrice', 'inAmount']
      let storeOutFields = ['outNum', 'outPrice', 'outAmount']
      let docType = 0 // 红冲记录判断: 20入库，10出库
      if (storeInFields.includes(docField)) {
        docType = 20
      }
      if (storeOutFields.includes(docField)) {
        docType = 10
      }
      if (record) {
        this.$router.push({
          name: '出入库红冲记录',
          params: {
            redFlashTime: this.form.timeRange,
            orgId: record.orgId,
            itemName: record.itemName,
            itemId: record.itemId,
            unit: record.unit,
            spec: record.spec,
            docType: docType,
            isJumpLink: true
          }
        })
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
</style>
