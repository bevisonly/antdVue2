<template>
  <div class="mainTop">
    <a-card
      v-if="screen"
      title="筛选查询"
      :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
      :body-style="{ padding: '12px,2px' }"
      size="small"
    >
      <div class="queryInfo">
        <a-form-model :model="form" :rules="formRules" ref="ruleForm">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-row :gutter="16">
                  <a-col :span="10">
                    <a-select
                      v-model="form.payDateType"
                      style="min-width:135px"
                    >
                      <a-select-option :value="payTypes.AD"
                        >约定收款日</a-select-option
                      >
                      <a-select-option :value="payTypes.RD"
                        >回款日</a-select-option
                      >
                      <a-select-option :value="payTypes.RCD"
                        >应收账款确认日</a-select-option
                      >
                    </a-select></a-col
                  >
                  <a-col :span="14">
                    <a-range-picker
                      v-model="form.timeRange"
                      valueFormat="YYYY-MM-DD"
                    />
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-select
                  style="width: 100%;"
                  show-search
                  mode="multiple"
                  v-model="form.orgId"
                  placeholder="请选择业务类型"
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
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-select
                      v-model="form.customerType"
                      style="min-width:100px"
                    >
                      <a-select-option value="name">客户名称</a-select-option>
                      <a-select-option value="sno">客户编号</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="16">
                    <a-select
                      v-if="form.customerType == 'name'"
                      style="width: 100%;"
                      show-search
                      mode="multiple"
                      v-model="form.customerName"
                      placeholder="请输入客户名称"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      allowClear
                      @search="handleCustomerNameSearch"
                      @change="handleCustomerNameOption"
                    >
                      <a-select-option
                        v-for="item in option.customerOption"
                        :key="item.id"
                        >{{ item.partnerName }}</a-select-option
                      >
                    </a-select>
                    <a-select
                      v-else
                      style="width: 100%;"
                      show-search
                      mode="multiple"
                      v-model="form.customerCode"
                      placeholder="请输入客户编号"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      allowClear
                      @search="handleCustomerNameSearch"
                      @change="handleCustomerNameOption"
                    >
                      <a-select-option
                        v-for="item in option.customerOption"
                        :key="item.id"
                        >{{ item.partnerCode }}</a-select-option
                      >
                    </a-select>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-input
                  style="width: 100%;"
                  placeholder="请输入订单编号"
                  v-model.trim="form.docNo"
                  allowClear
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-space size="middle">
                  <a-button
                    class="ant-button"
                    type="primary"
                    @click="submitBtn('search')"
                    >查询</a-button
                  >
                  <a-button class="ant-button" @click="resetBtn">重置</a-button>
                  <a-button
                    class="ant-button"
                    :loading="loadingDetail"
                    :disabled="!hasPermission('reportAccountsLedger_export')"
                    @click="exportDetailData"
                    >导出明细</a-button
                  >
                  <a-button
                    class="ant-button"
                    :loading="loadingSummary"
                    :disabled="!hasPermission('reportAccountsSummary_export')"
                    @click="exportSummaryData"
                    >导出汇总</a-button
                  >
                </a-space>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card
      title="数据列表"
      :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
      :body-style="{ padding: '12px,2px' }"
      style="margin-top: 16px;"
      size="small"
    >
      <div class="flex-sb">
        <a-button type="primary" @click="openModal">查看汇总数据</a-button>
        <a-button-group class="flex-ed a-button-group">
          <checkboxList
            v-model="columns"
            width="400"
          />
          <a-button
            class="btnStyle"
            type="primary"
            :icon="screen ? 'fullscreen' : 'fullscreen-exit'"
            @click="screenBtn"
          ></a-button>
        </a-button-group>
      </div>
      <div class="tableInfo">
        <a-table
          bordered
          size="middle"
          :columns="columns"
          :data-source="dataTable"
          :loading="loading"
          rowKey="indexAsc"
          :scroll="{ x: 307.778 }"
          :pagination="false"
        >
          <template tips="合计" slot="footer" slot-scope="currentPageData">
            合计：
            <span class="greyfont">应收账款发生额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.receivabledAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">回款金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.returnAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">信用期内支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.creditPeriodAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期30天内支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueOneMonthAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期30~60天内支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueTwoMonthsAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期60~90天内支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueThreeMonthsAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期90-120天内支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueFourMonthsAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期120~150天支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueFiveMonthsAmount || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期150天后支付</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) =>
                  repairMethodAdd(p, c.overdueOverFiveMonthsAmount || 0),
                0
              )
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
    </a-card>
    <accounts-summary ref="modal" />
  </div>
</template>

<script>
import moment from 'moment'
import XEUtils from 'xe-utils'
import { throttle } from '@/utils/tool'
import accountsSummary from './accountsSummary.vue'
import {
  getOverdueRecordReport,
  op,
  exportOverdueRecordData,
  exportOverdueSummaryData
} from '@/services/report/financial/reportAccountsReceivableLedger'
import { partnerType } from "@/services/userMa.js"
import { columns } from './tableConfig.js'

// 账期类型
const DATE_TYPE = {
  // 约定收款日
  AD: 0,
  // 应收账回款日
  RCD: 1,
  // 回款日
  RD: 2
}
const queryDateMap = new Map([
  [DATE_TYPE.AD, ['agreedCollectionDateBegin', 'agreedCollectionDateEnd']],
  [
    DATE_TYPE.RCD,
    ['receivableConfirmationDateBegin', 'receivableConfirmationDateEnd']
  ],
  [DATE_TYPE.RD, ['returnDateBegin', 'returnDateEnd']]
])
const queryCustomerMap = new Map([
  ['name', 'customerIds'],
  ['sno', 'customerIds']
])

