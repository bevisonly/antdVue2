<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-date-picker placeholder="新增开始时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.createDateStart" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
              至
              <a-date-picker placeholder="新增结束时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.createDateEnd" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入加工商品名称" v-model="form.processItemName"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" @click="submitBtn('select')">查询</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <div class="btnGrp">
        <a-button type="primary" :disabled="!hasPermission('bom_list_insert')" @click="addBomBtn('add')">新增</a-button>
      </div>
      <a-table
        bordered
        ref="tableRef"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <a-table-column :width="50" align='center' />
        <a-table-column key="reId" title="序号" data-index="reId" :width="80" align='center' />
        <a-table-column key="processItemName" title="商品名称" data-index="processItemName" :width="250"/>
        <a-table-column key="processItemCode" title="编码" data-index="processItemCode" :width="250"/>
        <a-table-column key="compositionNumber" title="组成数量" data-index="compositionNumber" :width="250"/>
        <a-table-column key="itemUnit" title="单位" data-index="itemUnit" :width="250"/>
        <a-table-column key="type" title="主辅料" data-index="type" :width="250"/>
        <a-table-column key="remark" title="备注" data-index="remark" :width="380"/>
        <a-table-column key="createDate" title="创建时间" data-index="createDate" :width="380"/>
        <a-table-column key="operation" title="操作" fixed='right' data-index="operation" :width="180" align='center' >
          <template slot-scope="text, record">
            <a-button v-if="record.topRowFlag == '1' ? true : false " class="greenfont bluefonthover" type="link" :disabled="!hasPermission('bom_list_edit')" @click="addBomBtn('edit',record.id, record)">编辑</a-button>
            <a-popconfirm v-if="record.topRowFlag == '1' ? true : false " placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('bom_list_delete')" @confirm="deleteProduct(record.id)">
              <a-icon slot="icon" type="question-circle" style="color: red" />
              <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('bom_list_delete')">删除</a-button>
            </a-popconfirm>
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
    <modal-add-product ref="modalAddProductRef"/>
  </div>
</template>

<script>
import { 
  bomGetPageList,
  bomDelete
} from '@/services/bomList.js'
import moment from 'moment';
import modalAddProduct from './modalAddProduct'
export default {
  name: 'bomList',
  components: { modalAddProduct },
  data() {
    return {
      form: {
        createDateStart: null,
        createDateEnd: null,
        processItemName: undefined,
      },
      selectedRowKeys: [],
      dataTable: [],
      bomDetails: [],
      loading: false,
      pageSizeOptions: ['10','20','50','100'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
      copyParams: undefined,
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
        createDateStart: null,
        createDateEnd: null,
        processItemName: undefined,
      }
      this.form = nullParams
    },
    deepClone(obj) {
      let objStorageBox = null;
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
    submitBtn(flag) {
      if (flag == 'select') this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        createDateStart: moment(this.form.createDateStart).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.createDateStart).format("YYYY-MM-DD HH:mm:ss"),
        createDateEnd: moment(this.form.createDateEnd).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.createDateEnd).format("YYYY-MM-DD HH:mm:ss"),
        processItemName: this.form.processItemName?.trim() || '',
      }
      this.loading = true
      if (flag) this.copyParams = this.deepClone(params)
      bomGetPageList(params).then(
        res => {
          if (res.data.code == '200') {
            res.data.data.map(
              (item, i) => {
                item.bomDetails.map(
                  (val, j) => {
                    val.reId = j + 1
                    val.id = item.id + '_' + val.id
                    val.typeCopy = val.type
                    val.type = val.type == '0' ? '主料' : val.type == '1' ? '辅料' : '包材'
                    val.processItemName = val.itemName
                    val.processItemCode = val.itemCode
                  }
                )
                item.reId = res.data.totalNum - i - (res.data.currentPage - 1)*res.data.pageSize
                item.topRowFlag = '1'
                item.children = item.bomDetails
              }
            )
            this.dataTable = res.data.data
            this.pagination.total = res.data.totalNum
            this.loading = false
          } else {
            this.loading = false
            this.$message.warn('查询失败!')
          }
        }
      ).catch(() => {this.loading = false})
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
            createDateStart: moment(this.form.createDateStart).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.createDateStart).format("YYYY-MM-DD HH:mm:ss"),
            createDateEnd: moment(this.form.createDateEnd).format("YYYY-MM-DD") == "Invalid date" ? '' : moment(this.form.createDateEnd).format("YYYY-MM-DD HH:mm:ss"),
            processItemName: this.form.processItemName?.trim() || '',
          }
        )
      }
      bomGetPageList(this.copyParams).then(
        res => {
          if (res.data.code == '200') {
            res.data.data.map(
              (item, i) => {
                item.bomDetails.map(
                  (val, j) => {
                    val.reId = j + 1
                    val.id = item.id + '_' + val.id
                    val.typeCopy = val.type
                    val.type = val.type == '0' ? '主料' : val.type == '1' ? '辅料' : '包材'
                    val.processItemName = val.itemName
                    val.processItemCode = val.itemCode
                  }
                )
                item.reId = res.data.totalNum - i - (res.data.currentPage - 1)*res.data.pageSize
                item.topRowFlag = '1'
                item.children = item.bomDetails
              }
            )
            this.dataTable = res.data.data
            this.bomDetails = this.dataTable.map((item,i) => {
              this.bomDetails[i] = item.bomDetails
            })
            this.pagination.total = res.data.totalNum
            this.loading = false
          } else {
            this.loading = false
            this.$message.warn('查询失败!')
          }
        }
      ).catch(() => {this.loading = false})
    },
    deleteProduct(id) {
      bomDelete({id: id}).then(
        res => {
          if (res.data.code == '200') {
            this.submitPagination()
            this.$message.success('删除成功')
          } else {
            this.$message.warn('删除失败')
          }
        }
      )
    },
    addBomBtn(flag, id ,allMsg) {
      this.$refs.modalAddProductRef.openModal(flag, id ,allMsg)
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
    this.submitPagination()
  },
}
</script>

<style lang="less">
  @import './index';
</style>