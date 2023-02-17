<template>
  <div id="scrollTop">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回发票管理"
      @back="handleBack"
    />
    <a-card
      title="发票登记"
      :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
      :body-style="{ padding: '12px,2px' }"
      size="small"
    >
      <div style="margin-bottom: 10px">
        <span>添加发票 : </span>
        <a-button
          icon="plus"
          type="dashed"
          @click="toRegister"
          :disabled="dashBtn > 49||registerClose"
          >登记发票</a-button
        >
      </div>

      <a-table
        :columns="columns"
        :data-source="form.apReceiptList"
        :scroll="{ x: 1100, y: 900 }"
        size="middle"
        :pagination="false"
        v-if="form.apReceiptList"
        :loading="loading"
      >
        <span slot="invoiceState" slot-scope="text">
          <a-tag v-if="text == 1" color="blue">待登记</a-tag>
          <a-tag v-if="text == 2" color="orange">已登记</a-tag>
          <a-tag v-if="text == 3" color="red">审核失败</a-tag>
          <a-tag v-if="text == 4" color="purple">已修正</a-tag>
          <a-tag v-if="text == 5" color="green">已核销</a-tag>
        </span>
        <span slot="invoiceType" slot-scope="text">
          <span v-if="text == 1">增值税专用发票</span>
          <span v-if="text == 2">增值税普通发票</span>
        </span>
        <span slot="fileList" slot-scope="text, record">
          <span v-if="record.fileList">
            <a-space>
              <span v-for="(item, index) in record.fileList" :key="index">
                <img
                  style="width: 30px; height: 20px"
                  :src="item.filePath"
                  @click="bigImg(item.filePath)"
                  alt="发票"
                />
              </span>
            </a-space>
          </span>
        </span>
        <div slot="operation" slot-scope="text, record">
          <a-space>
            <a-button
              type="link"
              @click="editInvoice(record)"
              :disabled="record.invoiceState == 5"
              >编辑</a-button
            >
            <a-button
              type="link"
              @click="deleteInvoice(record)"
              :disabled="record.invoiceState == 5"
              >删除</a-button
            >
          </a-space>
        </div>
        <template slot="footer">
          <div>
            合计 : 发票金额 :
            <span>{{
              form.apReceiptList.reduce((t, c) => {
                return formatPrice(+t + +c.invoiceAmount, 2) || 0;
              }, 0)
            }}</span>
          </div>
        </template>
      </a-table>
      <a-empty v-else></a-empty>
    </a-card>
    <!-- 订单信息 -->
    <a-card
      title="订单信息"
      :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
      :body-style="{ padding: '12px,2px' }"
      size="small"
    >
      <a-form>
        <a-row :gutter="12">
          <a-col :span="6">
            <a-form-item label="结算单号">
              <a-input v-model="form.apInvoiceCode" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商名称">
              <a-input v-model="form.supplierName" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="公司余额">
              <a-input v-model="form.companyBalance" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="单据金额">
              <a-input
                v-if="form.dataType == 2"
                readOnly
                v-model="form.payAmount"
              ></a-input>
              <a-input
                v-else
                v-model="form.settlementAmount"
                readOnly
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="6">
            <a-form-item label="支付方式">
              <a-input v-model="form.payType" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="结算货币">
              <a-input v-model="form.currency" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="预付金额">
              <a-input v-model="form.payAmount" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="结算状态">
              <a-input
                :value="
                  form.state == 1
                    ? '未结算'
                    : form.state == 2
                    ? '结算中'
                    : form.state == 3
                    ? '部分结算'
                    : '已结算'
                "
                readOnly
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="6">
            <a-form-item label="已付金额">
              <a-input v-model="form.payAmounted" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="本次结算金额">
              <a-input
                v-if="form.dataType == 2"
                readOnly
                v-model="form.payAmount"
              ></a-input>

              <a-input
                v-else
                v-model="form.surplusPayAmount"
                readOnly
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="未付金额">
              <a-input v-model="form.noPayAmount" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="折扣金额">
              <a-input v-model="form.discountAmount" readOnly></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="6">
            <a-form-item label="备注">
              <a-input v-model="form.remark" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属运营主体">
              <a-input v-model="form.opName" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="柜号">
              <a-input v-model="form.containerCode" readOnly></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="上传图片">
              <span v-if="fileList">
                <a-space>
                  <span v-for="(item, index) in fileList" :key="index">
                    <img
                      style="width: 100px; height: 100px"
                      :src="item.filePath"
                      @click="bigImg(item.filePath)"
                      alt="发票"
                    />
                  </span>
                </a-space>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <!-- 明细 -->
    <a-card
      title="结算单明细列表"
      :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
      :body-style="{ padding: '12px,2px' }"
      size="small"
      v-if="form.apInvoiceDetailList && form.apInvoiceDetailList.length > 0"
    >
      <a-table
        :columns="columnsP"
        :data-source="form.apInvoiceDetailList"
        size="middle"
        :pagination="false"
        :scroll="{ y: 800, x: 1100 }"
      >
        <span slot="inputTaxRate" slot-scope="text, record">
          <span>
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
            {{ record.inputTaxRate + "%" }}</span
          >
        </span>
        <template slot="footer">
          <div>
            本页合计：
            <span class="greyfont">数量</span>
            &lt;<span class="redfont">{{
              form.apInvoiceDetailList.reduce((t, c) => {
                return formatPrice(+t + +c.qty) || 0;
              }, 0)
            }}</span
            >&gt;
            <a-divider type="vertical" />
            <span class="greyfont">商品金额</span>
            &lt;<span class="redfont">{{
              form.apInvoiceDetailList.reduce((t, c) => {
                return formatPrice(+t + +c.itemAmount) || 0;
              }, 0)
            }}</span
            >&gt;
            <a-divider type="vertical" />
            <span class="greyfont">包装费+人工费</span>
            &lt;<span class="redfont">{{
              form.apInvoiceDetailList.reduce((t, c) => {
                return formatPrice(+t + +c.otherAmount) || 0;
              }, 0)
            }}</span
            >&gt;
            <a-divider type="vertical" />
            <span class="greyfont">总金额</span>
            &lt;<span class="redfont">{{
              form.apInvoiceDetailList.reduce((t, c) => {
                return formatPrice(+t + +c.settlementAmount) || 0;
              }, 0)
            }}</span
            >&gt;
          </div>
        </template>
      </a-table>
    </a-card>
    <!-- 费用 -->
    <a-card
      title="费用信息"
      :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
      :body-style="{ padding: '12px,2px' }"
      size="small"
      v-if="form.apInvoiceFeeList && form.apInvoiceFeeList.length > 0"
    >
      <a-table
        :columns="columnsF"
        :data-source="form.apInvoiceFeeList"
        size="middle"
        :pagination="false"
        :scroll="{ y: 800, x: 1100 }"
      >
        <template tips="费用类型" slot="feeType" slot-scope="text, record">
          <span>{{
            record.feeType == 1 ? "国内" : record.feeType == 2 ? "国际" : "其他"
          }}</span>
        </template>
        <span slot="rate" slot-scope="text, record">
          <span>
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
                : record.invoiceType == 4
                ? "进口增值税 -"
                : record.invoiceType == 5
                ? "进口关税 -"
                : ""
            }}{{
              record.invoiceType == 3
                ? "抵扣率"
                : [1, 2, 4, 5].includes(record.invoiceType)
                ? "税率"
                : ""
            }}
            {{ record.rate + "%" }}</span
          >
        </span>
        <template slot="footer">
          <div>费用项合计 : {{ totalFee }}</div>
        </template>
      </a-table>
    </a-card>
    <!-- 尾部 -->
    <div
      class="footer-btn"
      style="
        text-align: right;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      "
    >
      <a-space>
        <a-button @click="handleBack"> 返回列表 </a-button>
      </a-space>
    </div>

    <div style="position: fixed; bottom: 70px; right: 42px; z-index: 999999">
      <a-button type="primary" shape="circle" icon="up" @click="scrollTop" />
    </div>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
      width="40%"
    >
      <img alt="发票" style="width: 100%" :src="previewImage" />
    </a-modal>
    <invoiceRegister ref="invoiceRegister" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import invoiceRegister from "./invoiceRegister.vue";
