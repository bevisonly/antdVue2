<template>
  <a-modal class="modalTop" title="评分详情" :dialogStyle="{'top': '30px'}" :maskClosable="flag == 'details'? true : false" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="fontColor">
        <span class="titleStyle">评分对象：</span>
        <span>{{ allMsg.companyName }}</span>
      </div>
      <div class="tableContainer">
        <div class="pTittle">
          评分细则
        </div>
        <div class="redfont heightLine">合计: {{ allMsg.totalScore }}</div>
        <a-table
          size="middle"
          :scroll="{ x: 307.778, y: tableData.length < 20 ? 0 : 1300 }"
          :data-source="tableData" rowKey="id"
          :pagination='tableData.length > 19 ? {showTotal: ()=>`共 ${tableData.length} 条`,showSizeChanger: true,showQuickJumper: tableData.length > 1000} : false'
        >
          <a-table-column title="字段名称" data-index="fieldName" :width="80"/>
          <a-table-column title="权重" data-index="weights" :width="220"/>
          <a-table-column title="字段值" data-index="fieldValue" :width="160"/>
          <a-table-column title="得分" data-index="score" :width="140"/>
          <a-table-column title="加权得分" data-index="weightedScore" :width="140"/>
        </a-table>
      </div>
      <div class="flex-ed">
        <a-button @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { details } from '@/services/scoreCard/scoreResult'
export default {
  name: "modalDetails",
  data() {
    return {
      visibleLModal: false,
      allMsg: {},
      flag: 'details',
      tableData: [],
      total: 100,
    }
  },
  methods: {
    details(id) {
      this.tableData = []
      details({id: id}).then(res => {
        if (res.data.code == 200) {
          this.allMsg = res.data.data
          this.tableData = res.data.data?.scoreResultDetailList
          this.visibleLModal = true
        } else {
          this.$message.error("查看详情失败")
        }
      }).catch(() => this.$message.error("查看详情失败"))
    },
    openModal(id) {
      this.details(id)
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
    .fontColor {
      color: #000;
      .titleStyle {
        font-size: 18px;
        padding-left: 16px;
      }
    }
    .pTittle {
      margin-bottom: 0;
      height: 30px;
      line-height: 30px;
      color: #000;
      font-size: 18px;
      border-bottom: 1px solid #000;
    }
    .heightLine {
      height: 40px;
      line-height: 40px;
    }
    .tableContainer {
      margin: 10px 0;
    }
    .bottomMargin {
      margin-left: 10px;
    }
  }
}
</style>