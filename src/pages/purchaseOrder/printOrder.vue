<template>
  <a-modal
    title="打印采购单"
    :visible="visible"
    :width="1100"
    @cancel="handleCancel"
    destroyOnClose
  >
    <div class="print" ref="print" id="print">
      <div class="info">
        <p class="info-title">基本信息</p>
        <div class="info-form">
          <a-form :form="form">
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="6">
                <a-form-item label="需求编号">
                  <a-input disabled v-model="form.roCode" />
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-item label="销售单号">
                  <a-input disabled v-model="form.soCode" />
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
            size="small"
            rowKey="id"
            :pagination="false"
            :columns="columns"
            :data-source="data"
          >
          </a-table>
        </div>
        <p class="table-total">
          {{ settleStateDesc }}
        </p>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="handleCancel"> 取消 </a-button>
      <a-button type="primary" v-print="'#print'"> 确定 </a-button>
      <!-- <a-button type="primary" @click="handleSubmit"> 确定 </a-button> -->
    </template>
  </a-modal>
</template>
<script>
import { purchaseOrderHeadGetSingle } from "../../services/purchaseSaleInventory";
export default {
  name: "printOrder",
  data() {
    return {
      visible: false,
      form: {
        roCode: "",
        soCode: "",
      },
      columns: [
        {
          title: "商品名称",
          dataIndex: "itemName",
          align: "center",
        },
        {
          title: "商品编码",
          dataIndex: "itemCode",
          align: "center",
        },
        {
          title: "客户名称",
          dataIndex: "customerName",
          align: "center",
        },
        {
          title: "门店名称",
          dataIndex: "storeName",
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "poQty",
          align: "center",
        },
        {
          title: "数量单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          title: "重量(KG)",
          dataIndex: "poNetweight",
          align: "center",
        },
        {
          title: "采购单价(元)",
          dataIndex: "poPrice",
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
          align: "center",
        },
        {
          title: "包装费用(元)",
          dataIndex: "packingCost",
          align: "center",
        },
        {
          title: "采购总额",
          dataIndex: "poTotalAmount",
          align: "center",
        },
      ],
      data: [],
      settleStateDesc: "",
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    openModal(row) {
      const params = {
        id: row.id,
      };
      purchaseOrderHeadGetSingle(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.form = data.data;
          this.form = Object.assign(
            this.form,
            this.form.purchaseGlobalOrderDetail
          );
          this.data = data.data.details;
          this.data.forEach((item) => {
            item.poPrice = item.poPrice ? item.poPrice : "";
            item.poTotalAmount = item.poTotalAmount ? item.poTotalAmount : "";
            item.packingCost = item.poTotalAmount ? item.packingCost : "";
          });
          this.settleStateDesc = data.data.settleStateDesc;
          this.visible = true;
        } else {
          this.$message.error("获取详情失败！");
        }
      });
    },
    handleSubmit() {
      this.$print(document.getElementById("print"));
    },
    // getData(row) {
    //   const params = {
    //     id: row.id,
    //   };
    //   purchaseOrderHeadGetSingle(params).then((res) => {
    //     const data = res.data;
    //     if (data.code === "200") {
    //       this.form = data.data;
    //       this.form = Object.assign(
    //         this.form,
    //         this.form.purchaseGlobalOrderDetail
    //       );
    //       this.data = data.data.details;
    //       this.settleStateDesc = data.data.settleStateDesc;
    //       this.modalType = data.data.poType; //1.国内订单、2.国际订单
    //       this.priceData = data.data.purchaseFeeList;
    //       this.$print(this.$refs.print);
    //     } else {
    //       this.$message.error("获取详情失败！");
    //     }
    //   });
    // },
  },
};
</script>
<style lang="less" scoped>
.print {
  width: 100%;
  padding: 0;
  margin: 0;
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
<style lang="less" scoped>
@media print {
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
}
</style>