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
                      :filter-option="filterOption"
                      v-model="searchform.customerId"
                      style="width: 100%"
                      @change="handleChange"
                      placeholder="客户名称"
                      allowClear
                    >
                      <a-select-option
                        v-for="d in partnerList"
                        :key="d.id"
                        :value="d.id"
                      >
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
                      :disabled="true"
                      v-model="searchform.stateText"
                      placeholder=""
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.sno"
                      placeholder="销售单号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-input v-model="searchform.poCode" placeholder="采购订单号" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      style="width: 100%;"
                      show-search
                      :value="searchform.supplierId"
                      placeholder="请搜索选择供应商名称"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="handleSupplierSearch"
                      @change="handleSupplierOption"
                      @focus="handleSupplierSearch('')"
                    >
                      <a-select-option v-for="item in option.supplierOption" :key="item.id">{{ item.partnerName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.containerCode"
                      placeholder="柜号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col> -->
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
                      :placeholder="['送货日期开始时间', '送货日期结束时间']"
                      v-model="searchform.deliveryDate"
                    ></a-range-picker>
                  </a-form-item>
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
          title="待签收列表"
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div style="margin-bottom: 16px; text-align: left">
            <a-space>
              <a-button
                :loading="exportLoading"
                type="primary"
                icon="download"
                @click="exportItem"
                :disabled="!hasPermission('waitForSigned_export')"
              >
                导出
              </a-button>
              <a-button
                type="primary"
                :disabled="!hasPermission('waitForSigned_print')"
                @click="toPrint(2, 3)"
                >打印出库单</a-button
              >
            </a-space>
          </div>
          <a-table
            :columns="columns"
            :data-source="tableList"
            :scroll="{ x: 1300 }"
            rowKey="id"
            :pagination="false"
            :loading="tableLoading"
            :row-selection="{
              columnWidth: 50,
              onChange: rowSelectionChange,
              selectedRowKeys: selectedRowKeys,
            }"
          >
            <span slot="payType" slot-scope="text, record">
              {{ record.payType == 1 ? "现结" : "周期结算" }}
            </span>
            <span slot="type" slot-scope="text, record">
              <div v-if="record.type == 1">销售单</div>
              <div v-if="record.type == 2">库存单</div>
              <div v-if="record.type == 3">服务单</div>
              <div v-if="record.type == 4">换货单</div>
              <div v-if="record.type == 5">直送单</div>
              <div v-if="record.type == 6">采销一体单</div>
            </span>
            <span slot="state" slot-scope="text, record">
              <div v-if="record.state == 103">待签收</div>
              <div v-if="record.state == 220103">已收货待签收</div>
              <div v-if="record.state == 210103">待收货待签收</div>
            </span>
            <span slot="roughWeight" slot-scope="text, record">
              {{ record.roughWeight / 1000 }}
            </span>
            <span slot="totalAmount" slot-scope="text, record">
              {{ record.totalAmount }}
            </span>
            <template slot="opreation" slot-scope="text, record">
              <a-button
                type="link"
                @click="showSigned(record)"
                :disabled="!hasPermission('waitForSigned_signed')"
                >签收</a-button
              >
              <a-button
                type="link"
                @click="showDetail(record)"
                :disabled="!hasPermission('waitForSigned_view')"
                >查看</a-button
              >
            </template>
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
        </a-card>
      </div>
      <!-- <Signed ref="signed" /> -->
      <OrderDetails ref="orderDetails" />
      <print-order ref="printOrder"></print-order>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import Signed from "./signed.vue";
import printOrder from "./printOrder.vue";
import OrderDetails from "./orderDetails.vue";
import { mixin } from "../../utils/mixins";
import {
  getOpSubject,
  getListData,
  exportData
} from "../../services/signed/waitForSigned";
import { partnerType } from "@/services/userMa.js"
const columns = [
  {
    align: "center",
    title: "销售单号",
    dataIndex: "sno",
    // key: "poCode",
    // fixed: "left",
    width: 200,
  },
  {
    align: "center",
    title: "客户",
    dataIndex: "customerName",
    // key: "poSubtime",
    width: 250,
    // scopedSlots: { customRender: "itemCode" },
  },
  {
    align: "center",
    title: "门店名称",
    dataIndex: "storeName",
    // key: "supplierName",
    width: 200,
  },
  {
    align: "center",
    title: "送货日期",
    dataIndex: "deliveryDate",
    // key: "supplierPhone",
    width: 200,
  },
  {
    align: "center",
    title: "数量",
    dataIndex: "totalQty",
    // key: "purchaseWeight",
    width: 100,
    scopedSlots: { customRender: "" },
  },
  // {
  //   align: "center",
  //   title: "重量",
  //   dataIndex: "roughWeight",
  //   // key: "purchaseQty",
  //   width: 100,
  //   scopedSlots: { customRender: "roughWeight" },
  // },
  {
    align: "center",
    title: "订单金额",
    dataIndex: "totalAmount",
    // key: "poState",
    width: 100,
    scopedSlots: { customRender: "totalAmount" },
  },
  {
    align: "center",
    title: "付款方式",
    width: 100,
    dataIndex: "payType",
    scopedSlots: { customRender: "payType" },
  },
  {
    align: "center",
    title: "运营主体",
    width: 250,
    dataIndex: "opName",
  },
  {
    align: "center",
    title: "订单类型",
    width: 100,
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
  },
  {
    align: "center",
    title: "采购订单号",
    width: 180,
    dataIndex: "poCode",
  },
  {
    align: "center",
    title: "供应商名称",
    width: 200,
    dataIndex: "supplierName",
  },
  {
    align: "center",
    title: "订单状态",
    width: 100,
    dataIndex: "state",
    scopedSlots: { customRender: "state" },
  },
  {
    align: "center",
    title: "创建人",
    width: 150,
    dataIndex: "createUser",
  },
  {
    align: "center",
    title: "创建时间",
    width: 200,
    dataIndex: "createDate",
  },
  {
    align: "center",
    title: "关联合同",
    width: 200,
    dataIndex: "contractTitle",
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "opreation",
    // key: "opreation",
    width: 150,
    fixed: "right",
    scopedSlots: { customRender: "opreation" },
  },
];
export default {
  components: { OrderDetails, printOrder },
  mixins: [mixin],
  data() {
    return {
      option: {
        supplierOption: [],
        supplierMaterial: {},
      },
      exportLoading: false,
      // selectedRowKeys: [],
      tableLoading: false,
      columns,
      tableList: [],
      searchform: {
        customerName: "",
        customerId: undefined,
        type: undefined,
        state: 103,
        stateText: "待签收",
        sno: "",
        // opId: "",
        // customerSno: "",
        deliveryDateStart: "",
        deliveryDateEnd: "",
        storeId: undefined,
        deliveryDate: [],
        // containerCode: "",
        supplierId: undefined,
        supplierName: undefined,
        poCode: undefined,
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
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  activated() {
    // this.getOpSubject();
    this.getList();
    this.getPartner();
  },
  methods: {
    handleSupplierSearch(value) {
      partnerType({partnerName: value?.trim(), partnerType: 30}).then(res => res.data.code == '200' && (this.option.supplierOption = res.data.data))
    },
    handleSupplierOption(value) {
      this.searchform.supplierId = value
      this.option.supplierMaterial = this.option.supplierOption.find(item => item.id == value) || {}
      this.searchform.supplierName = this.option.supplierMaterial.partnerName
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    rowSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toPrint(state, flag) {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      if (this.selectedRows.length > 1) {
        this.$message.error("最多只能选择一条数据！");
        return false;
      }
      this.$refs.printOrder.openModal(this.selectedRows, state, flag);
    },
    handleDateChange(val) {
      this.searchform.deliveryDateStart = val[0];
      this.searchform.deliveryDateEnd = val[1];
    },
    showDetail(record) {
      this.$refs.orderDetails.showModal(record);
    },
    showSigned(record) {
      // this.$refs.signed.showModal(record);
      this.$router.push({
        path: "/transport/signed/waitForSignedNew",
        query: {
          record: record,
        },
      });
    },
    // onSelectChange() {},
    getList() {
      let temp = JSON.parse(JSON.stringify(this.searchform));
      delete temp.deliveryDate;
      const params = {
        ...this.pagination,
        ...temp,
      };
      this.tableLoading = true;
      getListData(params).then((res) => {
        this.tableLoading = false;
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
      }).catch(()=>{
        this.tableLoading = false;
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
      const params = {};
      const temp = this.searchform
        ? JSON.parse(JSON.stringify(this.searchform))
        : {};
      params.states = [103, 210103, 220103];
      if (temp.customerName) {
        params.customerName = temp.customerName;
      }
      if (temp.customerId) {
        params.customerId = temp.customerId;
      }
      if (temp.type) {
        params.type = temp.type;
      }
      if (temp.stateText) {
        params.stateText = temp.stateText;
      }
      if (temp.sno) {
        params.sno = temp.sno;
      }
      if (temp.deliveryDateStart) {
        params.deliveryDateStart = temp.deliveryDateStart;
      }
      if (temp.deliveryDateEnd) {
        params.deliveryDateEnd = temp.deliveryDateEnd;
      }
      if (temp.storeId) {
        params.storeId = temp.storeId;
      }
      params.supplierId = temp.supplierId
      params.supplierName = temp.supplierName
      params.poCode = temp.poCode
      this.exportLoading = true;
      exportData(params).then((res) => {
        console.log(res);
        const data = res.data;
        this.exportLoading = false;
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
      }).catch(()=>{
        this.exportLoading = false;
      });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      link.setAttribute("download", "待签收订单列表");
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
      console.log(option);
      console.log(this.searchform.customerId);
      console.log(this.partnerList);
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
        supplierId: undefined,
        supplierName: undefined,
        poCode: undefined,
        customerName: "",
        customerId: undefined,
        type: undefined,
        state: 103,
        stateText: "待签收",
        sno: "",
        // opId: "",
        // customerSno: "",
        deliveryDateStart: "",
        deliveryDateEnd: "",
        storeId: undefined,
        deliveryDate: [],
        // containerCode: "",
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
/deep/.ant-table-tbody > tr > td {
  padding: 8px;
}
</style>