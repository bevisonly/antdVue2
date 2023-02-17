<template>
  <div id="scrollTop">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回发票管理"
      @back="handleBack"
    />
    <invoice-card
      :titleState="titleState"
      :parentData="arInvioceData"
      :invoiceInfoList="invoiceInfoList"
      ref="invoiceCard"
      @stateChange='stateChange'
    ></invoice-card>
    <invoiceRegister ref="invoiceRegister" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import invoiceRegister from "./invoiceRegister.vue";
import InvoiceCard from "@/components/tool/InvoiceCard";
import { ViewReceiptApply } from "../../services/settlement/receive/invoice";
export default {
  mixins: [mixin],
  components: { invoiceRegister, InvoiceCard },
  data() {
    return {
      titleState: 3,
      invoiceInfoList: [],
      arInvioceData: {},
      arInvoiceCodeState: 1,
      form:{
        id:''
      }
    };
  },
  computed: {},
  methods: {
    stateChange(state){
      this.arInvoiceCodeState=state
      this.getList(this.form.id)
    },
    //删除发票
    deleteInvoice(record) {
      console.log(record);
    },
    toRegister() {},
    scrollTop() {
      document
        .querySelector("#scrollTop")
        .scrollIntoView({ behavior: "smooth" });
    },

    handleBack() {
      let a = "/balance/receiveable/arInvoiceDetails",
        b = "/balance/receiveable/ArInvoiceReceipt";
      this.$closePage(a, b);
    },
    async getList(id) {
      const params = {
        id: id || "",
        arInvoiceCodeState: this.arInvoiceCodeState,
      };
      let res = await ViewReceiptApply(params);
      const data = res.data;
      if (data.code == 200) {
        console.log(data.data.receiptApply);
        let temp=data.data.receiptApply||{}
        this.invoiceInfoList.push(temp);
        this.arInvioceData=data.data?.receiptApply||{}
        this.$refs.invoiceCard.getInvoiceProductList(
          "",
          data.data?.arInvoiceDetailList || []
        );
      }
    },
  },
  activated() {
    this.invoiceInfoList=[]
    this.arInvioceData={}
    if (Object.keys(this.$route.query).length) {
      console.log(111);
      this.form.id=this.$route.query.id||''
      console.log(this.form.id);
      this.getList(this.form.id);
    }
  },
};
</script>

<style lang="less" scoped>
@import "index";
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>