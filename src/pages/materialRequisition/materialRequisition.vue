<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">
        <a-button-group>
          <a-button :type="primary === 'wait' ? 'primary' : ''" size="small" @click="changeMode('wait')">待领料单</a-button>
          <a-button :type="primary === 'done' ? 'primary' : ''" size="small" @click="changeMode('done')">已领料单</a-button>
        </a-button-group>
      </p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-date-picker placeholder="领料开始时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.startTime" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
              至
              <a-date-picker placeholder="领料结束时间" format="YYYY-MM-DD HH:mm:ss" v-model="form.endTime" show-time>
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入商品名称" v-model.trim="form.piItemName"></a-input>
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
        <span>
          <a-button class="btnMarginRight" type="primary" :loading="loadingBtn" :disabled="!hasPermission('material_requisition_export')" @click="downloadBtn">导出</a-button>
          <a-button v-if="primary === 'wait' ? true : false" type="primary" :disabled="!hasPermission('material_requisition_add')" @click="newAdd">新增</a-button>
        </span>
      </div>
      <div class="tableOverflow">
        <a-table
          ref="tableRef"
          :data-source="dataTable"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :loading='loading'
          rowKey="id"
          :pagination='false'
        >
          <a-table-column title="领料批号" data-index="pickingNo" :width="180"/>
          <a-table-column title="分拣单号" data-index="sortingprocessingNumber" :width="180"/>
          <a-table-column title="领料数量" data-index="pickingNum" :width="100"/>
          <a-table-column title="领料人员" data-index="pickingUserName" :width="100"/>
          <a-table-column title="来源" data-index="resource" :width="110">
            <template slot-scope="text, record">
              <span>{{record.resource == '1' ? '领料单新增' : record.resource == '2' ? '分拣新增' : '待加工生成'}}</span>
            </template>
          </a-table-column>
          <a-table-column title="备注" data-index="remark" :width="104"/>
          <a-table-column title="创建时间" data-index="createDate" :width="166"/>
          <a-table-column title="操作" data-index="operation" :width="primary === 'wait' ? 344 : 240" align='center' >
            <template slot-scope="text, record">
              <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('material_requisition_print')" @click="printBtn(record)">打印</a-button>
              <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('material_requisition_details')" @click="detailsBtn('details',record)">详细</a-button>
              <a-button v-if="primary === 'wait' ? true : false" class="greenfont bluefonthover" type="link" icon='check-circle' :disabled="!hasPermission('material_requisition_confirm')" @click="pickerOkBtn('pickerOk',record)">确认领料</a-button>
              <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('material_requisition_edit')" @click="editBtn('edit', record)">编辑</a-button>
              <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('material_requisition_delete')" @confirm="deleteItem(record.id)">
                <a-button v-if="primary === 'wait' ? true : false" class="greenfont redfonthover" type="link" :disabled="!hasPermission('material_requisition_delete')" >删除</a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
          <a-table
            bordered
            slot="expandedRowRender"
            slot-scope="record"
            :data-source="record.unfinishedProList"
            :pagination="false"
            size="small"
            rowKey="piItemId"
          >
            <a-table-column title="领料商品" data-index="piItemName" :width="60"/>
            <a-table-column title="申请领料数" data-index="pickingNum" :width="60"/>
            <a-table-column title="单位" data-index="unit" :width="60"/>
            <a-table-column title="当前库存" data-index="stockNum" :width="60"/>
            <a-table-column title="领料仓库" data-index="piStockName" :width="60"/>
          </a-table>
        </a-table>
      </div>
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
    <modal-print ref="modalPrintRef"/>
    <modal-new-add ref="modalNewAddRef"/>
  </div>
</template>

<script>
import {
  pickingHeadFindList,
  pickingHeadExportList,
  pickingHeadDelete,
} from '@/services/materialRequisition.js'
import moment from 'moment';
import modalPrint from './modalPrint'
import modalNewAdd from './modalNewAdd'
export default {
  name: 'materialRequisition',
  components: { modalPrint, modalNewAdd},
  data() {
    return {
      form: {
        startTime: undefined,
        endTime: undefined,
        state: '1',
        piItemName: undefined,
      },
      copyParams: undefined,
      selectedRowKeys: [],
      primary: 'wait',
      dataTable: [],
      loading: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
      loadingBtn: false
    }
  },
  methods: {
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() == moment(today).format("DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
    changeMode(flag) {
      this.primary = flag
      this.form.state = flag == 'wait' ? '1' : '2'
      this.submitBtn()
    },
    resetBtn() {
      let nullParams = {
        startTime: undefined,
        endTime: undefined,
        state: this.form.state,
        piItemName: undefined,
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
      const params = {
        currentPage: this.pagination.page,
        pageSize: this.pagination.size,
        queryParam: {
          startTime: this.form.startTime == undefined || moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss"),
          endTime: this.form.endTime == undefined || moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss"),
          piItemName: this.form.piItemName,
          state: this.form.state,
        }
      }
      if (flag == 'search') {
        this.pagination.page = 1
        params.pageSize = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      pickingHeadFindList(params).then(
        res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.totalNum
            this.dataTable = res.data.data
          } else {
            this.loading = false
            this.$message.error(res.data.message)
          }
        }
      ).catch(() => {this.loading = false})
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.currentPage = this.pagination.page
        this.copyParams.pageSize = this.pagination.size
        this.copyParams.queryParam.state = this.form.state
      } else {
        this.copyParams = this.deepClone(
          {
            currentPage: this.pagination.page,
            pageSize: this.pagination.size,
            queryParam: {
              startTime: this.form.startTime == undefined || moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss"),
              endTime: this.form.endTime == undefined || moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss"),
              piItemName: this.form.piItemName,
              state: this.form.state,
            }
          }
        )
      }
      this.loading = true
      pickingHeadFindList(this.copyParams).then(
        res => {
          if (res.data.code == '200') {
            this.loading = false
            this.pagination.total = res.data.totalNum
            this.dataTable = res.data.data
          } else {
            this.loading = false
            this.$message.error(res.data.message)
          }
        }
      ).catch(() => {this.loading = false})
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
      this.loadingBtn = true
      pickingHeadExportList({ids: this.selectedRowKeys}).then(
        res => {
          if (res.data.type == 'application/vnd.ms-excel' || res.data.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '领料单导出'
            this.getErrExcel(res.data, name)
            this.loadingBtn = false
          } else {
            this.loadingBtn = false
            this.$message.warn('下载失败')
          }
        }
      ).catch(() => {
        this.loadingBtn = false
        this.$message.warn('下载失败')
      })
    },
    deleteItem(id) {
      pickingHeadDelete({id: id}).then(
        res => {
          if (res.data.code == 200) {
            this.submitPagination()
            this.$message.success(res.data.message)
          } else {
            this.$message.warn(res.data.message)
          }
        }
      )
    },
    printBtn(allMsg) { this.$refs.modalPrintRef.openModal(allMsg) },
    newAdd() { this.$refs.modalNewAddRef.openModal('add') },
    detailsBtn(flag, allMsg) { this.$refs.modalNewAddRef.openModal(flag, allMsg) },
    editBtn(flag, allMsg) { this.$refs.modalNewAddRef.openModal(flag, allMsg) },
    pickerOkBtn(flag, allMsg) { this.$refs.modalNewAddRef.openModal(flag, allMsg) },
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
  activated() { this.submitPagination() },
}
</script>

<style lang="less">
  @import './index';
</style>