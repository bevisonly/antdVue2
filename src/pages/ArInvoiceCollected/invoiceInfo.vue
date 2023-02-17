<template>
  <div id="scrollTop">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="pageTitle"
      @back="
        handleBackRouter(
          '/balance/receiveable/arInvoiceCollectedDetails',
          `/balance/receiveable/${
            titleState == 1
              ? 'arInvoiceWaitSettlement'
              : titleState == 2
              ? 'arInvoiceCollected'
              : ''
          }`
        )
      "
    />
    <invoice-card
      :titleState="titleState"
      :parentData="arData"
      :invoiceInfoList="invoiceInfoList"
      ref="invoiceCard"
    ></invoice-card>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import InvoiceCard from "@/components/tool/InvoiceCard";
import { ReceiptByApInvoiceId } from "../../services/settlement/receive/invoice";
import { GetList } from "../../services/settlement/receive/collected";
import { search } from "@/services/settlement/receive/clearingAccountsNeedget";
export default {
  mixins: [mixin],
  components: { InvoiceCard },
  data() {
    return {
      pageTitle: "",
      titleState: 1,
      arData: {},
      invoiceInfoList: [],
      invoiceAmountData: {},
    };
  },
  computed: {},
  methods: {
    async getMainOrders() {
      const params = {
        rows: 10,
        page: 1,
        arInvoiceCode: this.arData?.arInvoiceCode || "",
      };

      if (this.titleState == 1) {
        let res = await search(params);
        if (res.data.code == 200) {
          let temp = res.data.data?.list[0] || {};
          this.arData = JSON.parse(JSON.stringify(temp));
        }
      }
      if (this.titleState == 2) {
        let res = await GetList(params);
        let temp = res.data?.rows[0] || {};
        this.arData = JSON.parse(JSON.stringify(temp));
      }
    },
    async getArInvioce() {
      let res = await ReceiptByApInvoiceId({
        id: this.arData.id || "",
      });
      const data = res.data;
      if (res.data.code == 200) {
        this.invoiceInfoList = data?.data?.arReceiptApplyList || [];
      } else {
        this.$message.error("发票基本信息获取失败");
      }
    },
    scrollTop() {
      document
        .querySelector("#scrollTop")
        .scrollIntoView({ behavior: "smooth" });
    },
  },
  activated() {
    this.invoiceInfoList = [];
    console.log(this.$route.query);
    if (Object.keys(this.$route.query).length) {
      this.titleState = this.$route.query.titleState || 1;
      this.arData.id = this.$route.query.id || "";
      this.arData.arInvoiceCode = this.$route.query.arInvoiceCode || "";
      this.getMainOrders();
      this.getArInvioce();
      this.$refs.invoiceCard.getInvoiceProductList(this.arData?.id || "");
      if (this.titleState == 1) {
        this.pageTitle = "待结算账款列表";
        this.$setPageTitle(
          "/balance/receiveable/arInvoiceInfo",
          "应收-待结算-发票信息"
        );
      }
      if (this.titleState == 2) {
        this.pageTitle = "已收账款列表";
        this.$setPageTitle(
          "/balance/receiveable/arInvoiceInfo",
          "应收-已收账款-发票信息"
        );
      }
    }
  },
  deactivated() {
    console.log(this.$route.query);
  },
};
</script>

<style lang="less" scoped>
@import "index";
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>