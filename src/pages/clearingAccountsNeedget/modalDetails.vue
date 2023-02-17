<template>
  <div class="modalTop">
    <div class="modalContainer">
      <div class="divBorder" v-if="fullScreen">
        <p class="pTittle fontWeight">订单信息</p>
        <a-row class="rowMarginTop">
          <a-col :span="8"><span class="marginLeft fontWeight">结算单号：</span><span>{{ headMsg.arInvoiceCode }}</span></a-col>
          <a-col :span="8"><span class="fontWeight">运营主体：</span><span>{{ headMsg.opName }}</span></a-col>
          <a-col :span="8"><span class="fontWeight">客户名称：</span><span>{{ headMsg.customerName }}</span></a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="8"><span class="marginLeft fontWeight">门店名称：</span><span>{{ headMsg.storeName }}</span></a-col>
          <a-col :span="8"><span class="fontWeight">客户订单号：</span><span>{{ headMsg.customerSno }}</span></a-col>
          <a-col :span="8"><span class="fontWeight">单据金额：</span><span>{{ headMsg.totalAmount }}</span></a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <!-- <a-col :span="8"><span class="marginLeft fontWeight">关联合同：</span><span>{{ headMsg.contractTitle }}</span></a-col> -->
          <!-- //! glht -->
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="24" class="paddingLeft">
            <span class="fontWeight">单据图片：</span>
            <div>
              <div class="modalDiv"  v-for="item in imgData" :key="item.filePath">
                <div class="info">
                  <img class="imgStyle" :src="item.filePath"/>
                  <span class="eyeInfo">
                    <a-icon type="eye" style="color: white;" @click="browseImg(item.filePath)"/>
                  </span>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="tableContainer">
        <p class="pTittle fontWeight">结算单明细列表</p>
        <div class="flex-sb heightDiv">
          <a-button-group>
            <a-button icon="ordered-list" :type="whichData == 'order' ? 'primary' : ''" @click="changeData('order', 1)"> 按订单查看 </a-button>
            <a-button icon="shopping" :type="whichData == 'item' ? 'primary' : ''" @click="changeData('item', 2)"> 按商品查看 </a-button>
          </a-button-group>
          <a-button-group>
            <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
            <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
            <checkboxList v-model="materialsColumns" width="340" />
          </a-button-group>
        </div>
        <a-table
          bordered
          :scroll="{ x: 307.778, y: total < 20 ? 0 : 1300 }"
          :columns="materialsColumns" :data-source="tableData" rowKey="id"
          :pagination='tableData.length > 19 ? {showTotal: ()=>`共 ${tableData.length} 条`,showSizeChanger: true,showQuickJumper: tableData.length > 1000} : false'
        >
          <span slot="taxAmount" slot-scope="text">{{text.toFixed(2)*100/100}}</span>
          <span slot="vat" slot-scope="text,record">
            {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
            {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
            {{ record.vat+'%' }}
          </span>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            本页合计：
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
      <div class="flex-ed">
        <a-button type="primary" @click="changeComp">关闭</a-button>
      </div>
      <a-modal :visible="previewVisible" :footer="null" @cancel="() => previewVisible = false" :closeIcon="closeIcon">
        <img style="width: 100%" title="预览" :src="previewImg" />
      </a-modal>
    </div>
  </div>
</template>

<script>
import { details,getImgURL } from '@/services/settlement/receive/clearingAccountsNeedget'
const materialsColumns = [
  {title: '商品名称', dataIndex: 'itemName', width: 200},
  {title: '商品编码', dataIndex: 'itemCode', width: 200},
  {title: '客户', dataIndex: 'customerName', width: 260},
  {title: '门店名称', dataIndex: 'storeName', width: 260},
  {title: '数量', dataIndex: 'qty', width: 140},
  {title: '单位', dataIndex: 'unit', width: 140},
  {title: '计价单位', dataIndex: 'priceUnit', width: 180},
  {title: '单价(元)', dataIndex: 'signPrice', width: 180},
  {title: '包装类型', dataIndex: 'packType', width: 180},
  {title: '包装金额', dataIndex: 'packAmount', width: 180},
  {title: '单据金额', dataIndex: 'signAmount', width: 180},
  {title: '扣点金额', dataIndex: 'deductionAmount', width: 180},
  {title: '应收金额', dataIndex: 'receivableAmount', width: 180},
  {title: '税额', dataIndex: 'taxAmount', width: 180, scopedSlots: {customRender: "taxAmount"}},
  {title: '不含税金额', dataIndex: 'includingTaxAmount', width: 180},
  {title: '增值税', dataIndex: 'vat', width: 200,scopedSlots: {customRender: "vat"}},
]
export default {
  name: "modalDetails",
  data() {
    return {
      visibleLModal: false,
      flag: 'details',
      headMsg: {},
      id: undefined,
      whichData: 'order',
      tableData: [],
      imgData: [],
      totalSum: [
        ["qty", "数量"],["packAmount", "包装金额"],["signAmount", "单据金额"],
        ["deductionAmount", "扣点金额"],["receivableAmount", "应收金额"],["taxAmount", "税额"],
        ["includingTaxAmount", "不含税额"]
      ],
      materialsColumns,
      fullScreen: true,
      selectedRowKeys: [],
      previewVisible: false,
      previewImg: undefined,
      closeIcon: () => {return <div style="margin-left: 32px;"><a-icon type="close-circle" theme="twoTone" /></div>},
      disabledFlage: 0,
      total: 0
    }
  },
  methods: {
    changeComp() { this.$parent.changeComponent() },
    details(id, type = 1) {
      let parmas = {
        arInvoiceId: id,
        sort: 'id',
        order: 'desc',
        arInvoiceCodeState: type,
      }
      details(parmas).then(res => res.data.code == 200 && (this.tableData = res.data.data || [])).catch(() => this.$message.error("查看待结算列表详情失败") )
    },
    getImgURL(id) { getImgURL({tableId: id, tableName: 'ar_settlement'}).then(res => res.data.code == 200 && (this.imgData = res.data.data)) },
    browseImg(imgURL) {
      this.previewImg = imgURL
      this.previewVisible = true
    },
    changeData(flag, type) {
      this.whichData = flag
      this.details(this.id, type)
    },
    openModal(flag, record) {
      this.whichData = 'order'
      this.headMsg = record
      this.id = record.id
      this.details(record.id)
      this.getImgURL(record.id)
      this.visibleLModal = true
    },
    redo() { this.details(this.id, this.whichData == 'order' ? 1 : 2) },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
    triggerFun() {
      this.openModal(this.$parent.subPageFlag, this.$parent.dataSubPage)
    }
  },
  activated() {
    this.triggerFun()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  .modalContainer {
    margin-bottom: 10px;
    .pTittle {
      margin-bottom: 0;
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
      background-color: @common-bgc;
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
      border: @border-color;
      .rowMarginTop {
        margin: 5px 0;
        .marginLeft {
          margin-left: 20px;
        }
        .paddingLeft {
          padding-left: 20px;
        }
        .modalDiv {
          display: inline-block;
          padding: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          margin-right: 8px;
          margin-bottom: 8px;
          .info {
            position: relative;
            .eyeInfo {
              position: absolute;
            }
            &:hover > .eyeInfo {
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              z-index: 101;
            }
          }
          &:hover {
            cursor: pointer;
            .info::before {
              position: absolute;
              z-index: 100;
              width: 100%;
              border: 1 solid red;
              height: 100%;
              background-color: rgba(0,0,0,.5);
              opacity: 1;
              transition: all .3s;
              content: " ";
            }
          }
          .imgStyle {
            width: 86px;
          }
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
  }
}
</style>