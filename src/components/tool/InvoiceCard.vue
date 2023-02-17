<template>
  <div>
    <div v-if="invoiceInfoList && invoiceInfoList.length > 0">
      <a-card
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        v-for="(item, index) in invoiceInfoList"
        :key="index"
        class="top20"
      >
        <!-- 头部标题 -->
        <div slot="title">
          <span class="title">{{ "发票申请" + (index + 1) }}</span>
          <span class="invoice-amount">
            <span class="green"
              >可开发票金额：{{ item.billInvoiceAmount || 0 }}</span
            >
            <span class="orange"
              >已开发票金额：{{ item.invoiceAmounted || 0 }}</span
            >
            <span class="red"
              >待开发票金额：{{ item.waitInvoiceAmount || 0 }}</span
            >
          </span>
        </div>
        <!-- 申请信息 -->
        <div class="apply">
          <div>
            <span>申请信息：</span>
            <a-button
              class="a-btn"
              type="primary"
              @click="registerInvoice"
              v-if="item.issueState != 1 && titleState == 3"
              >开立发票</a-button
            >
            <span v-if="titleStateChoose == 'jiesuan'">
              <a-button
                class="a-btn"
                @click="applyInvoiceEdit(item)"
                v-if="item.issueState != 4 && item.issueState != 1"
                >编辑</a-button
              >
              <a-button
                class="a-btn"
                @click="deleteApplys(item)"
                v-if="item.issueState != 4 && item.issueState != 1"
                >删除</a-button
              >
            </span>
          </div>
          <div>
            <span>申请人：{{ item.applyUser }}</span>
            <span style="margin-left: 20px"
              >申请发票日期：{{ item.applyDate }}</span
            >
          </div>
        </div>
        <!-- 发票头 -->
        <div class="invoice-info">
          <div class="top">
            <detail-list :col="6" size="small">
              <detail-list-item term="发票名称">{{
                invoiceType[item.invoiceType] || ""
              }}</detail-list-item>
              <detail-list-item term="发票状态">{{
                issueState[item.issueState] || ""
              }}</detail-list-item>
              <detail-list-item term="发票税率"
                >{{ item.invoiceRate }}%</detail-list-item
              >
              <detail-list-item term="开票金额">{{
                item.invoiceAmount
              }}</detail-list-item>
              <detail-list-item term="开票金额（大写）"
                >{{ item.invoiceAmountUppercase }}
              </detail-list-item>
              <detail-list-item term="货款是否收取">{{
                chargeReceived[item.chargeReceived] || ""
              }}</detail-list-item>
              <detail-list-item term="预计收款周期"
                >{{ item.receivedCycle }}
              </detail-list-item>
              <detail-list-item term="发票用途"
                >{{ item.invoiceUse }}
              </detail-list-item>
              <detail-list-item term="备注"
                >{{ item.invoiceRemark }}
              </detail-list-item>
            </detail-list>
          </div>
          <a-divider style="margin: 16px 0; background-color: #babcbc" />
          <div class="bottom">
            <detail-list class="mine" :col="1">
              <detail-list-item term="开票主体名称">{{
                item.payName
              }}</detail-list-item>
              <detail-list-item term="开票主体税号">{{
                item.payTaxNo
              }}</detail-list-item>
              <detail-list-item term="开票主体开户行及账号">{{
                item.payBank
              }}</detail-list-item>
            </detail-list>
            <detail-list class="his" :col="1">
              <detail-list-item term="购买方名称">{{
                item.customerName
              }}</detail-list-item>
              <detail-list-item term="购买方税号">{{
                item.taxNo
              }}</detail-list-item>
              <detail-list-item term="购买方开户行及账号">{{
                item.depositBank
              }}</detail-list-item>
            </detail-list>
          </div>
        </div>
        <!-- 发票明细 -->
        <div v-if="item.receiptList && item.receiptList.length > 0">
          <a-card
            class="invoice-details"
            v-for="(t, i) in item.receiptList"
            :key="i"
          >
            <div class="invoice-tit" slot="title">
              <div class="tit">
                <span class="title-circle"></span>
                <span class="tit-font">{{ "发票" + (i + 1) }}</span>
                <span v-if="titleStateChoose == 'jiesuan'">
                  <a-button class="a-btn" v-if="t.state == 1" disabled
                    >已领取</a-button
                  >
                  <a-button
                    class="a-btn"
                    @click="drawInvoice(t)"
                    :loading="btnState.drawBtn"
                    v-if="!t.state"
                    >领取发票</a-button
                  >

                  <a-button
                    class="a-btn"
                    v-if="t.state == 1"
                    @click="arRecallInvoice(t)"
                    >撤回</a-button
                  >
                </span>
                <span v-else-if="titleStateChoose == 'fapiao'">
                  <a-button class="a-btn" v-if="t.state == 1" disabled
                    >已领取</a-button
                  >
                  <a-button class="a-btn" v-if="!t.state" disabled
                    >待领取</a-button
                  >
                  <a-button class="a-btn" @click="recallInvoice(t)"
                    >撤回</a-button
                  >
                </span>
                <span v-else-if="titleStateChoose == 'hexiao'">
                  <a-button class="a-btn" v-if="!t.state">未领取</a-button>
                  <a-button class="a-btn" v-if="t.state == 1" disabled
                    >已领取</a-button
                  >
                </span>
              </div>
            </div>
            <div class="extra" slot="extra">
              <span>
                <span>{{ "开立人：" + t.createUser }}</span>
                <span>{{ "开票时间：" + t.createDate }}</span>
              </span>
              <span>
                <span>领票人：{{ t.collectUser }}</span>
                <span>领票时间：{{ t.collectDate }}</span>
              </span>
            </div>
            <div>
              <detail-list :col="4">
                <detail-list-item term="发票金额">{{
                  t.invoiceAmount
                }}</detail-list-item>
                <detail-list-item term="发票金额（大写）">{{
                  t.invoiceAmountUppercase
                }}</detail-list-item>
                <detail-list-item term="发票代码">{{
                  t.invoiceCode
                }}</detail-list-item>
                <detail-list-item term="发票号码">{{
                  t.invoiceNumber
                }}</detail-list-item>
                <detail-list-item term="开票日期"
                  >{{ t.invoiceDate }}
                </detail-list-item>
              </detail-list>
              <detail-list :col="1">
                <detail-list-item term="开票备注"
                  >{{ t.invoiceMessage }}
                </detail-list-item>
              </detail-list>
            </div>
          </a-card>
        </div>
      </a-card>
    </div>
    <!-- empty -->
    <div v-else>
      <a-card
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        v-if="titleStateChoose != 'hexiao'"
      >
        <!-- 头部标题 -->
        <div slot="title">
          <span class="title">发票申请</span>
          <span class="invoice-amount">
            <span class="green">可开发票金额：{{parentData.totalAmount||0}}</span>
            <span class="orange">已开发票金额：0</span>
            <span class="red">待开发票金额：{{parentData.totalAmount||0}}</span>
          </span>
        </div>
        <!-- 申请信息 -->
        <div class="apply">
          <div>
            <span>申请信息：</span>
            <a-button
              class="a-btn"
              type="dashed"
              icon="plus"
              @click="applyInvoice"
              >申请开票</a-button
            >
          </div>
        </div>
        <!-- 暂无 -->
        <a-card style="margin-top: 20px">
          <div>
            <a-empty>
              <span slot="description">该账单暂未申请开立发票</span>
            </a-empty>
          </div>
        </a-card>
      </a-card>
    </div>
    <div
      class="invoice-product"
      style="margin-top: 20px"
      v-if="invoiceProductList && invoiceProductList.length > 0"
    >
      <a-card
        title="开票商品列表"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
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
          :data-source="invoiceProductList"
          :columns="columns"
          :scroll="{ x: 1500, y: 900 }"
          size="middle"
          :pagination="false"
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
            <span v-for="(item, j) in footerTotal" :key="item.name">
              <span class="greyfont">{{ item.name }}</span>
              &lt;<span class="redfont">{{
                currentPageData.reduce(
                  (t, c) => formatPrice(+t + +c[item.value]),
                  0
                )
              }}</span
              >&gt;
              <a-divider v-show="j != footerTotal.length - 1" type="vertical" />
            </span>
          </template>
        </a-table>
      </a-card>
    </div>
    <invoice-apply ref="invoiceApply"></invoice-apply>
    <invoice-register ref="invoiceRegister"></invoice-register>
  </div>
