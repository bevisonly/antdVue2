<template>
  <div class="mainTop">
    <div class="queryInfo">
      <a-form-model>
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input-search style="width: 100%;" placeholder="请输入模型id/模型名称" v-model.trim="form.keyword" @search="onSearch"></a-input-search>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.testStatus"
                placeholder="请选择测试状态"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                @select="onSearch"
                @change="statusChange"
                allowClear
              >
                <a-select-option v-for="item in statusOption" :key="item.value">
                  <span>
                    {{ item.name }}
                  </span>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <div class="heightDiv flex-ed">
        <a-button class="endRight" :disabled="!hasPermission('scoreModel_add')" @click="editBtn('add')"> 新增 </a-button>
        <a-button class="endRight" :disabled="!hasPermission('scoreModel_onMore')" @click="swapMoreOff"> 启用 </a-button>
        <a-button class="endRight" :disabled="!hasPermission('scoreModel_offMore')" @click="swapMoreOn"> 停用 </a-button>
        <a-button :disabled="!hasPermission('scoreModel_deleteMore')" @click="cancelMore"> 删除 </a-button>
      </div>
      <a-table
        class="tableStyle"
        :columns="scoreColumns"
        ref="tableRef"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 307.778 , y: dataTable.length < 50 && pagination.size < 50 ? 0 : 1300 }"
        :pagination='false'
      >
        <span slot="status" slot-scope="text, record">
          <span>{{ record.status == 1? "启用中" : "已停用" }}</span>
        </span>
        <span slot="testStatus" slot-scope="text, record">
          <span
            :style="{'color':record.testStatus == '未测试' ? '#1540ff' :
            record.testStatus == '测试不通过' ? '#ff4234':
            record.testStatus == '测试通过' ? '#55c018' :'transparent'}" >
            {{ record.testStatus }}
          </span>
        </span>
        <span slot="operation" slot-scope="text, record">
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_export')" @click="exportDetails(record.id)">导出</a-button>
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_edit')" @click="editBtn(record)">编辑</a-button>
          <a-popconfirm placement="bottom" title="确定启用吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('scoreModel_on')" @confirm="swapBtn(record.id, record.status, record.testStatus)">
            <a-icon slot="icon" type="close" style="color: red" />
            <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_on')">启用</a-button>
          </a-popconfirm>
          <a-popconfirm placement="bottom" title="确定停用吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('scoreModel_off')" @confirm="swapBtn(record.id, record.status)">
            <a-icon slot="icon" type="close" style="color: red" />
            <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_off')">停用</a-button>
          </a-popconfirm>
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_test')" @click="editTest(record)">测试</a-button>
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_details')" @click="detailsBtn(record.id)">评分结果</a-button>
          <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('scoreModel_delete')" @confirm="cancel(record.id, record.status)">
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreModel_delete')">删除</a-button>
          </a-popconfirm>
        </span>
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
    <modal-details-model ref="modalDetailsModelRef"/>
    <modal-edit ref="modalEditRef"/>
    <modal-test ref="modalTestRef"/>
  </div>
</template>

