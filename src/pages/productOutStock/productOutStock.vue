<template>
  <div class="topDiv">
    <div class="queryInfo" v-show="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-row>
        <a-col :span="24">
          <a-form-model>
            <a-form-model-item class="formItemStyle" label="送货日期">
              <a-range-picker
                show-time
                dropdownClassName="noShowTimeStyle"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="form.dateGroup"
                @change="changeDate"
              ></a-range-picker>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle inputWidth"
              label="商品名称"
            >
              <a-input
                v-model.trim="form.itemName"
                placeholder="请输入商品名称"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle inputWidth"
              label="商品编码"
            >
              <a-input
                v-model.trim="form.itemCode"
                placeholder="请输入商品编码"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle typeSelectWidth"
              label="库存分类"
            >
              <a-select
                v-model="form.invAvailableType"
                placeholder="请选择库存种类"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">{{ "在库库存" }}</a-select-option>
                <a-select-option value="2">{{ "在途库存" }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle stockSelectWidth"
              label="仓库名称"
            >
              <a-select
                mode="multiple"
                show-search
                v-model="form.whIds"
                placeholder="请选择仓库"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleWarehouseSearch"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="item in warehouseOptionFilter"
                  :key="item.baseId"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle widthStyle"
              label="客户名称"
            >
              <a-select
                style="width: 100%"
                show-search
                :value="form.partnerName"
                placeholder="请输入客户名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handlePartnerNameSearch"
                @change="handlePartnerNameOption"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="item in supplierNameOption"
                  :key="item.id"
                  >{{ item.partnerName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle widthStyle"
              label="单据编号"
            >
              <a-input
                v-model.trim="form.docNo"
                placeholder="请输入单据编号/出库编号"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle widthStyle" label="柜号">
              <a-input v-model.trim="form.containerCode" placeholder="请输入柜号"></a-input>
            </a-form-model-item>
            <a-form-model-item
              class="formItemStyle supplierWidth"
              label="运营主体"
            >
              <a-select
                mode="multiple"
                style="width: 56%"
                show-search
                v-model="form.orgId"
                placeholder="请搜索选择运营主体"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSupplierSearch"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in supplierOptionFilter" :key="item.orgId">{{ item.opName }}</a-select-option>
              </a-select>
              <a-button class="ant-button" type="primary" @click="clearForm">清空</a-button>
              <a-button type="primary" @click="onSubmit('search')">查询</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
    <div class="tableInfo" :style="{border: !fullScreen ? 0 : ''}">
      <div class="pTittle" v-show="fullScreen">结果列表</div>
      <div class="flex-sb heightDiv">
        <a-button-group>
          <a-button type="primary" :disabled="!hasPermission('item_invlot_export')" :loading="loadingDownload" @click="downloadBtn" >导出</a-button>
          <a-button type="primary" @click="computedAverage" :loading="avgLoading" :disabled="!hasPermission('month_average')">月加权平均</a-button>
        </a-button-group>
        <a-button-group style="text-align: right">
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo" />
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"/>
          <checkboxList v-model="columns" width="400" col="3" />
        </a-button-group>
      </div>
      <a-table
        bordered
        :columns="columns"
        :scroll="{x: 307.778, y: dataTable[10] ? 560 : 0}"
        :data-source="dataTable"
        :loading="loading"
        rowKey="idTemp"
        :pagination="false"
        style="margin-top: 10px"
      >
        <span tips="库存分类" slot="invAvailableType" slot-scope="text, record">{{record.invAvailableType == "1" ? "在库库存" : "在途库存"}}</span>
        <span tips="出库类型" slot="transType" slot-scope="text, record">{{record.dicText || record.transType}}</span>
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
  </div>
</template>

<script>
import {
  opSubjectList,
  itemTransactionOutStoreListPage,
  exportIsFinished,
  transType,
  getWarehouse,
  Calculate,
} from "@/services/productOutStock.js";
import { partnerType } from "@/services/userMa.js";
import moment from "moment";
const columns = [
  { title: '送货日期', dataIndex: 'createDate', width: 180, sorter: (a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime() },
  { title: '单据编号', dataIndex: 'docNo', width: 190, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('') },
  { title: '出库编号', dataIndex: 'invCode', width: 200, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('') },
  { title: '商品名称', dataIndex: 'itemName', width: 260, sorter: (a, b) => a.itemName.length - b.itemName.length },
  { title: '商品编码', dataIndex: 'itemCode', width: 160, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('') },
  { title: '柜号', dataIndex: 'containerCode', width: 160, sorter: (a, b) => a.containerCode.length - b.containerCode.length },
  { title: '规格', dataIndex: 'spec', width: 110, sorter: (a, b) => a.spec.length - b.spec.length },
  { title: '库存分类', dataIndex: 'invAvailableType', width: 166, scopedSlots: { customRender: "invAvailableType" }, sorter: (a, b) => a.invAvailableType.length - b.invAvailableType.length },
  { title: '出库类型', dataIndex: 'transType', width: 166, scopedSlots: { customRender: "transType" }, sorter: (a, b) => a.transType.length - b.transType.length },
  { title: '出库数量', dataIndex: 'qty', width: 166, sorter: (a, b) => a.qty - b.qty },
  { title: '计价单位', dataIndex: 'unit', width: 166, sorter: (a, b) => a.poPrice - b.poPrice },
  { title: '验收数量', dataIndex: 'signQty', width: 166, sorter: (a, b) => a.totalWarehousingPrice - b.totalWarehousingPrice },
  { title: '成本单价', dataIndex: 'costPrice', width: 166, sorter: (a, b) => a.unit - b.unit },
  { title: '成本数量', dataIndex: 'costQty', width: 166, sorter: (a, b) => a.taxRate - b.taxRate },
  { title: '成本金额', dataIndex: 'costAmount', width: 166, sorter: (a, b) => a.taxAmount - b.taxAmount },
  { title: '加权平均单价', dataIndex: 'averagePrice', width: 166, sorter: (a, b) => a.afterTaxAmount - b.afterTaxAmount },
  { title: '出库成本金额', dataIndex: 'chukuchengbenJEA', width: 166, sorter: (a, b) => a.warehousingCostPrice - b.warehousingCostPrice },
  { title: '客户名称', dataIndex: 'customerName', width: 266, sorter: (a, b) => a.otherWarehousingPrice.length - b.otherWarehousingPrice.length },
  { title: '客户门店', dataIndex: 'partnerName', width: 266, sorter: (a, b) => a.partnerName.length - b.partnerName.length },
  // {title: '关联合同', dataIndex: 'contractTitle', width: 240, sorter: (a, b) => a.contractTitle.length - b.contractTitle.length},
  //! glht
]
export default {
  name: "productOutStock",
  data() {
    return {
      columns,
      avgLoading: false,
      form: {
        dateGroup: [],
        beginTime: "",
        endTime: "",
        itemName: undefined,
        itemCode: undefined,
        containerCode: undefined,
        partnerName: undefined,
        invAvailableType: "",
        orgId: [],
        whIds: [],
        docNo: undefined,
      },
      copyParams: undefined,
      supplierNameMaterial: {},
      warehouseOption: [],
      supplierOption: [],
      supplierNameOption: [],
      fullScreen: true,
      disabledFlage: 0,
      dataTable: [],
      loading: false,
      loadingDownload: false,
      pageSizeOptions: ["10", "20", "50", "100", "200"],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    };
  },
  computed: {
    warehouseOptionFilter() {
      this.getEmptyArr();
      return this.warehouseOption;
    },
    supplierOptionFilter() {
      this.getEmptyArrOrgId()
      return this.supplierOption
    }
  },
  methods: {
    computedAverage() {
      this.avgLoading = true;
      const params = {
        executeFunction: 1,
        orgId: localStorage.getItem("orgId") || "",
      };
      Calculate(params).then((res) => {
        this.avgLoading = false;
        const data = res.data;
        console.log(data);
        if (data.code === "200") {
          this.submitPagination();
          this.$message.success(
            data.message == "OK" ? "执行成功" : data.message
          );
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //---------
    changeDate() {
      this.form.beginTime = this.form.dateGroup[0] || "";
      this.form.endTime = this.form.dateGroup[1] || "";
    },
    getEmptyArr() {
      this.form.whIds.includes("") && (this.form.whIds = [""]);
    },
    getEmptyArrOrgId() {
      this.form.orgId.includes("") && (this.form.orgId = [""])
    },
    getWarehouse() {
      getWarehouse({}).then(
        (res) =>
          res.data.code == "200" && (this.warehouseOption = res.data.data || [])
      );
    },
    handleWarehouseSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, "");
      getWarehouse({ name: v }).then(
        (res) =>
          res.data.code == "200" && (this.warehouseOption = res.data.data || [])
      );
    },
    findTransType(data, value) {
      if (this.typeis(data) != "array" && this.typeis(value) != "array") return;
      data.forEach((item) => {
        value.find((val) => {
          item.transType == val.dicCode ? (item.dicText = val.dicText) : "";
          return item.transType == val.dicCode;
        });
      });
    },
    transType() {
      transType({ type: 26 })
        .then((res) => (this.transTypeValue = res.data.data || []))
        .catch(() => this.$message.warn("出库类型获取失败"));
    },
    getpartnerName() {
      opSubjectList({}).then(
        (res) => res.data.code == "200" && (this.supplierOption = res.data.data)
      );
    },
    getCustomerForName() {
      partnerType({ partnerType: 20, partnerName: "" }).then(
        (res) =>
          res.data.code == "200" && (this.supplierNameOption = res.data.data)
      );
    },
    handleSupplierSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, "");
      opSubjectList({ opName: v }).then((res) =>
        res.data.code == "200" ? this.supplierOption == res.data.data : ""
      );
    },
    handlePartnerNameSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, "");
      partnerType({ partnerName: v, partnerType: 20 }).then(
        (res) =>
          res.data.code == "200" && (this.supplierNameOption = res.data.data)
      );
    },
    handlePartnerNameOption(value) {
      this.form.partnerName = value;
      this.supplierNameMaterial =
        this.supplierNameOption.find((item) => {
          return item.id == value;
        }) || {};
    },
    clearForm() {
      const value = {
        dateGroup: [],
        beginTime: "",
        endTime: "",
        itemName: undefined,
        itemCode: undefined,
        containerCode: undefined,
        partnerName: undefined,
        invAvailableType: "",
        priceUnit: undefined,
        whIds: [],
        docNo: undefined,
        orgId: []
      };
      this.supplierNameMaterial = {};
      this.form.beginTime = "";
      this.form.endTime = "";
      this.form = value;
      this.getpartnerName();
      this.getWarehouse();
      this.getCustomerForName();
    },
    fullScreenBtn() {
      this.fullScreen = !this.fullScreen;
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
    redo() {
      this.pagination.page = 1;
      this.pagination.size = 10;
      const params = {
        sort: "createDate",
        order: "desc",
        page: 1,
        rows: 10,
        orgIds: this.form.orgId,
      };
      this.loading = true;
      itemTransactionOutStoreListPage(params)
        .then((res) => {
          res.data.rows.map((item, i) => (item.idTemp = i));
          this.pagination.total = res.data.total;
          this.findTransType(res.data.rows, this.transTypeValue);
          this.dataTable = res.data.rows;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page;
        this.copyParams.rows = this.pagination.size;
      } else {
        this.copyParams = this.deepClone({
          rows: this.pagination.size,
          page: this.pagination.page,
          sort: "createDate",
          order: "desc",
          orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
          itemName: this.form.itemName,
          itemCode: this.form.itemCode,
          containerCode: this.form.containerCode?.trim(),
          priceUnit:
            this.form.priceUnit == "全部" ? undefined : this.form.priceUnit,
          customerName:
            this.supplierNameMaterial.partnerName === ""
              ? undefined
              : this.supplierNameMaterial.partnerName,
          invAvailableType: this.form.invAvailableType,
          beginTime: this.form.dateGroup[0] || '',
          endTime: this.form.dateGroup[1] || '',
          whIds: this.form.whIds.includes("") ? undefined : this.form.whIds,
          docNo: this.form.docNo,
        });
      }
      this.loading = true;
      itemTransactionOutStoreListPage(this.copyParams)
        .then((res) => {
          res.data.rows.map((item, i) => (item.idTemp = i));
          this.pagination.total = res.data.total;
          this.findTransType(res.data.rows, this.transTypeValue);
          this.dataTable = res.data.rows;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    onSubmit(flag) {
      const params = {
        rows: this.pagination.size,
        page: this.pagination.page,
        sort: "createDate",
        order: "desc",
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        containerCode: this.form.containerCode?.trim(),	
        priceUnit:
          this.form.priceUnit == "全部" ? undefined : this.form.priceUnit,
        customerName:
          this.supplierNameMaterial.partnerName === ""
            ? undefined
            : this.supplierNameMaterial.partnerName,
        invAvailableType: this.form.invAvailableType,
        beginTime: this.form.dateGroup[0] || '',
        endTime: this.form.dateGroup[1] || '',
        whIds: this.form.whIds.includes("") ? undefined : this.form.whIds,
        docNo: this.form.docNo,
      };
      if (flag === "search") {
        this.pagination.page = 1;
        params.page = 1;
        this.copyParams = this.deepClone(params);
      }
      this.loading = true;
      itemTransactionOutStoreListPage(params)
        .then((res) => {
          res.data.rows.map((item, i) => (item.idTemp = i));
          this.pagination.total = res.data.total;
          this.findTransType(res.data.rows, this.transTypeValue);
          this.dataTable = res.data.rows;
          this.loading = false;
        })
        .then(() => (this.loading = false));
    },
    getErrExcel(res, name) {
      const link = document.createElement("a");
      const blob = new Blob([res], {
        type: "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      link.href = URL.createObjectURL(blob);
      link.download = name;
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    downloadBtn() {
      this.loadingDownload = true;
      const params = {
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        containerCode: this.form.containerCode?.trim(),
        priceUnit:
          this.form.priceUnit == "全部" ? undefined : this.form.priceUnit,
        customerName:
          this.supplierNameMaterial.partnerName === ""
            ? undefined
            : this.supplierNameMaterial.partnerName,
        invAvailableType: this.form.invAvailableType,
        beginTime: this.form.dateGroup[0] || '',
        endTime: this.form.dateGroup[1] || '',
        whIds: this.form.whIds.includes("") ? undefined : this.form.whIds,
        docNo: this.form.docNo,
      };
      exportIsFinished(params)
        .then((res) => {
          if (
            res.data.type == "application/vnd.ms-excel" ||
            res.data.type ==
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            let name = res.headers["content-disposition"]
              ? decodeURIComponent(res.headers["content-disposition"]).match(
                  /(?<=filename=).*(?=\.xl)/gm
                )[0]
              : "商品出库列表导出";
            this.getErrExcel(res.data, name);
            this.loadingDownload = false;
          } else {
            this.loadingDownload = false;
            this.$message.warn("导出失败");
          }
        })
        .catch(() => {
          this.loadingDownload = false;
          this.$message.warn("导出失败");
        });
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
    this.transType();
    this.getpartnerName();
    this.getCustomerForName();
    this.submitPagination();
    this.getWarehouse();
  },
  created() {
    this.form.dateGroup = [
      moment('00:00:00', 'HH:mm:ss').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      moment('23:59:59', 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    ]
    this.form.beginTime = this.form.dateGroup[0]
    this.form.endTime = this.form.dateGroup[1]
    this.form.orgId = [+localStorage.getItem('orgId')]
  }
};
</script>

<style lang="less">
@import "./index";
</style>