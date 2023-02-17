<template>
    <a-modal :width='1300' :dialogStyle="{'top': '36px'}" v-model="visibleSearch" title="需求单详情" :footer="null">
      <div class="print" id="print">
        <div class="topBox">
          <p class="topP">基本信息</p>
          <a-row class="rowStyleTop">
            <a-col :span='10'><span class="colSpan">需求订单编号: </span>{{ dataBaseInfo.sno }}</a-col>
            <a-col :span='6'><span class="colSpan">订单状态: </span>{{ dataBaseInfo.state }}</a-col>
            <a-col :span='8'><span class="colSpan">运营主体: </span>{{ dataBaseInfo.opName }}</a-col>
          </a-row>
          <a-row class="rowStyleCenter">
            <a-col :span='10'><span class="colSpan">采购订单提交时间: </span>{{ dataBaseInfo.createDate }}</a-col>
            <a-col :span='6'><span class="colSpan">采购订单提交人: </span>{{ dataBaseInfo.createUser }}</a-col>
          </a-row>
          <a-row class="rowStyleBottom">
            <a-col :span='24'><span class="colSpan" style="float: left;">销售订单编号：</span>{{ dataBaseInfo.soSno }}</a-col>
          </a-row>
        </div>
        <div class="bottomBox">
          <p class="topP">商品信息</p>
          <a-table
            class="tableStyle"
            size="small"
            bordered
            ref="tableRef"
            :columns="columns"
            :data-source="dataTable"
            :pagination="false"
            rowKey="id"
          >
          <template tips='采购价' slot="supplyPrice" slot-scope="text, record">
            <span>{{ record.supplyPrice ? record.supplyPrice : ''}}</span>
          </template>
          <template tips='包装金额' slot="packUnitPriceT" slot-scope="text, record">
            <span>{{ record.packUnitPriceT }}</span>
          </template>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            本页合计：
            <span class="greyfont">商品共</span>(<span class="redfont">{{ (currentPageData.length) }}</span>)种&nbsp;|
            <span v-if="currentPageData">
              <span v-for="(item, i) in totalSum" :key="i">
                <span class="greyfont">{{item[1]}}</span>
                &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(+t + +c[item[0]]), 0) }}</span>&gt;
                <a-divider type="vertical" style="background: #000000a6;" v-show="i != totalSum.length - 1" />
              </span>
            </span>
          </template>
          </a-table>
        </div>
      </div>
      <p v-if="VIfPrint" class="bottomP flex-ed">
        <a-button @click="handleCancel"> 取消 </a-button>
        <a-button class="btnMargin" type="primary" v-print="'#print'"> 打印 </a-button>
      </p>
    </a-modal>
