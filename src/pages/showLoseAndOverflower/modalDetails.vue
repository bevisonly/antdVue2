<template>
  <a-modal :width='1200' class="modalTop" title="报损报溢详情" :dialogStyle="{'top': '30px'}" v-model="visibleLO" :footer="null">
    <div class="modalFinalTop">
      <p class="baseInfo">基本信息</p>
      <div class="baseInfoToOption">
        <span><span>仓库：</span></span>
        <span class="marginRightPlusTimes showInfo">{{baseInfo.warehouse}}</span>
        <span>
          <span><span>单据类型：</span></span>
          <span class="showInfo">{{baseInfo.loType == 2 ? '手工报溢' : '手工报损'}}</span>
        </span>
      </div>
    </div>
    <div class="tableContainer">
      <p class="tipsInfo">损益商品</p>
      <a-table
        bordered
        :data-source="data"
        :columns="baseInfo.loType == 1 ? commonTable : commonTableOver"
        rowKey="id"
        :pagination="false"
      >
      <template tips="报损报溢金额" slot="loPrice" slot-scope="text, record">
        <span>{{typeis(record.loPrice, 'number') ? record.loPrice : '0'}}</span>
      </template>
      </a-table>
      <div class="flex-ed confrimButton">
        <a-button type="primary" @click="cancelModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {  lossOverflowGetLossOverflowInfo } from '../../services/showLoseAndOverflower'
const commonTable = [
  {title: '商品名称', align: 'center', dataIndex: 'proName', width: 120},
  {title: '商品类型', align: 'center', dataIndex: 'proType', width: 120},
  {title: '系统库存', align: 'center', dataIndex: 'invNum', width: 120},
  {title: '实际数量', align: 'center', dataIndex: 'num', width: 120},
  {title: '损益数量', align: 'center', dataIndex: 'subNum', scopedSlots: { customRender: 'subNum' }, width: 80},
  {title: '成本单价', align: 'center', dataIndex: 'price', width: 120},
  {title: '报损报溢金额', align: 'center', dataIndex: 'loPrice', width: 120},
  {title: '备注', align: 'center', dataIndex: 'remark', width: 200},
]
const commonTableOver = [
  {title: '商品名称', align: 'center', dataIndex: 'proName', width: 120},
  {title: '商品类型', align: 'center', dataIndex: 'proType', width: 120},
  {title: '实际数量', align: 'center', dataIndex: 'num', width: 120},
  {title: '成本单价', align: 'center', dataIndex: 'price', width: 120},
  {title: '报损报溢金额', align: 'center', dataIndex: 'loPrice', width: 120},
  {title: '备注', align: 'center', dataIndex: 'remark', width: 200},
]
export default {
  name: "modalNewLoseAndOverflowerNew",
  data() {
    return {
      visibleLO: false,
      commonTable,
      commonTableOver,
      baseInfo: {
        warehouse: '',
        loType: ''
      },
      data: [],
    }
  },
  methods: {
    getDetailsInfo(id) {
      lossOverflowGetLossOverflowInfo({id}).then(val => {
        if (val.data.code == 200) {
          this.baseInfo.warehouse = val.data.data.wareHouseName
          this.baseInfo.loType = val.data.data.loType
          val.data.data.subList.map(val => {
            val.loPrice = this.typeis(val.loPrice, 'number') ? val.loPrice : ''
            val.subNum = this.typeis(val.num - val.invNum, 'number') ? this.formatPrice(val.num - val.invNum) : ''
          })
          this.data = val.data.data.subList
        } else {
          this.data = []
          this.$message.error(val.data.message)
        }
      })
    },
    openModal(id, flag) {
      this.baseInfo.loType = flag
      this.getDetailsInfo(id)
      this.visibleLO = true;
    },
    cancelModalBtn() {
      this.visibleLO = false;
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
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      .marginRight{
        margin-right: 4px;
      }
      .marginRightPlusTimes{
        margin-right: 16px;
      }
      .showInfo{
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
  }
}
</style>