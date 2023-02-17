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
        <a-form-model :model="form" ref="ruleForm">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
              <a-form-model-item prop="timeRange">
                <a-date-picker
                  mode="year"
                  placeholder="请选择年份"
                  format="YYYY"
                  valueFormat="YYYY"
                  style="width: 90%;"
                  :open="isOpen"
                  v-model="form.timeRange"
                  @change="handleValueChange"
                  @openChange="handleOpenChange"
                  @panelChange="handlePanelChange"
                />
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
                    :disabled="!hasPermission('reportAccountsOverdue_export')"
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
          rowKey="rowIndex"
          :scroll="{ x: 307.778 }"
          :pagination="false"
        >
          <template slot="migrationRate" slot-scope="text, record">
            {{ record.migrationRate ? record.migrationRate + '%' : '' }}
          </template>
          <template slot="lossRate" slot-scope="text, record">
            {{ record.lossRate ? record.lossRate + '%' : '' }}
          </template>
          <template slot="creditLossRatio" slot-scope="text, record">
            {{ record.creditLossRatio ? record.creditLossRatio + '%' : '' }}
          </template>
          <template tips="合计" slot="footer" slot-scope="currentPageData">
            合计：
            <span class="greyfont"
              >{{ form.timeRange }}年12月31日应收账款账面余额</span
            >
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.bookBalance || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">预期信用损失准备</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.creditLoss || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont"
              >{{ form.timeRange }}年12月31日应收账款账面价值</span
            >
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.bookValue || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">1月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Jan || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">2月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Feb || 0),
                0
              )
            }}</span
            >&gt;
            <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">3月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Mar || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">4月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Apr || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">5月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.May || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">6月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Jun || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">7月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Jul || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">8月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Aug || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">9月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Sep || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">10月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Oct || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">11月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Nov || 0),
                0
              )
            }}</span
            >&gt; <a-divider type="vertical" style="background: #000000a6;" />
            <span class="greyfont">12月应收</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce(
                (p, c) => repairMethodAdd(p, c.Dec || 0),
                0
              )
            }}</span
            >&gt;
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import XEUtils from 'xe-utils'
import { throttle } from '@/utils/tool'
import {
  getOverdueAgingReport,
  exportOverdueAgingData
} from '@/services/report/financial/reportAccountsOverdueAnalysis'
import { createColumns, generateTableData } from './tableConfig.js'

const currentYear = moment().format('YYYY')
let columns = createColumns(currentYear)

export default {
  name: 'reportAccountsOverdueAnalysis',
  data() {
    return {
      columns,
      dataTable: [],
      loading: false,
      loadingDetail: false,
      isOpen: false,
      form: {
        timeRange: currentYear
      },
      formRules: {
        timeRange: [
          {
            required: true,
            message: '请选择查询的年份',
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
      }
    }
  },
  methods: {
    // 拼装的年份选择器
    handleValueChange() {
      this.form.timeRange = null
    },
    handleOpenChange(status) {
      this.isOpen = !!status
    },
    handlePanelChange(value) {
      let year = moment(value).format('YYYY')
      this.form.timeRange = year
      this.isOpen = false
    },
    // 加法精度问题
    repairMethodAdd: XEUtils.add,
    exportDetailData: throttle(function() {
      this.exportData(exportOverdueAgingData, '应收账逾期账龄', 'loadingDetail')
    }, 1500),
    exportData(cb, sheetName, loading) {
      const params = {
        recordYear: this.form.timeRange
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
      const params = {
        recordYear: this.form.timeRange
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.columns = createColumns(this.form.timeRange || currentYear)
          getOverdueAgingReport(params)
            .then(res => {
              if (res.data.code == 200) {
                this.loading = false
                this.dataTable = this.formatTableData(res.data.data)
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
    resetBtn() {
      this.form = {}
      this.option.opMaterial = {}
      this.option.customerMaterial = {}
      this.$refs.ruleForm.clearValidate()
    },
    screenBtn() {
      this.screen = !+this.screen
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
    formatTableData(data) {
      return generateTableData(data)
    }
  },
  activated() {
    this.submitBtn()
  }
}
</script>

<style lang="less" scoped>
@import './index';
</style>
