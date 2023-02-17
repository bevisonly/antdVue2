<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-date-picker placeholder="完工入库开始时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.completeBeginTime" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
              至
              <a-date-picker placeholder="完工入库结束时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.completeEndTime" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%;"
                :value="form.whName"
                placeholder="请选择仓库主体名称"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                @change="handleWarehouseOption"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in warehouseOption" :key="item.id">
                  {{ item.whName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入商品名称" v-model="form.piItemName"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入加工/入库单号" v-model="form.imItemCode"></a-input>
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
      <p class="bottomTitle">
        完工入库 <a-icon type="book" />
      </p>
      <a-table
        bordered
        ref="tableRef"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <a-table-column title="入库单号" data-index="imItemCode" :width="230">
          <template slot-scope="text, record">
            <span class="cursorPin greenfont bluefonthover" @click="detailsBtn(record)">{{ record.imItemCode }}</span>
          </template>
        </a-table-column>
        <a-table-column title="加工单号" data-index="number" :width="230"/>
        <a-table-column title="入库仓库" data-index="whName" :width="300"/>
        <a-table-column title="入库数量" data-index="inNumber" :width="210"/>
        <a-table-column title="创建人" data-index="createUser" :width="200"/>
        <a-table-column title="完工时间" data-index="completeDate" :width="suitableTdWidth"/>
        <a-table-column title="操作" fixed='right' data-index="operation" :width="90" align='center' >
          <template slot-scope="text, record">
            <a-button class="greenfont bluefonthover" type="link" icon='edit' :disabled="!hasPermission('completeInStock_details')" @click="detailsBtn(record)">详情</a-button>
          </template>
        </a-table-column>
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
    <modal-details ref="modalDetailsRef"/>
  </div>
</template>

<script>
import moment from 'moment';
import modalDetails from './modalDetails'
import { warehouseList, tableList } from '@/services/sortingProcessing/completeInStock'
export default {
  name: 'completeInStock',
  components: { modalDetails },
  data() {
    return {
      form: {
        completeBeginTime: '',
        completeEndTime: '',
        piItemName: undefined,
        imItemCode: undefined,
        whName: undefined,
      },
      warehouseOption: [],
      dataTable: [],
      suitableTdWidth: 160,
      loading: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
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
    detailsBtn(record) {
      this.$refs.modalDetailsRef.openModal(record)
    },
    resetBtn() {
      let nullParams = {
        completeBeginTime: '',
        completeEndTime: '',
        piItemName: undefined,
        imItemCode: undefined,
        whName: undefined,
      }
      this.form = nullParams
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
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone(
          {
            page: this.pagination.page,
            rows: this.pagination.size,
            sort: "id",
            order: "DESC",
            completeBeginTime: moment(this.form.completeBeginTime).format("YYYY-MM-DD") == "Invalid date" ? undefined : moment(this.form.completeBeginTime).format("YYYY-MM-DD HH:mm:ss"),
            completeEndTime: moment(this.form.completeEndTime).format("YYYY-MM-DD") == "Invalid date" ? undefined : moment(this.form.completeEndTime).format("YYYY-MM-DD HH:mm:ss"),
            piItemName: this.form.piItemName,
            imItemCode: this.form.imItemCode,
            whName: this.form.whName
          }
        )
      }
      this.loading = true
      tableList(this.copyParams).then(
        res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.totalNum
            this.dataTable = res.data.data
          } else {
            this.loading = false
          }
        }
      ).catch(() => this.loading = false)
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        completeBeginTime: moment(this.form.completeBeginTime).format("YYYY-MM-DD") == "Invalid date" ? undefined : moment(this.form.completeBeginTime).format("YYYY-MM-DD HH:mm:ss"),
        completeEndTime: moment(this.form.completeEndTime).format("YYYY-MM-DD") == "Invalid date" ? undefined : moment(this.form.completeEndTime).format("YYYY-MM-DD HH:mm:ss"),
        piItemName: this.form.piItemName,
        imItemCode: this.form.imItemCode,
        whName: this.form.whName
      }
      if (flag == 'search') {
        this.pagination.page = 1
        params.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      tableList(params).then(
        res => {
          if (res.data.code == 200) {
            this.loading = false
            this.pagination.total = res.data.totalNum
            this.dataTable = res.data.data
          } else {
            this.loading = false
            this.$message.warn('查询失败...')
          }
        }
      ).catch(() => this.loading = false)
    },
    getWarehoseList() {
      warehouseList({}).then(val => val.data.code == '200' && (this.warehouseOption = val.data.data))
    },
    handleWarehouseOption(value) {
      this.form.whName = value
      if (value == "") return
      this.warehouseMaterial =  this.warehouseOption.find(item => item.id == value).id
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
  mounted() {
    this.$nextTick(()=>{
      window.addEventListener('resize', () => {
        document.querySelector('.paginationContainer')?.clientWidth > 1600 ? this.suitableTdWidth = '' : this.suitableTdWidth = 160
      });
    })
  },
  activated() {
    document.querySelector('.paginationContainer')?.clientWidth > 1600 ? this.suitableTdWidth = '' : this.suitableTdWidth = 80
    this.getWarehoseList()
    this.submitPagination()
  },
}
</script>

<style lang="less">
  @import './index';
</style>