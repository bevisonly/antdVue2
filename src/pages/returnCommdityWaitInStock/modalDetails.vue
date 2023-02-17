<template>
  <a-modal class="modalTop" :width='1300' title="销售单详情" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :destroyOnClose="true" :footer="null">
    <div class="modalContainer">
      <div class="tittleBorder">
        <div class="tittleStyle">订单信息</div>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">销售单号：</span><span class="spanContainer">{{ baseData.sno }}</span></a-col>
          <a-col :span=9>
            <span class="spanTittle">订单类型：</span>
            <span class="spanContainer">
              {{
                baseData.type == 1 ? "销售单" :
                baseData.type == 2 ? "库存单" :
                baseData.type == 3 ? "服务单" :
                baseData.type == 4 ? "换货单" :
                baseData.type == 5 ? "直送单" :
                baseData.type == 6 ? "采销一体单" : baseData.type
              }}
            </span>
          </a-col>
          <a-col :span=5>
            <span class="spanTittle">单据状态：</span>
            <span class="spanContainer">
              {{
                baseData.state == 103 ? "待签收" :
                baseData.state == 104 ? "已签收" :
                baseData.state == 220103 ? "已收货待签收" :
                baseData.state == 220104 ? "已收货已签收" :
                baseData.state == 210103 ? "待收货待签收" :
                baseData.state == 210104 ? "待收货已签收" : baseData.state
              }}
            </span>
          </a-col>
          <a-col :span=4>
            <span class="spanTittle">提货方式：</span>
            <span class="spanContainer">
              {{
                baseData.deliveryType == 1 ? "自提" :
                baseData.deliveryType == 2 ? "配送" : baseData.deliveryType
              }}
            </span>
          </a-col>
        </a-row>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">客户名称：</span><span class="spanContainer">{{ baseData.customerName }}</span></a-col>
          <a-col :span=9><span class="spanTittle">客户门店：</span><span class="spanContainer">{{ baseData.storeName }}</span></a-col>
          <a-col :span=9><span class="spanTittle">联系电话：</span><span class="spanContainer">{{ baseData.receiptPhone }}</span></a-col>
        </a-row>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">供&nbsp;应&nbsp;商&nbsp;：</span><span class="spanContainer">{{ baseData.supplierName }}</span></a-col>
          <a-col :span=9><span class="spanTittle">送货日期：</span><span class="spanContainer">{{ baseData.deliveryDate }}</span></a-col>
          <a-col :span=9>
            <span class="spanTittle">收款方式：</span>
            <span class="spanContainer">{{ baseData.payType == 1 ? "现结" : baseData.payType == 2 ? "周期结算" : baseData.payType }}</span>
          </a-col>
        </a-row>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">运营主体：</span><span class="spanContainer">{{ baseData.opName }}</span></a-col>
          <a-col :span=9><span class="spanTittle">收货地址：</span><span class="spanContainer">{{ baseData.receiptRegion }}</span></a-col>
          <a-col :span=9><span class="spanTittle">详细地址：</span><span class="spanContainer">{{ baseData.receiptAddress }}</span></a-col>
        </a-row>
      </div>
      <div class="tittleBorder divTop">
        <div class="tittleStyle">供应商信息</div>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">采购客户：</span><span>{{ baseInfo.buyerAccountName }}</span></a-col>
          <a-col :span=6><span class="spanTittle">采购订单号：</span><span>{{ baseInfo.poCode }}</span></a-col>
          <a-col :span=6><span class="spanTittle">客户订单号：</span><span>{{ baseData.customerSno }}</span></a-col>
          <a-col :span=6><span class="spanTittle">需求单号：</span><span>{{ baseInfo.roCode }}</span></a-col>
        </a-row>
      </div>
      <div class="tittleBorder divTop">
        <div class="tittleStyle">收货信息</div>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">收货司机：</span><span>{{ baseInfo.deliveryUser }}</span></a-col>
          <a-col :span=6><span class="spanTittle">收货司机手机号：</span><span>{{ baseInfo.deliveryPhone }}</span></a-col>
          <a-col :span=6><span class="spanTittle">完成时间：</span><span>{{ baseInfo.deliveryTime }}</span></a-col>
        </a-row>
        <a-row class="rowStyle">
          <a-col :span=6><span class="spanTittle">送货司机：</span><span>{{ baseData.deliveryDriver }}</span></a-col>
          <a-col :span=6><span class="spanTittle">送货司机手机号：</span><span>{{ baseData.deliveryPhone }}</span></a-col>
          <a-col :span=6><span class="spanTittle">完成时间：</span><span>{{ baseData.deliveryDate }}</span></a-col>
        </a-row>
        <a-row class="rowStyle">
          <a-col :span=12>
            <span class="spanTittle">收货单据：</span>
            <div>
              <div class="modalDiv" v-for="item in pickUpImgs" :key="item">
                <div class="info">
                  <img class="imgStyle" :src="item"/>
                  <span class="eyeInfo">
                    <a-icon type="eye" style="color: white;" @click="browseImg(item)"/>
                  </span>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span=12>
            <span class="spanTittle">送货单据：</span>
            <div>
              <div class="modalDiv"  v-for="item in deliveryImgs" :key="item">
                <div class="info">
                  <img class="imgStyle" :src="item"/>
                  <span class="eyeInfo">
                    <a-icon type="eye" style="color: white;" @click="browseImg(item)"/>
                  </span>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="tittleBorder divTop">
        <div class="tittleStyle">退货商品</div>
        <a-table bordered :columns="tableColumns" :data-source="dataTable" size="middle" rowKey="id" :scroll="{ x: 307.778 }" :pagination='false'>
          <span slot="vat" slot-scope="text,record">
            <span v-if="text==0||text">
                  {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                  {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                  {{ record.vat+'%' }}
            </span>
            <span v-else></span>
          </span>
        </a-table>
      </div>
      <a-row class="divTop">
        <p class="flex-ed">
          <a-button class="btnMarginRight" type="primary" @click="cancelBtn">关闭</a-button>
        </p>
      </a-row>
      <a-modal :visible="previewVisible" :footer="null" @cancel="() => previewVisible = false" :closeIcon="closeIcon">
        <img style="width: 100%" title="预览" :src="previewImg" />
      </a-modal>
    </div>
  </a-modal>
</template>

<script>
import { waitInDetail } from '@/services/transport/signed/returnCommdityWaitInStock'
const tableColumns = [
  {title: '商品编码', dataIndex: 'itemCcode', width: 180},
  {title: '商品名称', dataIndex: 'itemCname', width: 180},
  {title: '供应商商品编码', dataIndex: 'itemScode', width: 180},
  {title: '供应商商品名称', dataIndex: 'itemSname', width: 180,},
  {title: '规格', dataIndex: 'itemSpec', width: 140},
  {title: '包装费用', dataIndex: 'packAmount', width: 140},
  {title: '出库金额', dataIndex: 'pickupAmt', width: 140},
  {title: '出库日期', dataIndex: 'pickupDate', width: 160},
  {title: '出库数量', dataIndex: 'pickupQty', width: 140},
  {title: '计价单位', dataIndex: 'priceUnit', width: 140},
  {title: '供应商单价', dataIndex: 'puPrice', width: 140},
  {title: '采购数量', dataIndex: 'saleQty', width: 140},
  {title: '退货数量', dataIndex: 'returnQty', width: 140},
  {title: '验收数量', dataIndex: 'signQty', width: 140},
  {title: '验收单价', dataIndex: 'signPrice', width: 140},
  {title: '验收金额', dataIndex: 'signAmt', width: 140},
  // {title: '增值税', dataIndex: 'vat', width: 200,scopedSlots: { customRender: "vat" },},
  {title: '成本数量', dataIndex: 'costQty', width: 140},
  {title: '成本单价', dataIndex: 'costPrice', width: 140},
  {title: '成本金额', dataIndex: 'costAmt', width: 140}
]
export default {
  name: "modalInStock",
  data() {
    return {
      visibleLModal: false,
      previewVisible: false,
      previewImg: undefined,
      closeIcon: () => {return <div style="margin-left: 32px;"><a-icon type="close-circle" theme="twoTone" /></div>},
      pickUpImgs: undefined,
      deliveryImgs: undefined,
      tableColumns,
      baseData: {},
      baseInfo: {},
      dataTable: []
    }
  },
  methods: {
    waitInDetail(record) {
      let parmas = {
        id: record.id,
        imItemId: record.imItemId,
        imItemCode: record.imItemCode,
        sno: record.sno,
      }
      waitInDetail(parmas).then(res => {
        this.baseData = res.data.data?.order || {}
        this.baseInfo = res.data.data?.purchaseOrderHead || {}
        this.pickUpImgs = /^{{1}.*}{1}$/.test(res.data.data?.pickUpImgs?.[0]) || res.data.data?.pickUpImgs
        this.deliveryImgs = /^{{1}.*}{1}$/.test(res.data.data?.deliveryImgs?.[0]) || res.data.data?.deliveryImgs
        this.dataTable = res.data.data?.orderReturnedList || []
      })
    },
    openModal(record) {
      this.deliveryImgs = undefined
      this.pickUpImgs = undefined
      this.waitInDetail(record)
      this.visibleLModal = true
    },
    browseImg(imgURL) {
      this.previewImg = imgURL
      this.previewVisible = true
    },
    cancelBtn() {
      this.visibleLModal = false
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.tittle() {
  margin: 0;
  padding-left: 15px;
  background-color: @common-bgc;
  // border-bottom: @border-color;
  letter-spacing: 1px;
  font-size: 14px;
  font-weight: 800;
}
.modalTop{
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/ .ant-modal-header{
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 0px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .tittleBorder {
      border: @border-color;
      .tittleStyle {
        height: 30px;
        line-height: 30px;
        .tittle()
      }
      .rowStyle {
        margin: 10px 0;
        padding-left: 15px;
        .spanTittle {
          font-size: 14px;
          color: #000000d9;
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
        .spanContainer {
          padding: 4px 4px;
        }
      }
    }
    .divTop {
      margin-top: 10px;
    }
  }
}
</style>