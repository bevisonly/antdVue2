<template>
  <a-modal class="modalTop" :width='1200' title="打印退货单" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="printMainBody" id="printMainBody">
        <h2 class="h2Style">{{ allMsg.supplierName }}</h2>
        <h5 class="h2Style fontWeight">退货库单</h5>
        <a-row class="rowA">
          <a-col :span="7">
            <span class="spanStyle spanLeft">采购单号：</span><span class="greyfont">{{ allMsg.poCode }}</span>
          </a-col>
          <a-col :span="7">
            <span class="spanStyle">供应商：</span><span class="greyfont">{{ allMsg.supplierName }}</span>
          </a-col>
          <a-col :span="7">
            <span class="spanStyle">电话：</span><span class="greyfont">{{ allMsg.supplierPhone }}</span>
          </a-col>
          <a-col :span="3">
            <span class="spanStyle">退货日期：</span><span class="greyfont">{{ createDate }}</span>
          </a-col>
        </a-row>
        <a-table bordered ref="tableRef" :data-source="dataTable" rowKey="id" :pagination='false'>
          <a-table-column title="商品编码" data-index="itemCode" :width="110"/>
          <a-table-column title="商品名称" data-index="itemName" :width="110"/>
          <a-table-column title="规格" data-index="itemSpec" :width="74"/>
          <a-table-column title="数量" data-index="returnQty" :width="80"/>
          <a-table-column title="单价" data-index="poPrice" :width="60"/>
          <a-table-column title="计价单位" data-index="unit" :width="67"/>
          <a-table-column title="金额" data-index="returnAmount" :width="80"/>
          <a-table-column title="备注" data-index="remark" :width="100"/>
          <template slot="footer">
            <a-row>
              <a-col :span="7">
                <span class="spanStyle">总数量：</span>
                <span class="greyfont">{{ allMsg.returnQty }}</span>
              </a-col>
              <a-col :span="11">
                <span class="spanStyle">总金额：</span>
                <span class="greyfont">{{ allMsg.returnAmountChinese }}</span>
              </a-col>
              <a-col :span="6">
                <span class="spanStyle">总金额：</span>
                <span class="greyfont">{{ allMsg.returnAmount }}</span>
              </a-col>
            </a-row>
          </template>
        </a-table>
        <a-row class="rowB">
          <a-col :span="7">
            <span class="spanStyle spanLeft">客户签字：</span>
          </a-col>
          <a-col :span="7">
            <span class="spanStyle">发货人：</span>
          </a-col>
          <a-col :span="7">
            <span class="spanStyle">审核人：</span>
          </a-col>
          <a-col :span="3">
            <span class="spanStyle">制单：</span>
          </a-col>
        </a-row>
      </div>
      <div class="flex-ed marginTop">
        <a-button type="primary" icon="printer" v-print="'#printMainBody'">打印</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment';
import { printFile } from '@/services/transport/signed/returnSupplierCommdity'
export default {
  name: "modalPrint",
  data() {
    return {
      visibleLModal: false,
      ids: '',
      allMsg: {},
      createDate: undefined,
      dataTable: [],
    }
  },
  methods: {
    printFile(soId, imItemId) {
      printFile({soId: soId, imItemId: imItemId}).then(res => {
        if (res.data.code == "200") {
          this.dataTable = res.data.data
        } else {
          this.$message.warn('获取打印的表格数据失败')
        }
      }).catch(() => this.$message.warn('获取打印的表格数据失败'))
    },
    openModal(allMsg) {
      this.allMsg = allMsg
      this.createDate = moment(allMsg.createDate || "").format("YY") == "Invalid date" ? "" : moment(allMsg.createDate).format("YYYY-MM-DD")
      this.printFile(allMsg.soId, allMsg.imItemId)
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
    padding-bottom: 10px;
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
      margin-bottom: 0;
      text-align: center;
      font-weight: 800;
      font-size: 30px;
    }
    .fontWeight {
      font-size: 20px;
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
    .spanLeft {
      padding-left: 15px
    }
    .marginTop {
      margin-top: 15px;
    }
  }
}
</style>
<style lang="less" scoped>
@media print {
  /deep/.ant-table {
    font-family: Microsoft YaHei;
    color: #000;
  }
  /deep/.ant-table-thead > tr > th {
    color: #000;
  }
  .ant-modal-body {
    padding: 0;
    margin: 0;
  }
  .ant-modal-content {
    box-shadow: none;
  }
  /deep/.ant-table-thead > tr > th {
    padding: 10px 4px;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 10px 4px;
  }
}
</style>