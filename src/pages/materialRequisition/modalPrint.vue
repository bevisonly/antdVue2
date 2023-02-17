<template>
  <a-modal class="modalTop" :width='1200' title="打印领料单" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="printMainBody" id="printMainBody">
        <h2 class="h2Style">领料单</h2>
        <a-row class="rowA">
          <a-col :span="18">
            <span class="spanStyle">NO：</span><span class="greyfont">{{allMsg.pickingNo}}</span>
          </a-col>
          <a-col :span="6">
            <span class="spanStyle">领料时间：</span><span class="greyfont">{{allMsg.pickDate}}</span>
          </a-col>
        </a-row>
        <a-table bordered ref="tableRef" :data-source="supplierData" rowKey="id" :pagination='false'>
          <a-table-column title="领料商品编码" data-index="piItemNo" :width="110"/>
          <a-table-column title="领料商品名称" data-index="piItemName" :width="110"/>
          <a-table-column title="领料仓库" data-index="piStockName" :width="110"/>
          <a-table-column title="规格" data-index="piItemSpec" :width="80"/>
          <a-table-column title="领取数量" data-index="pickingNum" :width="80"/>
          <a-table-column title="单价" data-index="piItemPrice" :width="60"/>
          <a-table-column title="单位" data-index="unit" :width="57"/>
          <a-table-column title="金额" data-index="piItemTotal" :width="74"/>
          <a-table-column title="备注" data-index="remark" :width="80"/>
          <template slot="footer" slot-scope="currentPageData">
            <a-row>
              <a-col :span="6">
                <span class="spanStyle">领取总数量：</span>
                <span class="greyfont">
                  {{ currentPageData.reduce((t, c) => { return (+t + +c.pickingNum).toFixed(8)*100000000/100000000 || undefined }, 0) }}
                </span>
              </a-col>
              <a-col :span="10">
                <span class="spanStyle">总金额：</span>
                <span class="greyfont">{{allMsg.piItemTotal}}</span>
              </a-col>
              <a-col :span="8">
                <span class="spanStyle">总金额：</span>
                <span class="greyfont">
                  {{ currentPageData.reduce((t, c) => { return (+t + +c.piItemTotal).toFixed(8)*100000000/100000000 || undefined }, 0) }}
                </span>
              </a-col>
            </a-row>
          </template>
        </a-table>
        <a-row class="rowB">
          <a-col :span="2" />
          <a-col :span="8">
            <span class="spanStyle">领料人：</span><span class="greyfont">{{allMsg.pickingUserName}}</span>
          </a-col>
          <a-col :span="8">
            <span class="spanStyle">审核人：</span><span class="greyfont">{{allMsg.pickingMakeUserName}}</span>
          </a-col>
          <a-col :span="6">
            <span class="spanStyle">制单：</span><span class="greyfont">{{allMsg.createUser}}</span>
          </a-col>
        </a-row>
      </div>
      <div class="flex-ed">
        <a-button type="primary" icon="printer" v-print="'#printMainBody'">打印</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "modalPrint",
  data() {
    return {
      visibleLModal: false,
      allMsg: {pickingNo: undefined},
      supplierData: [],
      moneyReverse: undefined,
      money: '8000'
    }
  },
  methods: {
    openModal(allMsg) {
      this.allMsg = allMsg
      this.supplierData = allMsg.unfinishedProList
      this.visibleLModal = true;
    },
    cancelModalBtn() {
      this.visibleLModal = false;
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
    padding-bottom: 15px;
  }
  /deep/.ant-table-thead > tr > th {
    padding: 10px 4px;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 10px 4px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .h2Style {
      font-weight: 800;
      font-size: 30px;
      text-align: center;
    }
    .rowA{
      margin-bottom: 4px;
    }
    .rowB{
      margin: 15px 0;
    }
    .spanStyle{
      color: black;
      font-weight: 600;
    }
  }
}
</style>
<style lang="less" scoped>
@media print {
  .ant-modal-body {
    margin: 0;padding: 0;
  }
  .ant-modal-content {
    box-shadow: none;
  }
  /deep/.ant-table {
    font-family: Microsoft YaHei;
    color: #000;
  }
  /deep/.ant-table-thead > tr > th {
    padding: 10px 4px;
    color: #000;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 10px 4px;
  }
}
</style>