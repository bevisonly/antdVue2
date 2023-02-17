<template>
  <div id="scrollTop">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="已收账款列表"
      @back="
        handleBackRouter(
          '/balance/receiveable/arInvoiceCollectedDetails',
          '/balance/receiveable/arInvoiceCollected'
        )
      "
    />
    <div>
      <a-card
        title="订单信息"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        class="top20"
      >
        <detail-list :col="3">
          <detail-list-item term="结算单号">{{
            orderInfo.arInvoiceCode
          }}</detail-list-item>
          <detail-list-item term="运营主体">{{
            orderInfo.opName
          }}</detail-list-item>
          <detail-list-item term="客户名称">{{
            orderInfo.customerName
          }}</detail-list-item>
          <detail-list-item term="门店名称">{{
            orderInfo.storeName
          }}</detail-list-item>
          <detail-list-item term="客户订单号">
            {{ orderInfo.customerSno }}</detail-list-item
          >
          <detail-list-item term="单据金额"
            >{{ orderInfo.totalAmount }}
          </detail-list-item>
        </detail-list>
        <detail-list :col="1">
          <detail-list-item term="单据图片">
            <div v-for="(item, index) in imgData" :key="index">
              <img
                style="width: 80px"
                :src="item.filePath"
                alt=""
                @click="bigImg(item.filePath)"
              />
            </div>
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card
        title="关联银行流水"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        class="top20"
      >
        <!-- 银行流水 -->
        <p v-for="(item, i) in relationList" :key="i">
          <span @click="downloadXsl(item)">{{ item.fileName }}</span>
        </p>
        <a-table
          bordered
          ref="tableRef"
          :columns="columnsx"
          :data-source="relationList"
          rowKey="id"
          :scroll="{ x: 307.778 }"
          :pagination="false"
        >
          <span slot="status" slot-scope="text, record">
            <a-tag color="#999999" v-show="record.status == 0">
              <div style="width: 48px; text-align: center">
                {{ option.status[text] }}
              </div>
            </a-tag>
            <a-tag color="#F59A23" v-show="record.status == 1">
              {{ option.status[text] }}
            </a-tag>
            <a-tag color="#5F9900" v-show="record.status == 2">
              <div style="width: 48px; text-align: center">
                {{ option.status[text] }}
              </div>
            </a-tag>
          </span>
          <span slot="accountNumber" tips="本方账户账号" slot-scope="text"
            ><div>{{ strExchange(text) }}</div></span
          >
          <span slot="oppAccNo" tips="对方账户账号" slot-scope="text"
            ><div>{{ strExchange(text) }}</div></span
          >
          <span slot="fileName" tips="文件名" slot-scope="text, record">
            <a-button
              type="link"
              style="text-decoration: underline"
              @click="downloadXsl(record)"
              >{{ text }}</a-button
            >
          </span>
        </a-table>
      </a-card>
      <!-- 结算单明细 -->
      <a-card
        title="结算单明细列表"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        class="top20"
      >
        <div style="margin-bottom: 10px">
          <a-radio-group
            v-model="arInvoiceCodeState"
            button-style="solid"
            @change="arInvoiceCodeStateChange"
          >
            <a-radio-button :value="1"> 按订单查看 </a-radio-button>
            <a-radio-button :value="2"> 按商品查看</a-radio-button>
          </a-radio-group>
        </div>
        <a-table
          :data-source="arInvoiceDetailList"
          :columns="detailsColumns"
          :pagination="false"
          :scroll="{ x: 1600, y: 900 }"
        >
          <span slot="vat" slot-scope="text, record">
            {{
              record.invoiceBusinessType == 0
                ? "应税 -"
                : record.invoiceBusinessType == 1
                ? "免税 -"
                : ""
            }}
            {{
              record.invoiceType == 1
                ? "普票 -"
                : record.invoiceType == 2
                ? "专票 -"
                : record.invoiceType == 3
                ? "普票(免税) -"
                : ""
            }}{{
              record.invoiceType == 3
                ? "抵扣率"
                : record.invoiceType == 1 || record.invoiceType == 2
                ? "税率"
                : ""
            }}
            {{ record.vat + "%" }}
          </span>
          <template tips="合计" slot="footer" slot-scope="currentPageData">
            本页合计：
            <span v-if="currentPageData">
              本页合计：
              <span v-for="(item, j) in footerTotal" :key="item.name">
                <span class="greyfont">{{ item.name }}</span>
                &lt;<span class="redfont">{{
                  currentPageData.reduce(
                    (t, c) => formatPrice(+t + +c[item.value]),
                    0
                  )
                }}</span
                >&gt;
                <a-divider
                  v-show="j != footerTotal.length - 1"
                  type="vertical"
                />
              </span>
            </span>
          </template>
        </a-table>
      </a-card>
    </div>
    <invoice-card
      :titleState="titleState"
      :parentData="orderInfo"
      :invoiceInfoList="invoiceInfoList"
      ref="invoiceCard"
      class="top20"
    ></invoice-card>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
      width="40%"
    >
      <img alt="发票" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import DetailList from "@/components/tool/DetailList";
