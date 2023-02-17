<template>
  <div class="finalTop">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询</p>
      <div class="queryInfoDiv">
        <a-form-model ref="searchFormRef" :model="searchForm" layout="horizontal">
          <a-row>
            <a-col :span="24">
              <a-form-model-item class="floatLeft widthTime">
                <a-date-picker v-model="searchForm.startTime" show-time type="date" allowClear placeholder="开始日期"/>
                至
                <a-date-picker class="datePicker" v-model="searchForm.endTime" show-time type="date" allowClear placeholder="结束日期"/>
              </a-form-model-item>
              <a-form-model-item class="floatLeft widthPercent">
                <a-input v-model="searchForm.proName" placeholder="请输入商品名称"></a-input>
              </a-form-model-item>
              <a-form-model-item class="floatLeft widthPercent">
                <a-select style="width: 100%;" allowClear placeholder="审核状态选择" v-model="searchForm.state">
                 <a-select-option value=''>{{'全部'}}</a-select-option>
                 <a-select-option value='0'>{{'待审核'}}</a-select-option>
                 <a-select-option value='1'>{{'已审核'}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="floatLeft widthPercent">
                <a-select class="selectOption" placeholder="仓库选择" :value="wareHouseName" allowClear @change="handleChangeWhNameOption">
                  <a-select-option v-for="item in warehousList" :key="item.id">{{item.whName}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="floatLeft">
                <a-button class="ant-button" type="primary" icon="search" @click="queryInfo">查询</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </div>
    <div class="tableInfo">
      <div class="addData">
        <a-button type="primary" :disabled="!hasPermission('warehouse_inventorycheck_new')" @click="newAdd('add')">新增</a-button>
      </div>
      <a-table
        bordered
        ref="tableRef"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination="false"
      >
        <!-- :pagination="{showTotal: ()=>`共 ${paginationTotal} 条`,showSizeChanger: true,showQuickJumper: paginationTotal/271 > 1}" -->
        <a-table-column key="iwNumber" title="盘库单号" data-index="iwNumber" :width="216"/>
        <a-table-column key="createDate" title="创建时间" data-index="createDate" :width="216"/>
        <a-table-column key="invWhTime" title="盘库时间" data-index="invWhTime" :width="216"/>
        <a-table-column key="wareHouseName" title="仓库名称" data-index="wareHouseName" :width="216"/>
        <a-table-column key="adjustDebitPrice" title="损溢金额" data-index="adjustDebitPrice" :width="216"/>
        <a-table-column key="createUser" title="制单人" data-index="createUser" :width="216"/>
        <a-table-column key="state" title="审核状态" data-index="state" :width="216">
          <template slot-scope="text, record">
            <span :class="record.state == 1 ? 'greenfont' : ''">{{record.state == 1 ? '已审核' : '待审核'}}</span>
          </template>
        </a-table-column>
        <a-table-column key="operation" title="操作" fixed='right' data-index="operation" :width="360" align='center' >
          <template slot-scope="text, record">
            <a-button class="bluefonthover" type="link" :disabled="!hasPermission('warehouse_inventorycheck_details')" @click="detailsInfo(record.id)">详情</a-button>
            <a-button class="bluefonthover" type="link" :disabled="!hasPermission('warehouse_inventorycheck_check')" @click="checkInfo('check', record.id)">审核</a-button>
            <a-button class="bluefonthover" type="link" :disabled="!hasPermission('warehouse_inventorycheck_edit')" @click="editBtn('edit',record.id)">编辑</a-button>
            <a-button class="bluefonthover" type="link" :disabled="!hasPermission('warehouse_inventorycheck_export')" @click="downloadExcel(record.id)">导出</a-button>
            <a-button class="redfonthover" type="link" :disabled="!hasPermission('warehouse_inventorycheck_delete')" @click="deleteAData(record.id, record.state)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination
          show-size-changer
          :pageSizeOptions='pageSizeOptions'
          :default-current="1"
          :total="pagination.total"
          :show-total="total => `共 ${pagination.total} 条`"
          @showSizeChange="onShowSizeChange"
          @change="onPageSizeChange"
        />
      </div>
    </div>
    <modalInventoryNewAdd ref="modalInventoryNewAddRef"></modalInventoryNewAdd>
    <modalDetails ref="modalDetailsRef"></modalDetails>
  </div>
</template>

<script>
import modalInventoryNewAdd from './modalInventoryNewAdd'
import modalDetails from './modalDetails'
import {
  inventoryStockGetData,
  inventoryStockDelete,
  exportData
} from '../../services/inventoryCheck.js'
import { warehouseList } from '../../services/showLoseAndOverflower'
import moment from "moment";
export default {
  name: "inventoryCheck",
  components: { modalInventoryNewAdd, modalDetails },
  data() {
    return {
      searchForm: {
        startTime: "",
        endTime: "",
        proName: "",
        state: '0',
        wareHouse: []
      },
      warehousList: [],
      wareHouseName: undefined,
      dataTable: [],
      loading: false,
      pageSizeOptions: ["10", "20", "50", "100"],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  methods: {
    newAdd(flag) {
      this.$refs.modalInventoryNewAddRef.openModal(flag, undefined, this.queryInfo);
    },
    detailsInfo(id) {
      this.$refs.modalDetailsRef.openModal(id);
    },
    checkInfo(flag, id) {
      this.$refs.modalInventoryNewAddRef.openModal(flag, id, this.queryInfo);
    },
    editBtn(flag, id) {
      this.$refs.modalInventoryNewAddRef.openModal(flag, id, this.queryInfo);
    },
    queryInfo() {
      const params = {
        startTime: this.searchForm.startTime !== null && this.searchForm.startTime !== '' ? moment(this.searchForm.startTime).format("YYYY-MM-DD HH:mm:ss") : "",
        endTime: this.searchForm.endTime !== null && this.searchForm.endTime !== '' ? moment(this.searchForm.endTime).format("YYYY-MM-DD HH:mm:ss") : "",
        proName: this.searchForm.proName,
        state: this.searchForm.state === 0 ? 0 : this.searchForm.state == null || this.searchForm.state.length == 0? '' : this.searchForm.state,
        wareHouse: this.searchForm.wareHouse == ![] && !this.wareHouseName ? '' : this.searchForm.wareHouse,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      this.loading = true
      inventoryStockGetData(params).then(
        res => {
          if (res.data.code == '200') {
            this.pagination.total = res.data.data.total
            res.data.data.list.map(
              item => {
                item.adjustDebitPrice = typeof(item.adjustDebitPrice) == 'number' && !Number.isNaN(item.adjustDebitPrice) ? item.adjustDebitPrice : ''
                item.excessPrice = typeof(item.excessPrice) == 'number' && !Number.isNaN(item.excessPrice) ? item.excessPrice : ''
              }
            )
            this.dataTable = res.data.data.list
          } else {
            this.$message.warn(res.data.message)
          }
          this.loading = false
        }
      ).catch( () => this.loading = false )
    },
    getWarehoseList() {
      const params = {}
      warehouseList(params).then(
        val => {
          if (val.data.code == '200') {
            this.warehousList = val.data.data
          }
        }
      )
    },
    handleChangeWhNameOption(value) {
      this.wareHouseName = value;
      this.searchForm.wareHouse = !value ? '' : this.warehousList.find( item => { return item.id == value} ).id
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    downloadExcel(id) {
      this.$message.success('正在导出，请稍后')
      exportData({id: id}).then(
        res => {
          if (res.data.type == 'application/vnd.ms-excel' || res.data.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '列表导出'
            this.getErrExcel(res.data, name)
          } else {
            this.$message.warn('导出失败')
          }
        }
      ).catch(e => this.$message.warn('导出失败'+e, 3))
    },
    deleteAData(id, state) {
      if (state === 1) {
        this.$message.warn('该商品已审核，不能删除')
        return
      }
      const params = { id : id }
      inventoryStockDelete(params).then(
        val => {
          if (val.data.code == 200) {
            this.$message.success('删除成功')
            this.queryInfo()
          } else {
            this.$message.warn(`删除失败${val.data.message}`, 3)
          }
        }
      )
    },
    onPageSizeChange(current, pageSize) {
      this.pagination.currentPage = current == 0 ? 1 : current
      this.pagination.pageSize = pageSize
      this.queryInfo()
    },
    onShowSizeChange(current, pageSize) {
      this.pagination.currentPage = current == 0 ? 1 : current
      this.pagination.pageSize = pageSize
      this.queryInfo()
    },
  },
  activated() {
    this.getWarehoseList()
    this.queryInfo()
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>