</template>

<script>
import DetailList from "@/components/tool/DetailList";
import InvoiceApply from "@/pages/ArInvoiceCollected/invoiceApply";
import InvoiceRegister from "@/pages/ReceiveInvoice/invoiceRegister";
import {
  ArCollectReceipt,
  ArInvoiceCollectRevoke,
  ArInvoiceRevoke,
  DeleteApply,
} from "../../services/settlement/receive/invoice";
import { blueAddOrTicket } from "@/services/settlement/receive/clearingAccountsNeedget";
const DetailListItem = DetailList.Item;
const columns = [
  { title: "销售单号", dataIndex: "soCode", width: 200 },
  { title: "商品名称", dataIndex: "itemName", width: 150 },
  { title: "商品编码", dataIndex: "itemCode", width: 150 },
  { title: "客户", dataIndex: "customerName", width: 200 },
  { title: "门店名称", dataIndex: "storeName", width: 200 },
  { title: "数量", dataIndex: "qty", width: 120 },
  { title: "单位", dataIndex: "unit", width: 120 },
  { title: "单价", dataIndex: "signPrice", width: 150 },
  { title: "单据金额", dataIndex: "signAmount", width: 150 },
  { title: "扣点金额", dataIndex: "deductionAmount", width: 150 },
  { title: "应收金额", dataIndex: "receivableAmount", width: 150 },
  { title: "税额", dataIndex: "taxAmount", width: 150 },
  { title: "不含税金额", dataIndex: "includingTaxAmount", width: 150 },
  {
    title: "增值税",
    dataIndex: "vat",
    width: 200,
    scopedSlots: { customRender: "vat" },
  },
];
export default {
  name: "InvoiceCard",
  props: {
    titleState: Number, //1待结算--2 已收账款 2.1 已收账款详情-- 3 发票管理 --4 核销
    parentData: Object,
    invoiceInfoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { DetailListItem, DetailList, InvoiceApply, InvoiceRegister },
  data() {
    return {
      invoiceType: ["", "增值税普通发票", "增值税专用发票"],
      issueState: [
        "待申请",
        "全部开票",
        "已红冲",
        "已蓝补",
        "部分开票",
        "待开票",
      ],
      chargeReceived: ["未收货款", "已收货款"],
      btnState: { drawBtn: false },
      columns,
      invoiceProductList: [],
      arInvoiceCodeState: 1,
      arInvoiceId: "",
      footerTotal: [
        { name: "数量", value: "qty" },
        { name: "单价", value: "signPrice" },
        { name: "单据金额", value: "signAmount" },
        { name: "扣点金额", value: "deductionAmount" },
        { name: "应收金额", value: "receivableAmount" },
        { name: "税额", value: "taxAmount" },
        { name: "不含税额", value: "includingTaxAmount" },
      ],
    };
  },
  computed: {
    titleStateChoose() {
      let state = "";
      switch (this.titleState) {
        case 1:
        case 2:
        case 2.1:
          state = "jiesuan";
          break;
        case 3:
          state = "fapiao";
          break;
        case 4:
          state = "hexiao";
          break;

        default:
          break;
      }
      return state;
    },
  },
  methods: {
    //结算撤回
    arRecallInvoice(data) {
      let _this = this;
      this.$confirm({
        title: "确认撤回该发票?",
        onOk() {
          ArInvoiceCollectRevoke({ id: data.id || "" })
            .then((res) => {
              if (res.data.code == 200) {
                _this.$message.success(res.data.message || "撤回发票成功");
                switch (_this.titleState) {
                  case 1:
                  case 2:
                    _this.$refreshPage("/balance/receiveable/arInvoiceInfo");

                    break;
                  case 2.1:
                    _this.$refreshPage(
                      "/balance/receiveable/arInvoiceCollectedDetails"
                    );
                    break;
                  default:
                    break;
                }
              } else {
                _this.$message.error(res.data.message || "撤回发票失败");
              }
            })
            .catch(() => {
              _this.$message.error("接口连接失败");
            });
        },
        class: "test",
      });
    },
    recallInvoice(data) {
      let _this = this;
      this.$confirm({
        title: "确认撤回该发票?",
        onOk() {
          ArInvoiceRevoke({ id: data.id || "" })
            .then((res) => {
              if (res.data.code == 200) {
                _this.$message.success(res.data.message || "撤回发票成功");
                _this.$refreshPage("/balance/receiveable/arInvoiceDetails");
              } else {
                _this.$message.error(res.data.message || "撤回发票失败");
              }
            })
            .catch(() => {
              _this.$message.error("接口连接失败");
            });
        },
        class: "test",
      });
    },
    //领取发票
    drawInvoice(data) {
      let _this = this;
      this.$confirm({
        title: "确认领取该发票?",
        content: "请确认发票金额、发票代码、号码与收到的实体发票一致！",
        onOk() {
          ArCollectReceipt({ id: data.id || "" })
            .then((res) => {
              if (res.data.code == 200) {
                _this.$message.success(res.data.message || "领取发票成功");
                switch (_this.titleState) {
                  case 1:
                  case 2:
                    _this.$refreshPage("/balance/receiveable/arInvoiceInfo");

                    break;
                  case 2.1:
                    _this.$refreshPage(
                      "/balance/receiveable/arInvoiceCollectedDetails"
                    );
                    break;
                  default:
                    break;
                }
              } else {
                _this.$message.error(res.data.message || "领取发票失败");
              }
            })
            .catch(() => {
              _this.$message.error("接口连接失败");
            });
        },
        class: "test",
      });
    },
    //发票列表汇总
    arInvoiceCodeStateChange() {
      if (this.titleState == 3) {
        this.$emit("stateChange", this.arInvoiceCodeState);
        return;
      }
      this.$forceUpdate();
      this.getInvoiceProductList(this.arInvoiceId);
    },
    async getInvoiceProductList(id, data) {
      this.arInvoiceId = id;
      let res, params;
      switch (this.titleState) {
        case 1:
          params = {
            arInvoiceId: id || "",
            arInvoiceCodeState: this.arInvoiceCodeState,
            order: "desc",
            sort: "id",
          };
          res = await blueAddOrTicket(params);
          if (res.data.code == 200) {
            this.invoiceProductList = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
          break;
        case 3:
          this.invoiceProductList = data;

          break;
        default:
          break;
      }
    },
    deleteApplys(item) {
      let _this = this;
      this.$confirm({
        title: "确认删除该笔发票申请记录?",
        content:
          "确认删除后，财务将不会开立发票， 请确认是否删除该笔发票记录！",
        onOk() {
          const params = {
            id: item.id || "",
            arInvoiceId: item.arInvoiceId || "",
          };
          DeleteApply(params).then((res) => {
            if (res.data.code == 200) {
              _this.$refreshPage("/balance/receiveable/arInvoiceInfo");
            }
          });
        },
        class: "test",
      });
    },
    //开票新增申请
    applyInvoice() {
      this.$refs.invoiceApply.showModal(this.titleState, this.parentData);
    },
    //修改开票申请
    applyInvoiceEdit(data) {
      this.$refs.invoiceApply.showModal(this.titleState, data, true);
    },
    //开立发票
    registerInvoice() {
      this.$refs.invoiceRegister.showModal(this.parentData, 0);
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  margin-top: 20px;
}
.invoice-amount {
  margin-left: 12px !important;
  span {
    margin-left: 18px;
    font-size: 14px;
  }
  .green {
    color: green;
  }
  .orange {
    color: orange;
  }
  .red {
    color: red;
  }
}
.apply {
  display: flex;
  justify-content: space-between;
}
.invoice-info {
  margin-top: 20px;
  background-color: #f1f6f7;
  padding: 18px;
  .bottom {
    display: flex;
    padding-top: 8px;
    .mine {
      width: 50%;
      border-right: 1px solid #babcbc;
    }
    .his {
      flex: 1;
      margin-left: 50px;
    }
  }
}
.invoice-details {
  margin-top: 18px;
  .tit {
    span.tit-font {
      margin-right: 40px;
      font-weight: bold;
    }
  }
  .extra {
    span {
      margin-left: 16px;
    }
  }
}
.title-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d9001b;
  margin-right: 4px;
}
.a-btn {
  margin-left: 10px;
}
/deep/ .ant-col-md-6 {
  width: 19%;
}
</style>