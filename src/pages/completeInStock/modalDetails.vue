<template>
  <a-modal class="modalTop" :width='1200' title="完工入库详情" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="divBorder">
        <a-row class="rowMarginTop">
          <a-col :span="5"><span class="marginLeft fontWeight">成品入库单：</span><span>{{ headMsg.imItemCode }}</span></a-col>
          <a-col :span="9"><span class="fontWeight textwrap">入库仓库：</span><span :title="headMsg.whName">{{ headMsg.whName }}</span></a-col>
          <a-col :span="5"><span class="fontWeight">创建时间：</span><span>{{ headMsg.createDate }}</span></a-col>
          <a-col :span="5"><span class="fontWeight">入库日期：</span><span>{{ headMsg.completeDate }}</span></a-col>
        </a-row>
      </div>
      <div class="tableContainer">
        <p class="pTittle fontWeight">详情列表</p>
        <a-table bordered :columns="materialsColumns" :data-source="materialsData" rowKey="id" :pagination='false'></a-table>
      </div>
      <div class="flex-ed">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { details } from '@/services/sortingProcessing/completeInStock'
const materialsColumns = [
  {title: '产成品', dataIndex: 'piItemName'},
  {title: '成本单价', dataIndex: 'price'},
  {title: '入库金额', dataIndex: 'inPrice'},
  {title: '需求数量', dataIndex: 'sortingNumber'},
  {title: '单位', dataIndex: 'unit'},
  {title: '分拣人员', dataIndex: 'workerName'}
]
export default {
  name: "modalPrintOutboundOrder",
  data() {
    return {
      visibleLModal: false,
      flag: 'details',
      headMsg: {},
      materialsData: [],
      materialsColumns,
    }
  },
  methods: {
    details(id) {
      details({id: id}).then(res => {
        if (res.data.code == 200) {
          res.data.data?.forEach(item => {
            item.price = (+item.price)?.toFixed(2) * 100 / 100 || ''
            item.inPrice = (+item.inPrice)?.toFixed(2) * 100 / 100 || ''
            item.workerNameArr = []
            item.pickingWorkers?.forEach(val => item.workerNameArr.push(val.workerName))
            item.workerName = item.workerNameArr.join('、')
          })
          this.materialsData = res.data.data
        }
      }).catch(() => this.$message.error("查看完工入库列表详情失败") )
    },
    openModal(record) {
      this.details(record.id)
      this.headMsg.imItemCode = record.imItemCode
      this.headMsg.whName = record.whName
      this.headMsg.createDate = record.createDate
      this.headMsg.completeDate = record.completeDate
      this.visibleLModal = true
    },
    closeModalBtn() {
      this.visibleLModal = false
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/ .ant-modal-header{
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .fontWeight {
      font-weight: 600;
    }
    .circle {
      display: inline-block;
      width: 36px;
      height: 36px;
      line-height: 36px;
      margin-right: 16px;
      text-align: center;
      border: @border-color;
      border-radius: 50%;
    }
    .bgc {
      border: 0;
      font-size: 18px;
      background-color: #009b00;
      color: white;
    }
    .divBorder {
      margin-top: 10px;
      .rowMarginTop {
        margin: 5px 0;
        .marginLeft {
          margin-left: 20px;
        }
      }
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      max-height: 1500px;
      overflow: auto;
      .scrollBar();
      .ant-btn-link{
        margin: 0;padding: 0px 4px;
      }
      /deep/.ant-btn > .anticon + span {
        margin-left: 0;
      }
      .pSelete {
        margin-bottom: 0;
        padding-left: 20px;
        height: 46px;
        line-height: 46px;
        font-weight: 600;
      }
      .pTittle {
        margin-bottom: 0;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
        background-color: @common-bgc;
      }
    }
  }
}
</style>