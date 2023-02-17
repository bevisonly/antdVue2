<template>
  <a-modal class="modalTop" :width="1200" title="打印" :dialogStyle="{'top': '30px'}" :maskClosable='false' v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="printBody" id="mustPrint">
        <div class="printMainBody" v-for="(item, i) in printList" :key="i">
          <div class="divBorder">
            <p class="pTittle">基础信息</p>
            <a-row class="rowMarginTop">
              <a-col :span="12">
                <span class="marginLeft fontStyle">供应商名称：</span><span>{{ item.supplierName }}</span>
              </a-col>
              <a-col :span="12">
                <span class="fontStyle">供应商联系手机：</span><span>{{ item.supplierPhone }}</span>
              </a-col>
            </a-row>
          </div>
          <div class="tableContainer">
            <p class="pTittle ">收货单商品列表</p>
            <a-table bordered :columns="detailsColumns" :data-source="item.details" rowKey="id" :pagination='false'></a-table>
          </div>
          <div class="tableContainer" v-if="item.purchaseFeeList && item.purchaseFeeList[0]">
            <p class="pTittle ">费用项列表</p>
            <a-table bordered :columns="feeColumns" :data-source="item.purchaseFeeList" rowKey="id" :pagination='false'>
              <span slot="feeType" slot-scope="text">{{text == 1 ? '国内' : text == 2 ? '国际' : '其他'}}</span>
            </a-table>
          </div>
        </div>
      </div>
      <div class="flex-ed">
        <a-button class="closeBtn" type="primary" @click="closeBtn">关闭</a-button>
        <a-button type="primary" v-print="'#mustPrint'">打印</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { batchPrint } from '@/services/pickUpOrder/receivedList'
const detailsColumns = [
  {title: '商品名称', dataIndex: 'itemName'},
  {title: '商品编码', dataIndex: 'itemCode'},
  {title: '客户名称', dataIndex: 'customerName'},
  {title: '门店名称', dataIndex: 'storeName'},
  {title: '规格', dataIndex: 'itemSpec'},
  {title: '实际采购单价(元)', dataIndex: 'poPrice'},
  {title: '采购件数', dataIndex: 'poQty'},
  {title: '数量单位', dataIndex: 'unit'},
  {title: '计价单位', dataIndex: 'priceUnit'},
  {title: '收货数量', dataIndex: 'deliveryQty'},
  {title: '包装费用(元)', dataIndex: 'packingCost'},
  {title: '商品金额', dataIndex: 'poTotalAmount'},
  {title: '实际采购总额', dataIndex: 'puTotalAmount'}
]
const feeColumns = [
  {title: "费用类型", dataIndex: "feeType", scopedSlots: { customRender: "feeType" }},
  {title: "费用项", dataIndex: "feeName"},
  {title: "收款主体", dataIndex: "receivingSubjectName"},
  {title: "清关单号", dataIndex: "customsClearanceFeeNumber"},
  {title: "费用金额",dataIndex: "feeAmount"},
  {title: "税率(%)", dataIndex: "rate",},
  {title: "不含税金额", dataIndex: "priceExcludingTax",},
  {title: "币种", dataIndex: "currency",},
  {title: "汇率", dataIndex: "exchangeRate",},
  {title: "外币金额", dataIndex: "foreignCurrencyAmount",},
  {title: "人民币金额", dataIndex: "currencyAmount",},
  {title: "备注", dataIndex: "remark"},
];
export default {
  name: "modalPrint",
  data() {
    return {
      visibleLModal: false,
      printList: [],
      detailsColumns,
      feeColumns,
    }
  },
  methods: {
    batchPrint(ids) {
      batchPrint({ids: ids.join(',')}).then(res => {
        if (res.data.code == 200) {
          this.printList = res.data.data || []
          this.visibleLModal = true
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    openModal(ids) {
      this.printList = []
      this.$parent.selectedRowKeys = []
      this.batchPrint(ids)
    },
    closeBtn() {
      this.visibleLModal = false
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  cursor: default;
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
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
    .printBody {
      margin: 0;padding: 0;
      .printMainBody {
        margin: 0;padding: 0;
        .pTittle {
          margin-bottom: 0;
          padding-left: 15px;
          height: 30px;
          line-height: 30px;
          border-bottom: 0;
          background-color: @common-bgc;
        }
        .divBorder {
          margin-top: 10px;
          .rowMarginTop {
            margin: 5px 0;
            .marginLeft {
              margin-left: 20px;
            }
            .fontStyle {
              font-size: 16px;
              color: black;
            }
            .divLeftBottom {
              width: 45%;
              margin-left: 20px;
            }
            .divAddress {
              width: 93.5%;
            }
          }
        }
        .tableContainer {
          margin: 10px 0;
        }
      }
    }
    .closeBtn {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../assets/css/commonless';
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
  .printBody {
    margin: 0;padding: 0;
    .printMainBody {
      margin: 0;padding: 0;
      page-break-after: always;
      .pTittle {
        margin-bottom: 0;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
        border-bottom: 0;
        background-color: @common-bgc;
      }
      .divBorder {
        margin-top: 10px;
        .rowMarginTop {
          margin: 5px 0;
          .marginLeft {
            margin-left: 20px;
          }
          .fontStyle {
            font-size: 16px;
            color: black;
          }
          .divLeftBottom {
            width: 45%;
            margin-left: 20px;
          }
          .divAddress {
            width: 93.5%;
          }
        }
      }
      /deep/.ant-table-thead > tr > th {
        padding: 10px 4px;
      }
      /deep/.ant-table-tbody > tr > td {
        padding: 10px 4px;
      }
      .tableContainer {
        margin: 10px 0;
      }
    }
  }
}
</style>