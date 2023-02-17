<template>
  <a-modal class="modalTop" title="详情" :dialogStyle="{'top': '30px'}" :maskClosable="flag == 'details'? true : false" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="divBorder" v-if="fullScreen">
        <p class="pTittle fontWeight">订单信息</p>
        <div class="paddingLeftRight" v-if="allMsg.poType == 1">
          <a-row class="rowMarginTop" :gutter="14">
            <a-col :span="6" v-for="item in poTypeHome" :key="item[0]">
              <span class="fontWeight">{{item[0]}}：</span>
              <a-input disabled class="widthMargin" v-model="headMsg[item[1]]"></a-input>
            </a-col>
          </a-row>
        </div>
        <div class="paddingLeftRight" v-else>
          <a-row class="rowMarginTop" :gutter="14">
            <a-col :span="6" v-for="item in poTypeAbroad" :key="item[0]">
              <span class="fontWeight">{{item[0]}}：</span>
              <a-input disabled class="widthMargin" v-model="headMsg[item[1]]"></a-input>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="divBorder" v-if="costTableData.length">
        <p class="pTittle fontWeight">费用项列表</p>
        <a-table
          bordered
          :scroll="{ x: 300, y: costTableData.length < 11 ? 0 : 1300 }"
          :columns="costColumns" :data-source="costTableData" rowKey="id"
          :pagination='false'
        >
          <template tips='费用类型' slot="feeType" slot-scope="text, record">
            <span>{{record.feeType == 1 ? '国内' : record.feeType == 2 ? '国际' : '其他'}}</span>
          </template>
         <span slot-scope="text,record" slot="rate">
            <span>
              {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
              {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':
              record.invoiceType==4?'进口增值税 -':record.invoiceType==5?'进口关税 -':''}}
              {{record.invoiceType==3?'抵扣率':[1,2,4,5].includes(record.invoiceType)?'税率':''}}
              {{ record.rate+'%' }}
            </span>
          </span>
          <span slot="priceExcludingTax" slot-scope="text,record">
            <span>{{ record.priceExcludingTax }}</span>
          </span>
        </a-table>
      </div>
      <div class="tableContainer">
        <p class="pTittle fontWeight">结算单明细列表</p>
        <div class="flex-ed heightDiv">
          <a-button-group>
            <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
            <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
            <checkboxList v-model="columns" width="290" />
          </a-button-group>
        </div>
        <a-table
          bordered
          :columns="columns"
          :scroll="{ x: 307.778, y: total < 20 ? 0 : 1300 }"
          :data-source="tableData" rowKey="id"
          :pagination='tableData.length > 19 ? {showTotal: ()=>`共 ${tableData.length} 条`,showSizeChanger: true,showQuickJumper: tableData.length > 1000} : false'
        >
          <span title="增值税" slot="inputTaxRate" slot-scope="text,record">
              {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
              {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
              {{ record.inputTaxRate+'%' }}
          </span>
          <span title="税额" slot="inputTax" slot-scope="text, record">
            <span>{{formatPrice(record.inputTax, 2)}}</span>
          </span>
          <span title="不含税金额" slot="noTaxRateAmount" slot-scope="text, record">
            <span>{{formatPrice(+record.puItemAmount - +record.inputTax)}}</span>
          </span>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            本页合计：
            <span v-if="currentPageData">
              <span v-for="(item, i) in totalSum" :key="i">
                <span class="greyfont">{{item[1]}}</span>
                &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(+t + (+c[item[0]] - ~~c[item[2]])), 0) }}</span>&gt;
                <a-divider type="vertical" style="background: #000000a6;" v-show="i != totalSum.length - 1" />
              </span>
            </span>
          </template>
        </a-table>
      </div>
      <div class="flex-ed">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { details } from '@/services/settlement/payable/reconciledNeedpay';
