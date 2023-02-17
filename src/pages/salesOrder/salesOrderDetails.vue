<template>
  <div class="modal">
    <a-modal
      title="订单详情"
      :visible="visible"
      :width="1100"
      @cancel="handleCancel"
      destroyOnClose
    >
      <div class="details">
        <div class="info">
          <p class="info-title">订单信息</p>
          <div class="info-form">
            <a-form :form="form">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="送货日期">
                    <a-input readOnly v-model="form.deliveryDate" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="客户名称">
                    <a-input readOnly v-model="form.customerName" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="订单状态">
                    <a-input readOnly v-model="form.stateDesc" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="订单类型">
                    <a-input readOnly v-model="form.orderTypeDesc" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="客户门店">
                    <a-input readOnly v-model="form.storeName" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="提货方式">
                    <a-input readOnly v-model="form.deliveryTypeDesc" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="车牌号">
                    <a-input readOnly v-model="form.carPlate" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="供应商">
                    <a-input readOnly v-model="form.supplierName" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="联系电话">
                    <a-input readOnly v-model="form.receiptPhone" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="收货地址">
                    <a-input readOnly v-model="form.receiptRegion" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="销售订单号">
                    <a-input readOnly v-model="form.sno" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="收款方式">
                    <a-input readOnly v-model="form.payTypeDesc" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="详细地址">
                    <a-input readOnly v-model="form.receiptAddress" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="运营主体">
                    <a-input readOnly v-model="form.opName" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type == 3">
                  <a-form-item label="是否采购服务">
                    <a-input readOnly v-model="form.isPurchaseServerText" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type == 3">
                  <a-form-item label="服务单类型">
                    <a-input readOnly v-model="form.serverTypeText" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="12">
                  <a-form-item label="关联合同">
                    <a-input readOnly v-model="form.contractTitle" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
        <div class="info">
          <p class="info-title">供应商信息</p>
          <div class="info-form">
            <a-form :form="form">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="采购账户">
                    <a-input readOnly v-model="form.customerName" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="客户订单号">
                    <a-input readOnly v-model="form.sno" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="需求单号">
                    <a-input readOnly v-model="form.roSno" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="采购订单号">
                    <a-input readOnly v-model="form.purchaseOrderHeadSno" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
        <div class="info">
          <p class="info-title">提送货信息</p>
          <div class="info-form">
            <a-form :form="form">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="收货人">
                    <a-input readOnly v-model="form.signPerson" />
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-item label="送货司机">
                    <a-input readOnly v-model="form.deliveryDriver" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
        <div class="table">
          <p class="table-title">商品信息</p>
          <div class="table-data">
            <a-table
              bordered
              rowKey="id"
              :pagination="false"
              :columns="columns"
              :data-source="data"
              :scroll="{ y: 200, x: 850 }"
            >
              <span slot="vat" slot-scope="text,record">
                <span v-if="text==0||text">
                  {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                  {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                  {{ record.vat+'%' }}
                </span>
                <span v-else></span>
                </span>
              <span slot="Packaging" slot-scope="record">
                <a-button type="link" @click="openPackage(record)">
                  包装选择
                </a-button>
              </span>
            </a-table>
          </div>
        </div>
        <div
            class="table"
            style="margin-bottom: 10px"
            v-if="priceData && priceData.length > 0"
          >
            <p class="table-title">费用信息</p>
            <div class="table-data">
              <a-table
                rowKey="id"
                :pagination="false"
                :columns="priceColumns"
                :data-source="priceData"
                :scroll="{ x: 300, y: 800 }"
              >
                <span slot="feeType" slot-scope="text">{{text == 1 ? "国内" : "国际"}}</span>
                <span slot="rate" slot-scope="text,record">
                  {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                  {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                  {{ record.rate+'%' }}
                </span>
                <template slot="footer">
                  <div>
                    <span>费用项合计 : </span>
                    <span>{{totalFee}}</span>
                  </div>
                </template>
              </a-table>
            </div>
          </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleCancel">返回 </a-button>
      </template>
    </a-modal>
    <a-modal
      title="包装选择"
      :visible="packageVisible"
      :width="600"
      @cancel="handleCancelPackage"
      :dialogStyle="{
        top: '160px',
      }"
      destroyOnClose
    >
      <div class="details">
        <div class="table">
          <p class="table-title">商品信息</p>
          <div class="table-data">
            <a-table
              rowKey="packCode"
              :pagination="false"
              :columns="packageColumns"
              :data-source="packageData"
              :scroll="{ y: 200 }"
            >
              <span slot="packUnitPrice" slot-scope="text">
                <span>{{ text }}</span>
              </span>
            </a-table>
          </div>
        </div>

      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleCancelPackage">关闭 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { orderGetsingle } from "../../services/sales";
export default {
  name: "salesOrderDetails",
  data() {
    return {
      packageVisible: false,
      visible: false,
      form: {
        deliveryDate: "",
        customerName: "",
        stateDesc: "",
        orderTypeDesc: "",
        storeName: "",
        opName: "",
        receiptPhone: "",
        receiptRegion: "",
        sno: "",
        payTypeDesc: "",
        receiptAddress: "",
      },
      data: [],
      columns: [
        {
          title: "供应商出货信息",
          children: [
            {
              title: "出厂日期",
              dataIndex: "prodDate",
              width: 150,
              align: "center",
            },
            {
              title: "供应商商品名称",
              dataIndex: "itemName",
              width: 150,
              align: "center",
            },
            {
              title: "供应商商品编码",
              dataIndex: "itemSno",
              width: 150,
              align: "center",
            },
            {
              title: "规格",
              dataIndex: "specs",
              width: 100,
              align: "center",
            },
            {
              title: "出厂数量",
              dataIndex: "saleQty",
              width: 150,
              align: "center",
            },
            // {
            //   title: "出厂重量",
            //   dataIndex: "saleWeight",
            //   width: 150,
            //   align: "center",
            // },
            {
              title: "采购价",
              // title: "供应商单价",
              dataIndex: "supplyPrice",
              width: 150,
              align: "center",
            },
            {
              title: "出厂金额",
              dataIndex: "saleAmount",
              width: 100,
              align: "center",
            },
          ],
        },
        {
          title: "采购及验收信息",
          children: [
            {
              title: "采购数量",
              dataIndex: "roQty",
              width: 150,
              align: "center",
            },
            // {
            //   title: "采购重量",
            //   dataIndex: "roWeight",
            //   width: 150,
            //   align: "center",
            // },
            {
              title: "验收数量",
              dataIndex: "signQty",
              width: 150,
              align: "center",
            },
            // {
            //   title: "验收重量",
            //   dataIndex: "signWeight",
            //   width: 150,
            //   align: "center",
            // },
            {
              title: "验收单价",
              dataIndex: "signPrice",
              width: 150,
              align: "center",
            },
            {
              title: "包装",
              width: 120,
              scopedSlots: { customRender: "Packaging" },
              align: "center",
            },
            {
              title: "验收金额",
              dataIndex: "signAmount",
              width: 150,
              align: "center",
            },
          ],
        },
        {
          title: "成本信息",
          children: [
            {
              title: "成本数量",
              dataIndex: "costQty",
              width: 100,
              align: "center",
            },
            {
              title: "成本单价",
              dataIndex: "costWeight",
              width: 100,
              align: "center",
            },
            {
              title: "成本金额",
              dataIndex: "costPrice",
              width: 100,
              align: "center",
            },
          ],
        },
        {
          title: "增值税", 
          dataIndex: "vat", 
          width: 250, 
          align: "center",
          scopedSlots: { customRender: "vat" }
        }
      ],
      packageData: [],
      packageColumns: [
        {
          title: "包装名称",
          dataIndex: "packName",
          width: 100,
          align: "center",
        },
        {
          title: "包装编号",
          dataIndex: "packCode",
          width: 150,
          align: "center",
        },
        {
          title: "包装数量",
          dataIndex: "packQty",
          width: 100,
          align: "center",
        },
        {
          title: "包装",
          dataIndex: "packUnitPrice",
          width: 110,
          align: "center",
          scopedSlots: { customRender: "packUnitPrice" },
        },
      ],
     priceColumns: [
        {title: "费用类型",dataIndex: "feeType",width: 150,align: "center",scopedSlots: { customRender: "feeType" },},
        {title: "费用项",dataIndex: "feeName",width: 150,align: "center",},
        {title: "收款主体",dataIndex: "receivingSubjectName",width: 280,align: "center",},
        {title: "费用金额",dataIndex: "feeAmount",width: 180,align: "center",},
        {title: "增值税", dataIndex: "rate", width: 250, align: "center",scopedSlots: { customRender: "rate" }},
        {title: "不含税金额", dataIndex: "priceExcludingTax", width: 180, align: "center"},
        {title: "币种", dataIndex: "currency", width: 120, align: "center"},
        {title: "汇率", dataIndex: "exchangeRate", width: 120, align: "center"},
        {title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 200, align: "center"},
        {title: "人民币金额", dataIndex: "currencyAmount", width: 200, align: "center"},
        {title: "备注",dataIndex: "remark",width: 200,align: "center",},
      ],
      priceData: [],
    };
  },
  methods: {
    handleCancelPackage() {
      this.packageVisible = false;
    },
    openPackage(row) {
      this.packageData = row.itemPackList || [];
      this.packageVisible = true;
    },
    openModal(row) {
      const params = {
        id: row.id,
      };
      orderGetsingle(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.form = data.data;
          this.form.contractTitle = row.contractTitle
          this.data = data.data.orderDetailList;
          this.priceData=data.data.orderFeeList||[]
          this.data.forEach((item) => {
            item.supplyPrice = item.supplyPrice ? item.supplyPrice : "";
            item.saleAmount = item.saleAmount ? item.saleAmount : "";
            item.signPrice = item.signPrice ? item.signPrice : "";
            item.signAmount = item.signAmount ? item.signAmount : "";
            item.costWeight = item.costWeight ? item.costWeight : "";
            item.costPrice = item.costPrice ? item.costPrice : "";
          });
          switch (this.form.isPurchaseServer) {
            case 1:
              this.form.isPurchaseServerText = "是";
              break;
            case 0:
              this.form.isPurchaseServerText = "否";
              break;

            default:
              break;
          }
          switch (this.form.serverType) {
            case 1:
              this.form.serverTypeText = "加工服务单";
              break;
            case 2:
              this.form.serverTypeText = "配送服务单";
              break;
            case 3:
              this.form.serverTypeText = "仓储服务单";
              break;

            default:
              break;
          }
          this.visible = true;
        } else {
          this.$message.error("获取详情失败！");
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
  computed: {
     totalFee() {
      return this.priceData.reduce((t, c) => { return this.formatPrice(t + (+c.feeAmount || 0),2 ) }, 0) || "-"
    },
  },
};
</script>
<style scoped lang="less">
.details {
  .info {
    margin-bottom: 10px;
    .info-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
  }
  /deep/.ant-form-item-label {
    line-height: 22px;
  }
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
  .table {
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    .table-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
    .table-data {
      padding: 10px;
    }
    .table-total {
      margin-bottom: 0;
      padding: 0 20px;
      line-height: 35px;
    }
  }
}
</style>