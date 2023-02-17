<template>
  <div class="mainTop">
    <div class="queryInfo">
      <a-form-model>
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input-search style="width: 100%;" placeholder="请输入合作商编码/对象名称" v-model.trim="form.keyword" @search="onSearch"></a-input-search>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.modelId"
                placeholder="请选择模型名称"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSearch"
                @change="handleOption"
                @select="onSearch"
                @focus="handleSearch('can')"
                allowClear
              >
                <a-select-option v-for="item in option.modelOption" :key="item.id">{{ item.modelName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" placeholder="请选择对象大类" v-model="form.companyType" allowClear @select="onSearch">
                <a-select-option value="20">供应商</a-select-option>
                <a-select-option value="30">客户</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.modelState"
                placeholder="模型状态"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                @change="onSearch"
                allowClear
              >
                <a-select-option v-for="(item, i) in statusModelState" :key="i">
                  <span>
                    {{ item }}
                  </span>
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button type="primary" :disabled="!hasPermission('scoreResult_exportAll')" :loading="loadingAll" @click="exportAll">导出评分结果</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <a-spin :spinning="loadingExcel">
        <a-table
          class="tableStyle"
          :columns="scoreColumns"
          ref="tableRef"
          :data-source="dataTable"
          :loading='loading'
          rowKey="id"
          :scroll="{ x: 307.778 , y: dataTable.length < 50 && pagination.size < 50 ? 0 : 1300 }"
          :pagination='false'
        >
          <span slot="companyType" slot-scope="text">{{text == 20 ? "供应商" : "客户"}}</span>
          <span slot="operation" slot-scope="text, record">
            <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreResult_record')" @click="recordBtn(record.modelId, record.partnerId)">评分记录</a-button>
            <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreResult_details')" @click="detailsBtn(record.id)">当前详情</a-button>
            <a-popconfirm
              title="请选择导出格式"
              ok-text="Excel"
              cancel-text="PDF"
              okType="default"
              @confirm="exportDetails(record.id, 'excel')"
              @cancel="exportDetails(record.id, 'pdf')"
              :disabled="!hasPermission('scoreResult_exportDetails')"
            >
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('scoreResult_exportDetails')">导出详情</a-button>
            </a-popconfirm>
          </span>
        </a-table>
      </a-spin>
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
    <modal-record ref="modalRecordRef"/>
  </div>
</template>

<script>
import modalDetails from './modalDetails'
import modalRecord from './modalRecord'
import {
  search,
  modelNameOption,
  exportAll,
  exportDetails
} from '@/services/scoreCard/scoreResult'
const scoreColumns = [
  {title: "序号",dataIndex: "indexAsc", width: 70},
  {title: "合作商编码",dataIndex: "companyCode"},
  {title: "对象名称",dataIndex: "companyName"},
  {title: "对象大类",dataIndex: "companyType", scopedSlots: { customRender: "companyType" }},
  {title: "评分模型名称",dataIndex: "modelName"},
  {title: "分值",dataIndex: "totalScore"},
  {title: "评分时间",dataIndex: "createDate"},
  {title: "等级",dataIndex: "rating"},
  {title: "建议额度(万元)",dataIndex: "suggestAmount"},
  {title: "操作",dataIndex: "operation", width: 320, scopedSlots: { customRender: "operation" }},
]
export default {
  name: 'scoreResult',
  components: { modalDetails, modalRecord },
  data() {
    return {
      scoreColumns,
      form: {
        modelState: "1"
      },
      loadingAll: !1,
      statusModelState: {
        "0": "已停用",
        "1": "开启中",
        "2": "已删除",
      },
      option: {
        modelOption: [],
        modelMaterial: {}
      },
      dataTable: [],
      loading: !1,
      loadingExcel: !1,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    getExcel(res, name, type='application/vnd.ms-excel;charset=UTF-8') {
      const link = document.createElement('a')
      const blob = new Blob([res], {type})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    exportAll() {
      this.loadingAll = !0
      exportAll({...this.form}).then(res => {
        this.loadingAll = !1
        if (res.status == 200) {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '评分结果导出'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('导出失败')
        }
      }).catch(() => {
        this.loadingAll = !1
        this.$message.warn('导出异常')
      })
    },
    exportDetails(id, type) {
      this.loadingExcel = !0
      const MIME = type == 'excel' ? 'application/vnd.ms-excel;charset=UTF-8' : 'application/pdf'
      exportDetails({id, type}).then(res => {
        this.loadingExcel = !1
        if (res.data.type?.includes("application/json")) {
          let reader = new FileReader();
          let This = this
          reader.addEventListener("loadend", function () {
            let res = JSON.parse(reader.result);
            if (res.code == '200') {
              This.$message.success(res.message, 3)
            } else {
              This.$message.error(res.message, 3)
            }
          });
          reader.readAsText(res.data, 'utf-8');
          return
        }
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*/gm)[0] : '评分结果详情导出'
          this.getExcel(res.data, name, MIME)
        } else {
          this.$message.warn('导出失败')
        }
      }).catch((e) => {
        this.loadingExcel = !1
        this.$message.warn('导出异常'+e, 3)
      })
    },
    handleSearch(v) {
      if (!v || v?.trim() == "") return
      v == "can" && (v = undefined)
      modelNameOption({keyword: v?.trim()}).then(res => res.data.code == '200' && (this.option.modelOption = res.data.data))
    },
    handleOption(v) {
      if (!v) {
        this.option.modelMaterial = {}
        return
      }
      this.form.modelId = v
      this.option.modelMaterial = this.option.modelOption.find(item => item.id == v) || {}
    },
    detailsBtn(id) { this.$refs.modalDetailsRef.openModal(id) },
    recordBtn(id, partnerId) { this.$refs.modalRecordRef.openRecordModal(id, partnerId) },
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
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          ...this.form
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        this.loading = false
        this.pagination.total = res.data.total || 0
        res.data.rows.forEach((item, i) => item.indexAsc = ++i)
        this.dataTable = res.data.rows
      }).catch(() => this.loading = false)
    },
    onSearch() { this.submitBtn("search")},
    submitBtn(flag) {
      this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        ...this.form,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(res => {
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
    this.handleSearch("can")
    this.submitPagination()
  },
}
</script>

<style lang="less" scoped>
  @import './index';
</style>