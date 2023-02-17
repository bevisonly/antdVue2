<template>
  <div class="mainTop">
    <div class="queryInfo" v-if="screen">
      <a-form-model :model="form" :rules="formRules" ref="ruleForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              class="formItemStyle formItemStylewidth"
              prop="timeRange"
            >
              <a-month-picker
                style="width: 100%"
                placeholder="请选择红冲月份"
                :disabled="isJump"
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
                :disabled="isJump"
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
                v-model="form.itemName"
                placeholder="请搜索产品名称"
                :disabled="isJump"
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
                  >{{ item.itemName }}</a-select-option
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
                :disabled="!hasPermission('reportInventoryRecord_export')"
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
          <span class="greyfont">修改前数量</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((p, c) => p + c.updateBeforeQty || 0, 0)
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">修改前金额</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((p, c) => p + c.updateBeforeAmount || 0, 0)
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">修改后数量</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((p, c) => p + c.updateAfterQty || 0, 0)
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">修改后金额</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((p, c) => p + c.updateAfterAmount || 0, 0)
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">红冲数量</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((p, c) => p + c.redDashedQty || 0, 0)
          }}</span
          >&gt;
          <a-divider type="vertical" style="background: #000000a6;" />
          <span class="greyfont">红冲金额</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((p, c) => p + c.redDashedAmount || 0, 0)
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
import {
  getInOutRecord,
  exportData,
  op,
  product
} from '@/services/report/reportInventoryRecord'
const columns = [
  { title: '序号', dataIndex: 'indexAsc', width: 80, align: 'center' },
  { title: '采购订单号', dataIndex: 'poCode', width: 200, align: 'center' },
  { title: '入库编号', dataIndex: 'imItemCode', width: 300, align: 'center' },
  { title: '入库/出库时间', dataIndex: 'invDate', width: 200, align: 'center' },
  {
    title: '修改时间',
    dataIndex: 'updateInvDate',
    width: 200,
    align: 'center'
  },
  { title: '业务单元', dataIndex: 'opName', width: 200, align: 'center' },
  { title: '产品名称', dataIndex: 'itemName', width: 300, align: 'center' },
  { title: '单位', dataIndex: 'unit', width: 160, align: 'center' },
  {
    title: '修改前',
    dataIndex: 'b',
    children: [
      {
        title: '数量',
        dataIndex: 'updateBeforeQty',
        width: 160,
        align: 'center'
      },
      {
        title: '金额',
        dataIndex: 'updateBeforeAmount',
        width: 160,
        align: 'center'
      }
    ]
  },
  {
    title: '修改后',
    dataIndex: 'p',
    children: [
      {
        title: '数量',
        dataIndex: 'updateAfterQty',
        width: 180,
        align: 'center'
      },
      {
        title: '金额',
        dataIndex: 'updateAfterAmount',
        width: 180,
        align: 'center'
      }
    ]
  },
  {
    title: '红冲',
    dataIndex: 's',
    children: [
      { title: '数量', dataIndex: 'redDashedQty', width: 180, align: 'center' },
      {
        title: '金额',
        dataIndex: 'redDashedAmount',
        width: 180,
        align: 'center'
      }
    ]
  }
]
export default {
  name: 'reportInventoryRecord',
  data() {
    return {
      columns,
      dataTable: [],
      loading: false,
      loadingExcel: false,
      form: {
        timeRange: undefined,
        itemName: undefined,
        itemId: '',
        unit: '',
        spec: ''
      },
      formRules: {
        timeRange: [
          { required: true, message: '请选择查询的红冲月份', trigger: 'change' }
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
            .format('YYYY-MM-DD')
        : ''
    },
    searchItemName() {
      return this.option.productOption.find(
        item => item.id == this.form.itemName
      )
        ? this.option.productOption.find(item => item.id == this.form.itemName)
            .itemName
        : ''
    },
    isJump() {
      return this.$route.params.isJumpLink
    }
  },
  methods: {
    exportData() {
      const params = {
        redFlashTime: this.redFlashTime,
        itemName: this.searchItemName,
        orgIds: this.form.orgId,
        itemId: this.form.itemId,
        unit: this.form.unit,
        spec: this.form.spec
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
                  : '出入库红冲记录表'
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
        redFlashTime: this.redFlashTime,
        itemName: this.searchItemName,
        orgIds: this.form.orgId
      }
      if (flag == 'search') {
        this.copyParams = this.deepClone(params)
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          getInOutRecord(params)
            .then(res => {
              if (res.data.code == 200) {
                this.loading = false
                this.pagination.total = res.data.data.totalNum
                res.data.data.data.forEach((item, i) => (item.indexAsc = ++i))
                this.dataTable = res.data.data.data
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
      if (this.copyParams && !this.isJump) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          redFlashTime: this.redFlashTime,
          itemName: this.searchItemName,
          orgIds: this.form.orgId,
          itemId: this.form.itemId,
          unit: this.form.unit,
          spec: this.form.spec,
          docType: this.form.docType
        })
      }
      this.loading = true
      getInOutRecord(this.copyParams)
        .then(res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.data.totalNum
            res.data.data.data.forEach((item, i) => (item.indexAsc = ++i))
            this.dataTable = res.data.data.data
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
      return product({ likeItemName: v?.trim() || '', rows: 50, page: 1 }).then(
        res => (this.option.productOption = res.data.data || [])
      )
    },
    handleItemNameOption(value) {
      this.form.itemName = value
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
      if (this.$route.params.itemId) {
        let searchItem = this.option.productOption.find(
          item => item.itemName == this.$route.params.itemName
        )
        this.form.timeRange = this.$route.params.redFlashTime
        this.form.orgId = this.$route.params.orgId
        this.form.itemName = searchItem ? searchItem.id : undefined
        this.form.itemId = this.$route.params.itemId
        this.form.unit = this.$route.params.unit
        this.form.spec = this.$route.params.spec
        this.form.docType = this.$route.params.docType
      } else {
        if (!this.form.timeRange) {
          this.form.timeRange = moment()
            .subtract(1, 'months')
            .format('YYYY-MM')
        }
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
  async activated() {
    this.handleOrgIdSearch()
    if (this.$route.params.itemName) {
      await this.handleItemNameSearch(this.$route.params.itemName)
    } else {
      await this.handleItemNameSearch()
    }
    this.setQueryDate()
    this.submitPagination()
  }
}
</script>

<style lang="less" scoped>
@import './index';
</style>