import InvoiceCard from "@/components/tool/InvoiceCard";
const DetailListItem = DetailList.Item;
import { GetList } from "@/services/settlement/receive/collected";
import {
  getImgURL,
  details,
} from "@/services/settlement/receive/clearingAccountsNeedget";
import {
  FindRelateDataAr,
  FindRelateDataById,
} from "../../services/settlement/receive/collected";
import { ReceiptByApInvoiceId } from "../../services/settlement/receive/invoice";
const detailsColumns = [
  { title: "商品名称", dataIndex: "itemName", width: 200 },
  { title: "商品编码", dataIndex: "itemCode", width: 200 },
  { title: "客户", dataIndex: "customerName", width: 260 },
  { title: "门店名称", dataIndex: "storeName", width: 260 },
  { title: "数量", dataIndex: "qty", width: 140 },
  { title: "单位", dataIndex: "unit", width: 140 },
  { title: "计价单位", dataIndex: "priceUnit", width: 180 },
  { title: "单价(元)", dataIndex: "signPrice", width: 180 },
  { title: "包装类型", dataIndex: "packType", width: 180 },
  { title: "包装金额", dataIndex: "packAmount", width: 180 },
  { title: "单据金额", dataIndex: "signAmount", width: 180 },
  { title: "扣点金额", dataIndex: "deductionAmount", width: 180 },
  { title: "应收金额", dataIndex: "receivableAmount", width: 180 },
  { title: "税额", dataIndex: "taxAmount", width: 180 },
  { title: "不含税金额", dataIndex: "includingTaxAmount", width: 180 },
  {
    title: "增值税",
    dataIndex: "vat",
    width: 200,
    scopedSlots: { customRender: "vat" },
  },
];
const columnsx = [
  { title: "交易时间", dataIndex: "transDatetime", width: 180 },
  {
    title: "关联状态",
    dataIndex: "status",
    width: 160,
    scopedSlots: { customRender: "status" },
  },
  { title: "关联账单", dataIndex: "relatedBill", width: 200 },
  { title: "本方组织", dataIndex: "orgName", width: 260 },
  { title: "本方账户银行", dataIndex: "bankName", width: 260 },
  { title: "本方账户户名", dataIndex: "accountName", width: 260 },
  {
    title: "本方账户账号",
    dataIndex: "accountNumber",
    width: 260,
    scopedSlots: { customRender: "accountNumber" },
  },
  { title: "币种", dataIndex: "currencyCode", width: 120 },
  { title: "收入", dataIndex: "income", width: 150 },
  { title: "对方账户户名", dataIndex: "oppAccName", width: 260 },
  {
    title: "对方账户账号",
    dataIndex: "oppAccNo",
    width: 320,
    scopedSlots: { customRender: "oppAccNo" },
  },
  { title: "对方开户行", dataIndex: "oppBank", width: 320 },
  { title: "银行流水号", dataIndex: "bankSerialNumber", width: 240 },
  { title: "用途", dataIndex: "purpose", width: 260 },
  { title: "摘要", dataIndex: "description", width: 160 },
  { title: "备注", dataIndex: "noteAppended", width: 260 },
  {
    title: "文件名",
    dataIndex: "fileName",
    width: 300,
    scopedSlots: { customRender: "fileName" },
  },
  { title: "上传人", dataIndex: "createUser", width: 160 },
  { title: "上传时间", dataIndex: "createDate", width: 180 },
];
export default {
  mixins: [mixin],
  components: { DetailListItem, DetailList, InvoiceCard },
  data() {
    return {
      orderInfo: {},
      imgData: [],
      previewImage: "",
      previewVisible: false,
      footerTotal: [
        { name: "数量", value: "qty" },
        { name: "包装金额", value: "packAmount" },
        { name: "单据金额", value: "signAmount" },
        { name: "扣点金额", value: "deductionAmount" },
        { name: "应收金额", value: "receivableAmount" },
        { name: "税额", value: "taxAmount" },
        { name: "不含税额", value: "includingTaxAmount" },
      ],
      detailsColumns,
      arInvoiceCodeState: 1, //
      arInvoiceDetailList: [],
      relationParams: [],
      relationList: [],
      option: { status: ["未关联", "部分关联", "已关联"] },
      columnsx,
      titleState: 2.1,
      invoiceInfoList: [],
    };
  },
  computed: {},
  methods: {
    async getInvoiceDetails() {
      let res = await ReceiptByApInvoiceId({ id: this.orderInfo.id || "" });
      const data = res.data;
      if (data.code == 200) {
        this.invoiceInfoList = data?.data?.arReceiptApplyList || [];
      } else {
        this.$message.error("发票基本信息获取失败");
      }
    },
    //--------------------
    strExchange(str) {
      return String(str || "")?.replace(/(?<=.{4}).{1}(?=.{4})/g, "*");
    },
    downloadXsl(item) {
      let link = document.createElement("a");
      link.setAttribute("download", item.fileName || "文件");
      link.setAttribute("href", item.filePath);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    //获取关联流水列表
    async getRelationList() {
      console.log(111);
      let temp = [];
      this.relationParams.forEach((item) => {
        temp.push(item.yocylId);
      });
      let res = await FindRelateDataById({ ids: temp });
      if (res.data.code == 200) {
        this.relationList = res.data.data || [];
      } else {
        this.$message.error("获取关联流水列表失败");
      }
    },
    //获取关联流水的参数
    async getRelationData() {
      const params = {
        docId: this.orderInfo.id || "",
        relateType: 1,
      };
      let res = await FindRelateDataAr(params);
      if (res.data.code == 200) {
        this.relationParams = res.data.data || [];
        if (this.relationParams && this.relationParams.length > 0) {
          this.getRelationList();
        }
      } else {
        this.$message.error("获取关联流水参数失败");
      }
    },
    arInvoiceCodeStateChange() {
      this.getArDetails();
    },
    //图
    bigImg(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    scrollTop() {
      document
        .querySelector("#scrollTop")
        .scrollIntoView({ behavior: "smooth" });
    },
    getImgURL(id) {
      console.log(id);
      getImgURL({ tableId: id, tableName: "ar_settlement" }).then(
        (res) => res.data.code == 200 && (this.imgData = res.data.data || [])
      );
    },
    async getArDetails() {
      const params = {
        order: "desc",
        sort: "id",
        arInvoiceId: this.orderInfo.id || "",
        arInvoiceCodeState: this.arInvoiceCodeState,
      };
      let res = await details(params);
      if (res.data.code == 200) {
        this.arInvoiceDetailList = res.data.data || [];
      } else {
        this.$message.error(res.data.message);
      }
    },
    async getArinvoiceSingle() {
      const params = {
        rows: 10,
        page: 1,
        arInvoiceCode: this.orderInfo?.arInvoiceCode || "",
      };
      let res = await GetList(params);
      this.orderInfo = res.data?.rows[0] || {};
    },
  },
  activated() {
    if (Object.keys(this.$route.query).length) {
      this.orderInfo.id = this.$route.query.id || "";
      this.orderInfo.arInvoiceCode = this.$route.query.arInvoiceCode || "";
      this.getArinvoiceSingle();
      console.log(this.$route.query);
      this.getImgURL(this.$route.query.id);
      this.getArDetails();
      this.getRelationData();
      this.getInvoiceDetails()
    }
  },
};
</script>

<style lang="less" scoped>
@import "index";
/deep/.ant-form-item {
  margin-bottom: 0;
}
.top20 {
  margin-top: 20px;
}
</style>