<template>
  <div class="topDiv">
    <div class="queryInfo" v-show="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-row>
        <a-col :span="24">
          <a-form-model>
            <a-form-model-item class="formItemStyle" label="入库日期">
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
              class="formItemStyle inputWidth"
              label="柜号"
            >
              <a-input
                v-model.trim="form.containerCode"
                placeholder="请输入柜号"
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
              label="供应商名称"
            >
              <a-select
                style="width: 100%"
                show-search
                :value="form.partnerName"
                placeholder="请输入供应商名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handlePartnerNameSearch"
                @change="handlePartnerNameOption"
              >
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
                placeholder="请输入单据编号/入库编号"
              ></a-input>
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
          <a-button
            type="primary"
            style="margin-left: 15px"
            title="导出全部数据"
            :disabled="!hasPermission('product_in_itock_export')"
            :loading="loadingDownload"
            @click="downloadBtn"
          >
            导出
          </a-button>
          <a-button
            type="primary"
            :disabled="!hasPermission('product_in_itock_print_supplier')"
            @click="printBtn('supplyOrder')"
          >
            打印供货单
          </a-button>
          <a-button
            type="primary"
            :disabled="!hasPermission('product_in_itock_print_stock')"
            @click="printBtn"
          >
            打印入库单
          </a-button>
        </a-button-group>
        <a-button-group class="a-button-group">
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"/>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"/>
          <checkboxList v-model="columns" width="400" col="3" />
        </a-button-group>
      </div>
      <a-table
        bordered
        :columns="columns"
        :scroll="{x: 300, y: dataTable[10] ? 560 : 0}"
        :data-source="dataTable"
        :loading="loading"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        rowKey="id"
        :pagination="false"
      >
        <span tips="库存分类" slot="invAvailableType" slot-scope="text, record">{{ record.invAvailableType == "1" ? "在库库存" : "在途库存"}}</span>
        <span tips="入库类型" slot="transType" slot-scope="text, record">{{ record.dicText || record.transType }}</span>
        <span tips="增值税" slot="taxRate" slot-scope="text, record">
          {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
          {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
          {{record.taxRate+'%'}}
        </span>
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
    <modal-print ref="modalPrintRef" />
  </div>
</template>

<script>
import {
  opSubjectList,
  itemTransactionInStoreLlistPage,
  exportIsFinished,
  transType,
  getWarehouse,
} from "@/services/enterSaleStore/store/productInStock.js";
import { partnerType } from "@/services/userMa.js";
const columns = [
  {title: '入库日期', dataIndex: 'deliveryTime', width: 180, sorter: (a, b) => new Date(a.deliveryTime).getTime() - new Date(b.deliveryTime).getTime()},
  {title: '单据编号', dataIndex: 'docNo', width: 200, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('')},
  {title: '入库编号', dataIndex: 'invCode', width: 200, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('')},
  {title: '商品名称', dataIndex: 'itemName', width: 260, sorter: (a, b) => a.itemName.length - b.itemName.length},
  {title: '商品编码', dataIndex: 'itemCode', width: 160, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('')},
  {title: '柜号', dataIndex: 'containerCode', width: 180, sorter: (a, b) => a.containerCode.length - b.containerCode.length},
  {title: '规格', dataIndex: 'spec', width: 110, sorter: (a, b) => a.spec.length - b.spec.length},
  {title: '库存分类', dataIndex: 'invAvailableType', width: 166, scopedSlots: {customRender: "invAvailableType"}, sorter: (a, b) => a.invAvailableType.length - b.invAvailableType.length},
  {title: '入库类型', dataIndex: 'transType', width: 166, scopedSlots: {customRender: "transType"}, sorter: (a, b) => a.transType.length - b.transType.length},
  {title: '入库数量', dataIndex: 'qty', width: 166, sorter: (a, b) => a.qty - b.qty},
  { title: '供应商单价', dataIndex: 'poPrice', width: 166, sorter: (a, b) => a.poPrice - b.poPrice },
  { title: '商品金额', dataIndex: 'totalWarehousingPrice', width: 166, sorter: (a, b) => a.totalWarehousingPrice - b.totalWarehousingPrice },
  { title: '外币金额', dataIndex: 'foreignCurrencyAmount', width: 166, sorter: (a, b) => a.foreignCurrencyAmount - b.foreignCurrencyAmount },
  { title: '单位', dataIndex: 'unit', width: 126, sorter: (a, b) => a.unit - b.unit },
  { title: '增值税', dataIndex: 'taxRate', width: 200, scopedSlots: { customRender: "taxRate" }, sorter: (a, b) => a.taxRate - b.taxRate },
  { title: '税额', dataIndex: 'taxAmount', width: 166, sorter: (a, b) => a.taxAmount - b.taxAmount },
  {title: '不含税金额', dataIndex: 'afterTaxAmount', width: 166, sorter: (a, b) => a.afterTaxAmount - b.afterTaxAmount},
  {title: '入库成本单价', dataIndex: 'warehousingCostPrice', width: 166, sorter: (a, b) => a.warehousingCostPrice - b.warehousingCostPrice},
  {title: '其他金额', dataIndex: 'otherWarehousingPrice', width: 166, sorter: (a, b) => a.otherWarehousingPrice - b.otherWarehousingPrice},
  {title: '供应商', dataIndex: 'partnerName', width: 266, sorter: (a, b) => a.partnerName.length - b.partnerName.length},
  // {title: '关联合同', dataIndex: 'contractTitle', width: 240, sorter: (a, b) => a.contractTitle.length - b.contractTitle.length},
  //! glht
  {title: '备注', dataIndex: 'remark', width: 166, sorter: (a, b) => a.remark.length - b.remark.length},
]
import moment from "moment";
import modalPrint from "./modalPrint";
export default {
  name: "productInStock",
  components: { modalPrint },
  data() {
    return {
      columns,
      form: {
        dateGroup: [],
        beginTime: "",
        endTime: "",
        itemName: undefined,
        itemCode: undefined,
        partnerName: undefined,
        invAvailableType: "",
        whIds: [],
        orgId: [],
        containerCode: undefined,
      },
      supplierNameMaterial: {},
      supplierOption: [],
      supplierNameOption: [],
      warehouseOption: [],
      copyParams: undefined,
      fullScreen: true,
      dataTable: [],
      selectedRowKeys: [],
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
    intNumber(num) {
      if (typeof num == "number" && String(num).indexOf(".") !== -1) {
        return String(num).substr(String(num).indexOf(".") + 1).length;
      }
      return 0;
    },
    calculateNumber(v1, v2) {
      let num = +(v1 * v2).toFixed(this.intNumber(v1) + this.intNumber(v2));
      return num;
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
      transType({ type: 25 })
        .then((res) => (this.transTypeValue = res.data.data || []))
        .catch(() => this.$message.warn("入库类型获取失败"));
    },
    getpartnerName() {
      opSubjectList({}).then(
        (res) => res.data.code == "200" && (this.supplierOption = res.data.data)
      );
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
    getSupplierForName() {
      partnerType({ partnerType: 30, partnerName: "" }).then(
        (res) =>
          res.data.code == "200" && (this.supplierNameOption = res.data.data)
      );
    },
    handleSupplierSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, "");
      opSubjectList({ opName: v }).then((res) =>
        res.data.code == "200" ? (this.supplierOption = res.data.data) : ""
      );
    },
    handlePartnerNameSearch(value) {
      let v = value?.replace(/^\s*|\s*$/g, "");
      partnerType({ partnerName: v, partnerType: 30 }).then(
        (res) =>
          res.data.code == "200" && (this.supplierNameOption = res.data.data)
      );
    },
    handlePartnerNameOption(value) {
      this.form.partnerName = value;
      this.supplierNameMaterial =
        this.supplierNameOption.find((item) => item.id == value) || {};
    },
    printBtn(flag) {
      let ids = this.selectedRowKeys;
      if (this.selectedRowKeys.length == 0) {
        this.$message.warn("当前未勾选任何数据");
        return;
      }
      if (flag != "supplyOrder") {
        this.$refs.modalPrintRef.openModal(flag, ids);
        this.selectedRowKeys = [];
        return;
      }
      this.$refs.modalPrintRef.openModal(flag, ids);
      this.selectedRowKeys = [];
    },
    clearForm() {
      const value = {
        dateGroup: [],
        beginTime: "",
        endTime: "",
        itemName: undefined,
        itemCode: undefined,
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
      this.getWarehouse();
      this.getpartnerName();
      this.getSupplierForName();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
        sort: "deliveryTime",
        order: "desc",
        page: 1,
        rows: 10,
        orgIds: this.form.orgId,
      };
      this.loading = true;
      itemTransactionInStoreLlistPage(params)
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
          sort: "deliveryTime",
          order: "desc",
          orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
          itemName: this.form.itemName,
          itemCode: this.form.itemCode,
          priceUnit:
            this.form.priceUnit == "全部" ? undefined : this.form.priceUnit,
          partnerName: this.supplierNameMaterial.partnerName,
          invAvailableType: this.form.invAvailableType,
          beginTime: this.form.dateGroup[0] || '',
          endTime: this.form.dateGroup[1] || '',
          whIds: this.form.whIds.includes("") ? undefined : this.form.whIds,
          docNo: this.form.docNo,
        });
      }
      this.loading = true;
      itemTransactionInStoreLlistPage(this.copyParams)
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
        sort: "deliveryTime",
        order: "desc",
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        containerCode: this.form.containerCode,
        priceUnit:
          this.form.priceUnit == "全部" ? undefined : this.form.priceUnit,
        partnerName: this.supplierNameMaterial.partnerName,
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
      itemTransactionInStoreLlistPage(params)
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
      const parmas = {
        partnerName: this.supplierNameMaterial.partnerName,
        itemName: this.form.itemName,
        itemCode: this.form.itemCode,
        containerCode: this.form.containerCode,
        orgIds: this.form.orgId.includes("") ? undefined : this.form.orgId,
        invAvailableType: this.form.invAvailableType,
        beginTime: this.form.dateGroup[0] || '',
        endTime: this.form.dateGroup[1] || '',
        docNo: this.form.docNo,
        whIds: this.form.whIds.includes("") ? undefined :this.form.whIds,
      };
      exportIsFinished(parmas)
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
              : "商品入库列表导出";
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
    this.getWarehouse();
    this.transType();
    this.getpartnerName();
    this.getSupplierForName();
    this.submitPagination();
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