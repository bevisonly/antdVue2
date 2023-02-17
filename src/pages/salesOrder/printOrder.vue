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
          }}{{
            pageState === "gonghuo"
              ? "销售出库单"
              : pageState === "chuku"
              ? "销售单"
              : ""
          }}
        </h1>
        <p class="two-title">NO：{{ form.sno }}</p>
      </div>
      <div class="info">
        <a-row class="row-info" :gutter="16">
          <a-col :span="8">
            <span>客户：{{ form.customerName }}</span>
          </a-col>
          <a-col :span="8" v-if="pageState === 'gonghuo'">
            <span>收货地址：{{ form.receiptRegion }}</span>
          </a-col>
          <a-col :span="8" v-if="pageState === 'chuku'">
            <span>出库仓库：{{ form.opAddress }}</span>
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
                  : form.deliveryType === 2
                  ? "配送"
                  : "暂无"
              }}</span
            >
          </a-col>
          <a-col :span="8" v-if="pageState === 'gonghuo'">
            <span>配送日期：{{ form.deliveryDate }}</span>
          </a-col>
          <a-col :span="8" v-if="pageState === 'chuku'">
            <span>出库时间：{{ form.deliveryDate }}</span>
          </a-col>
          <a-col :span="8">
            <span>车牌：{{ form.carPlate }}</span>
          </a-col>
        </a-row>
      </div>
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
      <div class="info-bottom">
        <a-row :gutter="16" v-if="pageState === 'gonghuo'">
          <a-col :span="6">
            <span>收货单位及经手人：</span>
          </a-col>
          <a-col :span="6">
            <span>发货单位及经手人：</span>
          </a-col>
          <a-col :span="6">
            <span>司机：</span>
          </a-col>
          <a-col :span="6">
            <span>制单：</span>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="pageState === 'chuku'">
          <a-col :span="8">
            <span>发货单位：</span>
          </a-col>
          <a-col :span="8">
            <span>收货单位：</span>
          </a-col>
          <a-col :span="8">
            <span>制单：</span>
          </a-col>
        </a-row>
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
import { orderGetsingle } from "../../services/sales";
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
          dataIndex: "saleQty",
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "salePrice",
          align: "center",
        },
        {
          title: "计价单位",
          dataIndex: "priceUnit",
          align: "center",
        },
        // {
        //   title: "重量",
        //   dataIndex: "saleWeight",
        //   align: "center",
        // },
        {
          title: "金额",
          dataIndex: "saleAmount",
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
    handleCancel() {
      this.visible = false;
    },
    openModal(data, state) {
      this.pageState = state;
      const params = {
        id: data[0].id,
      };
      orderGetsingle(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.form = data.data;
          // this.form.saleAmount = this.form.saleAmount / 100;
          // this.form.supplyPrice = this.form.supplyPrice / 100;
          this.data = data.data.orderDetailList;
          this.visible = true;
        } else {
          this.$message.error("获取详情失败！");
        }
      });
    },
    handleSubmit() {
      this.$print(document.getElementById("print"));
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