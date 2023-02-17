<template>
  <div class="mainTop">
    <div class="queryInfo">
      <a-form-model>
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input-search style="width: 100%;" placeholder="输入搜索内容" v-model.trim="form.keyword" @search="onSearch"></a-input-search>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <a-table
        class="tableStyle"
        :columns="columns"
        ref="tableRef"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ y: dataTable.length < 50 && pagination.size < 50 ? 0 : 1300 }"
        :pagination='false'
      >
        <span slot="operation" slot-scope="text, record">
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('signableEnterprise_edit')" @click="editBtn('add', record.id)">合同签订</a-button>
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('signableEnterprise_list')" @click="listBtn(record.id)">合同列表</a-button>
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
          :show-quick-jumper="pagination.total >= 500 ? true : false"
          @showSizeChange="paginationSize"
          @change="paginationPage"
        />
      </div>
    </div>
    <modal-edit ref="modalEditRef"/>
    <modal-list ref="modelListRef"/>
  </div>
</template>

<script>
import modalEdit from './modalEdit'
import modalList from './modalList'
import { search } from "@/services/resourceCenter/contractMa/signableEnterprise"
const columns = [
  {title: "序号",dataIndex: "indexAsc", width: 100},
  {title: "合作商ID",dataIndex: "companyCode"},
  {title: "合作商名称",dataIndex: "companyName"},
  {title: "合同数量",dataIndex: "contractAmount"},
  {title: "操作",dataIndex: "operation", width: 200, align: 'center', scopedSlots: { customRender: "operation" }},
]
export default {
  name: 'signableEnterprise',
  components: { modalEdit, modalList },
  data() {
    return {
      columns,
      form: {},
      dataTable: [],
      loading: false,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    editBtn(flag, id) { this.$refs.modalEditRef.openEditModal(flag, id) },
    listBtn(id) { this.$refs.modelListRef.openModal(id) },
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
        this.pagination.total = res.data.total
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
    this.submitPagination()
  },
}
</script>

<style lang="less" scoped>
  @import './index';
</style>