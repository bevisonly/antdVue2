<template>
  <a-modal class="modalTop" title="合同列表" :dialogStyle="{'top': '30px'}" :maskClosable="!1" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="tableContainer">
        <a-table
          size="small"
          :columns="columns"
          :scroll="{ x: 307.778, y: tableData.length < 20 ? 0 : 1300 }"
          :data-source="tableData" rowKey="id"
          :pagination='false'
        >
          <span slot="operation" slot-scope="text, record">
            <a-button class="cursorDef bluefont bluefonthover" type="link" @click="editItem(record.id)">编辑</a-button>
            <a-popconfirm placement="bottom" title="确定要删除该合同吗" @confirm="deleteItem(record.id)">
              <a-icon slot="icon" type="delete" style="color: red" />
              <a-button class="cursorDef bluefont bluefonthover" type="link">删除</a-button>
            </a-popconfirm>
          </span>
        </a-table>
        <div class="paginationContainer flex-ed" v-if="tableData.length">
          <a-pagination
            :pageSizeOptions='pageSizeOptions'
            v-model="pagination.page"
            :pageSize="pagination.size"
            :total="pagination.total"
            :show-total="() => `共 ${pagination.total} 条`"
            show-size-changer
            :show-quick-jumper="false"
            @showSizeChange="paginationSize"
            @change="paginationPage"
          />
        </div>
      </div>
      <div class="flex-ed">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { searchContract, del } from "@/services/resourceCenter/contractMa/signableEnterprise"
const columns = [
  {title: "合同编码",dataIndex: "contractNumber"},
  {title: "项目名称",dataIndex: "projectName"},
  {title: "合同标题",dataIndex: "contractTitle"},
  {title: "创建时间",dataIndex: "createDate"},
  {title: "最新修改时间",dataIndex: "updateDate"},
  {title: "操作",dataIndex: "operation", width: 160, align: 'center', scopedSlots: { customRender: "operation" }},
]
export default {
  name: "modalList",
  data() {
    return {
      columns,
      visibleLModal: false,
      allMsg: {},
      flag: 'details',
      id: undefined,
      tableData: [],
      pageSizeOptions: ['10','15','30','50','100'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    details(id, page = 1, rows = 10) {
      searchContract({companyId: id, page, rows}).then(res => {
        this.pagination.total = res.data.total || 0
        this.tableData = res.data.rows || []
        this.visibleLModal = true
      }).catch(() => this.$message.error("获取信息失败"))
    },
    openModal(id) {
      this.pagination.page = 1
      this.pagination.size = 10
      this.id = id
      this.details(id)
    },
    editItem(id) {
      this.visibleLModal = false
      this.$parent.editBtn("edit", id)
    },
    deleteItem(id) {
      del({id}).then(res => {
        if (res.data.code == 200) {
          this.details(this.id)
          this.$parent.submitPagination()
          this.$message.success("删除成功")
        }
      }).catch(() => this.$message.error("删除失败"))
    },
    submitPagination(companyId, page, rows) {
      if (companyId == undefined) return
      searchContract({companyId, page, rows}).then(res => {
        this.pagination.total = res.data.total || 0
        this.tableData = res.data.rows || []
        this.visibleLModal = true
      }).catch(() => this.$message.error("获取信息失败"))
    },
    paginationPage(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination(this.id, currentPage,pageSize)
    },
    paginationSize(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination(this.id, currentPage,pageSize)
    },
    closeModalBtn() { this.visibleLModal = false },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/.ant-modal{
    width: 92% !important;
    min-width: 1300px !important;
    max-width: 2000px !important;
  }
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .tableContainer {
      margin: 10px 0;
    }
    .paginationContainer{
      margin: 0;padding: 10px 0px 0px 0;
      /deep/.ant-select {
        margin: 0;
      }
    }
  }
}
</style>