<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-date-picker placeholder="分拣开始时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.pickStartTime" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
              至
              <a-date-picker placeholder="分拣结束时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.pickEndTime" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input v-model.trim="form.itemName" placeholder="请输入商品名称"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" icon="redo" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" icon="search" @click="submitBtn('search')">查询</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <div class="btnGrp">
        <a-button type="primary" size="small" icon="download" :loading="loadingBtn" :disabled="!hasPermission('data_report_export')" @click="downloadBtn">导出</a-button>
      </div>
      <a-table bordered ref="tableRef" :data-source="dataTable" :loading='loading' rowKey="id" :pagination='false'>
        <a-table-column title="工人名称" data-index="workerName" :width="160"/>
        <a-table-column title="分拣开始时间" data-index="pickStartTime" :width="170"/>
        <a-table-column title="分拣结束时间" data-index="pickEndTime" :width="130"/>
        <a-table-column title="分拣时长" data-index="sortingDuration" :width="130"/>
        <a-table-column title="平均分拣数量" data-index="sortingNum" :width="140"/>
        <a-table-column title="商品名称" data-index="itemName" :width="120"/>
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
import {
  workerExportList,
  workerGetWorkerPerformancePageList
} from '@/services/workerKPI.js'
import moment from 'moment';
export default {
  name: 'workerKPI',
  data() {
    return {
      form: {
        pickStartTime: '',
        pickEndTime: '',
        itemName: undefined,
      },
      dataTable: [],
      loading: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
      copyParams: undefined,
      loadingBtn: false
    }
  },
  methods: {
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YY-MM-DD") == moment(today).format("YY-MM-DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    resetBtn() {
      let nullParams = {
        pickStartTime: '',
        pickEndTime: '',
        itemName: undefined,
      }
      this.form = nullParams
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    downloadBtn() {
      const params = {
        orgId: localStorage.getItem("orgId"),
        pickStartTime: moment(this.form.pickStartTime).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.pickStartTime).format("YYYY-MM-DD HH:mm:ss"),
        pickEndTime: moment(this.form.pickEndTime).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.pickEndTime).format("YYYY-MM-DD HH:mm:ss"),
        itemName: this.form.itemName || '',
      }
      this.loadingBtn = true
      workerExportList(params).then(
        res => {
          if (res.data.type == 'application/vnd.ms-excel' || res.data.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '工人绩效'
            this.getErrExcel(res.data, name)
            this.loadingBtn = false
          } else {
            this.loadingBtn = false
            this.$message.warn('下载失败,'+res.data.message, 2)
          }
        }
      ).catch(() => {
        this.$message.warn('下载失败')
        this.loadingBtn = false
      })
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
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.currentPage = this.pagination.page
        this.copyParams.pageSize = this.pagination.size
      } else {
        this.copyParams = this.deepClone(
          {
            currentPage: this.pagination.page,
            pageSize: this.pagination.size,
            queryParam: {
              orgId: localStorage.getItem("orgId"),
              pickStartTime: moment(this.form.pickStartTime).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.pickStartTime).format("YYYY-MM-DD HH:mm:ss"),
              pickEndTime: moment(this.form.pickEndTime).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.pickEndTime).format("YYYY-MM-DD HH:mm:ss"),
              itemName: this.form.itemName || '',
            }
          }
        )
      }
      this.loading = true
      workerGetWorkerPerformancePageList(this.copyParams).then(
        res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.totalNum
            res.data.data.map((item, i) => item.id ? '' : item.id = i)
            this.dataTable = res.data.data
          } else {
            this.loading = false
          }
        }
      ).catch(() => {this.loading = false})
    },
    submitBtn(flag) {
      const params = {
        currentPage: this.pagination.page,
        pageSize: this.pagination.size,
        queryParam:{
          orgId: localStorage.getItem("orgId"),
          pickStartTime: moment(this.form.pickStartTime).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.pickStartTime).format("YYYY-MM-DD HH:mm:ss"),
          pickEndTime: moment(this.form.pickEndTime).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.pickEndTime).format("YYYY-MM-DD HH:mm:ss"),
          itemName: this.form.itemName || '',
        }
      }
      if (flag == 'search') {
        this.pagination.page = 1
        params.pageSize = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      workerGetWorkerPerformancePageList(params).then(
        res => {
          if (res.data.code == 200) {
            this.loading = false
            this.pagination.total = res.data.totalNum
            res.data.data.map((item, i) => item.id ? '' : item.id = i)
            this.dataTable = res.data.data
          } else {
            this.loading = false
            this.$message.warn('查询失败...')
          }
        }
      ).catch(() => this.loading = false)
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
    this.submitPagination()
  },
}
</script>

<style lang="less">
  @import './index';
</style>