export default {
  name: 'reportAccountsReceivableLedger',
  components: {
    accountsSummary
  },
  data() {
    return {
      columns,
      payTypes: DATE_TYPE,
      dataTable: [],
      loading: false,
      loadingDetail: false,
      loadingSummary: false,
      form: {
        payDateType: DATE_TYPE.AD,
        customerType: 'name',
        timeRange: []
      },
      formRules: {
        timeRange: [
          {
            required: true,
            message: '请选择查询的开始与结束日期',
            trigger: 'change'
          }
        ]
      },
      screen: true,
      option: {
        opOption: [],
        customerOption: [],
        opMaterial: {},
        customerMaterial: {}
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
    startTime() {
      return this.form.timeRange.length
        ? moment(this.form.timeRange[0]).format('YYYY-MM-DD')
        : undefined
    },
    endTime() {
      return this.form.timeRange.length
        ? moment(this.form.timeRange[1]).format('YYYY-MM-DD')
        : undefined
    }
  },
  methods: {
    openModal() {
      this.$refs.modal.changeModalStatus({
        orgIds: this.form.orgId,
        docNo: this.form.docNo || undefined,
        [queryDateMap.get(this.form.payDateType)[0]]: this.startTime,
        [queryDateMap.get(this.form.payDateType)[1]]: this.endTime,
        [queryCustomerMap.get(this.form.customerType)]:
          this.form.customerType === 'name'
            ? this.form.customerName
            : this.form.customerCode
      })
    },
    // 加法精度问题
    repairMethodAdd: XEUtils.add,
    exportSummaryData: throttle(function() {
      this.exportData(
        exportOverdueSummaryData,
        '应收账款汇总',
        'loadingSummary'
      )
    }, 1500),
    exportDetailData: throttle(function() {
      this.exportData(exportOverdueRecordData, '应收账款明细', 'loadingDetail')
    }, 1500),
    exportData(cb, sheetName, loading) {
      const params = {
        orgIds: this.form.orgId,
        docNo: this.form.docNo || undefined,
        [queryDateMap.get(this.form.payDateType)[0]]: this.startTime,
        [queryDateMap.get(this.form.payDateType)[1]]: this.endTime,
        [queryCustomerMap.get(this.form.customerType)]:
          this.form.customerType === 'name'
            ? this.form.customerName
            : this.form.customerCode
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this[loading] = true
          cb(params)
            .then(res => {
              if (res.status == '200' && res.data.type != 'application/json') {
                let name = res.headers['content-disposition']
                  ? decodeURIComponent(
                      res.headers['content-disposition']
                    ).match(/(?<=filename=).*(?=\.xl)/gm)[0]
                  : sheetName
                this.getExcel(res.data, name)
                this[loading] = false
              } else {
                this[loading] = false
                this.$message.warn('下载失败')
              }
            })
            .catch(() => {
              this[loading] = false
              this.$message.warn('下载失败')
            })
        } else {
          return false
        }
      })
    },
    submitBtn: throttle(function(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        orgIds: this.form.orgId,
        docNo: this.form.docNo || undefined,
        [queryDateMap.get(this.form.payDateType)[0]]: this.startTime,
        [queryDateMap.get(this.form.payDateType)[1]]: this.endTime,
        [queryCustomerMap.get(this.form.customerType)]:
          this.form.customerType === 'name'
            ? this.form.customerName
            : this.form.customerCode
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          getOverdueRecordReport(params)
            .then(res => {
              if (res.data.code == 200) {
                this.loading = false
                this.pagination.total = res.data.data.total
                res.data.data.list.forEach((item, i) => (item.indexAsc = ++i))
                this.dataTable = res.data.data.list
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
    }, 1500),
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          customerIds: this.form.customerName,
          orgIds: this.form.orgId,
          docNo: this.form.docNo || undefined,
          [queryDateMap.get(this.form.payDateType)[0]]: this.startTime,
          [queryDateMap.get(this.form.payDateType)[1]]: this.endTime,
          [queryCustomerMap.get(this.form.customerType)]:
            this.form.customerType === 'name'
              ? this.form.customerName
              : this.form.customerCode
        })
      }
      this.loading = true
      getOverdueRecordReport(this.copyParams)
        .then(res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.data.total
            res.data.data.list.forEach((item, i) => (item.indexAsc = ++i))
            this.dataTable = res.data.data.list
          } else {
            this.loading = false
          }
        })
        .catch(() => (this.loading = false))
    },
    resetBtn() {
      this.form.payDateType = DATE_TYPE.AD
      this.form.customerType = 'name'
      this.form.timeRange = []
      this.form.orgId = undefined
      this.form.customerName = undefined
      this.form.customerCode = undefined
      this.form.docNo = undefined
      this.option.opMaterial = {}
      this.option.customerMaterial = {}
      this.$refs.ruleForm.clearValidate()
      this.handleOrgIdSearch()
      this.handleCustomerNameSearch()
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
    handleCustomerNameSearch(v) {
      partnerType({ partnerName: v?.trim() || '', partnerType: 20 }).then(
        res => (this.option.customerOption = res.data.data || [])
      )
    },
    handleCustomerNameOption(value) {
      this.form.customerName = value
      this.option.customerMaterial =
        this.option.customerOption.find(item => item.id == value) || {}
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
    this.handleCustomerNameSearch()
    this.submitPagination()
  }
}
</script>

<style lang="less" scoped>
@import './index';
</style>
