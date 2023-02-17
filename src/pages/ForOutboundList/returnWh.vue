<template>
  <div class="details-item">
    <a-modal
      title="出库单确认"
      v-model="visible"
      cnetered
      destroyOnClose
      width="50%"
      :maskClosable="false"
    >
      <div id="printToBeWh">
        <div class="info-item">
          <a-card
            title="出库单基本信息"
            class="card-info"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
          >
            <a-form :form="infoForm">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="出库单号">
                    <span>{{ infoForm.imItemCode }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="出库时间">
                    <a-date-picker
                      style="width: 100%"
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      v-model="infoForm.deliveryTime"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="出库类型">
                    <span v-if="infoForm.imItemType == 10">销售单出库</span>
                    <span v-if="infoForm.imItemType == 13">换货单出库</span>
                    <span v-if="infoForm.imItemType == 103">换货入库</span>
                    <span v-if="infoForm.imItemType == 90">领料出库</span>
                    <span v-if="infoForm.imItemType == 91">盘亏出库</span>
                    <span v-if="infoForm.imItemType == 98">其他出库</span>
                    <span v-if="infoForm.imItemType == 12">退货出库</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item
                    :label="
                      infoForm.partnerType == 20 ? '客户名称' : '供应商名称'
                    "
                  >
                    <span>{{ infoForm.partnerName }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="
                      infoForm.partnerType == 20
                        ? '客户联系手机'
                        : '供应商联系手机'
                    "
                  >
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
                <a-col :span="8">
                  <a-form-item label="送货地址"
                    ><span>{{
                      infoForm.deliverAddress || "--"
                    }}</span></a-form-item
                  >
                </a-col>
                <a-col :span="8">
                  <a-form-item label="订单备注"
                    ><span>{{ infoForm.remark || "--" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>
        </div>
        <div class="table-item" style="margin-top: 20px">
          <a-card
            title="出库单商品列表"
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
              <span class="table-formva" slot="DQTitle">实际出库数量</span>
              <div slot="deliveryQty" slot-scope="text, record">
                <a-input
                  style="text-align: center"
                  v-model="record.deliveryQty"
                  @change="qtyChange(record)"
                  v-number
                ></a-input>
              </div>
              <div slot="totalCostOfWarehousing" slot-scope="text, record">
                <a-input
                  style="text-align: center"
                  v-model="record.totalCostOfWarehousing"
                  v-number
                  @change="totalChange(record)"
                ></a-input>
              </div> </a-table
          ></a-card>
        </div>
      </div>
      <template slot="footer">
        <div>
          <a-button
            type="primary"
            :loading="confirmLoading"
            @click="warehouseSubmit"
            >确认出库</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
  <!-- :scroll="{ y: 300, x: 1300 }" -->
</template>

<script>
import {
  GetDetails,
  WarehousingConfirm,
} from "../../services/warehouseManagement/outWarehouse/ForOutboundList";
import { formatDate, debounce } from "../../utils/util";
export default {
  data() {
    return {
      columns: [
        {
          align: "center",
          title: "商品编码",
          dataIndex: "itemCode",
          // width: 150,
        },
        {
          align: "center",
          title: "商品名称",
          dataIndex: "itemName",
          // width: 150,
        },
        {
          align: "center",
          title: "规格",
          dataIndex: "itemSpec",
          // width: 100,
        },
        // {
        //   align: "center",
        //   title: "出库件数",
        //   dataIndex: "qty",
        //   // width: 100,
        // },
        {
          align: "center",
          // title: "实际出库数量",
          slots: { title: "DQTitle" },
          dataIndex: "deliveryQty",
          scopedSlots: { customRender: "deliveryQty" },
          // width: 120,
        },
        {
          align: "center",
          title: "出库单价",
          dataIndex: "poPrice",
          // width: 80,
        },
        {
          align: "center",
          title: "出库金额",
          dataIndex: "totalCostOfWarehousing",
          // width: 100,
          scopedSlots: { customRender: "totalCostOfWarehousing" },
        },
        {
          align: "center",
          title: "税率",
          dataIndex: "taxRate",
          // width: 80,
        },
        {
          align: "center",
          title: "税额",
          dataIndex: "tax",
          // width: 80,
          scopedSlots: { customRender: "tax" },
        },
        {
          align: "center",
          title: "单位",
          dataIndex: "unit",
          // width: 80,
          scopedSlots: { customRender: "unit" },
        },
      ],
      visible: false,
      infoForm: {
        deliveryTime: formatDate(new Date(), "YYYY-MM-dd hh:mm:ss"),
      },
      tableDetail: [],
      tableLoading: false,
      confirmLoading: false,
    };
  },
  methods: {
    totalChange(record) {
      record.poPrice =
        record.totalCostOfWarehousing && record.deliveryQty
          ? this.formatPrice(
              Number(record.totalCostOfWarehousing) / Number(record.deliveryQty)
            )
          : "";
    },
    qtyChange(record) {
      record.totalCostOfWarehousing =
        record.deliveryQty && record.poPrice
          ? this.formatPrice(
              Number(record.deliveryQty) * Number(record.poPrice)
            )
          : "";
    },
    warehouseSubmit: debounce(function () {
      let errorState = false;
      this.tableDetail.forEach((item) => {
        if (!item.deliveryQty) {
          errorState = true;
        }
      });
      if (errorState) {
        this.$message.error("实际出库数量为必填");
        return;
      }
      const params = {
        imItemType: this.infoForm.imItemType,
        docNo: this.infoForm.docNo,
        deliveryTime: this.infoForm.deliveryTime,
        imItemDetailDtoList: [...this.tableDetail],
      };
      this.confirmLoading = true;
      WarehousingConfirm(params).then((res) => {
        this.confirmLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.$message.success(
            data.message === "OK" ? "确认出库成功" : data.message
          );
          this.visible = false;
          this.$parent.getList();
        } else {
          this.$message.error(data.message ? data.message : "确认出库失败");
        }
      });
    }, 1000),
    getDetailData(record) {
      this.tableLoading = true;
      const params = {
        docNo: record.docNo ? record.docNo : record.imItemCode,
        type: record.imItemType,
      };
      GetDetails(params).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.tableDetail = res.data.data.imItemDetailDtoList;
          this.tableDetail.forEach((item) => {
            item.deliveryQty = item.deliveryQty ? item.deliveryQty : item.qty;
          });
          this.visible = true;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取出库单详情数据失败"
          );
        }
      });
    },
    showModal(record) {
      this.tableDetail = [];
      this.infoForm.imItemCode = record.imItemCode;
      this.infoForm.docNo = record.docNo;
      this.infoForm.imItemType = record.imItemType;
      this.infoForm.partnerName = record.partnerName;
      this.infoForm.partnerPhone = record.partnerPhone;
      this.infoForm.createDate = record.createDate;
      this.infoForm.remark = record.remark;
      this.infoForm.deliveryTime = formatDate(
        new Date(),
        "YYYY-MM-dd hh:mm:ss"
      );
      console.log(this.infoForm.deliveryTime);
      this.getDetailData(record);
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
</style>