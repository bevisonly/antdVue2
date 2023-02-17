<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="wait-for-signed">
      <div class="search-item">
        <a-card
          title="筛选查询"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          size="small"
        >
          <div class="search">
            <a-form :form="searchform">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      show-search
                      v-model="searchform.customerId"
                      style="width: 100%"
                      @change="handleChange"
                      placeholder="客户名称"
                      allowClear
                      :filter-option="filterOption"
                    >
                      <a-select-option v-for="d in partnerList" :key="d.id" >
                        {{ d.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      v-model="searchform.storeId"
                      :disabled="!searchform.customerId"
                      style="width: 100%"
                      placeholder="客户门店"
                      allowClear
                      show-search
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        v-for="item in storeList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      v-model="searchform.type"
                      placeholder="订单类型"
                      allowClear
                    >
                      <a-select-option value="1"> 销售单 </a-select-option>
                      <a-select-option value="2"> 库存单 </a-select-option>
                      <a-select-option value="3"> 服务单 </a-select-option>
                      <a-select-option value="4"> 换货单 </a-select-option>
                      <a-select-option value="5"> 直送单 </a-select-option>
                      <a-select-option value="6"> 采销一体单 </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.likeItemName"
                      placeholder="商品名称/编码"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <!-- <a-col :span="4">
                  <a-form-item label="运营主体">
                    <a-select v-model="searchform.opId" style="width: 100%">
                      <a-select-option
                        v-for="item in opList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.opName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col> -->
                <!-- <a-col :span="4">
                  <a-form-item label="客户订单号">
                    <a-input v-model="searchform.customerSno" placeholder="">
                    </a-input>
                  </a-form-item>
                </a-col> -->
                <a-col :span="6">
                  <a-form-item>
                    <a-range-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      showTime
                      @change="handleDateChange"
                      :placeholder="['订单日期开始时间', '订单日期结束时间']"
                      v-model="searchform.createDate"
                    ></a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-range-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      showTime
                      @change="handleDateChangeS"
                      :placeholder="['签收日期开始时间', '签收日期结束时间']"
                      v-model="searchform.signDate"
                    ></a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.soSno"
                      placeholder="销售单号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.containerCode"
                      placeholder="柜号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      show-search
                      allowClear
                      v-model.trim="searchform.orgId"
                      placeholder="请选择业务单元(主体)"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="opSearch"
                    >
                      <a-select-option
                        v-for="item in opList"
                        :key="item.orgId"
                        >{{ item.opName }}</a-select-option
                      >
                    </a-select></a-form-item
                  >
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      show-search
                      allowClear
                      mode="multiple"
                      v-model.trim="searchform.topItemType"
                      placeholder="请搜索选择商品一级分类"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="typeNameSearch"
                    >
                      <a-select-option
                        v-for="(item, index) in typeNameList"
                        :key="index"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select></a-form-item
                  >
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-space>
                      <a-button type="primary" @click="handleReset"
                        >清 空</a-button
                      >
                      <a-button type="primary" @click="searchList"
                        >查 询</a-button
                      >
                    </a-space>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </div>
      <div class="list-table" style="margin-top: 16px">
        <a-card
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div style="margin-bottom: 16px; text-align: left">
            <a-button
              :loading="exportLoading"
              type="primary"
              icon="download"
              @click="exportItem"
              :disabled="!hasPermission('signed_details_export')"
            >
              导出
            </a-button>
          </div>
          <a-spin :tip="spinText" :spinning="spinning">
            <a-table
              :columns="columns"
              :data-source="tableList"
              :scroll="{ x: 1300 }"
              rowKey="id"
              :pagination="false"
            >
              <div slot="isPurchaseServer" slot-scope="text">
                <span v-if="text == 1">是</span>
                <span v-if="text == 0">否</span>
              </div>
              <div slot="serverType" slot-scope="text">
                <span v-if="text == 1">加工服务单</span>
                <span v-if="text == 2">配送服务单</span>
                <span v-if="text == 3">仓储服务单</span>
              </div>
              <span slot="vat" slot-scope="text,record">
                  {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
                  {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
                  {{ record.vat+'%' }}
                </span>
            </a-table>
            <!-- 分页 -->
            <div class="pagination">
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
            </div>
          </a-spin>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "../../utils/mixins";
import {
  getOpSubject,
  GetDetailsList,
  SignedDetailExport,
  GetOpList,
  GetPrimaryClassification,
} from "../../services/signed/signed";
import { partnerType } from "@/services/userMa.js";
const columns = [
  {
    align: "center",
    title: "业务单元(主体)",
    dataIndex: "opName",
    width: 200,
  },
  {
    align: "center",
    title: "签收日期",
    dataIndex: "signDate",
    width: 200,
  },
  {
    align: "center",
    title: "订单日期",
    dataIndex: "createDate",
    width: 200,
  },
  {
    align: "center",
    title: "柜号",
    dataIndex: "containerCode",
    width: 150,
  },
  {
    align: "center",
    title: "销售单号",
    dataIndex: "soSno",
    width: 200,
  },
  {
    align: "center",
    title: "客户",
    dataIndex: "customerName",
    width: 250,
  },
  {
    align: "center",
    title: "门店名称",
    dataIndex: "storeName",
    width: 200,
  },
  {
    align: "center",
    title: "送货日期",
    dataIndex: "deliveryDate",
    width: 200,
  },
  {
    align: "center",
    title: "商品名称",
    dataIndex: "itemName",
    width: 200,
  },
  {
    align: "center",
    title: "商品一级分类",
    dataIndex: "topItemType",
    width: 150,
  },
  {
    align: "center",
    title: "商品编码",
    dataIndex: "itemSno",
    width: 200,
  },
    {
    align: "center",
    title: "是否采购服务",
    dataIndex: "isPurchaseServer",
    width: 200,
    scopedSlots: { customRender: "isPurchaseServer" },
  },
  {
    align: "center",
    title: "服务单类型",
    dataIndex: "serverType",
    width: 200,
    scopedSlots: { customRender: "serverType" },
  },
  {
    align: "center",
    title: "下单数量",
    dataIndex: "saleQty",
    width: 100,
  },
  {
    align: "center",
    title: "单价",
    dataIndex: "salePrice",
    width: 100,
  },
  {
    align: "center",
    title: "单位",
    dataIndex: "priceUnit",
    width: 100,
  },
  {
    align: "center",
    title: "验收数量",
    dataIndex: "signQty",
    width: 100,
  },
  {
    align: "center",
    title: "验收单价",
    dataIndex: "signPrice",
    width: 100,
  },
  {
    align: "center",
    title: "验收金额",
    dataIndex: "signAmount",
    width: 100,
  },
  {
    align: "center",
    title: "成本数量",
    dataIndex: "costQty",
    width: 100,
  },
  {
    align: "center",
    title: "成本单价",
    dataIndex: "costPrice",
    width: 100,
  },
  {
    align: "center",
    title: "成本金额",
    dataIndex: "costAmount",
    width: 100,
  },
  {
    align: "center",
    title: "退货数量",
    dataIndex: "returnQty",
    width: 100,
  },
  {
    align: "center",
    title: "退货金额",
    dataIndex: "returnAmount",
    width: 100,
  },
  {
    align: "center",
    title: "增值税",
    dataIndex: "vat",
    width: 120,
    scopedSlots: { customRender: "vat" },
  },
  {
    align: "center",
    title: "税额",
    dataIndex: "taxAmount",
    width: 100,
  },
  {
    align: "center",
    title: "不含税金额",
    dataIndex: "afterTaxAmount",
    width: 100,
  },
  // {
  //   align: "center",
  //   title: "关联合同",
  //   dataIndex: "contractTitle",
  //   width: 200,
  // },
  //! glht
];
export default {
  mixins: [mixin],
  data() {
    return {
      exportLoading: false,
      // selectedRowKeys: [],
      spinning: false,
      typeNameList: [],
      spinText: "",
      columns,
      tableList: [],
      searchform: {
        customerName: "",
        customerId: undefined,
        type: undefined,
        state: 104,

        soSno: "",
        // opId: "",
        // customerSno: "",
        createDateStart: "",
        createDateEnd: "",
        signDateStart: "",
        signDateEnd: "",
        storeId: undefined,
        createDate: "",
        signDate: "",
        likeItemName: undefined,
        containerCode: undefined,
      },
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "desc",
      },
      storeList: [],
      partnerList: [],
      opList: [],
    };
  },
  activated() {
    // this.getOpSubject();
    this.getList();
    this.getPartner();
    this.getOp();
    this.getTypeNameList();
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    typeNameSearch(value) {
      this.getTypeNameList(value);
    },
    async getTypeNameList(value) {
      const res = await GetPrimaryClassification({ typeName: value || "" });
      this.typeNameList = res.data.data || [];
    },
    opSearch(value) {
      this.getOp(value);
    },
    async getOp(value) {
      const res = await GetOpList({ opName: value || "" });
      this.opList = res.data.data || [];
    },
    handleDateChange(val) {
      this.searchform.createDateStart = val[0];
      this.searchform.createDateEnd = val[1];
    },
    handleDateChangeS(val) {
      this.searchform.signDateStart = val[0];
      this.searchform.signDateEnd = val[1];
    },
    getList() {
      this.spinText = "数据加载中";
      let temp = JSON.parse(JSON.stringify(this.searchform));
      delete temp.createDate;
      delete temp.signDate;
      temp.topItemType = temp.topItemType ? temp.topItemType.join(",") : "";
      const params = {
        ...this.pagination,
        ...temp,
      };
      this.spinning = true;
      GetDetailsList(params).then((res) => {
        this.spinning = false;
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
      });
    },
    //分页
    pageChange(index) {
      this.pagination.page = index;
      this.getList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.page = 1;
      this.pagination.rows = pageSize;
      this.getList();
    },
    //导出
    exportItem() {
      let temp = JSON.parse(JSON.stringify(this.searchform));
      delete temp.createDate;
      delete temp.signDate;
      temp.topItemType = temp.topItemType ? temp.topItemType.join(",") : "";
      const params = {
        ...temp,
      };
      this.exportLoading = true;
      this.spinning = true;
      this.spinText = "数据导出中请稍后";
      SignedDetailExport(params).then((res) => {
        console.log(res);
        const data = res.data;
        this.exportLoading = false;
        this.spinning = false;
        if (data) {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          const url = URL.createObjectURL(blob);
          console.log(url);
          this.downloadTem(url);
        } else {
          this.$message.error("导出失败！");
        }
      });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      link.setAttribute("download", "签收明细表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    getOpSubject() {
      getOpSubject().then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          this.opList = res.data.data;
        }
      });
    },
    handleSearch(value) {
      if (!value) {
        this.partnerList = [];
        return;
      }
      console.log(value);
      this.searchform.customerId = value;
      this.getPartner();
    },
    handleChange(option) {
      this.searchform.storeId = "";
      this.partnerList.forEach((item) => {
        if (option == item.id) {
          this.searchform.customerName = item.partnerName;
        }
      });
      console.log(this.searchform);
      this.getStore();
    },
    getStore() {
      const params = {
        partnerType: 22,
        parentId: this.searchform.customerId,
      };
      partnerType(params).then((res) => {
        if (res.data.code == 200) {
          this.storeList = res.data.data;
        }
      });
    },
    getPartner() {
      const params = {
        partnerType: 20,
        partnerName: this.searchform.customerId || "",
      };
      // if (!params.name) {
      //   return;
      // }
      partnerType(params).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.partnerList = res.data.data;
        }
      });
    },
    handleReset() {
      this.searchform = {
        customerName: "",
        customerId: undefined,
        type: undefined,
        state: 104,
        soSno: "",
        // opId: "",
        // customerSno: "",
        createDateStart: "",
        createDateEnd: "",
        signDateStart: "",
        signDateEnd: "",
        storeId: undefined,
        createDate: "",
        signDate: "",
        likeItemName: undefined,
        containerCode: undefined,
        orgId: undefined,
      };
    },
    searchList() {
      console.log(this.searchform);
      this.pagination.page = 1;
      this.getList();
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
@import "index";
.search {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }

  /deep/.ant-card-head-title {
    padding: 0;
  }
}
// /deep/.ant-table-tbody > tr > td {
//   padding: 8px;
// }
</style>