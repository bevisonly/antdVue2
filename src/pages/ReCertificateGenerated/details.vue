<template>
  <div>
    <a-modal
      width="60%"
      centered
      v-model="visible"
      title="待生成凭证详情"
      @ok="handleOk"
      destroyOnClose
    >
      <div class="basic-info">
        <a-card
          title="基本信息"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          size="small"
        >
          <a-row :gutter="[24, 24]">
            <a-col :span="8">
              <div>订单号 : {{ basicInfo.sno }}</div>
            </a-col>
            <a-col :span="8">
              <div>客户名称 : {{ basicInfo.customerName }}</div>
            </a-col>
            <a-col :span="8">
              <div>子公司名称 : {{ basicInfo.storeName }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 24]">
            <a-col :span="8">
              <div>
                状态 :
                <span
                  v-if="
                    basicInfo.settleState == 4 &&
                    basicInfo.reconciliaState == 520
                  "
                  >已结算</span
                >
                <span
                  v-if="
                    basicInfo.settleState != 4 &&
                    basicInfo.reconciliaState == 520
                  "
                  >已对账</span
                >
              </div>
            </a-col>
            <a-col :span="8">
              <div>单据金额 : {{ basicInfo.totalSignAmount }}</div>
            </a-col>
            <!-- <a-col :span="8">
              <div>单据 : <img :src="basicInfo.img" alt="" /></div>
            </a-col> -->
          </a-row>
          <a-row :gutter="[24, 24]">
            <a-col :span="8">
              <div>
                单据 :
                <img
                  style="width: 100px; height: 100px"
                  v-for="(item, index) in basicInfo.img"
                  :key="index"
                  :src="item"
                  alt=""
                />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </div>
      <div class="detail-table" style="margin-top: 20px">
        <a-card
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          title="数据列表"
        >
          <div>
            <a-radio-group
              v-model="state"
              button-style="solid"
              @change="stateChange(basicInfo.sno)"
            >
              <a-radio-button :value="2"> 按商品汇总 </a-radio-button>
              <a-radio-button :value="1"> 按订单明细 </a-radio-button>
            </a-radio-group>
          </div>
          <a-table
            :columns="columns"
            :data-source="tableDetail"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top: 10px"
            size="small"
            :scroll="{ y: 300, x: 1300 }"
          >
            <span slot="vat" slot-scope="text,record">
              {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
              {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
              {{ record.vat+'%' }}
            </span>
          </a-table>
        </a-card>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleOk">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { GetDetails } from "../../services/settlement/receive/ReCertificateGenerated";
const columns = [
  {
    align: "center",
    title: "客户单号",
    dataIndex: "soSno",
    width: 150,
    key: 3,
  },
  {
    align: "center",
    title: "商品名称",
    dataIndex: "itemName",
    width: 150,
    key: 4,
  },
  {
    align: "center",
    title: "商品类别",
    dataIndex: "categoryName",
    width: 150,
    key: 20,
  },
  {
    align: "center",
    title: "商品编码",
    dataIndex: "itemSno",
    width: 100,
    key: 5,
  },
  {
    align: "center",
    title: "客户",
    dataIndex: "customerName",
    width: 250,
    key: 6,
  },
  {
    align: "center",
    title: "门店名称",
    dataIndex: "storeName",
    width: 100,
    key: 7,
  },
  {
    align: "center",
    title: "数量",
    dataIndex: "signQty",
    width: 80,

    key: 8,
  },
  {
    align: "center",
    title: "单位",
    dataIndex: "unit",
    width: 80,
    key: 9,
  },
  {
    align: "center",
    title: "重量",
    width: 80,
    dataIndex: "signWeight",
    key: 10,
  },

  {
    align: "center",
    title: "单价",
    dataIndex: "signPrice",
    width: 80,
    key: 11,
  },
  {
    align: "center",
    title: "单据金额",
    dataIndex: "docsAmount",
    width: 80,
    key: 12,
  },

  {
    align: "center",
    title: "扣点金额",
    dataIndex: "deductionAmount",
    width: 100,

    key: 13,
  },
  {
    align: "center",
    title: "应收金额",
    dataIndex: "signAmount",
    width: 100,

    key: 14,
  },
  {
    align: "center",
    title: "税额",
    dataIndex: "taxAmount",
    width: 100,

    key: 15,
  },
  {
    align: "center",
    title: "不含税金额",
    dataIndex: "includingTaxAmount",
    width: 100,
    key: 16,
  },
  {
    align: "center",
    title: "增值税",
    dataIndex: "vat",
    width: 200,
    scopedSlots: { customRender: "vat" },
    key: 18,
  },
];
export default {
  data() {
    return {
      state: 2,
      tableLoading: false,
      visible: false,
      columns,
      tableDetail: [],
      basicInfo: {
        sno: "",
        customerName: "",
        storeName: "",
        totalSignAmount: "",
        img: [],
        reconciliaState: "",
        settleState: "",
      },
    };
  },
  methods: {
    stateChange(sno) {
      this.getDetails(sno);
    },
    getDetails(sno) {
      const params = {
        sno: sno,
        snoState:this.state
      };
      this.tableLoading=true
      GetDetails(params).then((res) => {
        console.log(res);
        this.tableLoading=false
        if (res.data.code == 200) {
          this.visible = true;
          let item = res.data.data;
          this.basicInfo = {
            sno: item.sno || "",
            customerName: item.customerName || "",
            storeName: item.storeName || "",
            totalSignAmount: item.totalSignAmount || "",
            reconciliaState: item.reconciliaState,
            settleState: item.settleState,
            img: item.filePaths || [],
          };
          this.tableDetail = item.receivableDetailDtos;
          this.tableDetail.forEach((v) => {
            v.signWeight = v.signWeight / 1000 || "";
             v.docsAmount = v.signPrice&&v.signQty?this.formatPrice(v.signPrice * v.signQty):''
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    showModal(record) {
      this.state = 2;
      this.getDetails(record.sno);
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  },
};
</script>