</template>
<script>
import { requireOrderFindInfo } from "@/services/purchaseNeed.js";
const columns = [
  { title: '商品编号', align: 'center', width: 90, dataIndex: 'itemSno', key: 'itemSno',},
  { title: '商品名称', align: 'center', width: 90, dataIndex: 'itemName', key: 'itemName',},
  { title: '客户名称', align: 'center', dataIndex: 'customerName', key: 'customerName', width: 140 },
  { title: '门店名称', align: 'center', dataIndex: 'storeName', key: 'storeName', width: 90 },
  { title: '规格', align: 'center', dataIndex: 'specs', key: 'specs', width: 64 },
  { title: '销售数量', align: 'center', dataIndex: 'saleQty', key: 'saleQty', width: 90 },
  { title: '销售重量', align: 'center', dataIndex: 'saleWeight', key: 'saleWeight', width: 90 },
  { title: '采购价', align: 'center', dataIndex: 'supplyPrice', key: 'supplyPrice', width: 90, scopedSlots: { customRender: 'supplyPrice' } },
  { title: '需求单件数', align: 'center', dataIndex: 'roQty', key: 'roQty', width: 110},
  { title: '需求单重量', align: 'center', dataIndex: 'roWeight', key: 'roWeight', width: 110 },
  { title: '包装金额', align: 'center', dataIndex: 'packUnitPriceT', key: 'packUnitPriceT', width: 90, scopedSlots: { customRender: 'packUnitPriceT' } },
];
export default {
  name:"modalDetails",
  data() {
    return {
      visibleSearch: false,
      VIfPrint: false,
      columns,
      totalSum: [
        ["saleQty", "需求总数量"],["saleWeight", "需求总重量"],["roQty", "需求单总件数"],
        ["packUnitPriceN", "包装总数量"],["packUnitPriceT", "包装总金额"]
      ],
      dataBaseInfo: {
        sno: '',
        State: '',
        OpName: '',
        createDate: '',
        createUser: '',
        soSno: '',
        itemSno: '',
        netWeight: '',
      },
      orderState: {
        "100": "待确认",
        "101": "销售订单作废",
        "102": "待转需求单",
        "103": "待签收",
        "104": "已签收",
        "105": "待支付",
        "106": "待发货",
        "107": "已送达",
        "108": "关闭",
        "200": "待转采购订单",
        "201": "待确认",
        "203": "销采单已确认",
        "210": "待收货",
        "301": "呆滞品",
        "401": "待退货确认",
        "402": "已退货",
        "403": "待审核",
        "404": "已审核",
        "406": "待入库",
        "407": "待退款",
        "405": "已关闭",
        "210103": "待收货待签收",
        "210104": "待收货已签收",
        "220103": "已收货待签收",
        "220104": "已收货已签收",
      },
      dataTable: [],
    }
  },
  methods: {
    getDataInfo(id) {
      const params = { id: id }
      requireOrderFindInfo(params).then(
        res => {
          Object.keys(this.orderState).find(
            key => res.data.data.state == key ? res.data.data.state = this.orderState[key] : ''
          )
          this.dataBaseInfo = res.data.data
          if (res.data.data.orderDetailList.length > 0 && res.data.data.orderDetailList[0].soSno) {
            let soSno = res.data.data.orderDetailList.reduce(
              (initialValue,currentValue) => { return initialValue + ',' + currentValue.soSno },
              res.data.data.orderDetailList[0].soSno
            )
            this.dataBaseInfo.soSno = soSno.substring(soSno.indexOf(',') + 1)
          }
          res.data.data.orderDetailList.forEach((vip) => {
            vip.packUnitPriceT = vip.itemPackList.reduce((t, c) => { return this.formatPrice(t + (+c.packUnitPrice || 0)) }, 0)
            vip.packUnitPriceN = vip.itemPackList.length
          })
          this.dataTable = res.data.data.orderDetailList
        }
      )
    },
    openModal(id,printFlag) {
      this.getDataInfo(id)
      this.VIfPrint = printFlag == 'print'
      this.visibleSearch = true;
    },
    handleCancel() { this.visibleSearch = false },
  },
}
</script>
<style lang="less" scoped>
@borderLine:1px solid #cccccc;
  .topBox{
    border: @borderLine;
    .topP{
      height: 30px;
      padding-left: 12px;
      border-bottom: 1px solid #d9d9d9;
      line-height: 30px;
      color: black;
      background-color: #F0F3F6;
    }
    .rowStyleTop{
      margin:0 18px;
    }
    .rowStyleCenter{
      margin:8px 18px;
    }
    .rowStyleBottom{
      margin:0 18px 18px 18px;
    }
    .colSpan{
      color: #525252;
    }
  }
  .bottomBox{
    margin-top: 15px;
    border: @borderLine;
    .topP{
      margin: 0;
      height: 30px;
      padding-left: 12px;
      line-height: 30px;
      color: black;
      background-color: #F0F3F6;
    }
    .tableStyle{
      margin: 0;max-height:489.48px;min-height:163.16px;overflow: auto;
    }
    .footerP{
      padding: 10px 0 0 12px;
    }
  }
  .bottomP{
    margin-top: 10px;
    .btnMargin{
      margin-left: 10px;
    }
  }
</style>
<style>
@media print {
  .ant-modal-body {
    padding: 0;
    margin: 0;
  }
  .ant-modal-content {
    box-shadow: none;
  }
}
</style>