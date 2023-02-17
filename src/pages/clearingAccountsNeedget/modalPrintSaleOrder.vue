<template>
  <a-modal class="modalTop" :width='1280' title="打印" :dialogStyle="{'top': '30px'}" :maskClosable='false' v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="printBody" id="mustPrint">
        <div class="printMainBody">
          <div class="pTittle">销售对账结算单</div>
          <a-row class="rowMarginTop">
            <a-col :span="12" class="paddingLeft"><span>卖方名称：{{ allMsg.opName }}</span></a-col>
            <a-col :span="12" class="paddingLeft"><span>对账日期：{{ allMsg.createDate }}</span></a-col>
          </a-row>
          <a-row class="rowMarginTop">
            <a-col :span="12" class="paddingLeft"><span>买方名称：{{ allMsg.customerName }}</span></a-col>
            <a-col :span="12" class="paddingLeft"><span>合同编号：</span></a-col>
          </a-row>
          <a-row class="rowMarginTop">
            <a-col :span="12" class="paddingLeft"><span>收款开户行：{{ allMsg.depositBank }}</span></a-col>
            <a-col :span="12" class="paddingLeft"><span>收款银行账号：{{ allMsg.bankAccount}}</span></a-col>
          </a-row>
          <a-row class="rowMarginTop">
            <a-col :span="12" class="paddingLeft"><span>付款方式：
              {{
                allMsg.paymentType == 1 ? "微信对私" :
                allMsg.paymentType == 2 ? "现金" :
                allMsg.paymentType == 3 ? "私对公转账" :
                allMsg.paymentType == 4 ? "支付宝" :
                allMsg.paymentType == 5 ? "公对公转账" : ""
              }}
            </span></a-col>
            <a-col :span="12" class="paddingLeft"><span>结算单位：人民币</span></a-col>
          </a-row>
          <a-row class="tableRowStyle">
            <a-col :span="24">
              <a-table bordered size="small" :columns="leftColumns" :data-source="leftTable" rowKey="id" :pagination='false'>
                <span slot="noDate" slot-scope="text">{{text || "/"}}</span>
                <span slot="noAmount" slot-scope="text">{{text || "0.00"}}</span>
                <span slot="issueState" slot-scope="text, record">{{ record.issueState == 1 ? "是" : "否"}}</span>
                <template tips='合计' slot="footer" slot-scope="currentPageData">
                  <span class="paddingLeft">合计：开票金额：</span>
                  &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => { return (+t + +(c.includingTaxAmount || 0)).toFixed(8)*100000000/100000000 || undefined }, 0) }}</span>&gt;
                  <span class="paddingLeft">本次付款金额：</span>
                  &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => { return (+t + +(c.receivableAmount || 0)).toFixed(8)*100000000/100000000 || undefined }, 0) }}</span>&gt;
                </template>
              </a-table>
            </a-col>
          </a-row>
          <a-row class="bottomStyle">
            <a-col :span="12" class="paddingLeft"><span>本次付款金额人民币(大写)：{{ allMsg.thisReceivableAmountSumStr }}</span></a-col>
            <a-col :span="12" class="paddingLeft"><span>本次付款金额合计：{{ allMsg.thisReceivableAmountSum }}</span></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"></a-col>
            <a-col :span="12" class="paddingLeftHeight rowHeight"><p>买方经办人：</p></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"></a-col>
            <a-col :span="12" class="paddingLeftHeight rowHeightBottom"><p>买方盖章：</p></a-col>
          </a-row>
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
import { saleOrderPrint } from '@/services/settlement/receive/clearingAccountsNeedget'
const leftColumns = [
  {title: '序号', dataIndex: 'liId'},
  {title: '货物/服务名称', dataIndex: 'itemName'},
  {title: '单位', dataIndex: 'priceUnit'},
  {title: '数量', dataIndex: 'qty'},
  {title: '品种', dataIndex: 'itemType'},
  {title: '品牌', dataIndex: 'itemBrand'},
  {title: '规格 ', dataIndex: 'spec'},
  {title: '单价/箱', dataIndex: 'signPrice'},
  {title: '开票金额(含税)', dataIndex: 'includingTaxAmount'},
  {title: '是否开票', dataIndex: 'issueState', scopedSlots: {customRender: "issueState"}},
  {title: '已预付情况', children: [
    {title: '日期', dataIndex: 'noDate', scopedSlots: {customRender: "noDate"}},
    {title: '预付金额', dataIndex: 'noAmount', scopedSlots: {customRender: "noAmount"}}
  ]},
  {title: '本次付款金额', dataIndex: 'receivableAmount'},
  {title: '备注', dataIndex: 'remark'},
]
export default {
  name: "modalPrint",
  data() {
    return {
      visibleLModal: false,
      leftColumns,
      allMsg: {},
      leftTable: [],
      rightTable: [],
    }
  },
  methods: {
    saleOrderPrint(id) {
      saleOrderPrint({ids: id}).then(res => {
        if (res.data.code == 200) {
          res.data.data[0].opName = res.data.data[0]?.partner?.partnerOpRef?.opName
          res.data.data[0].bankAccount = res.data.data[0]?.partner?.bankAccount
          this.allMsg = res.data.data[0]
          res.data.data[0]?.arInvoiceDetails.forEach((item, i) => (item.liId = ++i, item.issueState = res.data.data[0]?.issueState))
          this.leftTable = res.data.data[0]?.arInvoiceDetails
          this.visibleLModal = true
        }
      })
    },
    openModal(id) {
      this.saleOrderPrint(id)
    },
    closeBtn() { this.visibleLModal = false },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  cursor: default;
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    color: black;
    cursor: default;
    .printBody {
      margin: 0;padding: 0;
      .printMainBody {
        .pTittle {
          text-align: center;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .rowMarginTop {
          height: 34px;line-height: 34px;
          border-bottom: 0;
          .paddingLeft {
            padding-left: 16px;
          }
        }
        .bottomStyle {
          height: 34px;line-height: 34px;
          border-top: 0;
          .paddingLeft {
            padding-left: 16px;
          }
        }
        .paddingLeftHeight {
          padding-left: 16px;
        }
        .rowHeight {
          height: 60px; line-height: 60px;
        }
        .rowHeightBottom {
          padding-bottom: 30px;
        }
        .tableRowStyle {
          border: 1px solid #f0f0f0;
          border-bottom: 0;
          .paddingLeft {
            padding-left: 8px;
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
  @borderColor: 1px solid #000;
  /deep/.ant-table-small {
    border: @borderColor;
    border-radius: 0;
  }
  /deep/.ant-table-small.ant-table-bordered .ant-table-content {
    border: 0;
  }
  /deep/.ant-table-bordered .ant-table-thead > tr > th {
    border-bottom: @borderColor;
  }
  /deep/.ant-table-thead > tr > th {
    border-right: @borderColor;
  }
  /deep/.ant-table-bordered .ant-table-tbody > tr > td:not(:last-child) {
    border-right: @borderColor;
  }
  /deep/.ant-table-small.ant-table-bordered .ant-table-footer {
    border-top: @borderColor;
  }
  /deep/.ant-table-small > .ant-table-content > .ant-table-body {
    margin: 0;
  }
  /deep/.ant-table-thead > tr > th {
    color: #000;
  }
  /deep/.ant-table {
    font-family: Microsoft YaHei;
    color: #000;
  }
  .ant-modal-body {
    margin: 0; padding: 0;
  }
  .ant-modal-content {
    box-shadow: none;
  }
  .printBody {
    margin: 0;padding: 0;
    cursor: default;
    .printMainBody {
      margin: 0;padding: 0;
      page-break-after: always;
      .pTittle {
        text-align: center;
        font-size: 24px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>