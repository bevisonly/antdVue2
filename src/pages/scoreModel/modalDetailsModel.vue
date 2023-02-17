<template>
  <a-modal class="modalTop" title="评分详情" :dialogStyle="{'top': '30px'}" :maskClosable="false" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="queryInfo">
        <a-form-model>
          <a-row>
            <a-col :span="24">
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-input-search style="width: 100%;" placeholder="请输入合作商编码/名称" v-model.trim="form.keyword" @search="submitBtn('search')"></a-input-search>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="tableInfo">
        <a-table
          class="tableStyle"
          bordered
          :columns="scoreColumns"
          ref="tableRef"
          :data-source="dataTable"
          :loading='loading'
          rowKey="id"
          :scroll="{ x: 307.778 , y: dataTable.length < 50 && pagination.size < 50 ? 0 : 1300 }"
          :pagination='false'
        >
          <span slot="operation" slot-scope="text, record">
            <a-button class="cursorDef bluefont" type="link" @click="recordBtn(record.modelId, record.partnerId)">评分记录</a-button>
            <a-button class="cursorDef bluefont" type="link" @click="detailsBtn(record.id)">当前详情</a-button>
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
      <div class="flex-ed heightTop">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
      </div>
    <modal-details ref="modalDetailsRef"/>
    <modal-record ref="modalRecordRef"/>
    </div>
  </a-modal>
</template>

<script>
import { search } from '@/services/scoreCard/scoreResult'
import modalDetails from './modalDetails'
import modalRecord from './modalRecord'
const scoreColumns = [
  {title: "序号",dataIndex: "indexAsc", width: 70},
  {title: "合作商编码",dataIndex: "companyCode"},
  {title: "供应商名称",dataIndex: "companyName"},
  {title: "分值",dataIndex: "totalScore"},
  {title: "评分时间",dataIndex: "createDate"},
  {title: "操作",dataIndex: "operation", width: 200, scopedSlots: { customRender: "operation" }},
]
export default {
  name: "modalDetailsModel",
  components: { modalDetails, modalRecord },
  data() {
    return {
      visibleLModal: false,
      modelId: undefined,
      scoreColumns,
      form: {
        modelName: undefined
      },
      copyParams: {},
      loading: false,
      dataTable: [],
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    openModal(id) {
      this.modelId = id
      this.submitBtn("search")
      this.visibleLModal = true
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        modelId: this.modelId,
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
          modelId: this.modelId,
          ...this.form,
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
    detailsBtn(id) {
      this.$refs.modalDetailsRef.openModal(id)
    },
    recordBtn(id, companyType) { this.$refs.modalRecordRef.openRecordModal(id, companyType, this.detailsBtn) },
    paginationPage(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
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
    .queryInfo {
      margin-bottom: 10px;
      .queryInfoP{
        margin: 0;
        padding-left: 15px;
        height: 40px;
        line-height: 40px;
        border-bottom: @border-color;
        background-color: @common-bgc;
        letter-spacing: 1px;
        font-size: 14px;
        font-weight: 800;
      }
      .formItemStyle {
        float: left;
        margin-left: 15px;
      }
      .formItemStylewidth {
        width: 28%;
        min-width: 200px;
        max-width: 310px;
      }
      .ant-row .ant-form-item {
        margin-bottom: 0;
      }
    }
    .tableInfo{
      .a-btn{ 
        width: 50px;
      }
      .tableStyle {
        cursor: default;
        /deep/.ant-btn-link{
          margin: 0;padding: 0px 12px;
        }
        /deep/.ant-btn > .anticon + span {
          margin-left: 0;
        }
        .ant-table-footer .ant-divider {
          margin-left: 5px;
          background-color: #7a7a7a;
        }
        .columnStyle {
          border-radius: 4px;
        }
        .columnStyleRed {
          background-color: #ff5050;
          color: white;
        }
        .columnStyleBlue {
          background-color: #6e7dff;
          color: white;
        }
      }
      .bottomTitle{
        height: 40px;
        margin-bottom: 2px;
        padding-left: 15px;
        line-height: 40px;
        border-bottom: @border-color;
        background-color: @common-bgc;
        letter-spacing: 1px;
        font-size: 14px;
        font-weight: 800;
      }
    }
    .heightTop {
      margin-top: 10px;
    }
    .bottomMargin {
      margin-left: 10px;
    }
    .paginationContainer{
      margin: 0;padding: 10px 8px 10px 0;
    }
  }
}
</style>