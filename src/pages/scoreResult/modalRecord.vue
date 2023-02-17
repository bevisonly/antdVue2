<template>
  <a-modal class="modalTop" title="轨迹" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :maskClosable="false" :footer="null">
    <div class="modalContainer">
      <div class="flex-ct contentBox">
        <a-timeline>
          <a-timeline-item v-for="(item, i) in recordData" :key="i">
            <span class="commonStyle">{{ item.createDate }}</span>
            <span class="commonStyle marginStyle">{{ item.totalScore }}</span>
            <span class="cursorDef commonStyle blueCursor" @click="detailsBtn(item.id)">评分详情</span>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div class="flex-ed">
        <a-pagination
          size="small"
          v-model="pagination.page"
          :total="pagination.total"
          :pageSize="pagination.size"
          :show-total="t => `共 ${t} 条`"
          :show-quick-jumper="pagination.total >= 300 ? true : false"
          @showSizeChange="paginationSize"
          @change="paginationPage"
        />
        <a-button @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { searchTrack as search } from '@/services/scoreCard/scoreResult'
export default {
  name: "modalRecord",
  data() {
    return {
      visibleLModal: false,
      allMsg: false,
      recordData: [],
      modelId: undefined,
      partnerId: undefined,
      pagination: {total: 0, page: 1, size: 10}
    }
  },
  methods: {
    search(modelId, partnerId) {
      search({page:1, rows: 10, modelId, partnerId}).then(res => {
        this.pagination.total = res.data.total
        this.recordData = res.data.rows
        this.visibleLModal = true
      })
    },
    detailsBtn(id) {
      this.visibleLModal = false
      this.$parent.detailsBtn(id)
    },
    submitPagination() {
      let params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        modelId: this.modelId,
        partnerId: this.partnerId,
      }
      search(params).then(res => {
        this.pagination.total = res.data.total
        this.recordData = res.data.rows
      })
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
    },
    openRecordModal(modelId, partnerId) {
      this.pagination.page = 0
      this.pagination.size = 10
      this.modelId = modelId
      this.partnerId = partnerId
      this.search(modelId, partnerId)
    },
    closeModalBtn() { this.visibleLModal = false },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/.ant-modal{
    width: 32% !important;
    min-width: 700px !important;
    max-width: 1000px !important;
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
    .contentBox {
      margin-top: 40px;
      .ant-timeline {
        width: 80%;
        max-height: 800px;
        overflow: auto;
      }
      .commonStyle {
        font-size: 18px;
        color: #000;
      }
      .marginStyle {
        margin: 0 60px;
      }
      .blueCursor {
        color: blue;
        cursor: pointer;
      }
    }
    .bottomMargin {
      margin-left: 10px;
    }
  }
}
</style>