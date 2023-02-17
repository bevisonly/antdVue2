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
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
              <a-form-model-item>
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
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-select
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
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
              <a-form-model-item>
                <a-select placeholder="请选择归属部门"> </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
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
                    @click="exportDetailData"
                    :disabled="!hasPermission('reportAccountsAging_export')"
                    >导出</a-button
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
      <div class="flex-ed">
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
            <span class="greyfont">未逾期金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.creditPeriodAmounts || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期1个月内金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueOneMonthAmounts || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">2个月内金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueTwoMonthsAmounts || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">3个月内金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.overdueThreeMonthsAmounts || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">逾期3个月以上金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) =>
                  repairMethodAdd(p, c.overdueOverThreeMonthsAmounts || 0),
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
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import { throttle } from '@/utils/tool'
import {
  op,
  getListPageAgeAnalysisReport,
  exportListPageAgeAnalysisData
} from '@/services/report/financial/reportAccountsAgingAnalysis'
import { partnerType } from "@/services/userMa.js"
import { columns } from './tableConfig.js'

export default {
  name: 'reportAccountsAgingAnalysis',
  data() {
    return {
      columns,
      dataTable: [],
      loading: false,
      loadingDetail: false,
      form: {},
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
  methods: {
    exportDetailData: throttle(function() {
      this.exportData(
        exportListPageAgeAnalysisData,
        '应收账款账龄分析表',
        'loadingDetail'
      )
    }, 1500),
    exportData(cb, sheetName, loading) {
      const params = {
        orgIds: this.form.orgId,
        customerIds: this.form.customerName
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
    // 加法精度问题
    repairMethodAdd: XEUtils.add,
    submitBtn: throttle(function(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        orgIds: this.form.orgId,
        customerIds: this.form.customerName
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          getListPageAgeAnalysisReport(params)
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
          orgIds: this.form.orgId,
          customerIds: this.form.customerName
        })
      }
      this.loading = true
      getListPageAgeAnalysisReport(this.copyParams)
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
      this.form = {}
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
