<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="search-item">
      <a-card
        title="筛选查询"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
      >
        <div class="search">
          <a-form :form="searchForm">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.customerName"
                    placeholder="客户名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.storeName"
                    placeholder="客户门店"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.sno"
                    placeholder="销售订单号"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="4">
                  <a-form-item label="运营主体">
                    <a-select v-model="searchForm.opId" style="width: 100%">
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
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item>
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    showTime
                    @change="handleDateChange"
                    :placeholder="['订单日期开始时间', '结束时间']"
                    v-model="searchForm.orderDate"
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
                    @change="handleDateChanges"
                    :placeholder="['签收日期开始时间', '结束时间']"
                    v-model="searchForm.signDate"
                  ></a-range-picker>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
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
              <a-col :span="6">
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
    <div class="table-item">
      <a-card
        title="待对账列表"
        class="card-table"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
        style="margin-top: 20px"
      >
        <div style="margin-bottom: 16px; text-align: left">
          <a-button-group>
            <a-button
              :loading="exportLoading"
              type="primary"
              icon="download"
              @click="exportItem"
              :disabled="!hasPermission('noReconciliation_export')"
            >
              导出
            </a-button>
            <a-button
              :loading="btnLoading"
              type="primary"
              icon="check-circle"
              @click="batchReconciliation"
              :disabled="!hasPermission('noReconciliation_reconciliate_batch')"
            >
              批量对账
            </a-button>
          </a-button-group>
        </div>
        <a-table
          :columns="columns"
          :data-source="tableList"
          :scroll="{ x: 1300 }"
          rowKey="id"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :loading="tableLoading"
          size="middle"
        >
          <span slot="settleState" slot-scope="text, record">
            <a-tag v-if="record.settleState == 1">未收款</a-tag>
            <a-tag v-if="record.settleState == 2">部分收款</a-tag>
            <a-tag v-if="record.settleState == 3">已收款</a-tag>
          </span>
          <div slot="opreation" slot-scope="text, record">
            <a-button
              type="link"
              @click="showModal(record)"
              :disabled="!hasPermission('noReconciliation_reconciliate')"
              >对账</a-button
            >
          </div>
          <span slot="totalSignAmount" slot-scope="text">
            {{ text ? formatPrice(text) : "-" }}
          </span>
          <span slot="totalDeductionAmount" slot-scope="text">
            {{ text ? formatPrice(text) : "-" }}
          </span>
          <span slot="totalReceivableAmount" slot-scope="text">
            {{ text ? formatPrice(text) : "-" }}
          </span>
          <span slot="totalTaxAmount" slot-scope="text">
            {{ text ? formatPrice(text) : "-" }}
          </span>
          <span slot="totalIncludingTaxAmount" slot-scope="text">
            {{ text ? formatPrice(text) : "-" }}
          </span>
        </a-table>
        <div class="total">
          合计 :
          <span>数量 :{{ signQtyTo }} </span>
          <span>单据金额 :{{ signAmountTo }} </span>
          <span>扣点金额 :{{ deductionTo }} </span>
          <span>应收金额 :{{ reAmountTo }} </span>
          <span>税额 :{{ taxAmountTo }} </span>
          <span>不含税金额 :{{ inTaxAmountTo }} </span>
        </div>
      </a-card>
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
      <Reconciliation ref="reconciliation" />
    </div>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { add } from "../../utils/tool";
