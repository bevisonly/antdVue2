<template>
  <a-modal
    title="打印"
    :visible="visible"
    :width="1300"
    @cancel="handleCancel"
    destroyOnClose
  >
  <div class="top-page" v-if="printShow">
    <div class="print" ref="print" id="print">
      <div v-if="poType === 1">
        <div class="title">
          <h1>{{ baseInfo.opName }}采购单</h1>
          <p class="two-title" style="margin-top: 50px">
            NO：{{ baseInfo.poCode }}
          </p>
        </div>
        <div class="info">
          <a-row class="row-info" :gutter="16">
            <a-col :span="8">
              <span>供应商：{{ baseInfo.supplierName }}</span>
            </a-col>
            <a-col :span="8">
              <span>入库仓库：{{ baseInfo.whName }}</span>
            </a-col>
            <a-col :span="8">
              <span>计划交货时间：{{ baseInfo.planDeliveryTime }}</span>
            </a-col>
            <!-- <a-col :span="6">
                <span>实际入库日期：{{ baseInfo.deliveryDate }}</span>
              </a-col> -->
          </a-row>
          <!-- <a-row class="row-info" :gutter="16"> -->
          <!-- <a-col :span="8">
            <span>配送方式：{{ baseInfo.saleInfo.deliveryType == 1 ? "自提" : "配送"}}</span>
          </a-col>
          <a-col :span="8">
            <span>车牌：{{ baseInfo.saleInfo.carPlate }}</span>
          </a-col> -->
          <!-- </a-row> -->
        </div>
        <div class="table-data" style="margin-top: 20px">
          <a-table
            size="middle"
            rowKey="id"
            :pagination="false"
            :columns="columns"
            :data-source="dataTable"
            bordered
            :rowClassName="rowClassNameChange"
          >
            <!-- <template>
              <div slot="footer">
                {{ baseInfo.settleStateDesc }}
              </div>
            </template> -->
          </a-table>
        </div>
        <div class="info-bottom" style="padding-bottom: 10px">
          <a-row :gutter="16">
            <!-- <a-col :span="6">
            <span>收货单位及经受人：</span>
          </a-col> -->
            <a-col :span="8">
              <span>发货人：</span>
            </a-col>
            <a-col :span="8">
              <span>审核人：</span>
            </a-col>
            <a-col :span="8">
              <span>制单：</span>
            </a-col>
          </a-row>
        </div>
        <div
          style="
            text-align: right;
            height: 60px;
            line-height: 60px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          "
        >
          打印时间 : {{ printTime }}
        </div>
      </div>
      <div v-if="poType === 2">
        <!-- <div id="gjprint" ref="gjprint" class="print-gj"> -->
        <div class="title-gj">
          <h1>PURCHASE ORDER</h1>
          <h1>采购订单</h1>
          <p>
            合同编号PO NO.:{{ baseInfo.purchaseGlobalOrderDetail.contractNo }}
          </p>
        </div>
        <div class="sb-info">
          <div class="seller">
            <div class="seller-name">
              卖方Seller:{{ baseInfo.supplierName }}
            </div>
            <div class="seller-address">
              地址Address:{{ baseInfo.supplierAddress }}
            </div>
          </div>
          <div class="buyer">
            <div class="seller-name">
              买方Buyer:Shenzhen Jiali Supply Chain CO.,LTD
            </div>
            <div class="seller-address">
              地址Address:Room 1304M building 7 Qianhai Excellence Financial
              Center (phase I) unit 2 Guiwan District Nanshan street Qianhai
              cooperation zone Shenzhen
            </div>
          </div>
        </div>
        <div class="po-info">
          <p>经协商，双方同意根据双方签订的合同条款签订本采购订单。</p>
          <p>
            After discussing, it is mutually agreed by both parties to sign this
            purchase order according to the terms and conditions of the contract
            signed by both parties.
          </p>
          <div class="currency">
            币种Currency:{{ baseInfo.purchaseGlobalOrderDetail.currency }}-{{
              baseInfo.purchaseGlobalOrderDetail.currencyAbbreviations
            }}
          </div>
        </div>
        <div class="item-table">
          <a-table
            size="middle"
            rowKey="id"
            :pagination="false"
            :columns="columnsGj"
            :data-source="tableGj"
            bordered
          >
            <span slot="itemName" slot-scope="text, record">
              {{ record.itemNameEnglish ? record.itemNameEnglish + " " + (record.itemSpec || '')  : text }}
            </span>
            <div slot="poPrice" slot-scope="text">
              <span v-if="text">
                {{
                  baseInfo.purchaseGlobalOrderDetail.currencyAbbreviations
                }}&nbsp;{{ text ? toThousands(text) : "" }}
              </span>
            </div>
            <div slot="poTotalAmount" slot-scope="text">
              <span v-if="text">
                {{
                  baseInfo.purchaseGlobalOrderDetail.currencyAbbreviations
                }}&nbsp;{{ text ? toThousands(text) : "" }}
              </span>
            </div>
          </a-table>
        </div>
        <div class="sb-info" style="margin-top: 10px">
          <div class="seller">
            <div class="delivery-date">
              交货日期Delivery Date:{{
                delTime(baseInfo.purchaseGlobalOrderDetail.expectArrivalDate)
              }}
            </div>
            <div class="country">
              原产国Country of Origin:{{
                baseInfo.purchaseGlobalOrderDetail.countryOrigin
              }}
            </div>
            <div class="portl">Port of Loading:{{ baseInfo.purchaseGlobalOrderDetail.shipmentPort }}</div>
            <div class="payment">
              Payment Terms:{{ baseInfo.payAmountRatioTerm }}
            </div>
          </div>
          <div class="buyer">
            <div class="ship-mode">
              运输方式Ship mode:{{
                baseInfo.purchaseGlobalOrderDetail.flowDirection
              }}
            </div>
            <div class="destination">
              目的港Port of Destination:{{
                baseInfo.purchaseGlobalOrderDetail.purposeHarbor
              }}
            </div>
            <div class="terms">
              条款Trade terms：{{ baseInfo.purchaseGlobalOrderDetail.terms }}
            </div>
          </div>
        </div>
        <div class="other">
          <div class="tit">其他要求Other requirements：</div>
          <p>
            1 . 发船前发送相应照片作为参考，木托必须熏蒸而且印有IPPC标识。 Send
            photos of each pallet for review before shipping out. Fumigation
            must be taken on pallets and it is printedwith "IPPC"" logo.
          </p>
          <p>
            2 .请提供详细的装箱单，并注明每个托盘的实际毛重。 Provide detailed
            packing list with actual gross weight of each pallet.
          </p>
          <p>
            3
            .单据上所显示的详细信息(包括但不限于货物名称、件数、净重、毛重、品牌等)必须准确。
            The details shown on documents (include but not limited to cargo
            name, piece count, net weight, gross weight brand and etc.) must be
            accurate.
          </p>
          <p>
            4.本合同自签字之日起生效，对本合同条款的任何修改和附加条款，均须以书面形式作出，并经双方确认后方可生效。
            This contract come into effect from signing date, any amendment and
            additional clause to these conditions shall bevalid only if make in
            written form and duty confirmed by both side.
          </p>
        </div>
        <div class="sign-item">
          <div class="seller">
            <div class="seller-sign">卖方The Seller：</div>
            <div class="seller-by">By：</div>
            <div class="seller-date">
              Date： {{ baseInfo.purchaseGlobalOrderDetail.orderDateDesc }}
            </div>
          </div>
          <div class="buyer">
            <div class="buyer-sign">买方The Buyers：</div>
            <div class="buyer-by">By：</div>
            <div class="buyer-date">
              Date： {{ baseInfo.purchaseGlobalOrderDetail.orderDateDesc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template slot="footer">
      <a-button @click="handleCancel"> 取消 </a-button>
      <a-button type="primary" v-print="'#print'"> 打印 </a-button>
      <!-- <a-button type="primary" @click="handleSubmit"> 打印 </a-button> -->
    </template>
  </a-modal>
</template>
<script>
import { purchaseOrderHeadGetSingle } from "../../services/purchaseSaleInventory";
import { formatDate } from "../../utils/util";
import { add, priceUppercase } from "../../utils/tool";

export default {
  name: "printOrder",
  data() {
    return {
      visible: false,
      baseInfo: {
        saleInfo: {},
      },
      columns: [
        {
          title: "序号",
          dataIndex: "keyIndex",
          align: "center",
        },
        {
          title: "商品编码",
          dataIndex: "itemCode",
          align: "center",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
          align: "center",
        },
        // {
        //   title: "销售数量",
        //   dataIndex: "saleQty",
        //   align: "center",
        // },
        {
          title: "数量",
          dataIndex: "poQty",
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "poPrice",
          align: "center",
        },
        {
          title: "计价单位",
          dataIndex: "priceUnit",
          align: "center",
        },
        {
          title: "金额",
          dataIndex: "poTotalAmount",
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
        },
      ],
      columnsGj: [
        {
          title: "Item项目",
          dataIndex: "keyIndex",
          align: "center",
        },
        {
          title: "商品名及描述Name of Commodity and Descriptions",
          dataIndex: "itemName",
          align: "center",
          scopedSlots: { customRender: "itemName" },
          // customRender:(text,row,index)=>{
          //   if (row.id==='guihao') {
          //     console.log(index);
          //     return  <div style='diplay:flex'><span  style='over-flow:hidden;width:100%;height:100%;border-right: 1px solid #000'>柜号Container Number:</span><span>{{text}}</span>  </div>
          //   }else{
          //     return row.itemNameEnglish?row.itemNameEnglish:text
          //   }
          // }
        },
        {
          title: "品种Variery",
          dataIndex: "itemType",
          align: "center",
        },
        {
          title: "包装Package",
          dataIndex: "packageName",
          align: "center",
        },
        {
          title: "单价Unit Price(Per Case)",
          dataIndex: "poPrice",
          align: "center",
          scopedSlots: { customRender: "poPrice" },
        },
        {
          title: "数量Quantity(箱Cases)",
          dataIndex: "poQty",
          align: "center",
        },
        {
          title: "金额Amount",
          dataIndex: "poTotalAmount",
          align: "center",
          scopedSlots: { customRender: "poTotalAmount" },
        },
        // {
        //   title: "柜号Container Number",
        //   dataIndex: "containerCode",
        //   align: "center",
        // },
        // {
        //   title: "船名 Vessel Name",
        //   dataIndex: "shipName",
        //   align: "center",
        // },
      ],
      tableGj: [],
      dataTable: [],
      printTime: "",
      poType: "",
      originCountrys: "",
      printShow: false,
    };
  },
  computed: {},
  methods: {
    //去点时间
    delTime(val) {
      let val2 = val.substr(0, 10);
      return val2;
    },
    rowClassNameChange(record) {
      if (record.keyIndex === "合计 :") {
        console.log("合计");
        return "totalcomputed";
      }
    },
    createNewArr(data, key) {
      // data 需要处理的表格数据 key 就是需要合并单元格的唯一主键，我这里是projectId
      return data
        .reduce((result, item) => {
          //首先将key字段作为新数组result取出
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key]);
          }
          return result;
        }, [])
        .reduce((result, value, rownum) => {
          //将key相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
          const children = data.filter((item) => item[key] === value);
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
              rownum: rownum + 1,
            }))
          );
          return result;
        }, []);
    },

    //打印三位隔开
    toThousands(num = 0) {
      return num.toString().replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      });
    },
    handleCancel() {
      this.visible = false;
    },
    openModal(record) {
      this.printTime = formatDate(new Date(), "YYYY-MM-dd hh:mm:ss");
      console.log(record);
      this.poType = record.poType;
      console.log(this.poType);
      purchaseOrderHeadGetSingle({ id: record.id, resource: 2 })
        .then((res) => {
          if (res.data.code == "200") {
            this.printShow = true;
            this.visible = true;
            if (res.data.data.saleInfo == undefined) {
              res.data.data.saleInfo = {};
            }
            this.baseInfo = res.data.data;
            if (!this.baseInfo.purchaseGlobalOrderDetail) {
              this.baseInfo.purchaseGlobalOrderDetail = {};
            }
            // if (res.data.data?.details?.length > 0) {
            //   res.data.data?.details?.push({
            //     id: 1000000,
            //     itemCode: res.data.data.saleAmountStr,
            //     itemSpec: "合计",
            //     saleQty: res.data.data.saleQtyAmount,
            //     saleAmount: res.data.data.saleAmount,
            //   });
            // }
            console.log(this.baseInfo);
            const tempTable = res.data.data?.details || [];
            if (this.poType === 1) {
              let qty = 0,
                amount = 0;
              tempTable.forEach((item, index) => {
                item.keyIndex = index + 1;
                qty = add(qty, item.poQty ? Number(item.poQty) : 0);
                amount = add(
                  amount,
                  item.poTotalAmount ? Number(item.poTotalAmount) : 0
                );
              });
              if (res.data.data?.details?.length > 0) {
                tempTable.push({
                  keyIndex: "合计 :",
                  itemCode: priceUppercase(amount),
                  poQty: qty,
                  poTotalAmount: amount,
                });
              }
              this.dataTable = JSON.parse(JSON.stringify(tempTable));
            }
            if (this.poType === 2) {
              if (!this.baseInfo.purchaseGlobalOrderDetail) {
                this.baseInfo.purchaseGlobalOrderDetail = {};
              }
              this.tableGj = res.data.data?.details || [];
              if (this.tableGj && this.tableGj.length > 0) {
                let qty = 0;
                let amount = 0;
                let countrys = [];
                this.tableGj.forEach((item, index) => {
                  if (item.itemCountryOrigin) {
                    countrys.push(item.itemCountryOrigin);
                  }
                  item.keyIndex = index + 1;
                  qty = item.poQty ? add(item.poQty, qty) : add(0, qty);
                  amount = item.poTotalAmount
                    ? add(item.poTotalAmount, amount)
                    : add(0, amount);
                });
                this.originCountrys =
                  countrys && countrys.length > 0 ? countrys.join(",") : "";
                let item1 = {
                  id: "guihao",
                  keyIndex: "",
                  itemName: `柜号Container Number:${this.baseInfo.purchaseGlobalOrderDetail.containerCode}`,
                };
                let item2 = {
                  id: "ship",
                  keyIndex: "",
                  itemName: `船名Vessel Name:${this.baseInfo.purchaseGlobalOrderDetail.shipName}`,
                };
                let item3 = {
                  id: "total",
                  keyIndex: "",
                  itemName: `合计TOTAL`,
                  poQty: qty,
                  poTotalAmount: amount,
                };
                this.tableGj.push(item1);
                this.tableGj.push(item2);
                this.tableGj.push(item3);
                // this.tableGj = this.createNewArr(this.tableGj, "id");
                // console.log(this.tableGj);
              }
            }
            // this.$nextTick(() => {
            //   this.handleSubmit();
            // });
          } else {
            this.$message.warn("获取打印数据失败!");
          }
        })
        .catch(() => this.$message.warn("获取打印数据失败!"));
    },
    // handleSubmit() {
    //   if (Object.keys(this.baseInfo).length == 0) {
    //     this.$message.warn("没有可打印的数据");
    //     return;
    //   }

    //   this.$print(document.getElementById("print"));
    //   this.printShow = false;
    // },
  },
};
</script>
<style >
</style>
<style lang="less" scoped>
// /deep/ .ant-table-small.ant-table-bordered .ant-table-content {
//   border: 1px solid #000;
// }
/deep/ .ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td {
  border: 1px solid #000;
}
/deep/ .ant-table-tbody > tr > td {
  border: 1px solid #000;
}
/deep/ .ant-table table {
  border-collapse: collapse;
}
/deep/.totalcomputed {
  font-weight: bold;
}
// /deep/ .ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{padding: 0;}
.title-gj {
  text-align: center;
  color: #000;
  h1 {
    font-weight: bold;
    font-family: "Times New Roman";
  }
  P {
    text-align: right;
    font-family: "Times New Roman";
  }
}
.sb-info {
  display: flex;
  justify-content: space-evenly;
  // align-items: center;
  font-weight: bold;
  font-family: "Times New Roman";
  color: #000;
  .seller {
    width: 50%;
  }
  .buyer {
    flex: 1;
  }
  .seller-address {
    margin-top: 20px;
  }
}
.po-info {
  margin-top: 30px;
  font-family: "Times New Roman";
  color: #000;
}
.other {
  color: #000;
  font-family: "Times New Roman";
  p {
    margin-left: 20px;
  }
}
.sign-item {
  display: flex;
  color: #000;
  font-family: "Times New Roman";
  font-weight: bold;
  .seller,
  .buyer {
    margin-left: 80px;
    width: 40%;
    div {
      margin-top: 20px;
    }
  }
}

.print {
  width: 100%;
  padding: 0;
  margin: 0;
  .title {
    h1,
    p {
      padding: 0;
      margin: 0;
      font-weight: bolder;
    }
    .two-title {
      text-align: right;
    }
    text-align: center;
  }
  .info {
    .row-info {
      margin: 10px 0;
    }
  }
  .info-bottom {
    padding: 40px;
  }
}
</style>
<style lang="less" scoped>
@media print {
  html,
  body {
    padding: 0;
    margin: 0;
  }
  html {
    zoom: 80%;
  }
  .print {
    margin-top: 0;
  }
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
    color: #000;
  }
  /* .ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{padding: 0;} */
}
</style>