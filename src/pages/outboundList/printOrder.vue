<template>
  <a-modal
    title="打印"
    :visible="visible"
    :width="1100"
    @cancel="handleCancel"
    destroyOnClose
    :maskClosable='false'
  >
    <div class="print" ref="printToWh" id="printToWh">
      <div class="title">
        <h1>{{ form.opName }}出库单</h1>
        <p class="two-title" v-if="form.docNo">关联单号：{{ form.docNo }}</p>
      </div>
      <div class="info">
        <a-row class="row-info" :gutter="16">
          <a-col :span="8">
            <span>供应商：{{ form.partnerName }}</span>
          </a-col>
          <a-col :span="8">
            <span>收货地址：{{ form.partnerAddress }}</span>
          </a-col>
          <a-col :span="8">
            <span>电话：{{ form.partnerPhone }}</span>
          </a-col>
        </a-row>
      </div>
      <div class="table-data">
        <a-table
          size="middle"
          rowKey="id"
          :pagination="false"
          :columns="columns"
          :data-source="data"
        >
          <span slot="poPrice" slot-scope="text">
            {{ text || "-" }}
          </span>
          <span slot="totalCostOfWarehousing" slot-scope="text">
            {{ text || "-" }}
          </span>
        </a-table>
        <div class="total">
          <span> 合计 : {{ amountTotalUpper || "--" }} </span>
          <span>数量 : {{ qtyTotal }}</span>
          <span
            >金额 : {{ amountTotal ? formatPrice(amountTotal) : "--" }}</span
          >
        </div>
      </div>
      <div class="info-bottom">
        <a-row :gutter="16">
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
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleSubmit">打印</a-button>
    </template>
  </a-modal>
</template>
<script>
import { GetDetails } from "../../services/warehouseManagement/outWarehouse/ForOutboundList";
import { priceUppercase } from "../../utils/tool";
export default {
  name: "printOrder",
  data() {
    return {
      visible: false,
      form: {},
      columns: [
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
        {
          title: "数量",
          dataIndex: "deliveryQty",
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "poPrice",
          align: "center",
          scopedSlots: { customRender: "poPrice" },
        },
        {
          title: "计价单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          title: "金额",
          dataIndex: "totalCostOfWarehousing",
          align: "center",
          scopedSlots: { customRender: "totalCostOfWarehousing" },
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
        },
      ],
      data: [],
      traditionalValue: "",
    };
  },
  computed: {
    qtyTotal() {
      let qty = 0;
      this.data.forEach((item) => {
        if (item.deliveryQty) {
          qty += Number(item.deliveryQty);
        }
      });
      return qty;
    },
    amountTotal() {
      let amount = 0;
      this.data.forEach((item) => {
        if (item.totalCostOfWarehousing) {
          amount += Number(item.totalCostOfWarehousing);
        }
      });
      return amount;
    },
    amountTotalUpper() {
      let amount = 0;
      this.data.forEach((item) => {
        if (item.totalCostOfWarehousing) {
          amount += Number(item.totalCostOfWarehousing);
        }
      });
      return priceUppercase(amount);
    },
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    openModal(record) {
      console.log(record);
      this.form = {
        docNo: record.docNo,
        opName: record.opName,
        partnerName: record.partnerName,
        partnerPhone: record.partnerPhone,
        partnerAddress: record.partnerAddress,
      };
      console.log(this.form);
      const params = {
        docNo: record.docNo ? record.docNo : record.imItemCode,
        type: record.imItemType,
      };
      GetDetails(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.data = data.data.imItemDetailDtoList;
          this.traditionalValue = data.data.traditionValue || "";
          this.visible = true;
        } else {
          this.$message.error("获取打印数据失败！");
        }
      });
    },
    handleSubmit() {
      this.$print(document.getElementById("printToWh"));
    },
  },
};
</script>
<style lang="less" scoped>
.print {
  width: 100%;
  padding: 0;
  margin: 0;
  .title {
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
.total {
  margin-top: 10px;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  padding-right: 100px;
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