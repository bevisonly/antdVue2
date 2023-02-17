<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="search-item">
      <a-card
        title="筛选查询"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
      >
        <a-form :form="searchForm">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="订单日期">
                <a-range-picker
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  showTime
                  @change="handleDateChange"
                ></a-range-picker>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="6">
              <a-form-item label="运营主体">
                <a-select> </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :span="6">
              <a-form-item label="供应商">
                <a-select
                  show-search
                  v-model="searchForm.supplierId"
                  style="width: 100%"
                  :filter-option="false"
                  @change="handleChange"
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
              <a-form-item label="单号">
                <a-input
                  v-model="searchForm.apInvoiceCode"
                  placeholder="业务单号、结算单号、凭证号"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="运营主体">
                <a-select
                  style="width: 100%;"
                  v-model="searchForm.orgId"
                  show-search
                  placeholder="请搜索选择运营主体"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleOrganizationSearch"
                >
                  <a-select-option v-for="item in organizationOption" :key="item.orgId">{{ item.opName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="6">
              <a-form-item label="结算状态">
                <a-select @change="stateChange">
                  <a-select-option value="520">未结算</a-select-option>
                  <a-select-option value="4">已结算</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :span="6" style="margin-top: 38px">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleReset">清 空</a-button>
                  <a-button type="primary" @click="onSearch">查 询</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="24"> </a-row> -->
        </a-form>
      </a-card>
    </div>
    <div class="list-table" style="margin-top: 16px">
      <a-card
        title="数据列表"
        class="card-table"
        size="small"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
      >
        <a-row>
          <a-space>
            <a-button
              type="primary"
              @click="toExport"
              :loading="exportLoading"
              :disabled="!hasPermission('payable_certificated_export')"
              >导出</a-button
            >
          </a-space>
        </a-row>
        <a-table
          :loading="tableLoading"
          :columns="columns"
          :data-source="tableList"
          :scroll="{ y: 400, x: 1300 }"
          :rowKey="id"
          :pagination="false"
          style="margin-top: 12px"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          size="middle"
        >
          <div slot="createDate" slot-scope="text, record">
            <span v-if="record.createDate && record.updateDate">{{
              record.createDate
            }}</span>
            <span v-else>{{ record.updateDate }}</span>
          </div>
          <div slot="state" slot-scope="text, record">
            <a-tag
              v-if="record.reconciliaState == 620 && record.settleState != 3"
              >已对账</a-tag
            >
            <a-tag
              v-if="record.settleState == 3 && record.reconciliaState == 620"
              >已结算</a-tag
            >
          </div>
          <div slot="inStockFmis" slot-scope="text, record">
            <span v-if="record.inStockFmis == 0">否</span>
            <span v-if="record.inStockFmis == 1">是</span>
            <span v-if="record.inStockFmis == 2">已作废</span>
          </div>
          <div slot="opreation" slot-scope="text, record">
            <a-button
              type="link"
              @click="invalidOrder(record)"
              :disabled="!hasPermission('payable_certificated_restore')"
              >还原</a-button
            >
            <a-button
              type="link"
              @click="toDetails(record)"
              :disabled="!hasPermission('payable_certificated_details')"
              >详情</a-button
            >
          </div>
          <template slot="footer">
            <div class="sum" v-if="tableList" style="font-weight: bold">
              <span>合计 : </span>
              <span> 订单单据金额 : {{ puTotalAmountTo }}</span>
              <span> 税额 : {{ taxAmountTo }}</span>
              <span> 不含税金额 : {{ includingTaxAmountTo }}</span>
            </div>
          </template>
        </a-table></a-card
      >
    </div>
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
    <Details ref="details" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import Details from "./details.vue";
import { getOpSubject } from "../../services/signed/waitForSigned";
import {
  getList,
  getPartner,
  InvalidOrder,
  exportData,
} from "../../services/settlement/payable/PayableCertificateGenerated";
import { organization } from '../../services/commonSaasApi'
const columns = [
  {
    align: "center",
    title: "订单生成日期",
    dataIndex: "createDate",
    width: 200,
    scopedSlots: { customRender: "createDate" },
  },
  {
    align: "center",
    title: "业务单号",
    dataIndex: "poCode",
    width: 200,
  },
  {
    align: "center",
    title: "结算单号",
    dataIndex: "apInvoiceCode",
    width: 200,
  },
  {
    align: "center",
    title: "凭证号",
    dataIndex: "bdocid",
    width: 200,
  },
  {
    align: "center",
    title: "供应商",
    dataIndex: "supplierName",
    width: 250,
  },
  {title: '税率(%)', dataIndex: 'rate', width:200},
  {title: '不含税金额', dataIndex: 'priceExcludingTax', width:200},
  {title: '币种', dataIndex: 'currency', width:200},
  {title: '汇率', dataIndex: 'exchangeRate', width:200},
  {title: '外币金额', dataIndex: 'foreignCurrencyAmount', width:200},
  {title: '人民币金额', dataIndex: 'currencyAmount', width:200},
  {
    align: "center",
    title: "订单单据金额",
    dataIndex: "puTotalAmount1",
    width: 120,
  },
  {
    align: "center",
    title: "税额",
    dataIndex: "taxAmount1",
    width: 100,
  },
  {
    align: "center",
    title: "不含税金额",
    dataIndex: "includingTaxAmount1",
    width: 120,
  },
  {
    align: "center",
    title: "是否生成凭证",
    dataIndex: "inStockFmis",
    width: 100,
    scopedSlots: { customRender: "inStockFmis" },
  },
  {
    align: "center",
    title: "状态",
    dataIndex: "state",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    align: "center",
    title: "单据图片",
    dataIndex: "img",
    width: 100,
    scopedSlots: { customRender: "img" },
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "opreation",
    width: 200,
    scopedSlots: { customRender: "opreation" },
    fixed: "right",
  },
];

export default {
  name: "tobeCertificate",
  components: { Details },
  mixins: [mixin],
  data() {
    return {
      exportLoading: false,
      tableLoading: false,
      partnerList: [],
      storeList: [],
      tableList: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      searchForm: {
        // opId: "",
        apInvoiceCode: "",
        supplierName: "",
        supplierId: "",
        beginTime: "",
        endTime: "",
        reconciliaState: "",
        settleState: "",
      },
      organizationOption: [],
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        dateDesc: "desc",
      },
    };
  },
  methods: {
    handleOrganizationSearch(value) {
      organization({opName: value?.trim()}).then(res => res.data.code == '200' && (this.organizationOption = res.data.data))
    },
    //导出
    toExport() {
      const params = { ...this.searchForm };
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
          this.downloadTem(url);
        } else {
          this.$message.error("导出失败！");
        }
      });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      link.setAttribute("download", "应付-已生成凭证表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    toDetails(record) {
      this.$refs.details.showModal(record);
    },
    //还原
    invalidOrder(record) {
      const params = {
        poCode: record.poCode,
      };
      InvalidOrder(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys);
      console.log(selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    stateChange(val) {
      console.log(val);
      val == 3
        ? (this.searchForm.settleState = 3)
        : (this.searchForm.settleState = "");
      val == 620
        ? (this.searchForm.reconciliaState = 620)
        : (this.searchForm.reconciliaState = "");
    },
    handleDateChange(val) {
      this.searchForm.beginTime = val[0];
      this.searchForm.endTime = val[1];
    },
    onSearch() {
      this.getList();
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
    getOpSubject() {
      getOpSubject().then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          this.opList = res.data.data;
        }
      });
    },

    handleChange(option) {
      this.partnerList.forEach((item) => {
        if (option == item.id) {
          this.searchForm.supplierName = item.partnerName;
        }
      });
      console.log(this.searchForm);
    },

    getPartner() {
      const params = {
        partnerType: 30,
      };

      getPartner(params).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.partnerList = res.data.data;
        }
      });
    },
    handleReset() {
      this.searchForm = {
        // opId: "",
        apInvoiceCode: "",
        supplierName: "",
        supplierId: "",
        beginTime: "",
        endTime: "",
        reconciliaState: "",
        settleState: "",
      };
      this.getList();
    },
    getList() {
      const params = {
        ...this.pagination,
        ...this.searchForm,
      };
      this.tableLoading = true;
      getList(params).then((res) => {
        this.tableLoading = false;
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
        this.tableList.forEach((item) => {
          item.puTotalAmount1 = item.puTotalAmount;
          item.includingTaxAmount1 = item.includingTaxAmount;
          item.taxAmount1 = item.taxAmount;
        });
      });
    },
  },
  activated() {
    this.getList();
    this.handleOrganizationSearch();
    this.getPartner();
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    puTotalAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item.puTotalAmount??0;
      });
      return this.formatPrice(num);
    },
    taxAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item.taxAmount??0;
      });
      return this.formatPrice(num);
    },
    includingTaxAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item.includingTaxAmount??0;
      });
      return this.formatPrice(num);
    },
  },
};
</script>


  <style scoped lang="less">
@import "index.less";
.search-item {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
}
.sum {
  span {
    margin-left: 16px;
  }
}
</style>