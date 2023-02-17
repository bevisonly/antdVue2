<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入工人名称" v-model="form.workerName"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select v-model="form.workerState">
                <a-select-option value=""> 全部 </a-select-option>
                <a-select-option value="0"> 启用 </a-select-option>
                <a-select-option value="1"> 禁用 </a-select-option>
              </a-select>
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
        <a-button type="primary" :disabled="!hasPermission('worker_manager_insert')" @click="addWorkerBtn('add')">新增</a-button>
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
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        <a-table-column key="id" title="序号" data-index="id" :width="160" align='center' />
        <a-table-column key="workerName" title="工人名称" data-index="workerName" :width="250"/>
        <a-table-column key="workerState" title="状态" data-index="workerState" :width="250">
          <template slot-scope="text, record">
            <span :class="record.workerState == 1 ? '' : 'greenfont'">{{record.workerState == 1 ? '禁用' : '启用'}}</span>
          </template>
        </a-table-column>
        <a-table-column key="createDate" title="创建时间" data-index="createDate" :width="380"/>
        <a-table-column key="createUser" title="创建人" data-index="createUser" :width="380"/>
        <a-table-column key="operation" title="操作" fixed='right' data-index="operation" :width="240" align='center' >
          <template slot-scope="text, record">
            <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('worker_manager_onOff')" @click="noUseBtn(record.id, record.workerState)">启禁</a-button>
            <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('worker_manager_edit')" @click="addWorkerBtn('edit',record.id, record)">编辑</a-button>
            <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('worker_manager_delete')" @confirm="deleteWorker(record.id)">
              <a-icon slot="icon" type="question-circle" style="color: red" />
              <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('worker_manager_delete')">删除</a-button>
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
    <modal-add-worker ref="modalAddWorkerRef"/>
  </div>
</template>

<script>
import {
  workerGetPageList,
  workerActivate,
  workerDisable,
  workerDelete
} from '@/services/workerManager.js'
import modalAddWorker from './modalAddWorker'
export default {
  name: 'workerManager',
  components: { modalAddWorker },
  data() {
    return {
      form: {
        workerName: undefined,
        workerState: ''
      },
      productMaterial: undefined,
      selectedRowKeys: [],
      dataTable: [],
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
    resetBtn() {
      let nullParams = {
        workerName: undefined,
        workerState: ''
      }
      this.form = nullParams
      this.productMaterial = undefined
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
      if (flag == 'select') {
        this.pagination.page = 1
      }
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        workerName: this.form.workerName ? this.form.workerName.trim() : this.form.workerName,
        workerState: this.form.workerState
      }
      this.loading = true
      if (flag) {
        this.copyParams = this.deepClone(params)
      }
      workerGetPageList(params).then(
        res => {
          if (res.data.code == '200') {
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
            workerName: this.form.workerName ? this.form.workerName.trim() : this.form.workerName,
            workerState: this.form.workerState
          }
        )
      }
      workerGetPageList(this.copyParams).then(
        res => {
          if (res.data.code == '200') {
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
    noUseBtn(id, workerState) {
      if (workerState == 1) {
        workerActivate({id: id}).then(
          res => {
            if (res.data.code == '200') {
              this.submitPagination()
              this.$message.success('启用成功')
            } else {
              this.$message.warn('启用失败')
            }
          }
        )
      } else {
        workerDisable({id: id}).then(
          res => {
            if (res.data.code == '200') {
              this.submitPagination()
              this.$message.success('禁用成功')
            } else {
              this.$message.warn('禁用失败')
            }
          }
        )
      }
    },
    deleteWorker(id) {
      workerDelete({id: id}).then(
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
    addWorkerBtn(flag, id ,allMsg) {
      this.$refs.modalAddWorkerRef.openModal(flag, id ,allMsg)
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