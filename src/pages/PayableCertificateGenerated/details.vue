<template>
  <div>
    <a-modal
      width="60%"
      centered
      v-model="visible"
      title="已生成凭证详情"
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
          <a-row :gutter="24">
            <a-col :span="8">
              <div>订单号 : {{ basicInfo.poCode }}</div>
            </a-col>
            <a-col :span="8">
              <div>供应商 : {{ basicInfo.supplierName }}</div>
            </a-col>
            <a-col :span="8">
              <div>
                状态 :
                <span
                  v-if="
                    basicInfo.settleState == 3 &&
                    basicInfo.reconciliaState == 620
                  "
                  >已结算</span
                >
                <span
                  v-if="
                    basicInfo.settleState != 3 &&
                    basicInfo.reconciliaState == 620
                  "
                  >已对账</span
                >
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="24" style="margin-top: 20px">
            <a-col :span="8">
              <div>单据金额 : {{ basicInfo.puTotalAmount }}</div>
            </a-col>
            <a-col :span="8">
              <div>单据 : <img :src="basicInfo.img" alt="" /></div>
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
              @change="stateChange(basicInfo.poCode)"
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
            <span slot-scope="text,record" slot="inputTaxRate">                    
            {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
            {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
            {{ record.inputTaxRate+'%' }}
            </span>

          </a-table>
        </a-card>
      </div>
      <div class="detail-table" style="margin-top: 20px">
        <a-card
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          title="费用项列表"
        >
          <div class="feelist">
            <a-table
              :columns="costColumns"
              :data-source="feeList"
              size="middle"
              :scroll="{ x: 307.778, y: 800 }"
              :pagination="false"
              rowKey="id"
            >
              <div slot="feeType" slot-scope="text">
                <a-tag v-if="text === 1">国内</a-tag>
                <a-tag v-if="text === 2">国际</a-tag>
                <a-tag v-if="text === 3">其他</a-tag>
              </div>
            <span slot="rate" slot-scope="text,record">                    
            {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
            {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':record.invoiceType==4?'进口增值税 -':record.invoiceType==5?'进口关税 -':''}}{{record.invoiceType==3?'抵扣率':[1,2,4,5].includes(record.invoiceType)?'税率':''}}
            {{ record.rate+'%' }}
            </span>
            </a-table>
          </div>
        </a-card>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleOk">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { GetDetails } from "../../services/settlement/payable/PayableCertificateGenerated";
const columns = [
  {
    align: "center",
    title: "客户单号",
    dataIndex: "poCode",
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
    dataIndex: "itemCode",
    width: 100,

    key: 5,
  },
  {
    align: "center",
    title: "供应商",
    dataIndex: "supplierName",
    width: 250,
    key: 6,
  },

  {
    align: "center",
    title: "数量",
    dataIndex: "deliveryQty",
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
  // {
  //   align: "center",
  //   title: "重量",
  //   width: 80,
  //   dataIndex: "deliveryWeight",
  //   key: 10,
  // },

  {
    align: "center",
    title: "单价",
    dataIndex: "puPrice",
    width: 80,
    key: 11,
  },
  {
    align: "center",
    title: "单据金额",
    dataIndex: "sumAmount",
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
    dataIndex: "receivableAmount",
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
    dataIndex: "inputTaxRate",
    width: 200,
    scopedSlots: { customRender: "inputTaxRate" },
    key: 18,
  },
];
const costColumns = [
  {title: "费用类型", dataIndex: "feeType", width: 180, scopedSlots: { customRender: "feeType" }},
  {title: "费用项", dataIndex: "feeName", width: 180},
  {title: "收款主体", dataIndex: "receivingSubjectName", width: 260},
  {title: "费用金额",dataIndex: "feeAmount", width: 180},
  {title: "增值税", dataIndex: "rate", width: 200,scopedSlots: { customRender: "rate" },},
  {title: "不含税金额", dataIndex: "priceExcludingTax", width: 240},
  {title: "币种", dataIndex: "currency", width: 160},
  {title: "汇率", dataIndex: "exchangeRate", width: 160},
  {title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 240},
  {title: "人民币金额", dataIndex: "currencyAmount", width: 240},
  {title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 280},
  {title: "备注", dataIndex: "remark", width: 280},
]
export default {
  data() {
    return {
      costColumns,
      feeList: [],
      state: 2,
      tableLoading: false,
      visible: false,
      columns,
      tableDetail: [],
      basicInfo: {
        poCode: "",
        supplierName: "",
        puTotalAmount: "",
        img: "",
        reconciliaState: "",
        settleState: "",
      },
    };
  },
  methods: {
    stateChange(poCode) {
      this.getDetails(poCode);
    },
    getDetails(poCode) {
      const params = {
        poCode: poCode,
        poCodeState: this.state,
      };
      this.tableLoading = true;
      GetDetails(params).then((res) => {
        console.log(res);
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.visible = true;
          let item = res.data.data;
          this.basicInfo = {
            poCode: item.poCode || "",
            supplierName: item.supplierName || "",
            puTotalAmount: item.puTotalAmount || "",
            reconciliaState: item.reconciliaState,
            settleState: item.settleState,
            img: item.img || "",
          };
          this.tableDetail = item.purchaseOrderDetailDtos;
          this.tableDetail.forEach((v) => {
            v.deliveryWeight = v.deliveryWeight / 1000 || "";
          });
          this.feeList = res.data.data?.purchaseFeeList || []
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    showModal(record) {
      this.getDetails(record.poCode);
    },
    handleOk() {
      this.feeList = []
      this.visible = false;
    },
  },
};
</script>