<script>
import modalDetailsModel from './modalDetailsModel'
import modalEdit from './modalEdit'
import modalTest from './modalTest'
import {
  search,
  swapMore,
  cancelMore,
  swap,
  cancel,
  exportDetails
} from '@/services/scoreCard/scoreModel'
const scoreColumns = [
  {title: "序号",dataIndex: "indexAsc", width: 70},
  {title: "模型id",dataIndex: "id"},
  {title: "模型名称",dataIndex: "modelName"},
  {title: "状态",dataIndex: "status",scopedSlots: { customRender: "status" }},
  {title: "测试状态",dataIndex: "testStatus",scopedSlots: { customRender: "testStatus" }},
  {title: "操作",dataIndex: "operation", width: 480, scopedSlots: { customRender: "operation" }},
]
export default {
  name: 'scoreModel',
  components: { modalDetailsModel, modalEdit, modalTest },
  data() {
    return {
      scoreColumns,
      form: {},
      statusOption: [
        {value: "未测试", name: "未测试"},
        {value: "测试不通过", name: "测试不通过"},
        {value: "测试通过", name: "测试通过"}
      ],
      option: {
        modelOption: [],
        modelMaterial: {}
      },
      selectedRowKeys: [],
      dataTable: [],
      loading: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
    clearSelect() { this.selectedRowKeys = [] },
    detailsBtn(id) { this.$refs.modalDetailsModelRef.openModal(id) },
    editBtn(record) { this.$refs.modalEditRef.openModal(record) },
    editTest(record) { this.$refs.modalTestRef.openModal(record) },
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=UTF-8'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    exportDetails(id) {
      this.$message.success("请求下载中", 2)
      exportDetails({id}).then(res => {
        this.$message.success("请求下载完成")
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '评分模型导出'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('导出失败')
        }
      }).catch((e) => {
        this.$message.warn('导出异常'+e, 2)
      })
    },
    swapMoreOn() {
      let status0 = []
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请先选择数据")
        return
      }
      this.selectedRowKeys.forEach(item => this.dataTable.find(val => {
        if (val.id == item && val.status == 1 && val.testStatus != '测试不通过') {
          status0.push(item)
          return !0
        }
      }))
      if (status0.length > 0) {
        swapMore({ids: status0, status: 0}).then(res => {
          if (res.data.code == 200) {
            this.$message.success("成功")
            this.submitPagination()
          } else {
            this.$message.error("失败")
          }
        })
      }
    },
    swapMoreOff() {
      let status1 = []
      let noMean = "noMean"
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请先选择数据")
        return
      }
      this.selectedRowKeys.forEach(item => this.dataTable.find(val => {
        if (val.id == item && (val.testStatus == '测试不通过' || val.testStatus == '未测试')) {
          noMean = undefined
          return !0
        } else if (val.id == item && val.status == 0) {
          status1.push(item)
          return !0
        }
      }))
      if (!noMean) {
        status1 = []
        this.$message.error("模型测试中有未通过/未测试，不允许启用",3)
        return
      }
      if (status1.length > 0) {
        swapMore({ids: status1, status: 1}).then(res => {
          if (res.data.code == 200) {
            this.$message.success("成功")
            this.submitPagination()
          } else {
            this.$message.error("失败")
          }
        })
      }
    },
    cancelMore() {
      let status = []
      let noMean = "noMean"
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请先选择数据")
        return
      }
      this.selectedRowKeys.forEach(item => this.dataTable.find(val => {
        if (val.id == item && val.status == 0) {
          status.push(val.id)
          return !0
        } else if (val.status == 1) {
          noMean = undefined
          return !0
        }
      }))
      if (!noMean) {
        status = []
        this.$message.error("模型正在生效中，不允许删除",3)
        return
      }
      cancelMore(status).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message)
          this.submitPagination(+(this.pagination.page > 1))
        }
      })
    },
    cancel(id, status) {
      if (status == 1) {
        this.$message.error("模型正在生效中，不允许删除",3)
        return
      }
      cancel({id: id}).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message)
          this.submitPagination(+(this.pagination.page > 1 && this.dataTable.length == 1))
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    swapBtn(id,status, flag) {
      if (flag == '测试不通过' || flag == '未测试') {
        this.$message.error("模型测试未通过/未测试，不允许启用",3)
        return
      }
      swap({id, status: flag ? 1 : 0 }).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message)
          this.submitPagination()
        } else {
          this.$message.error(res.data.message)
        }
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
    submitPagination(del) {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page - ~~del
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          ...this.form
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        this.clearSelect()
        this.loading = false
        this.pagination.total = res.data.total
        res.data.rows.forEach((item, i) => item.indexAsc = ++i)
        this.dataTable = res.data.rows
      }).catch(() => this.loading = false)
    },
    onSearch() { this.submitBtn("search") },
    statusChange() {
      if (this.form.testStatus == "全部") {
        search().then(res => {
          this.pagination.total = res.data.total
          this.dataTable = res.data.rows
        })
      }
    },
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        ...this.form
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(res => {
        this.clearSelect()
        this.loading = false
        this.pagination.total = res.data.total
        res.data.rows.forEach((item, i) => item.indexAsc = ++i)
        this.dataTable = res.data.rows
      }).catch(() => this.loading = false)
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

<style lang="less" scoped>
  @import './index';
</style>