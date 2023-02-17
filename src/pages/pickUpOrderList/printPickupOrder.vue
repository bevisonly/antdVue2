<template>
  <div>
    <a-modal :width="1100" v-model="visible" title="打印单" @ok="handleOk" destroyOnClose>
      <div class="basic-data" id="printPickUpOrder">
        <p class="info-title title">基本信息</p>
        <div class="data">
          <a-row :gutter="16">
            <a-col :span="12">
              供应商名称 : <span>{{ basicForm.supplierName }}</span>
            </a-col>
            <a-col :span="12">
              供应商联系手机 : <span>{{ basicForm.supplierPhone }}</span>
            </a-col>
          </a-row>
        </div>
        <div class="table-infor" style="margin-top: 20px">
          <p class="table-title title">收货单商品</p>
          <a-table
            :columns="columns"
            :data-source="tableList"
            rowKey="id"
            :pagination="false"
            bordered
            size="small"
          >
          </a-table>
        </div>
        <div class="table-infor" style="margin-top: 20px" v-if="feetableList[0]">
          <p class="table-title title">费用项列表</p>
          <a-table
            :columns="feeColumns"
            :data-source="feetableList"
            rowKey="id"
            :pagination="false"
            bordered
            size="small"
          >
            <span slot="feeType" slot-scope="text">{{text == 1 ? '国内' : text == 2 ? '国际' : '其他'}}</span>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { pickUpOrderSingle } from "../../services/pickUpOrder/pickUpOrderList";
const feeColumns = [
  {title: "费用类型", dataIndex: "feeType", scopedSlots: { customRender: "feeType" }},
  {title: "费用项", dataIndex: "feeName"},
  {title: "收款主体", dataIndex: "receivingSubjectName"},
  {title: "清关单号", dataIndex: "customsClearanceFeeNumber"},
  {title: "费用金额",dataIndex: "feeAmount"},
  {title: "税率(%)", dataIndex: "rate",},
  {title: "不含税金额", dataIndex: "priceExcludingTax",},
  {title: "币种", dataIndex: "currency",},
  {title: "汇率", dataIndex: "exchangeRate",},
  {title: "外币金额", dataIndex: "foreignCurrencyAmount",},
  {title: "人民币金额", dataIndex: "currencyAmount",},
  {title: "备注", dataIndex: "remark"},
];
const columns = [
  {
    align: "center",
    title: "商品编号",
    dataIndex: "itemCode",
    // width: 150,
  },
  {
    align: "center",
    title: "商品名称",
    dataIndex: "itemName",

    // width: 150,
  },
  {
    align: "center",
    title: "客户名称",
    dataIndex: "customerName",

    // width: 250,
  },
  {
    align: "center",
    title: "门店名称",
    dataIndex: "storeName",
    // width: 150,
  },
  {
    align: "center",
    title: "规格",
    dataIndex: "itemSpec",
    // width: 120,
  },
  {
    align: "center",
    title: "实际采购单价(元)",
    dataIndex: "poPrice",
    // width: 100,
  },
  {
    align: "center",
    title: "采购重量(kg)",
    dataIndex: "poNetweight",
    // width: 100,
  },
  {
    align: "center",
    title: "采购件数",
    dataIndex: "poQty",
    // width: 100,
  },
  {
    align: "center",
    title: "数量单位",
    // width: 100,
    dataIndex: "unit",
    // key: "deliveryAdress",
  },

  {
    align: "center",
    title: "计价单位",
    dataIndex: "priceUnit",
    // key: "opreation",
    // width: 100,
    // scopedSlots: { customRender: "opreation" },
  },
  {
    align: "center",
    title: "收货重量(kg)",
    dataIndex: "weight",

    // width: 100,
  },
  {
    align: "center",
    title: "收货数量",
    dataIndex: "qty",

    // width: 80,
  },
  {
    align: "center",
    title: "包装费用",
    dataIndex: "unitPrice",

    // width: 100,
  },
  {
    align: "center",
    title: "商品金额",
    dataIndex: "itemPrice",

    // width: 100,
  },
  {
    align: "center",
    title: "实际采购总额",
    dataIndex: "poTotalAmount",

    // width: 120,
  },
];
export default {
  props: {
    dataList: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      feeColumns,
      visible: false,
      columns,
      basicForm: {
        supplierName: "",
        supplierPhone: "",
      },
      paramId: "",
      tableList: [],
      feetableList: [],
      tableLoading: false,
    };
  },
  methods: {
    getDetails(id) {
      let temp = this.dataList;
      const params = {
        poCode: "",
        partnerName: "",
      };
      temp.forEach((v) => {
        if (v.id == id) {
          params.poCode = v.poCode || "";
          params.partnerName = v.partnerName || "";
          this.basicForm.supplierName = v.supplierName || "";
          this.basicForm.supplierPhone = v.supplierPhone || "";
        }
      });
      this.tableLoading = true;
      pickUpOrderSingle(params).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.tableList = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    showModal(record) {
      this.paramId = record.id;
      this.getDetails(record.id);
      this.feetableList = this.typeis(record.purchaseFeeList, 'array') ? record.purchaseFeeList : [];
      this.$parent.selectedRowKeys.splice(0);
      this.$parent.selectedRows.splice(0);
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
      this.$print(document.getElementById("printPickUpOrder"));
    },
  },
};
</script>
<style lang="less" scoped>
p.title {
  background-color: #f0f3f6;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}
</style>
<style lang="less" scoped>
@media print {
  /deep/.ant-table {
    font-family: Microsoft YaHei;
    color: #000;
  }
  /deep/.ant-table-thead > tr > th {
    color: #000;
  }
}
</style>