import { getOrderDetail } from "../../services/pickUpOrder/pickUpOrderList";
const columns = [
  {title: '序号', dataIndex: 'indexId', width: 80},
  {title: '商品名称', dataIndex: 'itemName', width: 220},
  {title: '商品编码', dataIndex: 'itemCode', width: 160, scopedSlots: {customRender: "poState"}},
  {title: '规格', dataIndex: 'itemSpec', width: 140},
  {title: '数量', dataIndex: 'deliveryQty', width: 140},
  {title: '计价单位', dataIndex: 'priceUnit', width: 140},
  {title: '单价', dataIndex: 'puPrice', width: 140},
  {title: '商品金额', dataIndex: 'puTotalAmount', width: 140},
  {title: '包装', dataIndex: 'packingName', width: 220},
  {title: '包装费+人工费', dataIndex: 'packingCost', width: 140},
  {title: '应付金额', dataIndex: 'puItemAmount', width: 140},
  {title: '增值税', dataIndex: 'inputTaxRate', width: 200, scopedSlots: {customRender: "inputTaxRate"}},
  {title: '税额', dataIndex: 'inputTax', width: 200, scopedSlots: {customRender: "inputTax"}},
  {title: '不含税金额', dataIndex: 'noTaxRateAmount', width: 140, scopedSlots: {customRender: 'noTaxRateAmount'}},
]
const costColumns = [
  {title: "费用类型", dataIndex: "feeType", width: 180, scopedSlots: { customRender: "feeType" }},
  {title: "费用项", dataIndex: "feeName", width: 180},
  {title: "收款主体", dataIndex: "receivingSubjectName", width: 260},
  {title: "费用金额",dataIndex: "feeAmount", width: 180},
  {title: "税率(%)", dataIndex: "rate", width: 250,scopedSlots: { customRender: "rate" }},
  {title: "不含税金额", dataIndex: "priceExcludingTax", width: 240,scopedSlots: { customRender: "priceExcludingTax" }},
  {title: "币种", dataIndex: "currency", width: 160},
  {title: "汇率", dataIndex: "exchangeRate", width: 160},
  {title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 240},
  {title: "人民币金额", dataIndex: "currencyAmount", width: 240},
  {title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 280},
  {title: "备注", dataIndex: "remark", width: 280},
]
export default {
  name: "modalDetails",
  data() {
    return {
      poTypeHome: [
        ['采购单编号', 'poCode'],['供货商名称', 'supplierName'],['采购日期', 'poSubtime'],['单据金额', 'puTotalAmount'],
        ['对账状态', 'reconciliaState'],['预付款', 'payAmount'],['尾款', 'noPayAmount'],['结算状态', 'settleState'],
        ['对账时间', 'reconciliaDate'],['扣供应商款', 'deductions'],['备注', 'remark'],['关联合同', 'contractTitle'],
      ],
      poTypeAbroad: [
        ['采购订单编号', 'poCode'],['供应商名称', 'supplierName'],['代理公司名称', 'agencyName'],['采购订单提交时间', 'createDate'],['单据金额', 'poTotalAmount'],
        ['供应商联系手机', 'supplierPhone'],['柜', 'containerCode'],['订单日期', 'orderDate'],['船名', 'shipName'],
        ['发货', 'shipmentPort'],['开船日期', 'sailDate'],['目的港', 'purposeHarbor'],['预计到港日期', 'expectArrivalDate'],
        ['提单', 'pickCode'],['运输方式', 'flowDirection'],['订单号', 'orderCode'],['采购订单提交人', 'createUser'],
        ['定价方式', 'pricingState'],['条款', 'terms'],['币种', 'currency'],['汇率', 'exchangeRate'],
        ['预付款', 'payAmount'],['预付款比率(%)', 'payAmountRatio'],['预付款时间', 'advanceTime'],['扣供应商款', 'deductions'],
        ['尾款', 'noPayAmount'],['采购员', 'buyerName'],['业务类型', 'businessType'],['交易方式', 'transactionType'],
        ['关联合同', 'contractTitle']
      ],
      columns,
      visibleLModal: false,
      flag: 'details',
      allMsg: {},
      headMsg: {
        id: undefined,
        poCode: undefined,
        supplierName: undefined,
        poSubtime: undefined,
        puTotalAmount: undefined,
        reconciliaState: undefined,
        payAmount: undefined,
        noPayAmount: undefined,
        settleState: undefined,
        reconciliaDate: undefined,
        remark: undefined
      },
      totalSum: [
        ["deliveryQty","数量"],["puTotalAmount","商品金额"],["packingCost","包装费+人工费"],
        ["puItemAmount","应付金额"],["puItemAmount","不含税金额","inputTax"],
      ],
      id: undefined,
      supplierOption: [],
      option: {
        moneyOption: [],
        payWayOption: []
      },
      tableData: [],
      costTableData: [],
      costColumns,
      fullScreen: true,
      selectedRowKeys: [],
      disabledFlage: 0,
      total: 0,
    }
  },
  methods: {
    details(record) {
      details({id: record.id, poCode: record.poCode, docType: record.docType}).then(res => {
        if (res.data.code == 200) {
          if(res.data.data?.purchaseOrderDetails){
            res.data.data?.purchaseOrderDetails.forEach((item, i) => item.indexId = i + 1)
            this.tableData = res.data?.data?.purchaseOrderDetails || []
          }
          this.costTableData = res.data?.data?.purchaseFeeList || []
          this.visibleLModal = true
        }
      }
      ).catch(() => this.$message.error("查看列表详情失败") )
    },
    openModal(record) {
      this.tableData = []
      this.costTableData = []
      this.allMsg = record
      if(record.poType == 1){
        this.headMsg.id = record.id,
        this.headMsg.poCode = record.poCode,
        this.headMsg.supplierName = record.supplierName,
        this.headMsg.poSubtime = record.poSubtime,
        this.headMsg.puTotalAmount = record.puTotalAmount,
        this.headMsg.reconciliaState = record.reconciliaState == 610 ? '未对账' : record.reconciliaState == 620 ? '已对账' : '',
        this.headMsg.payAmount = record.payAmount,
        this.headMsg.noPayAmount = record.noPayAmount,
        this.headMsg.deductions = record.deductions,
        this.headMsg.settleState = record.settleState == 1 ? '未结算' : record.settleState == 2 ? '部分结算' : record.settleState == 3 ? '已结算' : '',
        this.headMsg.reconciliaDate = record.reconciliaDate,
        this.headMsg.contractTitle = record.contractTitle
        this.headMsg.remark = record.remark
      } else {
        this.getGlobalDetail(record);
      }
      this.id = record.id
      this.details(record)
    },
    getGlobalDetail(record) {
      getOrderDetail({ id: record.id }).then((res) => {
        if (res.data.code == 200) {
          let item = res.data.data;
          this.allMsg = {
            buyerName: item.buyerName || "",
            id: item.id || "",
            supplierId: item.supplierId || "",
            supplierCode: item.supplierCode || "",
            poState: item.poState || "",
            reconciliaState: item.reconciliaState || "",
            settleState: item.settleState || "",
            poCode: item.poCode || "",
            supplierName: item.supplierName || "",
            supplierPhone: item.supplierPhone || "",
            poSubtime: item.poSubtime || "",
            agencyName: item.purchaseGlobalOrderDetail.agencyName || "",
            businessType: item.purchaseGlobalOrderDetail.businessType || "",
            flowDirection: item.purchaseGlobalOrderDetail.flowDirection || "",
            orderCode: item.purchaseGlobalOrderDetail.orderCode || "",
            orderDate: item.purchaseGlobalOrderDetail.orderDate || "",
            pickCode: item.purchaseGlobalOrderDetail.pickCode || "",
            purposeHarbor: item.purchaseGlobalOrderDetail.purposeHarbor || "",
            shipName: item.purchaseGlobalOrderDetail.shipName || "",
            sailDate: item.purchaseGlobalOrderDetail.sailDate || "",
            expectArrivalDate: item.purchaseGlobalOrderDetail.expectArrivalDate || "",
            transactionType: item.purchaseGlobalOrderDetail.transactionType || "",
            currency: item.purchaseGlobalOrderDetail.currency || "",
            exchangeRate: item.purchaseGlobalOrderDetail.exchangeRate || "",
            pricingState: item.purchaseGlobalOrderDetail.pricingState || "",
            terms: item.purchaseGlobalOrderDetail.terms || "",
            payAmountRatio: item.payAmountRatio || "",
            advanceTime: item.advanceTime || "",
            shipmentPort: item.purchaseGlobalOrderDetail.shipmentPort || "",
            puTotalAmount: record.puTotalAmount || "",
            payAmount: record.payAmount || "",
            noPayAmount: record.noPayAmount || "",
            deductions: record.deductions || "",
            createDate: item.poSubtime || "",
            createUser: item.createUser || "",
            containerCode: record.containerCode || "",
          };
          this.allMsg.puTotalAmount=record.puTotalAmount||''
          this.headMsg=this.allMsg
        }
      });
    },
    redo() { this.details(this.id, this.whichData == 'order' ? 1 : 2) },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
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
  /deep/.ant-modal-body {
    padding-top: 0;
  }
  /deep/.ant-modal-header {
    border: 0;
  }
  /deep/.ant-modal-body {
    padding-bottom: 1px;
  }
  /deep/.ant-col-6 {
    padding-bottom: 6px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .pTittle {
      margin-bottom: 0;
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
      background-color: @common-bgc;
    }
    .paddingLeftRight {
      padding: 0 16px;
    }
    .fontWeight {
      font-weight: 600;
    }
    .bgc {
      border: 0;
      font-size: 18px;
      background-color: #009b00;
      color: white;
    }
    .divBorder {
      margin-top: 10px;
      border: @border-color;
      .rowMarginTop {
        margin: 5px 0;
        .widthMargin {
          width: 100%;
        }
      }
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      .ant-btn-link{
        margin: 0;padding: 0px 4px;
      }
      .heightDiv {
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
      }
      .a-btn {
        width: 50px;
      }
      .ant-table-footer .ant-divider {
        margin-left: 5px;
        background-color: #7a7a7a;
      }
    }
    .bottomMargin {
      margin-left: 10px;
    }
  }
}
</style>