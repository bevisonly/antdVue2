<template>
  <a-modal :width='1200' class="modalTop" title="库存盘点详情" :dialogStyle="{'top': '30px'}" v-model="visibleDetails" :footer="null">
    <div class="modalFinalTop">
      <p class="baseInfo">基本信息</p>
      <div class="baseInfoToOption">
        <span>仓库：</span><span class="showMsg marginRight">{{warehouse}}</span>
      </div>
    </div>
    <div class="tableContainer">
      <p class="tipsInfo">损益商品</p>
      <a-table
        bordered
        ref="tableRef"
        :columns="commonTable"
        :data-source="data"
        rowKey="id"
        :pagination="false"
      >
        <template slot="invDeference" slot-scope="text, record">
          <span>{{ Number.isNaN(record.sysNum - record.invNum) ? '' : record.sysNum - record.invNum == 0 ? '0' : record.invNum - record.sysNum }}</span>
        </template>
      </a-table>
      <div class="flex-ed confrimButton">
        <div class="buttonBox">
          <a-button type="primary" @click="cancelModalBtn">关闭</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  inventoryStockGetInventoryStockInfo,
} from '../../services/inventoryCheck.js'
const commonTable = [
  {title: '商品名称', align: 'center', dataIndex: 'proName', scopedSlots: { customRender: 'proName' }, width: 120},
  {title: '单位', align: 'center', dataIndex: 'unit', scopedSlots: { customRender: 'unit' }, width: 120,},
  {title: '商品类型', align: 'center', dataIndex: 'proType', scopedSlots: { customRender: 'proType' }, width: 120,},
  {title: '系统数量', align: 'center', dataIndex: 'sysNum', scopedSlots: { customRender: 'sysNum' }, width: 120,},
  {title: '实际库存', align: 'center', dataIndex: 'invNum', scopedSlots: { customRender: 'invNum' }, width: 104,},
  {title: '盘库差异', align: 'center', dataIndex: 'invDeference', scopedSlots: { customRender: 'invDeference' }, width: 100,},
  {title: '备注', align: 'center', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 240,},
]
export default {
  name: "modalDetails",
  data() {
    return {
      visibleDetails: false,
      commonTable,
      warehouse: '',
      data: [],
    }
  },
  methods: {
    inventoryStockGetInventoryStockInfo(id) {
      const params = { id : id }
      inventoryStockGetInventoryStockInfo(params).then(
        val => {
          if (val.data.code == 200) {
            this.warehouse = val.data.data.wareHouseName
            this.data = val.data.data.inventoryStockSubList
          } else {
            this.data = []
            this.$message.warn(val.data.message)
          }
        }
      )
    },
    openModal(id) {
      this.inventoryStockGetInventoryStockInfo(id)
      this.visibleDetails = true;
    },
    cancelModalBtn() {
      this.visibleDetails = false;
    }
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
  .modalFinalTop{
    margin-bottom: 10px;
    border: @border-color;
    .baseInfo{
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
    .baseInfoToOption{
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      .marginRight{
        margin-right: 16px;
      }
      .showMsg{
        background-color: #f7f7f7;
      }
    }
  }
  .tableContainer{
    border: @border-color;
    background-color: #fff;
    .tipsInfo{
      margin: 0;padding-left: 15px;
      height: 40px;
      line-height: 40px;
      background-color: @common-bgc;
      letter-spacing: 1px;
      font-size: 14px;
      font-weight: 800;
    }
  }
  .confrimButton{
    margin: 8px 8px 8px;
    .buttonBox{
      .buttonCancle{
        margin-right: 10px;
      }
    }
  }
}
</style>