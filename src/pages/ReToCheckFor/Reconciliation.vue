<template>
  <div>
    <a-modal
      title="对账单明细"
      v-model="visible"
      cnetered
      destroyOnClose
      width="65%"
      :maskClosable="false"
    >
      <div class="info-item">
        <a-card
          title="订单信息"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <div class="info">
            <a-form :form="infoForm">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item label="订单号">
                    {{ infoForm.sno }}
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="运营主体">
                    {{ infoForm.opName }}
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="客户名称">
                    {{ infoForm.customerName }}
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="门店名称">
                    {{ infoForm.storeName }}
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item label="客户订单号">
                    {{ infoForm.customerSno }}
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="收款方式">
                    {{ infoForm.payTypeDesc }}
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="单据金额">
                    {{ infoForm.totalSignAmount }}
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-item label="单据">
                    {{ infoForm.img }}
                  </a-form-item>
                </a-col> -->
              </a-row>
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item label="是否采购服务">
                    <span v-if="infoForm.isPurchaseServer == 1">是</span>
                    <span v-if="infoForm.isPurchaseServer == 0">否</span>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="服务单类型">
                    <span v-if="infoForm.serverType == 1">加工服务单</span>
                    <span v-if="infoForm.serverType == 2">配送服务单</span>
                    <span v-if="infoForm.serverType == 3">仓储服务单</span>
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-item label="关联合同">
                    <span >{{infoForm.contractTitle}}</span>
                  </a-form-item>
                </a-col> -->
                <!-- //! glht -->
              </a-row>
              <a-row :gutter="16">
                <a-col>
                  <div class="upload-img">
                    <a-form-item label="单据文件">
                      <div class="flex-fs uploadbox">
                        <div
                          v-if="uploadUrls.length > 0"
                          class="flex-fs imgWrap"
                        >
                          <div
                            class="uploadImgs"
                            v-for="(item, index) in uploadUrls"
                            :key="index"
                          >
                            <img
                              v-if="item.type.includes('image')"
                              :src="item.url"
                              :alt="item.name"
                              @click="preView(item.url)"
                            />
                            <div
                              v-else
                              class="cursorPin iconBox textwrap"
                              title="点击下载预览"
                              @click="downloadFile(item.url)"
                            >
                              <p class="iconP">
                                <a-icon type="file" />
                              </p>
                              {{ item.name }}
                            </div>
                          </div>
                        </div>
                        <ImageEdit
                          :imgList="previewImageList"
                          :filePreviewShow="previewVisible"
                          @close="handleCancelPreviewImage"
                        />
                      </div>
                    </a-form-item>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </div>
      <div class="table-item">
        <a-card
          title="对账单明细列表"
          class="card-table"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
          style="margin-top: 10px"
        >
          <a-table
            :columns="columns"
            :data-source="tableList"
            :scroll="{ x: 1300 }"
            rowKey="id"
            :pagination="false"
            :loading="tableLoading"
            size="small"
          >
            <span slot="vatTitle" class="table-formva">税率/抵扣率(%)</span>
            <span slot="signPrice" slot-scope="text">
              {{ formatPrice(text) }}
            </span>
            <span slot="signAmount" slot-scope="text">
              {{ formatPrice(text) }}
            </span>
            <span slot="deductionAmount" slot-scope="text">
              {{ formatPrice(text) }}
            </span>
            <span slot="receivableAmount" slot-scope="text">
              {{ formatPrice(text) }}
            </span>
            <!-- <span slot="taxAmount" slot-scope="text">
              {{ formatPrice(text) }}
            </span> -->
            <span slot="includingTaxAmount" slot-scope="text">
              {{ formatPrice(text) }}
            </span>
            <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
            <span slot="invoiceBusinessType" slot-scope="text, record">
              <a-select
                v-model="record.invoiceBusinessType"
                @click.stop.native
                placeholder=""
                @change="vatChange(record)"
                style="width: 40%">
                <a-select-option :value='0'>应税业务</a-select-option>
                <a-select-option :value='1'>免税业务</a-select-option>
              </a-select>
              <a-select
                v-model="record.invoiceType"
                @click.stop.native
                placeholder=""
                @change="vatChange(record)"
                style="width: 60%">
                <a-select-option v-for="(item,index) in invoiceOption" :key="index" :value='item.value' :title='item.text'>
                  {{item.text}}
                </a-select-option>
              </a-select>
              </span>
            <div slot="vat" slot-scope="text, record">
              <span style="width: 40%">
                <span v-if="record.invoiceType==3">抵扣率</span>
                <span v-if='record.invoiceType==1||record.invoiceType==2'>税率</span>
              </span>
              <a-select
                style="width: 50%;margin-left:2px"
                v-model="record.vat"
                @change="vatChange(record)"
              >
                <a-select-option value="0">0</a-select-option>
                <a-select-option value="1">1</a-select-option>
                <a-select-option value="3">3</a-select-option>
                <a-select-option value="6">6</a-select-option>
                <a-select-option value="9">9</a-select-option>
                <a-select-option value="11">11</a-select-option>
                <a-select-option value="13">13</a-select-option>
              </a-select>
            </div>
          </a-table>
        </a-card>
      </div>
      <div slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSubmit">对账确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "商品名称",
    dataIndex: "itemName",
    width: 150,
    align: "center",
  },
  {
    title: "商品编码",
    dataIndex: "itemSno",
    width: 150,
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "specs",
    width: 100,
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
    dataIndex: "signQty",
    width: 80,
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
    width: 80,
    align: "center",
    scopedSlots: { customRender: "signPrice" },
  },
  {
    title: "单据金额",
    dataIndex: "signAmount",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "signAmount" },
  },
  {
    title: "扣点金额",
    dataIndex: "deductionAmount",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "deductionAmount" },
  },
  {
    title: "应收金额",
    dataIndex: "receivableAmount",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "receivableAmount" },
  },
  {
    title: "税额",
    dataIndex: "taxAmount",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "taxAmount" },
  },
  {
    title: "不含税金额",
    dataIndex: "includingTaxAmount",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "includingTaxAmount" },
  },
  {
    slots: { title: "invoiceBusinessTypeTit" },
    dataIndex: "invoiceBusinessType",
    align: "center",
    width: 280,
    scopedSlots: { customRender: "invoiceBusinessType" },
    fixed: "right",
  },
  {
    // title: "增值税(%)",
    slots: { title: "vatTitle" },
    dataIndex: "vat",
    align: "center",
    width: 150,
    scopedSlots: { customRender: "vat" },
    fixed: "right",
  },
];
import {
  GetDetails,
  ReconciliateConfirm,
} from "../../services/settlement/receive/ReToCheckFor";
import { getUploadFiles } from "../../services/product/productList";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
import { isFalse } from "../../utils/util";
export default {
  components: {
    ImageEdit,
  },
  data() {
    return {
      //免税二期
      invoiceOption:[
        {value:1,text:'增值税普通发票'},
        {value:2,text:'增值税专用发票'},
        {value:3,text:'增值税普通发票(免税)'}
      ],
      columns,
      visible: false,
      infoForm: {},
      tableList: [],
      tableLoading: false,
      snoId: "",
      version: "",
      //单据相关
      previewVisible: false,
      uploadUrls: [],
      previewImageList: [],
    };
  },
  methods: {
    //单据文件
    handleCancelPreviewImage() {
      this.previewImage = undefined;
      this.previewImageList = [];
      this.previewVisible = false;
    },
    preView(url) {
      this.previewImageList = [];
      this.previewImage = url;
      if (this.uploadUrls.length > 0) {
        this.uploadUrls.forEach((item) => {
          if (item.type.includes("image")) {
            this.previewImageList.push(item.url);
          }
        });
      } else {
        this.previewImageList.push(url);
      }
      this.previewVisible = true;
    },
    vatChange(record) {
      console.log(record.vat);
      record.taxAmount = 0;
      record.includingTaxAmount = record.signAmount;
      if (record.invoiceType==3) {
        record.taxAmount=record.signAmount&&record.vat?(+record.signAmount*(+record.vat/100)).toFixed(2):record.taxAmount
      }else{
        record.taxAmount =
          record.signAmount && record.vat
            ? (
                ((Number(record.signAmount) / (1 + Number(record.vat) / 100)) *
                  Number(record.vat)) /
                100
              ).toFixed(2)
            : record.taxAmount;
      }
      record.includingTaxAmount =
        record.signAmount && record.taxAmount
          ? this.formatPrice(
              Number(record.signAmount) - Number(record.taxAmount)
            )
          : record.includingTaxAmount;
      console.log(record.taxAmount);
      this.$forceUpdate();
    },
    handleCancel() {
      this.visible = false;
    },
    handleSubmit() {
     if (
        this.tableList&&this.tableList.length>0?this.tableList.some(
         item=>isFalse([item.vat,item.invoiceBusinessType,item.invoiceType])
        ):false
      ) {
        this.$message.error("请填写费用项必填项");
        return;
      }
      const params = {
        id: this.snoId,
        orderDetailDtoList: this.tableList,
        version: this.version,
      };
      ReconciliateConfirm(params).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.visible = false;
          this.$message.success(
            res.data.message == "OK" ? "对账确认成功" : res.data.message
          );
          this.$parent.getList();
        }
      });
    },
    getDetails(id) {
      this.tableLoading = true;
      GetDetails({ id: id, sort: "id", order: "desc" }).then((res) => {
        console.log(res);
        this.tableLoading = false;
        this.tableList = res.data.rows || [];
        // if (this.tableList && this.tableList.length > 0) {
        //   this.tableList.forEach((item) => {
        //     item.vat = item.vat ? item.vat : 0;
        //   });
        // }
      });
    },
    async showModal(record) {
      this.visible = true;
      this.snoId = record.id;
      this.version = record.version;
      // this.infoForm = {
      //   sno: record.sno || "",
      //   opName: record.opName || "",
      //   customerName: record.customerName || "",
      //   storeName: record.storeName || "",
      //   customerSno: record.customerSno || "",
      //   payType: record.payType || "",
      //   totalSignAmount: this.formatPrice(record.totalSignAmount),
      //   img: record.img || "",
      // };
      this.infoForm = record;
      this.formatPrice(this.infoForm.tototalSignAmount);
      this.getDetails(record.id);
      //单据
      let params = new FormData();
      params.append("tableId", record.id);
      params.append("tableName", "signed");
      let res = await getUploadFiles(params);
      this.uploadUrls = [];
      if (res.data.code == 200 && res.data.data.length > 0) {
        let filetemp = [];
        res.data.data.forEach((item) => {
          filetemp.push({ ...JSON.parse(item.filePath), id: item.id });
        });
        this.uploadUrls = filetemp;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 0;
}
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: "*";
}
.uploadbox {
  flex-wrap: wrap;

  .imgWrap {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .uploadImgs {
    position: relative;
    border-radius: 4px;
    width: 104px;
    height: 104px;
    border: 1px solid #d9d9d9;
    padding: 14px;
    margin-bottom: 4px;

    .imgDelete {
      cursor: pointer;
      position: absolute;
      right: 4px;
      top: -10px;
    }

    .iconBox {
      text-align: center;
      font-size: 16px;

      /deep/.iconP {
        margin: 0;
        padding: 0;
        line-height: 0;

        i {
          svg {
            width: 40px;
            height: 40px;
            color: #818181;
          }
        }
      }
    }

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
</style>