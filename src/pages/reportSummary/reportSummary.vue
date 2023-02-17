<template>
  <div class="mainTop">
    <div class="queryInfo" v-if="screen">
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-button-group>
                <a-button class="a-btn" :type="primaryFlag == 'thisWeek' ? 'primary' : ''" @click="getWeekDate(0,'thisWeek')">本周</a-button>
                <a-button class="a-btn" :type="primaryFlag == 'lastWeek' ? 'primary' : ''" @click="getWeekDate(1,'lastWeek')">上周</a-button>
                <a-button class="a-btn" :type="primaryFlag == 'thisMonth' ? 'primary' : ''" @click="getMonthDate(0,'thisMonth')">本月</a-button>
                <a-button class="a-btn" :type="primaryFlag == 'lastMont' ? 'primary' : ''" @click="getMonthDate(1,'lastMont')">上月</a-button>
              </a-button-group>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-range-picker
                dropdownClassName="noShowTimeStyle"
                style="width: 100%"
                :show-time="{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="dateGroup"
                @ok="changeDate"
                @change="changeDate">
              </a-range-picker>
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
              >
                <a-select-option v-for="item in option.opOption" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="submitBtn('search')">查询</a-button>
              <a-button class="ant-button" @click="resetBtn">重置</a-button>
              <a-button class="ant-button" :loading="loadingExcel" @click="exportData" :disabled="!hasPermission('reportSummary_export')">导出</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="flex-ed marginWidth">
      <a-button-group class="a-button-group">
        <checkboxList v-model="columns" width="360" />
        <a-button class="btnStyle" type="primary" :icon="screen ? 'fullscreen' : 'fullscreen-exit'" @click="screenBtn"></a-button>
      </a-button-group>
    </div>
    <div class="tableInfo">
      <a-table
        bordered
        size="middle"
        :columns="columns"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ y: 400 }"
        :pagination='false'
      >
        <span slot="signPrice" slot-scope="text,record">{{formatPrice(record.signPrice, 2)}}</span>
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
import moment from "moment";
import { search, exportData, op} from '@/services/report/reportSummary'
const columns = [
  {title: '序号', dataIndex: 'indexAsc', align: "center"},
  {title: '业务单元', dataIndex: 'opName', align: "center"},
  {title: '营业收入(元)', dataIndex: 'operatingIncome', align: "center"},
  {title: '成本费用(元)', dataIndex: 'cost', align: "center"},
  {title: '毛利', dataIndex: 'profitBeforeInterestAndTax', align: "center"},
  // {title: '息税前利润(元)', dataIndex: 'profitBeforeInterestAndTax', align: "center"},
  {title: '应收账款总额(元)', dataIndex: 'itemNameX', align: "center"},
  {title: '逾期应收账款总额(元)', dataIndex: 'typeNameX', align: "center"},
  {title: '应付账款总额(元)', dataIndex: 'priceUnitX', align: "center"},
  {title: '年度指标(元)', dataIndex: 'specsX', align: "center"},
  {title: '年度指标完成率(%)', dataIndex: 'saleQtyX', align: "center"},
]
export default {
  name: 'reportSummary',
  data() {
    return {
      columns,
      dataTable: [],
      loading: false,
      loadingExcel: false,
      form: {},
      dateGroup: null,
      primaryFlag: undefined,
      screen: true,
      option: {
        opOption: [],
      },
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    }
  },
  methods: {
    moment,
    exportData() {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        orderDateStart: this.form.orderDateStart,
        orderDateEnd: this.form.orderDateEnd,
        orgIds: this.form.orgId,
      }
      this.loadingExcel = true
      exportData(params).then(res => {
        if (res.status == '200' && res.data.type != "application/json") {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '经营汇总数据表'
          this.getExcel(res.data, name)
          this.loadingExcel = false
        } else {
          this.loadingExcel = false
          this.$message.warn('下载失败')
        }
      }).catch(() => {
        this.loadingExcel = false
        this.$message.warn('下载失败')
      })
    },
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        orderDateStart: this.form.orderDateStart,
        orderDateEnd: this.form.orderDateEnd,
        orgIds: this.form.orgId,
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(
        res => {
          if (res.data.code == 200) {
            this.loading = false
            this.pagination.total = res.data.totalNum
            res.data.data.forEach((item,i) => item.indexAsc = ++i)
            this.dataTable = res.data.data
          } else {
            this.loading = false
            this.$message.warn(res.data.message, 2)
          }
        }
      ).catch(() => this.loading = false)
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          orderDateStart: this.form.orderDateStart,
          orderDateEnd: this.form.orderDateEnd,
          orgIds: this.form.orgId,
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.totalNum
          res.data.data.forEach((item,i) => item.indexAsc = ++i)
          this.dataTable = res.data.data
        } else {
          this.loading = false
        }
      }).catch(() => this.loading = false)
    },
    resetBtn() {
      this.form = {}
      this.dateGroup = null
      this.primaryFlag = undefined
      this.handleOrgIdSearch()
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    handleOrgIdSearch() {
      op({}).then(res => this.option.opOption = res.data.data || [])
    },
    getWeekDate(weekFlag, primaryFlag) {
      this.primaryFlag = primaryFlag
      this.dateGroup = null
      if (weekFlag == "0") {
        this.form.orderDateStart = moment('00:00:00', 'HH:mm:ss').startOf("week").format("YYYY-MM-DD HH:mm:ss")
        this.form.orderDateEnd = moment('23:59:59', 'HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")
      } else {
        this.form.orderDateStart = moment('00:00:00', 'HH:mm:ss').startOf("week").format("YYYY-MM-DD HH:mm:ss")
        this.form.orderDateEnd = moment('23:59:59', 'HH:mm:ss').endOf("week").format("YYYY-MM-DD HH:mm:ss")
      }
    },
    getMonthDate(monthFlag, primaryFlag) {
      this.primaryFlag = primaryFlag
      this.dateGroup = null
      if (monthFlag == "0") {
        this.form.orderDateStart = moment('00:00:00', 'HH:mm:ss').startOf("month").format("YYYY-MM-DD HH:mm:ss")
        this.form.orderDateEnd = moment('23:59:59', 'HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")
      } else {
        this.form.orderDateStart = moment('00:00:00', 'HH:mm:ss').startOf("month").format("YYYY-MM-DD HH:mm:ss")
        this.form.orderDateEnd = moment('23:59:59', 'HH:mm:ss').endOf("month").format("YYYY-MM-DD HH:mm:ss")
      }
    },
    changeDate() {
      this.primaryFlag = undefined
      this.form.orderDateStart = this.dateGroup[0] || undefined
      this.form.orderDateEnd = this.dateGroup[1] || undefined
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
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
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
    this.primaryFlag = undefined
    this.handleOrgIdSearch()
    this.submitPagination()
  },
}
</script>

<style lang="less" scoped>
  @import './index';
</style>