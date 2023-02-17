<template>
  <a-modal
    title="打印"
    :visible="visible"
    :width="1100"
    @cancel="handleCancel"
    destroyOnClose
  >
    <div class="print" ref="print" id="print">
      <div class="title">
        <h1>
          {{ form.opName
          }}{{ pageState === 1 ? "供货单" : pageState === 2 ? "出库单" : "" }}
        </h1>
        <p class="two-title">NO：{{ form.sno }}</p>
      </div>
      <div class="info">
        <a-row class="row-info" :gutter="16">
          <a-col :span="8">
            <span>客户：{{ form.customerName }}</span>
          </a-col>
          <a-col :span="8" v-if="pageState === 1">
            <span>收货地址：{{ form.receiptAddress }}</span>
          </a-col>
          <a-col :span="8" v-if="pageState === 2">
            <span>出库仓库：{{ form.whName }}</span>
          </a-col>
          <a-col :span="8">
            <span>电话：{{ form.receiptPhone }}</span>
          </a-col>
        </a-row>
        <a-row class="row-info" :gutter="16">
          <a-col :span="8">
            <span
              >配送方式：{{
                form.deliveryType === 1
                  ? "自提"
                  : form.deliveryType === 1
                  ? "配送"
                  : "暂无"
              }}</span
            >
          </a-col>
          <a-col :span="8" v-if="pageState === 1">
            <span>配送日期：{{ form.deliveryDate }}</span>
          </a-col>
          <a-col :span="8" v-if="pageState === 2">
            <span>出库时间：{{ form.deliveryDate }}</span>
          </a-col>
          <a-col :span="8">
            <span>车牌：{{ form.carPlate }}</span>
          </a-col>
        </a-row>
      </div>
      <div class="table-data">
        <a-table
          size="middle"
          rowKey="id"
          :pagination="false"
          :columns="pageState === 1 ? columns2 : columns"
          :data-source="data"
          bordered
          :rowClassName="rowClassNameChange"
        >
        </a-table>
      </div>
      <div class="info-bottom">
        <a-row :gutter="16" v-if="pageState === 1">
          <a-col :span="6">
            <span>收货单位及经手人：</span>
          </a-col>
          <a-col :span="6">
            <span>发货单位及经手人：</span>
          </a-col>
          <a-col :span="6">
            <span>审核人：</span>
          </a-col>
          <a-col :span="6">
            <span>制单：</span>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="pageState === 2">
          <a-col :span="4"></a-col>
          <a-col :span="6">
            <span>出库管理员：</span>
          </a-col>
          <a-col :span="6">
            <span>保管员：</span>
          </a-col>
          <a-col :span="6">
            <span>制单：</span>
          </a-col>
        </a-row>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="handleCancel"> 取消 </a-button>
      <a-button type="primary" v-print="'#print'"> 确定 </a-button>
    </template>
  </a-modal>
</template>
<script>
import { GetDetails, GetWarehouse } from "../../services/signed/signed";
import { priceUppercase, add } from "../../utils/tool";
export default {
  name: "printOrder",
  data() {
    return {
      visible: false,
      form: {
        customerName: "",
        receiptRegion: "",
        receiptPhone: "",
        deliveryType: "",
        deliveryDate: "",
        carPlate: "",
      },
      columns: [
        { title: "序号", dataIndex: "keyIndex", align: "center" },
        {
          title: "商品编码",
          dataIndex: "itemSno",
          align: "center",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "specs",
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "signQty",
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "signPrice",
          align: "center",
        },
        {
          title: "计价单位",
          dataIndex: "priceUnit",
          align: "center",
        },
        {
          title: "金额",
          dataIndex: "signItemAmount",
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
        },
      ],
      columns2: [
        {
          title: "序号",
          dataIndex: "keyIndex",
          align: "center",
        },
        {
          title: "商品编码",
          dataIndex: "itemSno",
          align: "center",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "specs",
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "deliveryCount",
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "costPrice",
          align: "center",
        },
        {
          title: "计价单位",
          dataIndex: "priceUnit",
          align: "center",
        },
        {
          title: "金额",
          dataIndex: "costAmount",
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
        },
      ],
      data: [],
      pageState: "",
    };
  },
  methods: {
    rowClassNameChange(record) {
      if (record.keyIndex === "合计 :") {
        console.log("合计");
        return "totalcomputed";
      }
    },
    handleCancel() {
      this.visible = false;
    },
    // async getWhName(id) {
    //   const res = await GetWarehouse({ id: id });
    //   if (res.data.code === "200") {
    //     this.form.whName = res.data.data;
    //   } else {
    //     this.$message.error(res.data.message);
    //   }
    // },
    async openModal(data, state, flag) {
      this.pageState = state;
      const params = {
        id: data[0].id,
      };
      const res = await GetDetails(params);
      if (res.data.code === "200") {
        this.form = res.data.data.order;
        this.data = res.data.data.orderDetailDtoList || [];
        if (flag == 3) {
          this.form.whName = res.data.data.purchaseOrderHead?.whName
        }
        if (this.data && this.data.length > 0) {
          this.data.forEach((item, index) => {
            item.keyIndex = index + 1;
          });
          let price = 0,
            qty = 0;
          this.data.forEach((item) => {
            if (this.pageState === 1) {
              price = add(price, item.costAmount ? Number(item.costAmount) : 0);
              qty = add(qty, item.deliveryCount ? Number(item.deliveryCount) : 0);
            }
            if (this.pageState === 2) {
              price = add(price, item.signItemAmount ? Number(item.signItemAmount) : 0);
              qty = add(qty, item.signQty ? Number(item.signQty) : 0);
              if (flag == 3) {
                item.signQty = item.saleQty
                item.signPrice = item.salePrice
                item.signItemAmount = item.saleAmount
              }
            }
          });
          this.data.push(
            this.pageState === 1
              ? {
                  keyIndex: "合计 :",
                  itemSno: ` ${priceUppercase(price)}`,
                  deliveryCount: `${qty==0?'':qty}`,
                  costAmount: `${price}`,
                }
              : {
                  keyIndex: "合计 :",
                  itemSno: ` ${priceUppercase(price)}`,
                  signQty: `${qty==0?'':qty}`,
                  signItemAmount: `${price}`,
                }
          );
        }
      } else {
        this.$message.error("获取打印数据失败！");
      }
      if (state === 2 && flag != 3) {
        const result = await GetWarehouse({ id: data[0].id });
        if (result.data.code === "200") {
          this.form.whName = result.data.data;
        } else {
          this.$message.error(result.data.message);
        }
      }
      this.$parent.selectedRows = []
      this.$parent.selectedRowKeys = []
      this.visible = true;
    },
    handleSubmit() {
      this.$print(document.getElementById("print"));
    },
  },
};
</script>
<style lang="less" scoped>
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
.print {
  width: 100%;
  padding: 0;
  margin: 0;
  color: #000;
  .title {
    h1 {
      font-weight: 900;
    }
    h1,
    p {
      padding: 0;
      margin: 0;
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
  .ant-modal-body {
    padding: 0;
    margin: 0;
  }
  .ant-modal-content {
    box-shadow: none;
  }
  /deep/.ant-table-thead > tr > th {
    color: #000;
  }
  /deep/.ant-table {
    font-family: Microsoft YaHei;
    color: #000;
  }
  #print {
    font-family: Source Han Sans CN,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif !important;
  }
}
</style>