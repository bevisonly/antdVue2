<template>
  <div id="scrollTop">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="subTitle"
      @back="handleBack"
    />
    <a-spin :tip="spinText" :spinning="spinning">
      <!-- 账单信息 -->
      <div style="margin-top: 16px">
        <a-card
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <template #title>
            <span>
              账单信息&nbsp;<a-button @click="exportDetails">导出明细</a-button>
            </span>
          </template>
          <span></span>
          <a-form :model="form">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="结算编号">
                  <span>{{ form.arInvoiceCode }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="单据金额">
                  <span>{{ form.totalAmount }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="结算日期">
                  <span>{{ form.settlementDate }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="核销状态">
                  <a-tag v-if="form.state === 3">未核销</a-tag>
                  <a-tag color="green" v-if="form.state === 4">已核销</a-tag>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="收款金额">
                  <span>{{ form.receivableAmount }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="税额">
                  <span>{{ form.taxAmount }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="不含税金额">
                  <span>{{ form.includingTaxAmount }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="结算周期">
                  <span v-show="form.settleCycleType === 1">自然月底</span>
                  <span v-show="form.settleCycleType === 2">每月15日</span>
                  <span v-show="form.settleCycleType === 3">自定义</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="运营主体">
                  <span>{{ form.opName }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="客户">
                  <span>{{ form.customerName }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="门店">
                  <span>{{ form.storeName }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="结款人">
                  <span>{{ form.payee }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="结款人电话">
                  <span>{{ form.payeePhone }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="银行流水号">
                  <span>{{ bankFlowNo }}</span>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="6">
                <a-form-item label="关联合同">
                  <span>{{ form.contractTitle }}</span>
                </a-form-item>
              </a-col> -->
              <!-- //! glht -->
            </a-row>
            <a-row :gutter="24" v-if="form.state === 4">
              <a-col :span="6">
                <a-form-item label="核销人">
                  <span>{{ form.writeOffUser }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="核销时间">
                  <span>{{ form.writeOffDate }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="单据图片">
                  <div class="uploadbox flex-fs">
                    <div
                      class="uploadImgs flex-fs"
                      v-for="(item, index) in previewImageList"
                      :key="index"
                    >
                      <img :src="item" alt="" @click="bigImg(index)" />
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="operation">
              <a-button type="primary" @click="toAudit" v-if="form.state === 3"
                >核销</a-button
              >
            </div>
          </a-form>
        </a-card>
      </div>
      <!-- 数据列表 -->
      <div class="list-table" style="margin-top: 16px">
        <a-card
          title="关联银行流水列表"
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <p v-for="(item, i) in dataTable" :key="i">
            <span @click="exportSingle(item)">{{ item.fileName }}</span>
          </p>
          <a-table
            bordered
            ref="tableRef"
            :columns="columnsx"
            :data-source="dataTable"
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
                @click="exportSingle(record)"
                >{{ text }}</a-button
              >
            </span>
            <!-- <template tips='合计' slot="footer" slot-scope="currentPageData" v-if="dataTable[0]">
              本页合计：
              <span class="greyfont">合计收入</span>
              &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(t + +(c.income || 0)), 0) }}</span>&gt;
            </template> -->
          </a-table>
        </a-card>
      </div>
      <div class="list-table" style="margin-top: 16px">
        <a-card
          title="数据列表"
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div class="search-item">
            <a-form :model="searchForm">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="商品名称/商品编号">
                    <a-input
                      v-model.trim="searchForm.itemName"
                      placeholder="请输入商品名称或编码"
                      @change="getList"
                      allowClear
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="客户单号">
                    <a-input
                      v-model.trim="searchForm.soCode"
                      placeholder="请输入客户单号"
                      @change="getList"
                      allowClear
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="export" style="margin-top: 10px">
            <a-button type="primary" @click="exportDetails">导出明细</a-button>
          </div>
          <a-table
            style="margin-top: 10px"
            :columns="columns"
            :data-source="tableList"
            :scroll="{ x: 1300, y: 500 }"
            rowKey="id"
            :pagination="false"
          >
          <span slot="vat" slot-scope="text,record">
            {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
            {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
            {{ record.vat+'%' }}
          </span>
            <div slot="isPurchaseServer" slot-scope="text">
              <span v-if="text == 1">是</span>
              <span v-if="text == 0">否</span>
            </div>
            <div slot="serverType" slot-scope="text">
              <span v-if="text == 1">加工服务单</span>
              <span v-if="text == 2">配送服务单</span>
              <span v-if="text == 3">仓储服务单</span>
            </div>
            <div slot="footer" class="table-footer">
              本页合计 :
              <span
                >单据金额<span>{{ signAmountTo }}</span></span
              >|<span
                >税额<span>{{ taxAmountTo }}</span></span
              >|<span
                >不含税金额<span>{{ includingTaxAmountTo }}</span></span
              >
            </div>
          </a-table>
          <!-- 分页 -->
          <!-- <div class="pagination">
          <a-pagination
            :page-size-options="['10', '20', '30', '40', '50']"
            :total="pagination.total"
            show-size-changer
            :page-size="pagination.rows"
            show-quick-jumper
            :current="pagination.page"
            :show-total="(total) => `共 ${total} 条记录`"
            @change="pageChange"
            @showSizeChange="pageSizeChange"
          >
          </a-pagination>
        </div> -->
        </a-card>
      </div>
       <invoice-card
      :titleState="titleState"
      :parentData="form"
      :invoiceInfoList="invoiceInfoList"
      ref="invoiceCard"
       style="margin-top:20px"
    ></invoice-card>
    </a-spin>
    <!-- 尾部 -->
    <div
      class="footer-btn"
      style="
        position: relative;
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
    <ImageEdit
      :imgList="previewImageList"
      :filePreviewShow="previewVisible"
      @close="handleCancelPreviewImage"
      :currentIndex="+imageIndex"
    />
    <div style="position: fixed; bottom: 70px; right: 42px; z-index: 999999">
      <a-button type="primary" shape="circle" icon="up" @click="scrollTop" />
    </div>
  </div>
</template>

<script>
import InvoiceCard from "@/components/tool/InvoiceCard";
import { mixin } from "../../utils/mixins";
import {
  GetDetails,
  UpdateStatus,
  GetUploadFiles,
  ExportDetails,
  getIds,
  getBankFlow,
} from "../../services/settlement/receive/ReVerification";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
import { ReceiptByApInvoiceId } from '../../services/settlement/receive/invoice';
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
  components: {
    ImageEdit,InvoiceCard
  },
  data() {
    return {
      columns: [
        {
          title: "客户单号",
          dataIndex: "soCode",
          width: 200,
          align: "center",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 150,
          align: "center",
        },
        {
          title: "商品编码",
          dataIndex: "itemCode",
          width: 150,
          align: "center",
        },
        {
          title: "是否采购服务",
          dataIndex: "isPurchaseServer",
          width: 200,
          scopedSlots: { customRender: "isPurchaseServer" },
          align: "center",
        },
        {
          title: "服务单类型",
          dataIndex: "serverType",
          width: 200,
          scopedSlots: { customRender: "serverType" },
          align: "center",
        },
        {
          title: "客户",
          dataIndex: "customerName",
          width: 200,
          align: "center",
        },
        {
          title: "门店名称",
          dataIndex: "storeName",
          width: 150,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "qty",
          width: 100,
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 100,
          align: "center",
        },
        {
          title: "计价单位",
          dataIndex: "priceUnit",
          width: 100,
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "signPrice",
          width: 100,
          align: "center",
        },
        {
          title: "单据金额",
          dataIndex: "signAmount",
          width: 100,
          align: "center",
        },
        {
          title: "扣点金额",
          dataIndex: "deductionAmount",
          width: 100,
          align: "center",
        },
        {
          title: "应收金额",
          dataIndex: "receivableAmount",
          width: 100,
          align: "center",
        },
        {
          title: "税额",
          dataIndex: "taxAmount",
          width: 100,
          align: "center",
        },
        {
          title: "含税金额",
          dataIndex: "includingTaxAmount",
          width: 100,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "arState",
          width: 100,
          align: "center",
        },
        {
          title: "减免",
          dataIndex: "breaks",
          width: 100,
          align: "center",
        },
        {
          title: "增值税",
          dataIndex: "vat",
          width: 200,
          align: "center",
          scopedSlots: { customRender: "vat" },
        },
        {
          title: "减免税率",
          dataIndex: "breaksRate",
          width: 100,
          align: "center",
        },
      ],
      columnsx,
      dataTable: [],
      bankFlowNo: undefined,
      option: { status: ["未关联", "部分关联", "已关联"] },
      pagination: {
        rows: 10,
        page: 1,
        sort: "id",
        order: "DESC",
      },
      btnLoading: false,
      pageState: "",
      subTitle: "",
      tableList: [],
      searchForm: {},
      spinText: "",
      spinning: false,
      imageIndex: "",
      previewImageList: [],
      previewVisible: false,
      form: {},
      titleState:4,//发票需求221026
      invoiceInfoList:[],
    };
  },
  computed: {
    signAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.signAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    taxAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.taxAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    includingTaxAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.includingTaxAmount ?? 0;
      });
      return this.formatPrice(num);
    },
  },
  methods: {
    //获取发票信息
    async getArInvioce() {
      let res = await ReceiptByApInvoiceId({
        id: this.form.id || "",
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
    strExchange(str) {
      return String(str || "")?.replace(/(?<=.{4}).{1}(?=.{4})/g, "*");
    },
    exportSingle(record) {
      let aNode = document.createElement("a");
      aNode.href = record.filePath;
      aNode.download =
        record.fileName?.slice(0, record.fileName?.lastIndexOf(".")) || "文件";
      aNode.click();
    },
    getBankFlow(ids) {
      this.dataTable = [];
      getBankFlow({ ids }).then((res) => {
        if (res.data.code == 200) {
          res.data.data?.map((item) =>
            item.transWay == "收入"
              ? (item.income = item.transAmount)
              : (item.outcome = item.transAmount)
          );
          this.dataTable = res.data.data;
        }
      });
    },
    getIds(docId, relateType = 1) {
      this.bankFlowNo = undefined;
      getIds({ docId, relateType }).then((res) => {
        if (res.data.code == 200) {
          let bankFlowNo = [];
          let ids = [];
          res.data.data?.forEach((val) => {
            bankFlowNo.push(val.yocylCode);
            ids.push(val.yocylId);
          });
          this.bankFlowNo = bankFlowNo.join(",");
          ids[0] && this.getBankFlow(ids);
        }
      });
    },
    //导出
    exportDetails() {
      this.spinning = true;
      this.spinText = "数据导出中请稍后";
      const params = {
        arCode: this.form?.arInvoiceCode ?? "",
        totalAmount: this.form?.totalAmount ?? "",
        settleDate: this.form?.settlementDate ?? "",
        arState: this.form?.state ?? "",
        arInvoiceId: this.form?.id ?? "",
      };
      ExportDetails(params)
        .then((res) => {
          console.log(res);
          const data = res.data;

          this.spinning = false;
          if (data) {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            console.log(url);
            this.downloadTem(url, true);
          } else {
            this.$message.error("导出失败！");
          }
        })
        .catch((res) => {
          console.log(res);
          this.spinning = false;
          this.$message.error("接口请求出错");
        });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      this.pageState === "receivableWaitVerification"
        ? link.setAttribute("download", "应收-待核销详情")
        : link.setAttribute("download", "应收-已核销详情");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async getFiles() {
      const params = new FormData();
      params.append("tableId", this.form?.id ?? "");
      params.append("tableName", "ar_settlement");
      const res = await GetUploadFiles(params);
      const data = res.data?.data ?? [];
      if (data.length > 0) {
        data.forEach((item) => {
          this.previewImageList.push(item?.filePath ?? "");
        });
      } else {
        this.previewImageList = [];
      }
    },
    toAudit() {
      //20221026发票需求
      if (this.invoiceInfoList&&this.invoiceInfoList.length>0) {
        if (this.invoiceInfoList.findIndex((item)=>item.issueState==1||item.issueState==3)==-1) {
          this.$info({
          title: "提示",
          content: "该账单未全部开票或已蓝补，无法确认核销。",
          okText: "关闭",
         });
         return
        }
        if (this.invoiceInfoList.findIndex((item)=>item.collectState==3)==-1) {
          this.$info({
          title: "提示",
          content: "该账单未领票完成，无法确认核销。",
          okText: "关闭",
         });
         return
        }
      }
      const that = this;
      const params = {
        id: this.form?.id ?? "",
      };
      this.$confirm({
        title: "确认核销账单",
        centered: true,
        okText: "确认核销",
        content: (
          <div>
            <div>请确认是否核销此账单?</div>
            <div>账单应收金额:{that.form?.receivableAmount ?? ""}</div>
          </div>
        ),
        onOk() {
          that.spinText = "核销中";
          that.spinning = true;
          UpdateStatus(params)
            .then((res) => {
              that.spinning = false;
              const data = res.data;
              if (data.code === "200") {
                that.$message.success(data?.message ?? "核销成功");
                console.log(that.$router);
                that.pageState = "receivableVerification";
                that.subTitle = "应收已核销详情";
                that.form = data?.data ?? {};
              } else {
                that.$message.error(data?.message ?? "核销失败");
              }
            })
            .catch((error) => {
              console.log(error);
              that.spinning = false;
              that.$message.error("接口连接错误");
            });
        },
        class: "test",
      });
    },
    bigImg(index) {
      this.imageIndex = index;
      this.previewVisible = true;
    },
    handleCancelPreviewImage() {
      this.previewVisible = false;
    },
    getList() {
      const params = {
        arInvoiceId: this.form?.id ?? "",
        sort: "creat_date",
        ...this.searchForm,
      };
      this.spinText = "数据加载中";
      this.spinning = true;
      GetDetails(params)
        .then((res) => {
          const data = res.data;
          this.tableList = data.data?.list ?? [];
          this.spinning = false;
        })
        .catch((error) => {
          this.spinning = false;
          console.log(error);
        });
    },
    handleBack() {
      let a = "/balance/receiveable/receiveableVerificationDetails",
        b;
      switch (this.pageState) {
        case "receivableWaitVerification":
          b = "/balance/receiveable/receivableWaitVerification";
          break;
        case "receivableVerification":
          b = "/balance/receiveable/receivableVerification";
          break;

        default:
          break;
      }
      this.$closePage(a, b);
    },
  },
  activated() {
    let record;
    if (Object.keys(this.$route.query).length) {
      record = this.$route.query.record;
      this.pageState = this.$route.query.state;
    }
    this.typeis(record.id) == "number" && this.getIds(record.id);
    this.form = JSON.parse(JSON.stringify(record));
    switch (this.pageState) {
      case "receivableWaitVerification":
        this.subTitle = "应收待核销详情";
        break;
      case "receivableVerification":
        this.subTitle = "应收已核销详情";
        break;
      default:
        break;
    }
    if (!record) return;
    this.getList();
    this.getFiles();
    this.getArInvioce()
  },
};
</script>

<style lang="less" scoped>
@import "index";
// .uploadImg {
//   position: relative;
//   border-radius: 4px;
//   width: 150px;
//   height: 200px;
//   border: 1px solid #d9d9d9;
//   padding: 14px;
//   margin-bottom: 4px;
// }
.uploadbox {
  flex-wrap: wrap;

  .imgWrap {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .uploadImgs {
    position: relative;
    border-radius: 4px;
    width: 150px;
    height: 200px;
    border: 1px solid #d9d9d9;
    padding: 14px;
    margin-bottom: 4px;
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      object-fit: cover;
    }

    margin-right: 4px;
  }

  .uploadImgIcon {
    width: 104px;
    height: 104px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    background-color: #fafafa;
    cursor: pointer;
  }
}
.operation {
  margin-top: 10px;
}
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>