import {
  EditAndViewInvoice,
  ViewInvoiceRegister,
  DeleteReceipt,
  ViewReceipt,
  GetUploadList,
} from "../../services/settlement/payable/invoice";
const columns = [
  {
    align: "center",
    title: "序号",
    dataIndex: "numberKey",
    width: 80,
  },
  {
    align: "center",
    title: "发票状态",
    dataIndex: "invoiceState",
    width: 100,
    scopedSlots: { customRender: "invoiceState" },
  },
  {
    align: "center",
    title: "发票名称",
    dataIndex: "invoiceType",
    width: 150,
    scopedSlots: { customRender: "invoiceType" },
  },
  {
    align: "center",
    title: "发票金额",
    dataIndex: "invoiceAmount",
    width: 100,
  },
  {
    align: "center",
    title: "发票图片",
    dataIndex: "fileList",
    width: 150,
    scopedSlots: { customRender: "fileList" },
  },
  {
    align: "center",
    title: "关联结算单号",
    dataIndex: "apInvoiceCode",
    width: 200,
  },
  {
    align: "center",
    title: "发票代码",
    dataIndex: "invoiceCode",
    width: 100,
  },
  {
    align: "center",
    title: "发票号码",
    dataIndex: "invoiceNumber",
    width: 100,
  },
  {
    align: "center",
    title: "开票日期",
    dataIndex: "invoiceDate",
    width: 150,
  },
  {
    align: "center",
    title: "发票用途",
    dataIndex: "invoiceUse",
    width: 150,
  },
  { align: "center", title: "发票抬头", dataIndex: "payName", width: 150 },
  {
    align: "center",
    title: "开票公司名称",
    dataIndex: "invoiceName",
    width: 150,
  },
  {
    align: "center",
    title: "开票公司税号",
    dataIndex: "taxNo",
    width: 150,
  },
  {
    align: "center",
    title: "开票公司开户行",
    dataIndex: "depositBank",
    width: 150,
  },
  {
    align: "center",
    title: "备注",
    dataIndex: "invoiceMessage",
    width: 150,
  },
  {
    align: "center",
    title: "上传人",
    dataIndex: "updateUser",
    width: 100,
  },
  {
    align: "center",
    title: "上传时间",
    dataIndex: "updateDate",
    width: 100,
  },
  {
    align: "center",
    title: "审核意见",
    dataIndex: "auditMsg",
    width: 100,
  },
  {
    align: "center",
    title: "审核人",
    dataIndex: "auditUser",
    width: 100,
  },
  {
    align: "center",
    title: "审核时间",
    dataIndex: "auditDate",
    width: 100,
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "operation",
    width: 200,
    fixed: "right",
    scopedSlots: { customRender: "operation" },
  },
];
const columnsP = [
  {
    title: "序号",
    dataIndex: "numberKey",
    width: 80,
  },
  {
    title: "单据号",
    dataIndex: "poCode",
    width: 100,
  },
  {
    title: "商品名称",
    dataIndex: "itemName",
    width: 100,
  },
  {
    title: "商品编码",
    dataIndex: "itemCode",
    width: 100,
  },
  {
    title: "规格",
    dataIndex: "itemSpecName",
    width: 100,
  },
  {
    title: "数量",
    dataIndex: "qty",
    width: 100,
  },
  {
    title: "单位",
    dataIndex: "priceUnit",
    width: 100,
  },
  {
    title: "单价",
    dataIndex: "price",
    width: 100,
  },
  {
    title: "商品金额",
    dataIndex: "itemAmount",
    width: 100,
  },
  {
    title: "包装费＋人工费",
    dataIndex: "otherAmount",
    width: 150,
  },
  {
    title: "总金额",
    dataIndex: "settlementAmount",
    width: 150,
  },
  {
    title: "增值税",
    dataIndex: "inputTaxRate",
    width: 150,
    scopedSlots: { customRender: "inputTaxRate" },
  },
];
const columnsF = [
  {
    title: "费用类型",
    dataIndex: "feeType",
    width: 180,
    scopedSlots: { customRender: "feeType" },
  },
  { title: "费用项", dataIndex: "feeName", width: 100 },
  { title: "收款主体", dataIndex: "receivingSubjectName", width: 200 },
  { title: "费用金额", dataIndex: "feeAmount", width: 100 },
  {
    title: "增值税",
    dataIndex: "rate",
    width: 200,
    scopedSlots: { customRender: "rate" },
  },
  { title: "不含税金额", dataIndex: "priceExcludingTax", width: 150 },
  { title: "币种", dataIndex: "currency", width: 100 },
  { title: "汇率", dataIndex: "exchangeRate", width: 100 },
  { title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 150 },
  { title: "人民币金额", dataIndex: "currencyAmount", width: 150 },
  { title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 200 },
  { title: "备注", dataIndex: "remark", width: 200 },
];

