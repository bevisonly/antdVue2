<template>
  <div class="topDiv">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-date-picker
                placeholder="送货开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="form.deliveryDateStart"
                show-time
              >
                <template slot="dateRender" slot-scope="current, today">
                  <div
                    class="ant-calendar-date"
                    :style="getCurrentStyle(current, today)"
                  >
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
              至
              <a-date-picker
                placeholder="送货结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="form.deliveryDateEnd"
                show-time
              >
                <template slot="dateRender" slot-scope="current, today">
                  <div
                    class="ant-calendar-date"
                    :style="getCurrentStyle(current, today)"
                  >
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%"
                show-search
                :value="form.supplierName"
                placeholder="请输入选择 供应商名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
                @change="handleSupplierChange"
              >
                <a-select-option
                  v-for="item in optionArr.optionSupplier"
                  :key="item.id"
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%"
                show-search
                :value="form.customerName"
                placeholder="请输入选择 客户名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleCustomerSearch"
                @change="handleCustomerChange"
              >
                <a-select-option
                  v-for="item in optionArr.optionCustomer"
                  :key="item.id"
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select
                class="autoCompleteStyle"
                style="width: 100%"
                show-search
                :value="form.storeName"
                placeholder="请输入选择 门店名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleStoreSearch"
                @change="handleStoreChange"
              >
                <a-select-option
                  v-for="item in optionArr.optionStore"
                  :key="item.id"
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input
                class="autoCompleteStyle"
                v-model.trim="form.sno"
                placeholder="请输入销售订单号"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button
                class="ant-button"
                type="primary"
                icon="redo"
                @click="resetBtn"
                >清空</a-button
              >
              <a-button
                class="ant-button"
                type="primary"
                icon="search"
                @click="submitBtn('search')"
                >查询</a-button
              >
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <div class="btnGrp">结果列表</div>
      <a-table
        bordered
        ref="tableRef"
        size="small"
        :columns="columns"
        :data-source="dataTable"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :loading="loading"
        rowKey="imItemId"
        :scroll="{ x: 307.778 }"
        :pagination="false"
      >
        <!-- rowKey="imItemId" -->
        <template slot="returnStatus" slot-scope="text, record">
          <a-tag color="green" v-if="record.returnStatus == 402"
            >已退供应商</a-tag
          >
          <a-tag v-else>待退供应商</a-tag>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button
            class="greenfont bluefonthover"
            type="link"
            :disabled="!hasPermission('returnSupplierCommdity_details')"
            @click="eidtBtn('details', record)"
            >详情</a-button
          >
          <a-button
            class="greenfont bluefonthover"
            type="link"
            v-if="record.returnStatus != 402"
            :disabled="!hasPermission('returnSupplierCommdity_returnConfrim')"
            @click="eidtBtn('edit', record)"
          >
            退货
          </a-button>
          <a-button
            class="greenfont bluefonthover"
            type="link"
            :disabled="!hasPermission('returnSupplierCommdity_print')"
            @click="printReturnSuplierOrder(record)"
            >打印</a-button
          >
          <a-popconfirm
            v-if="record.returnStatus != 402&&record.sno"
            placement="bottom"
            title="是否撤销退供应商？"
            ok-text="确定"
            cancel-text="取消"
            :disabled="!hasPermission('returnSupplierCommdity_delete')"
            @confirm="deleteSupplier(record.soId, record.imItemId)"
          >
            <a-button
              v-if="record.returnStatus != 402&&record.sno"
              class="greenfont redfonthover"
              type="link"
              :disabled="!hasPermission('returnSupplierCommdity_delete')"
              >撤销</a-button
            >
          </a-popconfirm>
        </template>
        <template tips="合计" slot="footer" slot-scope="currentPageData">
          本页合计：
          <span class="greyfont">退货总数量</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((t, c) => {
              return (
                ((+t + +c.returnQty).toFixed(8) * 100000000) / 100000000 ||
                undefined
              );
            }, 0)
          }}</span
          >&gt;
          <a-divider type="vertical" />
          <span class="greyfont">退货总金额</span>
          &lt;<span class="redfont">{{
            currentPageData.reduce((t, c) => {
              return (
                ((+t + +c.returnAmount).toFixed(8) * 100000000) / 100000000 ||
                undefined
              );
            }, 0)
          }}</span
          >&gt;
        </template>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination
          :pageSizeOptions="pageSizeOptions"
          v-model="pagination.page"
          :pageSize="pagination.size"
          :total="pagination.total"
          :show-total="() => `共 ${pagination.total} 条`"
          show-size-changer
          :show-quick-jumper="pagination.total >= 1000 ? true : false"
          @showSizeChange="paginationSize"
          @change="paginationPage"
        />
      </div>
    </div>
    <modalReturnOrder ref="modalReturnOrderRef" />
    <modalDetails ref="modalDetailsRef" />
  </div>
