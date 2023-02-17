<template>
  <div class="mainTop">
    <div class="queryInfo" v-if="screen">
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
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
                @search="handlerOrg"
                @change="handleOrgIdOption"
              >
                <a-select-option
                  v-for="item in option.opOption"
                  :key="item.orgId"
                  >{{ item.opCode }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                mode="multiple"
                v-model="form.customerId"
                placeholder="请选择客户"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
                @search="handlerItemName"
                @change="handleItemNameOption"
              >
                <a-select-option
                  v-for="item in option.customerOption"
                  :key="item.id"
                  >{{ item.partnerName }}</a-select-option
                >
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
                :disabled="!hasPermission('reportCustomersQuota_export')"
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
          width="600"
          col="3"
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
import {
  op,
  getLimitationCustomer,
  getPartnerList,
  exportLimitationCustomer
} from '@/services/report/reportCustomersQuota'
import { debounce } from '@/utils/util'

const columns = [
  { title: '序号', dataIndex: 'indexAsc', width: 80, align: 'center' },
  { title: '客户名称', dataIndex: 'partnerName', width: 300, align: 'center' },
  { title: '客户编码', dataIndex: 'partnerCode', width: 200, align: 'center' },
  {
    title: '业务单元',
    dataIndex: 'orgName',
    width: 300,
    align: 'center'
  },
  { title: '客户等级', dataIndex: 'rating', width: 200, align: 'center' },
  {
    title: '评估额度/万元',
    dataIndex: 'adviceAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '审批额度/万元',
    dataIndex: 'suggestAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '占用金额/万元(业务口径)',
    dataIndex: 'occupyAmountForBusiness',
    width: 220,
    align: 'center'
  },
  {
    title: '占用比例/万元(业务口径)',
    dataIndex: 'occupyRatioForBusiness',
    width: 180,
    align: 'center'
  },
  {
    title: '占用额度/万元(财务口径)',
    dataIndex: 'occupyAmountForFinancial',
    width: 220,
    align: 'center'
  },
  {
    title: '占用比例/万元(财务口径)',
    dataIndex: 'occupyRatioForFinancial',
    width: 180,
    align: 'center'
  }
]
export default {
  name: 'reportCustomersQuota',
  data() {
    return {
      columns,
      dataTable: [],
      loading: false,
      loadingExcel: false,
      form: {},
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
    exportData() {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        customerIds: this.form.customerId,
        orgIds: this.form.orgId
      }
      this.loadingExcel = true
      exportLimitationCustomer(params)
        .then(res => {
          if (res.status == '200' && res.data.type != 'application/json') {
            let name = res.headers['content-disposition']
              ? decodeURIComponent(res.headers['content-disposition']).match(
                  /(?<=filename=).*(?=\.xl)/gm
                )[0]
              : '客户占用额度报表'
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
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        customerIds: this.form.customerId,
        orgIds: this.form.orgId
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      getLimitationCustomer(params)
        .then(res => {
          if (res.data.code == 200) {
            this.loading = false
            this.pagination.total = res.data.totalNum
            res.data.data.forEach((item, i) => {
              item.indexAsc = ++i
            })
            this.dataTable = res.data.data
          } else {
            this.loading = false
            this.$message.warn(res.data.message, 2)
          }
        })
        .catch(() => (this.loading = false))
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          customerIds: this.form.customerId,
          orgIds: this.form.orgId
        })
      }
      this.loading = true
      getLimitationCustomer(this.copyParams)
        .then(res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.totalNum
            res.data.data.forEach((item, i) => {
              item.indexAsc = ++i
            })
            this.dataTable = res.data.data
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
      this.handleOrgIdSearch()
      this.handleItemNameSearch()
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    handleOrgIdSearch(query) {
      let params = {}
      if (query?.trim()) {
        params.opName = query?.trim()
      }
      this.getOpList(params)
    },
    handleOrgIdOption(value) {
      this.form.orgId = value
      this.option.opMaterial =
        this.option.opOption.find(item => item.orgId == value) || {}
      let params = {}
      if (this.form.orgId.length) {
        params.orgIds = this.form.orgId
      }
      this.getPartnerListData(params)
    },
    handleItemNameSearch(v) {
      let params = {
        orgIds: this.form.orgId
      }
      if (v?.trim()) {
        params.partnerName = v?.trim()
      }
      this.getPartnerListData(params)
    },
    handleItemNameOption(value) {
      this.form.customerId = value
      this.option.customerMaterial =
        this.option.customerOption.find(item => item.id == value) || {}
    },
    handlerItemName: debounce(function(v) {
      this.handleItemNameSearch(v)
    }, 1000),
    handlerOrg: debounce(function(v) {
      this.handleOrgIdSearch(v)
    }, 1000),
    getOpList(params) {
      op(params).then(res => (this.option.opOption = res.data.data || []))
    },
    getPartnerListData(params) {
      getPartnerList(params).then(
        res => (this.option.customerOption = res.data || [])
      )
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
    this.handleItemNameSearch()
    this.submitPagination()
  }
}
</script>

<style lang="less" scoped>
@import './index';
</style>
