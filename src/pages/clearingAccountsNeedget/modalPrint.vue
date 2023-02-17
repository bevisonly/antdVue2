<template>
  <a-modal class="modalTop" :width='1200' title="打印" :dialogStyle="{'top': '30px'}" :maskClosable='false' v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="printBody" id="mustPrint">
        <div class="printMainBody" v-for="(item, i) in arInvoiceList" :key="i">
          <div class="divBorder">
            <p class="pTittle">基础信息</p>
            <a-row class="rowMarginTop">
              <a-col :span="6">
                <span class="marginLeft">发票类型：</span>
                <div class="divLeft commonDivStyle">{{ item.invoiceTypeName }}</div>
              </a-col>
              <a-col :span="6">
                <span>电话号码：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.phone }}</div>
              </a-col>
              <a-col :span="6">
                <span>发票限额：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.invoiceMaxTypeName }}</div>
              </a-col>
              <a-col :span="6">
                <span>开户银行：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.depositBank }}</div>
              </a-col>
            </a-row>
            <a-row class="rowMarginTop">
              <a-col :span="6">
                <span class="marginLeft">发票名称：</span>
                <div class="divLeft commonDivStyle">{{ item.invoiceName }}</div>
              </a-col>
              <a-col :span="6">
                <span>开票金额：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.invoiceAmount }}</div>
              </a-col>
              <a-col :span="6">
                <span>开票日期：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.invoiceDate }}</div>
              </a-col>
              <a-col :span="6">
                <span>发票号：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.invoiceNo }}</div>
              </a-col>
            </a-row>
            <a-row class="rowMarginTop">
              <a-col :span="6">
                <span class="marginLeft">税号：</span>
                <div class="divLeft commonDivStyle">{{ item.taxNo }}</div>
              </a-col>
              <a-col :span="6">
                <span>凭证号：</span>
                <div class="divCommonStyle commonDivStyle">{{ item.evidenceNo }}</div>
              </a-col>
              <a-col :span="12">
                <span>单位地址：</span>
                <div class="divAddress commonDivStyle">{{ item.partnerAddress }}</div>
              </a-col>
            </a-row>
            <a-row class="rowMarginTop">
              <a-col :span="24">
                <span class="marginLeft">发票信息：</span>
                <div class="divLeftBottom commonDivStyle">{{ item.invoiceMessage }}</div>
              </a-col>
            </a-row>
          </div>
          <div class="tableContainer">
            <p class="pTittle ">开票商品信息</p>
            <a-table bordered :columns="detailsColumns" :data-source="item.arInvoiceDetails" rowKey="id" :pagination='false'>
              <span slot="vat" slot-scope="text,record">
                {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                {{ record.vat+'%' }}
              </span>
              <template tips='商品名称' slot="itemName" slot-scope="text, record">
                <div class="minWidthName">{{record.itemName}}</div>
              </template>
              <template tips='客户' slot="customerName" slot-scope="text, record">
                <div class="minWidth">{{record.customerName}}</div>
              </template>
              <template tips='门店名称' slot="storeName" slot-scope="text, record">
                <div class="minWidthName">{{record.storeName}}</div>
              </template>
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
import { batchPrint } from '@/services/settlement/receive/clearingAccountsNeedget'
const detailsColumns = [
  {title: '销售单号', dataIndex: 'soCode'},
  {title: '商品名称', dataIndex: 'itemName', scopedSlots: {customRender: "itemName"}},
  {title: '商品编码', dataIndex: 'itemCode'},
  {title: '客户', dataIndex: 'customerName', scopedSlots: {customRender: "customerName"}},
  {title: '门店名称', dataIndex: 'storeName', scopedSlots: {customRender: "storeName"}},
  {title: '数量', dataIndex: 'qty'},
  {title: '单位', dataIndex: 'unit'},
  {title: '计价单位', dataIndex: 'priceUnit'},
  {title: '单价', dataIndex: 'signPrice'},
  {title: '单据金额', dataIndex: 'signAmount'},
  {title: '扣点金额', dataIndex: 'deductionAmount'},
  {title: '应收金额', dataIndex: 'receivableAmount'},
  {title: '税额', dataIndex: 'taxAmount'},
  {title: '不含税金额', dataIndex: 'includingTaxAmount'},
  {title: '增值税', dataIndex: 'vat',scopedSlots:{costomRender:'vat'}}
]
export default {
  name: "modalPrint",
  data() {
    return {
      visibleLModal: false,
      arInvoiceList: [],
      detailsColumns,
    }
  },
  methods: {
    batchPrint(ids) {
      batchPrint({ids: ids.join(',')}).then(res => {
        if (res.data.code == 200 && res.data.data?.arInvoiceList.length) {
          this.arInvoiceList = res.data.data?.arInvoiceList || []
          this.visibleLModal = true
        } else if (!res.data.data?.arInvoiceList.length) {
          this.$message.error('要打印的表格没有数据')
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    openModal(ids) {
      this.arInvoiceList = []
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
            .commonDivStyle {
              min-height: 30px;
              line-height: 2;
              text-indent: 14px;
              border: 1px solid #bdbdbd;
              border-radius: 4px;
            }
            .divLeft {
              width: 80%;
              margin-left: 20px;
            }
            .divLeftBottom {
              width: 45%;
              margin-left: 20px;
            }
            .divCommonStyle {
              width: 87%;
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
          .minWidth {
            min-width: 100px;
          }
          .minWidthName {
            min-width: 56px;
          }
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
  /deep/.ant-table-thead > tr > th {
    color: #000;
  }
  /deep/.ant-table {
    font-family: Microsoft YaHei;
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
          .commonDivStyle {
            min-height: 30px;
            line-height: 2;
            text-indent: 14px;
            border: 1px solid #bdbdbd;
            border-radius: 4px;
            outline: none;
          }
          .divLeft {
            width: 80%;
            margin-left: 20px;
          }
          .divLeftBottom {
            width: 45%;
            margin-left: 20px;
          }
          .divCommonStyle {
            width: 87%;
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
        .minWidth {
          min-width: 100px;
        }
        .minWidthName {
          min-width: 56px;
        }
      }
    }
  }
}
</style>