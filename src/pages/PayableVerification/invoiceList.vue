<template>
  <div>
    <a-table
      :columns="pageState == 'payableWaitVerification' ? columns : columnsED"
      :data-source="invoiceList"
      :scroll="{ x: 1100, y: 900 }"
      size="middle"
      :pagination="false"
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
            @click="btnMessage(record, '通过')"
            :disabled="record.invoiceState == 5 || record.invoiceState == 3"
            >通过</a-button
          >
          <a-button
            type="link"
            @click="btnMessage(record, '退回')"
            :disabled="record.invoiceState == 5 || record.invoiceState == 3"
            >退回</a-button
          >
        </a-space>
      </div>
      <template slot="footer">
        <div>
          合计 : 发票金额 :
          <span>{{
            invoiceList.reduce((t, c) => {
              return formatPrice(+t + +c.invoiceAmount, 2) || 0;
            }, 0)
          }}</span>
        </div>
      </template>
    </a-table>
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
const columnsED = [
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
];
export default {
  props: {
    invoiceList: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    pageState: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      previewImage: "",
      previewVisible: false,
      columns,
      columnsED,
    };
  },
  methods: {
    btnMessage(record, op) {
      this.$emit("change", record, op);
    },
    //图
    bigImg(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
  },
};
</script>

<style>
</style>