import { mapState } from "vuex";
// import { getPartner, getStore } from "../../services/signed/waitForSigned";
import {
  GetList,
  ReconciliateListConfirm,
  exportData,
} from "../../services/settlement/receive/ReToCheckFor";
import Reconciliation from "./Reconciliation.vue";
import { organization } from '../../services/commonSaasApi'
const columns = [
  {
    title: "订单日期",
    dataIndex: "createDate",
    width: 150,
    align: "center",
  },
  {
    title: "签收日期",
    dataIndex: "signDate",
    width: 150,
    align: "center",
  },
  {
    title: "销售单号",
    dataIndex: "sno",
    width: 200,
    align: "center",
  },

  {
    title: "客户订单号",
    dataIndex: "customerSno",
    width: 200,
    align: "center",
  },
  {
    title: "客户",
    dataIndex: "customerName",
    width: 200,
    align: "center",
  },
  {
    title: "门店名称",
    dataIndex: "storeName",
    width: 200,
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "totalSignQty",
    width: 80,
    align: "center",
  },
  {
    title: "结算状态",
    dataIndex: "settleState",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "settleState" },
  },
  {
    title: "单据金额",
    dataIndex: "totalSignAmount",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "totalSignAmount" },
  },
  {
    title: "扣点金额",
    dataIndex: "totalDeductionAmount",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "totalDeductionAmount" },
  },
  {
    title: "应收金额",
    dataIndex: "totalReceivableAmount",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "totalReceivableAmount" },
  },
  {
    title: "税额",
    dataIndex: "totalTaxAmount",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "totalTaxAmount" },
  },
  {
    title: "不含税金额",
    dataIndex: "totalIncludingTaxAmount",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "totalIncludingTaxAmount" },
  },
  // {
  //   title: "关联合同",
  //   dataIndex: "contractTitle",
  //   width: 200,
  //   align: "center",
  // },
  //! glht
  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    width: 80,
    scopedSlots: { customRender: "opreation" },
    fixed: "right",
  },
];

export default {
  mixins: [mixin],
  components: { Reconciliation },
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin"),
      visible: false,
      tableLoading: false,
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "desc",
      },
      columns,
      tableList: [],
      storeList: [],
      partnerList: [],
      opList: [],
      searchForm: {},
      organizationOption: [],
      selectedRowKeys: [],
      exportLoading: false,
      btnLoading: false,
    };
  },

  methods: {
    handleOrganizationSearch(value) {
      organization({opName: value?.trim()}).then(res => res.data.code == '200' && (this.organizationOption = res.data.data))
    },
    // 对账
    showModal(record) {
      this.$refs.reconciliation.showModal(record);
    },
    exportItem() {
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
      link.setAttribute("download", "应收-待对账表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    //批量对账
    batchReconciliation() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      const params = {
        ids: [...this.selectedRowKeys],
      };
      this.btnLoading = true;
      ReconciliateListConfirm(params).then((res) => {
        this.btnLoading = false;
        this.selectedRowKeys = [];
        if (res.data.code == 200) {
          this.$message.success(
            res.data.message == "OK" ? "批量对账成功" : res.data.message
          );
          this.getList();
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "批量对账失败"
          );
        }
      }).catch(()=>{
        this.btnLoading = false;
        this.selectedRowKeys = [];
      });
    },
    searchList() {
      this.getList();
    },
    onSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleReset() {
      this.searchForm = {};
      this.storeList = [];
      this.partnerList = [];
    },
    handleDateChange(val) {
      this.searchForm.createDateStart = val[0];
      this.searchForm.createDateEnd = val[1];
      console.log(this.searchForm);
    },
    handleDateChanges(val) {
      this.searchForm.signDateStart = val[0];
      this.searchForm.signDateEnd = val[1];
    },
    getList() {
      let temp = JSON.parse(JSON.stringify(this.pagination));
      let tempS = JSON.parse(JSON.stringify(this.searchForm));
      delete temp.total;
      delete tempS.orderDate;
      delete tempS.signDate;
      const params = {
        ...temp,
        ...tempS,
      };
      this.tableLoading = true;
      GetList(params).then((res) => {
        this.tableLoading = false;
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
  },
  activated() {
    this.getList();
    this.handleOrganizationSearch();
    this.$setPageTitle('/balance/receiveable/receivableNoReconciliation','应收-待对账列表')
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    signAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += Number(item.totalSignAmount);
      });
      return this.formatPrice(num);
    },
    deductionTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += Number(item.totalDeductionAmount);
      });
      return this.formatPrice(num);
    },
    reAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += Number(item.totalReceivableAmount);
      });
      return this.formatPrice(num);
    },
    taxAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += Number(item.totalTaxAmount);
      });
      return this.formatPrice(num);
    },
    inTaxAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += Number(item.totalIncludingTaxAmount);
      });
      return this.formatPrice(num);
    },
    signQtyTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        // num += Number(item.totalSignQty);
        if (item.totalSignQty) {
          num = add(num, Number(item.totalSignQty));
        }
      });
      return num;
    },
  },
};
</script>


  <style scoped lang="less">
/deep/ .ant-modal-body {
  padding-bottom: 0 !important;
}
/deep/.ant-form-item {
  margin-bottom: 0;
}
@import "index.less";
</style>