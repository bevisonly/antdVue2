<template>
  <div class="details-modal">
    <a-modal
      width="70%"
      centered
      v-model="visible"
      title="销售单详情"
      destroyOnClose
    >
      <div class="order-info">
        <a-card
          size="small"
          title="订单信息"
          :head-style="{ backgroundColor: '#f0f3f6' }"
        >
          <div class="signed-info">
            <a-form :form="detailInfo">
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-item label="送货日期">
                    <a-input v-model="detailInfo.deliveryDate" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="客户名称">
                    <a-input
                      v-model="detailInfo.customerName"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="单据状态">
                    <a-input v-model="detailInfo.stateText" readOnly> </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="订单类型">
                    <a-input
                      v-model="detailInfo.typeText"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-item label="客户门店">
                    <a-input v-model="detailInfo.storeName" readOnly> </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="供应商">
                    <a-input
                      v-model="detailInfo.supplierName"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="联系电话">
                    <a-input v-model="detailInfo.receiptPhone" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="收货地址">
                    <a-input v-model="detailInfo.receiptRegion" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-item label="销售订单号">
                    <a-input v-model="detailInfo.sno" readOnly> </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="收款方式">
                    <a-input
                      v-model="detailInfo.payTypeText"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="详细地址">
                    <a-input v-model="detailInfo.receiptAddress" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="运营主体">
                    <a-input v-model="detailInfo.opName" readOnly> </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-item label="提货方式">
                    <a-input v-model="detailInfo.deliveryTypeText" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6" v-if="detailInfo.type == 3">
                  <a-form-item label="是否采购服务">
                    <a-input :value="detailInfo.isPurchaseServerText" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6" v-if="detailInfo.type == 3">
                  <a-form-item label="服务单类型">
                    <a-input v-model="detailInfo.serverTypeText" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="关联合同">
                    <div style="border: 1px solid #d9d9d9;line-height: 32px;border-radius: 6px;">
                      {{detailInfo.contractTitle}}
                      {{detailInfo.contractNumber ? '&' : ''}}
                      {{detailInfo.contractNumber || ''}}
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </div>
      <div class="supplier-info">
        <a-card
          size="small"
          title="供应商信息"
          :head-style="{ backgroundColor: '#f0f3f6' }"
        >
          <div class="signed-info">
            <a-form :form="detailInfo">
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-item label="采购客户">
                    <a-input v-model="detailInfo.buyerAccountName" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="采购订单号">
                    <a-input
                      v-model="detailInfo.poCode"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="客户订单号">
                    <a-input v-model="detailInfo.customerSno" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="需求单号">
                    <a-input v-model="detailInfo.roSno" placeholder="" readOnly>
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </div>
      <div class="signed-item" style="margin-top: 10px">
        <a-card
          size="small"
          title="收货信息"
          :head-style="{ backgroundColor: '#f0f3f6' }"
        >
          <div class="receiving-info">
            <a-form-model :form="detailInfo">
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-model-item label="收货司机">
                    <a-input v-model="detailInfo.deliveryUser" readOnly>
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="收货司机手机号">
                    <a-input
                      v-model="detailInfo.deliveryPhone"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="完成时间">
                    <a-input v-model="detailInfo.deliveryTime" readOnly>
                    </a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-model-item label="送货司机">
                    <a-input v-model="detailInfo.deliveryDriver" readOnly>
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="送货司机手机号">
                    <a-input
                      v-model="detailInfo.deliveryPhone2"
                      placeholder=""
                      readOnly
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="完成时间">
                    <a-input v-model="detailInfo.deliveryDate" readOnly>
                    </a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="6">
                  <a-form-model-item label="收货单据">
                    <img :src="detailInfo.receiveImg" alt="" />
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-model-item label="送货单据">
                    <img :src="detailInfo.deliveryImg" alt="" />
                  </a-form-model-item>
                </a-col> -->
              </a-row>
              <a-row :gutter="12">
                <div class="upload-img">
                  <a-form-item label="送货单据">
                    <div class="flex-fs uploadbox">
                      <div v-if="uploadUrls.length > 0" class="flex-fs imgWrap">
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
              </a-row>
            </a-form-model>
          </div>
        </a-card>
        <a-card
          size="small"
          title="收货商品"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          style="margin-top: 10px"
        >
          <div class="detail-table">
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
                <span v-if="text==0||text">
                  {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                  {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                  {{ record.vat+'%' }}
                </span>
                <span v-else></span>
                </span>
              <span slot="packAmount"></span>
            </a-table>
          </div>
        </a-card>
      </div>
      <div
        class="signed-item"
        style="margin-top: 10px"
        v-if="feeTable&&feeTable.length>0"
      >
        <a-card
          size="small"
          title="费用项列表"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          style="margin-top: 10px"
        >
          <div class="detail-table">
            <a-table
              :columns="costColumns"
              :data-source="feeTable"
              :pagination="false"
              style="margin-top: 10px"
              size="small"
              :scroll="{ y: 800, x: 300 }"
            >
              <span slot="feeType" slot-scope="text, record">
                <span>{{
                  record.feeType == 1
                    ? "国内费用"
                    : record.feeType == 2
                    ? "国际费用"
                    : "其它费用"
                }}</span>
              </span>
               <span slot="rate" slot-scope="text,record">
                  {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                  {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                  {{ record.rate+'%' }}
                </span>
                <template slot="footer">
                  <div>
                    <span>费用项合计 : </span>
                    <span>{{totalFee}}</span>
                  </div>
                </template>
            </a-table>
          </div>
        </a-card>
      </div>
      <template slot="footer">
        <span></span>
      </template>
    </a-modal>
    <!-- 包装选择 -->
    <!-- <a-modal
      title="包装选择"
      :visible="packageVisible"
      :width="700"
      @cancel="handleCancelPackage"
      :dialogStyle="{
        top: '160px',
      }"
      destroyOnClose
    >
      <div class="details">
        <div class="table">
          <p class="table-title flex-sb">
            <span>包装列表</span>
            <span>
              <a-select
                ref="addPackageSelect"
                mode="multiple"
                v-model="valueSelectPackage"
                size="small"
                show-search
                placeholder="请选择包装"
                option-filter-prop="children"
                style="width: 200px; margin-right: 6px"
                :filter-option="filterOption"
                @change="chooseSelectPackage"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                  >
                    <a-button type="primary" size="small" @click="addPackage"
                      >确认</a-button
                    >
                  </div>
                </div>
                <a-select-option
                  v-for="item in packageListData"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.packName }}
                </a-select-option>
              </a-select>
            </span>
          </p>
          <div class="table-data">
            <a-table
              rowKey="packCode"
              :pagination="false"
              :columns="packageColumns"
              :data-source="packageData"
              :scroll="{ y: 200 }"
            >
              <span slot="PQTitle" class="table-formva"> 包装数量</span>
            
              <span slot="packQty" slot-scope="text, record">
                <a-input v-model="record.packQty" placeholder="必填"></a-input>
              </span>
              <span slot="packUnitPrice" slot-scope="text">
                <span>{{ text / 100 }}</span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <template slot="footer">
        <span></span>
      </template>
    </a-modal> -->
  </div>
</template>

<script>
import { getDetails } from "../../services/signed/waitForSigned";
import { GetDetails } from "../../services/signed/signed";
import { getUploadFiles } from "../../services/product/productList";
const columns = [
  {
    align: "center",
    title: "供应商商品编码",
    dataIndex: "itemSno",
    width: 150,
    key: 3,
  },
  {
    align: "center",
    title: "供应商商品名称",
    dataIndex: "itemName",
    width: 150,
    key: 4,
  },
  {
    align: "center",
    title: "柜号",
    dataIndex: "containerCode",
    width: 150,
    key: 55,
  },
  {
    align: "center",
    title: "规格",
    dataIndex: "specs",
    width: 100,

    key: 5,
  },
  {
    align: "center",
    title: "包装费用",
    dataIndex: "packAmount",
    width: 100,
    key: 6,
  },
  // {
  //   align: "center",
  //   title: "出库金额",
  //   dataIndex: "pickupAmt",
  //   width: 100,
  //   key: 7,
  // },
  {
    align: "center",
    title: "入库日期",
    dataIndex: "prodDate",
    width: 150,
    key: 8,
  },
  // {
  //   align: "center",
  //   title: "出库数量",
  //   dataIndex: "pickupQty",
  //   width: 100,
  //   key: 9,
  // },
  {
    align: "center",
    title: "计价单位",
    width: 100,
    dataIndex: "priceUnit",
    key: 10,
  },

  {
    align: "center",
    title: "供应商单价",
    dataIndex: "supplyPrice",
    width: 100,

    key: 11,
  },
  // {
  //   align: "center",
  //   title: "采购数量",
  //   dataIndex: "saleQty",
  //   width: 100,
  //   scopedSlots: { customRender: "saleQty" },
  //   key: 12,
  // },
  {
    align: "center",
    title: "验收数量",
    dataIndex: "signQty",
    width: 100,

    key: 13,
  },
  {
    align: "center",
    title: "验收单价",
    dataIndex: "signPrice",
    width: 100,

    key: 14,
  },
  {
    align: "center",
    title: "验收金额",
    dataIndex: "signAmount",
    width: 100,
    key: 15,
  },
  {
    align: "center",
    title: "增值税",
    dataIndex: "vat",
    width: 250,
    key: 999,
    scopedSlots: { customRender: "vat" },
  },
  {
    align: "center",
    title: "成本数量",
    dataIndex: "costQty",
    width: 100,
    key: 16,
  },
  {
    align: "center",
    title: "成本单价",
    dataIndex: "costPrice",
    width: 100,
    key: 17,
  },
  {
    align: "center",
    title: "成本金额",
    dataIndex: "costAmount",
    width: 100,
    key: 18,
  },
];
const costColumns = [
  {
    title: "费用类型",
    dataIndex: "feeType",
    width: 180,
    scopedSlots: { customRender: "feeType" },
  },
  { title: "费用项", dataIndex: "feeName", width: 180 },
  { title: "收款主体", dataIndex: "receivingSubjectName", width: 260 },
  { title: "费用金额", dataIndex: "feeAmount", width: 180 },
  { title: "增值税", dataIndex: "rate", width: 200,scopedSlots: { customRender: "rate" } },
  { title: "不含税金额", dataIndex: "priceExcludingTax", width: 240 },
  { title: "币种", dataIndex: "currency", width: 160 },
  { title: "汇率", dataIndex: "exchangeRate", width: 160 },
  { title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 240 },
  { title: "人民币金额", dataIndex: "currencyAmount", width: 240 },
  { title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 280 },
  { title: "备注", dataIndex: "remark", width: 280 },
];
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
export default {
  components: {
    ImageEdit,
  },
  data() {
    return {
      // orderType: "",
      separdinedBillVisible: false,

      //计价单位数据
      dictionaryData: [],
      feeTable: [],
      costColumns,
      columns,
      // columns2,
      tableDetail: [],
      tableLoading: false,
      fileUrlList: [],
      fileList: [],
      imgData: {
        type: "item",
        tableName: "signed",
        mode: "batch",
      },
      visible: false,
      detailInfo: {
        deliveryDate: "",
        opName: "",
        customerName: "",
        storeName: "",
        sno: "",
        payType: "",
        receiptPhone: "",
        state: "",
        receiptRegion: "",
        receiptAddress: "",
        deliveryType: "",
        type: "",
        supplierName: "",
        buyerAccountName: "",
        poCode: "",
        customerSno: "",
        roSno: "",
        deliveryUser: "",
        deliveryTime: "",
        // deliveryDate: "",
        deliveryDriver: "",
        deliveryPhone: "",
        deliveryPhone2: "",
        receiveImg: "",
        deliveryImg: "",
        typeText: "",
        payTypeText: "",
        stateText: "",
        deliveryTypeText: "",
      },
      pageState: "",
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
    async getDetails(id, state) {
      this.pageState = state || "";
      this.tableLoading = true;
      if (state === "signed") {
        const res = await GetDetails({ id: id });
        this.tableLoading = false;
        if (res.data.code == 200) {
          let data = res.data.data;
          this.visible = true;
          let temp = data.orderDetailDtoList;
          this.tableDetail = JSON.parse(JSON.stringify(temp));
          this.feeTable = data.orderFeeList || [];
          this.detailInfo = { ...data.order, ...data.purchaseOrderHead };
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        const res = await getDetails({ id: id });
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.visible = true;
          let data = res.data.data;
          let temp = data.orderDetailDtoList;
          // let temp = data.orderDetailList.rows;
          this.tableDetail = JSON.parse(JSON.stringify(temp));
          this.detailInfo = { ...data.order, ...data.purchaseOrderHead };
          this.feeTable = data.orderFeeList || [];
        } else {
          this.$message.error(res.data.message);
        }
      }
      switch (this.detailInfo.state) {
        case 103:
          this.detailInfo.stateText = "待签收";
          break;
        case 220103:
          this.detailInfo.stateText = "已收货待签收";
          break;
        case 210103:
          this.detailInfo.stateText = "待收货待签收";
          break;
        case 104:
          this.detailInfo.stateText = "已签收";
          break;
        case 220104:
          this.detailInfo.stateText = "待收货已签收";
          break;
        case 210104:
          this.detailInfo.stateText = "已收货已签收";
          break;

        default:
          break;
      }
      this.detailInfo.deliveryTypeText =
        this.detailInfo.deliveryType == 1 ? "自提" : "配送";
      switch (this.detailInfo.payType) {
        case 1:
          this.detailInfo.payTypeText = "现结";
          break;
        case 2:
          this.detailInfo.payTypeText = "周期结算";
          break;

        default:
          break;
      }
      switch (this.detailInfo.type) {
        case 1:
          this.detailInfo.typeText = "销售单";
          break;
        case 2:
          this.detailInfo.typeText = "库存单";
          break;
        case 3:
          this.detailInfo.typeText = "服务单";
          break;
        case 4:
          this.detailInfo.typeText = "换货单";
          break;
        case 5:
          this.detailInfo.typeText = "直送单";
          break;
        case 6:
          this.detailInfo.typeText = "采销一体单";
          break;

        default:
          break;
      }
      switch (this.detailInfo.isPurchaseServer) {
        case 1:
          this.detailInfo.isPurchaseServerText = "是";
          break;
        case 0:
          this.detailInfo.isPurchaseServerText = "否";
          break;

        default:
          break;
      }
      switch (this.detailInfo.serverType) {
        case 1:
          this.detailInfo.serverTypeText = "加工服务单";
          break;
        case 2:
          this.detailInfo.serverTypeText = "配送服务单";
          break;
        case 3:
          this.detailInfo.serverTypeText = "仓储服务单";
          break;

        default:
          break;
      }
      console.log(this.detailInfo);
    },
    async showModal(data, state) {
      // this.detailInfo.soId = data.id;
      this.state = state;
      this.detailInfo = {
        soId: data.id,
        deliveryDriver: "",
        deliveryPhone: "",
        signPerson: "",
      };
      if (state === "signed") {
        this.getDetails(data.id, state);
      } else {
        this.getDetails(data.id, "");
      }
      let params = new FormData();
      params.append("tableId", this.detailInfo.soId);
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
    handleCancel() {
      this.visible = false;
    },
  },
  computed: {
     totalFee() {
      return this.feeTable.reduce((t, c) => { return this.formatPrice(t + (+c.feeAmount || 0),2 )}, 0) || "-"
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 0;
}
.detail-table {
  /deep/.ant-input {
    text-align: center;
  }
}
.surplus {
  color: red;
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