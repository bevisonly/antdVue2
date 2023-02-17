<template>
  <div class="details-item">
    <a-modal
      title="入库单详情"
      v-model="visible"
      cnetered
      destroyOnClose
      width="65%"
      :footer="false"
    >
      <div id="printToBeWh">
        <div class="info-item">
          <a-card
            title="入库单基本信息"
            class="card-info"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
          >
            <a-form :form="infoForm">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="入库订单编号">
                    <span>{{ infoForm.imItemCode }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="关联单号">
                    <span>{{ infoForm.docNo }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="入库类型">
                    <span>{{ infoForm.imItemTypeName }}</span>
                    <!-- <span v-if="infoForm.imItemType == 20">采购订单入库</span>
                    <span v-if="infoForm.imItemType == 33">盘盈入库</span>
                    <span v-if="infoForm.imItemType == 24">换货入库</span>
                    <span v-if="infoForm.imItemType == 23">客户退货入库</span>
                    <span v-if="infoForm.imItemType == 105">生产入库</span>
                    <span v-if="infoForm.imItemType == 106">退料入库</span>
                    <span v-if="infoForm.imItemType == 99">其他入库</span> -->
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="供应商名称">
                    <span>{{ infoForm.partnerName }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="供应商联系手机">
                    <span>{{ infoForm.partnerPhone }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="订单提交时间"
                    ><span>{{ infoForm.createDate }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <!-- <a-col :span="8">
                <a-form-item label="入库时间"> </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="入库人"> </a-form-item>
              </a-col> -->
                <a-col :span="8">
                  <a-form-item label="订单备注"
                    ><span>{{ infoForm.remark }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>
        </div>
        <div class="table-item" style="margin-top: 20px">
          <a-card
            title="入库单商品列表"
            size="small"
            :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
            :body-style="{ padding: '12px,2px' }"
          >
            <a-table
              :columns="columns"
              :data-source="tableDetail"
              :pagination="false"
              :loading="tableLoading"
              style="margin-top: 10px"
              size="small"
              rowKey="id"
            >
              <span slot="poPrice" slot-scope="text">{{ text || "-" }}</span>
              <span slot="tax" slot-scope="text">{{ text || "-" }}</span>
              <span slot="totalCostOfWarehousing" slot-scope="text">{{
                text || "-"
              }}</span>
                <span slot="inputTaxRate" slot-scope="text, record">
                  <span>
                    {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                    {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                    {{ (record.inputTaxRate||'')+'%' }}</span>
                </span>
            </a-table></a-card
          >
        </div>
      </div>
    </a-modal>
  </div>
  <!-- :scroll="{ y: 300, x: 1300 }" -->
</template>

<script>
import { GetDetails } from "../../services/warehouseManagement/warehousing/ToBeWarehousedOrder";
export default {
  data() {
    return {
      columns: [],
      columnsAll: [
        {
          align: "center",
          title: "商品编码",
          dataIndex: "itemCode",
        },
        {
          align: "center",
          title: "商品名称",
          dataIndex: "itemName",
        },
        {
          align: "center",
          title: "柜号",
          dataIndex: "containerCode",
        },
        {
          align: "center",
          title: "规格",
          dataIndex: "itemSpec",
        },
        {
          align: "center",
          title: "入库数量",
          dataIndex: "qty",

        },
        {
          align: "center",
          title: "实际入库数量",
          dataIndex: "lastQty",
        },
        {
          align: "center",
          title: "客户数",
          dataIndex: "totalSignAmount1",
        },
        {
          align: "center",
          title: "采购单价",
          dataIndex: "poPrice",
          scopedSlots: { customRender: "poPrice" },
        },
        {
          align: "center",
          title: "成本分摊单价",
          dataIndex: "price",
        },
        // {
        //   align: "center",
        //   title: "税率",
        //   dataIndex: "taxRate",
        // },
        {
          align: "center",
          title: "增值税",
          dataIndex: "inputTaxRate",
          scopedSlots: { customRender: "inputTaxRate" },
        },
        // {
        //   align: "center",
        //   title: "税额",
        //   dataIndex: "tax",
        //   scopedSlots: { customRender: "tax" },
        // },
        {
          align: "center",
          title: "商品金额",
          dataIndex: "itemAmount",
        },
        {
          align: "center",
          title: "入库总成本金额",
          dataIndex: "totalCostOfWarehousing",
          scopedSlots: { customRender: "totalCostOfWarehousing" },
        },
      ],
      visible: false,
      infoForm: {},
      tableDetail: [],
      tableLoading: false,
    };
  },
  methods: {
    getDetailData(record) {
      this.tableLoading = true;
      let docNo
      if (record.imItemType=='98'||record.imItemType=='99'||record.imItemType=='23') {
        docNo=record.imItemCode
      }else{
        docNo=record.docNo||''
      }
      const params = {
        docNo: docNo,
        // docNo: record.docNo ? record.docNo : record.imItemCode,
        type: record.imItemType,
      };
      GetDetails(params).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.tableDetail = res.data.data.imItemDetailDtoList;
          if (
            this.tableDetail &&
            this.tableDetail.length > 0 &&
            this.infoForm.imItemType == 105
          ) {
            this.tableDetail.forEach((item) => {
              if (item.price) {
                item.poPrice = item.price;
              }
            });
          }
          this.visible = true;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取入库单详情数据失败"
          );
        }
      });
    },
    showDetailModal(record) {
      this.tableDetail = [];

      this.infoForm = {
        imItemCode: record.imItemCode,
        docNo: record.docNo,
        imItemType: record.imItemType,
        imItemTypeName: record.imItemTypeName,
        partnerName: record.partnerName,
        partnerPhone: record.partnerPhone,
        createDate: record.createDate,
        remark: record.remark,
        // imItemCode:record.imItemCode,
        // imItemCode:record.imItemCode,
      };
      if (this.infoForm.imItemType != 105) {
        let ptTemp = [];
        let temp = ["price"];
        this.columnsAll.forEach((item) => {
          if (temp.indexOf(item.dataIndex) < 0) {
            ptTemp.push(item);
          }
        });
        this.columns = ptTemp;
      } else {
        this.columns = this.columnsAll;
      }
      this.getDetailData(record);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>