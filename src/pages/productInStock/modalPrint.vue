<template>
  <a-modal
    class="modalTop"
    :width="1200"
    :title="flag == 'supplyOrder' ? '打印供货单' : '打印入库单'"
    :dialogStyle="{ top: '30px' }"
    v-model="visibleLModal"
    :footer="null"
  >
    <div class="modalContainer">
      <div class="printMainBody" id="printMainBody">
        <div class="marginPadding" style="margin: 0; padding: 0" v-for="(supplierData, i) in printTableDate" :key="i" >
          <h2 class="h2Style">{{flag == "supplyOrder" ? supplierData.opName : supplierData.opName}}</h2>
          <h5 class="h2Style fontWeight">{{ flag == "supplyOrder" ? "供货单" : "入库单" }}</h5>
          <a-row class="rowA">
            <a-col :span="7">
              <span class="spanStyle spanLeft">采购单号：</span><span class="greyfont">{{ supplierData.purchaseIds }}</span>
            </a-col>
            <a-col :span="7">
              <span class="spanStyle">{{flag == "supplyOrder" ? "客户：" : "供应商："}}</span><span class="greyfont">{{ supplierData.supplierName }}</span>
            </a-col>
            <a-col :span="7">
              <span class="spanStyle">电话：</span><span class="greyfont">{{ supplierData.mobile }}</span>
            </a-col>
            <a-col :span="3">
              <span class="spanStyle">{{flag == "supplyOrder" ? "收货时间：" : "入库时间："}}</span><span class="greyfont">{{ supplierData.deliveryTime }}</span>
            </a-col>
          </a-row>
          <a-table bordered ref="tableRef" :data-source="supplierData.goodsList" rowKey="id" :pagination="false" >
            <a-table-column title="商品编码" v-if="flag == 'supplyOrder'" data-index="itemCode" :width="110" />
            <a-table-column title="商品名称" data-index="itemName" :width="110" />
            <a-table-column title="规格" data-index="spec" :width="74" />
            <a-table-column title="数量" data-index="qty" :width="80" />
            <a-table-column title="单价" data-index="poPrice" :width="60" />
            <a-table-column title="计价单位" data-index="priceUnit" :width="67" />
            <a-table-column title="商品金额" data-index="amount" :width="80" />
            <a-table-column title="增值税" data-index="taxRate" :width="160" >
              <span slot-scope="text,record">
              {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
              {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
              {{ record.taxRate+'%' }}
              </span>
            </a-table-column>
            <a-table-column title="不含税金额" data-index="afterTaxAmount" :width="100" />
            <a-table-column title="费用成本分摊" data-index="goDutch" :width="80" />
            <a-table-column :title="flag=='supplyOrder'?'总金额':'总成本'" data-index="orderAmount" :width="80" />
            <a-table-column title="备注" data-index="remark" :width="100" />
            <template slot="footer">
              <a-row v-if="flag == 'supplyOrder'">
                <a-col :span="7">
                  <span class="spanStyle">领取总数量：</span><span class="greyfont">{{ supplierData.totalQty }}</span>
                </a-col>
                <a-col :span="11">
                  <span class="spanStyle">总金额(大写)：</span><span class="greyfont">{{supplierData.amountChinese}}</span>
                </a-col>
                <a-col :span="6">
                  <span class="spanStyle">总金额：</span><span class="greyfont">{{ supplierData.totalAmount }}</span>
                </a-col>
              </a-row>
              <a-row v-else>
                <a-col :span="4">
                  <span class="spanStyle">领取总数量：</span><span class="greyfont">{{ supplierData.totalQty }}</span>
                </a-col>
                <a-col :span="5">
                  <span class="spanStyle">商品总金额(大写)：</span><span class="greyfont">{{supplierData.amountChinese}}</span>
                </a-col>
                <a-col :span="7">
                  <span class="spanStyle">总成本金额(大写)：</span><span class="greyfont">{{supplierData.afterTaxAmountChinese}}</span>
                </a-col>
                <a-col :span="4">
                  <span class="spanStyle">商品总金额：</span><span class="greyfont">{{ supplierData.totalAmount }}</span>
                </a-col>
                <a-col :span="4">
                  <span class="spanStyle">总成本金额：</span><span class="greyfont">{{supplierData.totalAfterTaxAmount}}</span>
                </a-col>
              </a-row>
            </template>
          </a-table>
          <h5 class="h2Style fontWeight" v-if="supplierData.feeList && supplierData.feeList[0]">费用明细</h5>
          <a-table bordered ref="tableRef" :data-source="supplierData.feeList" rowKey="id" :pagination="false" v-if="supplierData.feeList && supplierData.feeList[0]">
            <a-table-column title="费用类型" data-index="feeType">
              <span slot-scope="text">{{text == 1 ? '国内' : text == 2 ? '国际' : '其他'}}</span>
            </a-table-column>
            <a-table-column title="费用项" data-index="feeName" />
            <a-table-column title="收款主体" data-index="receivingSubjectName" />
            <a-table-column title="费用金额" data-index="feeAmount" />
            <a-table-column title="增值税" data-index="rate" >
              <span slot-scope="text,record">
              {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
              {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':record.invoiceType==4?'进口增值税 -':record.invoiceType==5?'进口关税 -':''}}{{record.invoiceType==3?'抵扣率':[1,2,4,5].includes(record.invoiceType)?'税率':''}}
              {{ record.rate+'%' }}
              </span>
            </a-table-column>
            <a-table-column title="不含税金额" data-index="priceExcludingTax" />
            <a-table-column title="币种" data-index="currency" />
            <a-table-column title="汇率" data-index="exchangeRate" />
            <a-table-column title="外币金额" data-index="foreignCurrencyAmount" />
            <a-table-column title="人民币金额" data-index="currencyAmount" />
            <a-table-column title="清关单号" data-index="poCode" />
            <a-table-column title="备注" data-index="remark" />
          </a-table>
          <a-row v-if="flag == 'supplyOrder'" class="rowB">
            <a-col :span="7">
              <span class="spanStyle spanLeft">收货单位及经手人：</span>
            </a-col>
            <a-col :span="7">
              <span class="spanStyle">发货单位及经手人：</span>
            </a-col>
            <a-col :span="7">
              <span class="spanStyle">审核人：</span>
            </a-col>
            <a-col :span="3">
              <span class="spanStyle">制单：</span>
            </a-col>
          </a-row>
          <a-row v-else class="rowB">
            <a-col :span="2" />
            <a-col :span="8">
              <span class="spanStyle">发货单位：</span>
            </a-col>
            <a-col :span="8">
              <span class="spanStyle">收货单位：</span>
            </a-col>
            <a-col :span="6">
              <span class="spanStyle">制单：</span>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="flex-ed marginTop">
        <a-button type="primary" icon="printer" v-print="'#printMainBody'">打印</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  printSupplierOrder,
  printInStockOrder,
} from "@/services/enterSaleStore/store/productInStock.js";
export default {
  name: "modalPrint",
  data() {
    return {
      visibleLModal: false,
      printTableDate: [],
      flag: "supplyOrder",
    };
  },
  methods: {
    getPrintMsg(id) {
      if (this.flag == "supplyOrder") {
        printSupplierOrder({ ids: id }).then((res) => {
          if (res.data.code == 200 && res.data.data?.length) {
            this.printTableDate = res.data.data;
            this.visibleLModal = true;
          } else if (res.data.code == 200) {
            this.$message.error("获取到的表格数据为空");
          } else {
            this.$message.error(res.data.message);
          }
        })
        return
      }
      printInStockOrder({ ids: id }).then((res) => {
        if (res.data.code == 200 && res.data.data?.length) {
          this.printTableDate = res.data.data;
          this.visibleLModal = true;
        } else if (res.data.code == 200) {
          this.$message.error("获取到的表格数据为空");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    openModal(flag, allMsg) {
      this.flag = flag;
      this.getPrintMsg(allMsg.join(","));
    },
    cancelModalBtn() {
      this.visibleLModal = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/commonless";
.modalTop {
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
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
    .marginPadding {
      margin: 0;
      padding: 0;
    }
    .h2Style {
      margin-bottom: 0;
      text-align: center;
      font-weight: 800;
      font-size: 30px;
    }
    .fontWeight {
      font-size: 20px;
    }
    .rowA {
      margin-bottom: 4px;
    }
    .rowB {
      margin: 15px 0;
    }
    .spanStyle {
      color: black;
      font-weight: 600;
    }
    .spanLeft {
      padding-left: 15px;
    }
    .marginTop {
      margin-top: 15px;
    }
  }
}
</style>
<style lang="less" scoped>
@import "../../assets/css/commonless";
@media print {
  .ant-modal-body {
    padding: 0;
    margin: 0;
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
  .marginPadding {
    margin: 0;
    padding: 0;
    page-break-after: always;
  }
  .h2Style {
    margin-bottom: 0;
    text-align: center;
    font-weight: 800;
    font-size: 30px;
  }
  .fontWeight {
    font-size: 20px;
  }
  .rowA {
    margin-bottom: 4px;
  }
  .rowB {
    margin: 15px 0;
  }
  .spanStyle {
    color: black;
    font-weight: 600;
  }
  .spanLeft {
    padding-left: 15px;
  }
  .marginTop {
    margin-top: 15px;
  }
}
</style>