export default {
  mixins: [mixin],
  components: { invoiceRegister },
  data() {
    return {
      form: {},
      columns,
      columnsP,
      columnsF,
      loading: false,
      previewVisible: false,
      previewImage: "",
      dashBtn: undefined,
      fileList: [],
      registerClose:false
    };
  },
  computed: {
    totalFee() {
      return (
        this.form.apInvoiceFeeList.reduce((t, c) => {
          return this.formatPrice(t + (+c.feeAmount || 0), 2);
        }, 0) || "-"
      );
    },
  },
  methods: {
    //获取上传文件列表
    getUploads(id) {
      const params = { tableId: id, tableName: "apInvoice" };
      GetUploadList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.fileList = data.data || [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //图
    bigImg(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    //编辑发票
    editInvoice(record) {
      console.log(record);
      this.loading = true;
      ViewReceipt({ id: record.id }).then((res) => {
        this.loading = false;
        const data = res.data;
        if (data.code == 200) {
          let code = [];
          code.push(data.data.apInvoiceCode);
          console.log(data.data);
          this.$refs.invoiceRegister.showModal(data.data, code, "edit");
        } else {
          this.$message.error(data.message || "获取发票详情失败");
        }
      });
    },
    //删除发票
    deleteInvoice(record) {
      this.loading = true;
      DeleteReceipt({ id: record.id })
        .then((res) => {
          this.loading = false;
          const data = res.data;
          if (data.code == 200) {
            this.$message.success(data.message || "删除成功");
            this.getList(this.form);
          } else {
            this.$message.error(data.message || "删除失败");
          }
        })
        .catch(() => {
          this.$message.error("连接错误");
          this.loading = false;
        });
    },
    toRegister() {
      let code = [];
      code.push(this.form.apInvoiceCode);
      const params = { id: this.form.id };
      this.spinning = true;
      ViewInvoiceRegister(params)
        .then((res) => {
          this.spinning = false;
          const data = res.data;
          if (data.code == 200) {
            this.$refs.invoiceRegister.showModal(data.data, code, "add");
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(() => {
          this.spinning = false;
          this.$message.error("连接错误");
        });
    },
    scrollTop() {
      document
        .querySelector("#scrollTop")
        .scrollIntoView({ behavior: "smooth" });
    },

    handleBack() {
      let a = "/balance/payable/invoiceDetails",
        b = "/balance/payable/apInvoiceListInvoice";
      this.$closePage(a, b);
    },
    getList(record) {
      this.loading = true;
      EditAndViewInvoice({ id: record.id || "" })
        .then((res) => {
          this.loading = false;
          const data = res.data;
          if (data.code == 200) {
            this.form = {
              ...record,
              apReceiptList: data.data.apReceiptList || [],
              apInvoiceDetailList: data.data.apInvoiceDetailList || [],
              apInvoiceFeeList: data.data.apInvoiceFeeList || [],
            };
            this.dashBtn = this.form?.apReceiptList?.length ?? 0;
            if (this.form.apReceiptList && this.form.apReceiptList.length > 0) {
              this.form.apReceiptList.forEach((item, index) => {
                item.numberKey = index + 1;
              });
            }
            if (
              this.form.apInvoiceDetailList &&
              this.form.apInvoiceDetailList.length > 0
            ) {
              this.form.apInvoiceDetailList.forEach((item, index) => {
                item.numberKey = index + 1;
              });
            }
          } else {
            this.$message.error(data.message || "未知错误");
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("连接失败");
        });
    },
  },
  activated() {
    if (Object.keys(this.$route.query).length) {
      let record = {
        ...this.$route.query.record,
      };
      if (record.invoiceRegisterState == 5) {
        this.registerClose=true
      }
      this.getList(record);
      this.getUploads(record.id || "");
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