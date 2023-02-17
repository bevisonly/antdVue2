<template>
  <a-modal
    v-model="visible"
    dialogClass="accounts-modal"
    :footer="null"
    forceRender
  >
    <template #title>
      <div style="text-align:center;">汇总数据</div>
    </template>
    <div class="modal-content">
      <a-spin :spinning="spinning">
        <a-card
          title="应收账款汇总"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          size="small"
        >
          <div class="ant-table-bordered flex-ct">
            <div class=" ant-table-body">
              <table class="custom-table">
                <thead class="table-thead ant-table-thead">
                  <tr>
                    <th
                      class="ant-table-align-center ant-table-row-cell-break-word col-0"
                    >
                      销售总额
                    </th>
                    <th
                      class="ant-table-align-center ant-table-row-cell-break-word col-1"
                    >
                      {{ receivableAmountSummary }}
                    </th>
                    <th
                      class="ant-table-align-center ant-table-row-cell-break-word col-2"
                    >
                      付款总额
                    </th>
                    <th
                      class="ant-table-align-center ant-table-row-cell-break-word col-3"
                    >
                      未付款总额
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="table-body ant-table-tbody"
                  v-show="tableData.length"
                >
                  <tr
                    v-for="item in tableData"
                    :key="item.id"
                    class="table-row ant-table-row"
                  >
                    <td class="ant-table-row-cell-break-word col-0">
                      {{ item.label }}
                    </td>
                    <td class="ant-table-row-cell-break-word col-1">
                      {{ item.received }}
                    </td>
                    <td class="ant-table-row-cell-break-word col-2">
                      {{ item.pay }}
                    </td>
                    <td class="ant-table-row-cell-break-word col-3">
                      {{ item.noPay }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-show="!tableData.length" class="empty-placeholder">
                <a-empty :image="simpleImage" />
              </div>
            </div>
          </div>
        </a-card>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { getOverdueSummaryReport } from '@/services/report/financial/reportAccountsReceivableLedger'
import { Empty } from 'ant-design-vue'

export default {
  name: 'accountsSummary',
  data() {
    return {
      visible: false,
      spinning: false,
      tableData: [],
      receivableAmountSummary: '',
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
    }
  },
  methods: {
    changeModalStatus(queryInfo) {
      this.visible = !this.visible
      this.getOverdueSummaryData(queryInfo)
    },
    getOverdueSummaryData(queryInfo) {
      const params = { ...queryInfo }
      this.spinning = true
      getOverdueSummaryReport(params)
        .then(res => {
          if (res.data.code === '200') {
            this.spinning = false
            this.tableData = this.formatToArray(res.data.data)
            this.receivableAmountSummary = res.data.data.receivableAmountSummary
          } else {
            this.spinning = false
            this.$message.warn(res.data.message, 2)
          }
        })
        .catch(() => (this.spinning = false))
    },
    /**
     * 将对象转化表格所需数组形式
     * @param {*} obj
     */
    formatToArray(obj) {
      const labelArray = [
        {
          label: '信用期内支付',
          row: 1,
          dataIndex: [
            'creditPeriodAmountedSummary',
            'creditPeriodAmountedSummary',
            'creditPeriodAmountingSummary'
          ]
        },
        {
          label: '逾期30天内支付',
          row: 2,
          dataIndex: [
            'overdueOneMonthAmountedSummary',
            'overdueOneMonthAndCreditPeriodAmountedSummary',
            'overdueOneMonthAmountingSummary'
          ]
        },
        {
          label: '逾期30~60天内支付',
          row: 3,
          dataIndex: [
            'overdueTwoMonthsAmountedSummary',
            'overdueTwoMonthsAndCreditPeriodAmountedSummary',
            'overdueTwoMonthsAmountingSummary'
          ]
        },
        {
          label: '逾期60~90天内支付',
          row: 4,
          dataIndex: [
            'overdueThreeMonthsAmountedSummary',
            'overdueThreeMonthsAndCreditPeriodAmountedSummary',
            'overdueThreeMonthsAmountingSummary'
          ]
        },
        {
          label: '逾期90-120天内支付',
          row: 5,
          dataIndex: [
            'overdueFourMonthsAmountedSummary',
            'overdueFourMonthsAndCreditPeriodAmountedSummary',
            'overdueFourMonthsAmountingSummary'
          ]
        },
        {
          label: '逾期120~150天支付',
          row: 6,
          dataIndex: [
            'overdueFiveMonthsAmountedSummary',
            'overdueFiveMonthsAndCreditPeriodAmountedSummary',
            'overdueFiveMonthsAmountingSummary'
          ]
        },
        {
          label: '逾期150天后支付',
          row: 7,
          dataIndex: [
            'overdueOverFiveMonthsAmountedSummary',
            'overdueOverFiveMonthsAndCreditPeriodAmountedSummary',
            'overdueOverFiveMonthsAmountingSummary'
          ]
        }
      ]
      return labelArray.map(item => {
        return {
          label: item.label,
          received: obj[item.dataIndex[0]],
          pay: obj[item.dataIndex[1]],
          noPay: obj[item.dataIndex[2]]
        }
      })
    }
  }
}
</script>

<style lang="less">
.accounts-modal {
  width: 92%;
  min-width: 1000px;
  max-width: 1600px;
  .table-thead > th {
    text-align: center;
  }
  .empty-placeholder {
    overflow:hidden;
    border-bottom:1px solid #f0f0f0;
    border-left:1px solid #f0f0f0;
    border-right:1px solid #f0f0f0;
  }
  @cols:0,1,2,3;
  each(@cols,{
    .custom-table .col-@{value}{
      min-width: 200px;
      max-width: 300px;
    }
  })
}
</style>