</template>

<script>
import {
  searchInfo,
  cancel,
} from "@/services/transport/signed/returnSupplierCommdity";
import moment from "moment";
import modalReturnOrder from "./modalPrint";
import modalDetails from "./modalDetails";
import { partnerType } from "@/services/userMa.js";
const columns = [
  { title: "出库单号", dataIndex: "imItemCode", width: 200 },
  { title: "销售单号", dataIndex: "sno", width: 200 },
  { title: "采购单号", dataIndex: "poCode", width: 200 },
  {
    title: "状态",
    dataIndex: "returnStatus",
    width: 120,
    scopedSlots: { customRender: "returnStatus" },
  },
  { title: "退货数量", dataIndex: "returnQty", width: 140 },
  { title: "退货金额", dataIndex: "returnAmount", width: 170 },
  { title: "创建人", dataIndex: "createUser", width: 120 },
  { title: "供应商名称", dataIndex: "supplierName", width: 260 },
  { title: "客户名称", dataIndex: "customerName", width: 260 },
  { title: "门店名称", dataIndex: "storeName", width: 260 },
  { title: "创建时间", dataIndex: "createDate", width: 165 },
  { title: "送货日期", dataIndex: "deliveryDate", width: 165 },
  { title: "退货原因", dataIndex: "returnReason", width: 300 },
  {
    title: "操作",
    dataIndex: "operation",
    fixed: "right",
    align: "center",
    scopedSlots: { customRender: "operation" },
    width: 300,
  },
];
export default {
  name: "returnSupplierSommdity",
  components: { modalReturnOrder, modalDetails },
  data() {
    return {
      columns,
      form: {
        deliveryDateStart: "",
        deliveryDateEnd: "",
        supplierName: undefined,
        customerName: undefined,
        storeName: undefined,
        sno: undefined,
      },
      optionArr: {
        optionSupplier: [{ id: 1, itemName: "全部供应商" }],
        optionCustomer: [{ id: 1, itemName: "全部客户" }],
        optionStore: [{ id: 1, itemName: "全部客户门店" }],
        optionSaleOrder: [{ id: 1, itemName: "全部销售订单" }],
      },
      supplierMaterial: undefined,
      customerMaterial: undefined,
      storeMaterial: undefined,
      selectedRowKeys: [],
      dataTable: [],
      loading: false,
      pageSizeOptions: ["10", "20", "50", "100", "200"],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    };
  },
  methods: {
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YYYY-MM-DD") == moment(today).format("YYYY-MM-DD")) {
        style.border = "1px solid green";
        style.borderRadius = "50%";
        style.backgroundColor = "white";
        style.color = "green";
      }
      return style;
    },
    partnerName(type, partnerStr, arrOptionFlag) {
      partnerType({ partnerType: type, partnerName: partnerStr }).then(
        (res) => {
          res.data.data?.unshift({ id: -99, partnerName: "全部" });
          arrOptionFlag == "30"
            ? (this.optionArr.optionSupplier = res.data.data)
            : arrOptionFlag == "20"
            ? (this.optionArr.optionCustomer = res.data.data)
            : arrOptionFlag == "22"
            ? (this.optionArr.optionStore = res.data.data)
            : "";
        }
      );
    },
    handleSupplierSearch(value) {
      this.partnerName(30, value, 30);
    },
    handleCustomerSearch(value) {
      this.partnerName(20, value, 20);
    },
    handleStoreSearch(value) {
      this.partnerName(22, value, 22);
    },
    handleSupplierChange(value) {
      this.form.supplierName = value;
      this.supplierMaterial = this.optionArr.optionSupplier.find(
        (item) => item.id == value
      );
    },
    handleCustomerChange(value) {
      this.form.customerName = value;
      this.customerMaterial = this.optionArr.optionCustomer.find(
        (item) => item.id == value
      );
    },
    handleStoreChange(value) {
      this.form.storeName = value;
      this.storeMaterial = this.optionArr.optionStore.find(
        (item) => item.id == value
      );
    },
    resetBtn() {
      let nullParams = {
        deliveryDateStart: "",
        deliveryDateEnd: "",
        supplierName: undefined,
        customerName: undefined,
        storeName: undefined,
        saleOrderId: undefined,
        customerOrg: undefined,
      };
      this.form = nullParams;
      this.supplierMaterial = undefined;
      this.customerMaterial = undefined;
      this.storeMaterial = undefined;
    },
    deepClone(obj) {
      let objStorageBox = null;
      if (typeof obj == "object" && obj !== null) {
        objStorageBox = obj instanceof Array ? [] : {};
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i]);
        }
      } else {
        objStorageBox = obj;
      }
      return objStorageBox;
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page;
        // this.copyParams.currentPage = this.pagination.page;
        this.copyParams.rows = this.pagination.size;
        // this.copyParams.pageSize = this.pagination.size;
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          // currentPage: this.pagination.page,
          // pageSize: this.pagination.size,
          rows: this.pagination.size,
          queryParam: {
            deliveryDateStart:
              moment(this.form.deliveryDateStart).format("YYYY-MM-DD") ==
              "Invalid date"
                ? ""
                : moment(this.form.deliveryDateStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
            deliveryDateEnd:
              moment(this.form.deliveryDateEnd).format("YYYY-MM-DD") ==
              "Invalid date"
                ? ""
                : moment(this.form.deliveryDateEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
            supplierId:
              this.supplierMaterial?.id == -99 ? "" : this.supplierMaterial?.id,
            customerId:
              this.customerMaterial?.id == -99 ? "" : this.customerMaterial?.id,
            storeId:
              this.storeMaterial?.id == -99 ? "" : this.storeMaterial?.id,
            sno: this.form.sno,
          },
        });
      }
      this.loading = true;
      searchInfo(this.copyParams)
        .then((res) => {
          this.loading = false;
          if (this.typeis(res.data?.rows) == "array") {
            this.pagination.total = res.data?.total || 0;
            this.dataTable = res.data?.rows;
          } else {
            this.$message.warn("查询失败...");
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.warn("获取数据失败");
        });
    },
    submitBtn(flag) {
      const params = {
        deliveryDateStart:
          moment(this.form.deliveryDateStart).format("YYYY-MM-DD") ==
          "Invalid date"
            ? ""
            : moment(this.form.deliveryDateStart).format("YYYY-MM-DD HH:mm:ss"),
        deliveryDateEnd:
          moment(this.form.deliveryDateEnd).format("YYYY-MM-DD") ==
          "Invalid date"
            ? ""
            : moment(this.form.deliveryDateEnd).format("YYYY-MM-DD HH:mm:ss"),
        supplierId:
          this.supplierMaterial?.id == -99
            ? undefined
            : this.supplierMaterial?.id,
        customerId:
          this.customerMaterial?.id == -99
            ? undefined
            : this.customerMaterial?.id,
        storeId:
          this.storeMaterial?.id == -99 ? undefined : this.storeMaterial?.id,
        sno: this.form.sno,
      };
      if (flag == "search") {
        this.pagination.page = 1;
        this.copyParams = this.deepClone(params);
      }
      this.loading = true;
      searchInfo(params)
        .then((res) => {
          this.loading = false;
          if (this.typeis(res.data?.rows) == "array") {
            this.pagination.total = res.data?.total || 0;
            this.dataTable = res.data?.rows;
          } else {
            this.$message.warn("查询失败...");
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.warn("获取退货供应商商品列表数据失败");
        });
    },
    printReturnSuplierOrder(record) {
      this.$refs.modalReturnOrderRef.openModal(record);
    },
    eidtBtn(flag, allMsg) {
      this.$refs.modalDetailsRef.openModal(flag, allMsg);
    },
    deleteSupplier(soId, imItemId) {
      cancel({ soId: soId, imItemId: imItemId })
        .then((res) => {
          if (res.data.code == "200") {
            this.submitPagination();
            this.$message.success("撤销成功");
          } else {
            this.$message.success("撤销失败");
          }
        })
        .catch(() => this.$message.success("撤销失败"));
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    paginationPage(currentPage, pageSize) {
      this.pagination.page = currentPage;
      this.pagination.size = pageSize;
      this.submitPagination();
    },
    paginationSize(currentPage, pageSize) {
      this.pagination.page = currentPage;
      this.pagination.size = pageSize;
      this.submitPagination();
    },
  },
  activated() {
    [20, 22, 30].forEach((item) => this.partnerName(item, "", item));
    this.submitPagination();
  },
};
</script>

<style lang="less">
@import "./index";
</style>