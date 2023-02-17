<template>
  <div class="mainTop">
    <div class="queryInfo">
      <a-form-model>
        <a-row>
          <a-col :span="24" class="flex-sb">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input-search style="width: 100%;" placeholder="输入搜索内容" v-model.trim="form.operateEntityName" @search="onSearch"></a-input-search>
            </a-form-model-item>
            <a-form-model-item class="marginRight">
              <a-button class="btnWidth" :disabled="!hasPermission('businessEntity_add')" @click="editBtn('add')">新增</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <a-table
        bordered
        size="middle"
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
          <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('businessEntity_edit')" @click="editBtn('edit', record)">编辑</a-button>
          <a-popconfirm placement="bottom" title="确定要删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('signableEnterprise_list')" @confirm="delBtn(record.id)">
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('businessEntity_delete')">删除</a-button>
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
          :show-quick-jumper="pagination.total >= 500 ? true : false"
          @showSizeChange="paginationSize"
          @change="paginationPage"
        />
      </div>
    </div>
    <modal-add ref="modalAddRef"/>
  </div>
</template>

<script>
import modalAdd from './modalAdd'
import { search, del } from "@/services/stage/businessEntity"
const columns = [
  {title: "序号",dataIndex: "indexAsc", align: "center", width: 80},
  {title: "经营主体名称",dataIndex: "operateEntityName", align: "center",},
  {title: "编码",dataIndex: "coding", align: "center",},
  {title: "修改时间",dataIndex: "updateDate", align: "center",},
  {title: "操作",dataIndex: "operation", width: 200, align: 'center', scopedSlots: { customRender: "operation" }},
]
export default {
  name: 'businessEntity',
  components: { modalAdd },
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
    editBtn(flag, id) { this.$refs.modalAddRef.openAddModal(flag, id) },
    delBtn(id) {
      del({id}).then(res => {
        if (res.data.code == 200) {
          this.submitPagination()
          this.$message.success("删除成功")
        } else {
          this.$message.error(res.data.message, 3)
        }
      }).catch(() => this.$message.error("删除失败"))
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

<style lang="less">
  @import './index';
</style>