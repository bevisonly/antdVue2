<template>
  <div class="details-item">
    <a-modal
      title="已出库单详情"
      v-model="visible"
      cnetered
      destroyOnClose
      width="50%"
      :footer="false"
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
                    <span>{{ infoForm.deliveryTime }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="出库类型">
                    <span>{{infoForm.imItemTypeName}}</span>
                    <!-- <span v-if="infoForm.imItemType == 10">销售单出库</span>
                    <span v-if="infoForm.imItemType == 13">换货单出库</span>
                    <span v-if="infoForm.imItemType == 103">换货入库</span>
                    <span v-if="infoForm.imItemType == 90">领料出库</span>
                    <span v-if="infoForm.imItemType == 91">盘亏出库</span>
                    <span v-if="infoForm.imItemType == 98">其他出库</span>
                    <span v-if="infoForm.imItemType == 12">退货出库</span> -->
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
                    <span>{{ infoForm.partnerName || "--" }}</span>
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
                    <span>{{ infoForm.partnerPhone || "--" }}</span>
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
                    ><span>{{ infoForm.deliveryAddress || "--" }}</span>
                  </a-form-item>
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
            </a-table
          ></a-card>
        </div>
      </div>
    </a-modal>
  </div>
  <!-- :scroll="{ y: 300, x: 1300 }" -->
</template>

<script>
import { GetDetails } from "../../services/warehouseManagement/outWarehouse/ForOutboundList";
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
          title: "实际出库数量",
          dataIndex: "deliveryQty",
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
      infoForm: {},
      tableDetail: [],
      tableLoading: false,
    };
  },
  methods: {
    getDetailData(record) {
      this.tableLoading = true;
      const params = {
        // docNo: record.docNo ? record.docNo : record.imItemCode,
        docNo: record.imItemType == 12||record.imItemType==98 ? record.imItemCode || "" : record.docNo,
        type: record.imItemType,
      };
      GetDetails(params).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.tableDetail = res.data.data.imItemDetailDtoList;
          this.visible = true;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取出库单详情数据失败"
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
        deliveryTime:record.deliveryTime,
        // imItemCode:record.imItemCode,
      };
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