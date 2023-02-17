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
              <a-col :span="4">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.poCode"
                    placeholder="请输入单据号"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-select
                    v-model.trim="searchForm.supplierId"
                    placeholder="请输入供应商名称"
                    @change="supplierChange"
                    @search="supplierSearch"
                    style="width: 100%"
                    :filter-option="filterOption"
                    allowClear
                    showSearch
                  >
                    <a-select-option
                      v-for="(item, index) in supplierList"
                      :value="item.id"
                      :key="index"
                      >{{ item.partnerName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-select
                    v-model.trim="searchForm.agencyId"
                    placeholder="请输入代理商名称"
                    @change="agencyChange"
                    @search="agencySearch"
                    style="width: 100%"
                    :filter-option="filterOption"
                    allowClear
                    showSearch
                  >
                    <a-select-option
                      v-for="(item, index) in agencyList"
                      :value="item.id"
                      :key="index"
                      >{{ item.partnerName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.containerCode"
                    placeholder="请输入柜号"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    showTime
                    @change="handleDateChange"
                    :placeholder="['采购开始时间', '结束时间']"
                    v-model="searchForm.orderDate"
                  ></a-range-picker>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item>
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
            <a-row :gutter="24"> </a-row>
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
              :disabled="!hasPermission('noReconciled_export')"
            >
              导出
            </a-button>
            <a-button
              :loading="btnLoading"
              type="primary"
              icon="check-circle"
              @click="batchReconciliation"
              :disabled="!hasPermission('noReconciled_batchReconciliate')"
            >
              批量对账
            </a-button>
          </a-button-group>
        </div>
        <a-table
          :columns="columns"
          :data-source="tableList"
          :scroll="{ x: 1300 }"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            onChange: onSelectChange,
          }"
          :loading="tableLoading"
          size="middle"
        >
          <div slot="opreation" slot-scope="text, record">
            <a-button
              type="link"
              @click="showModal(record)"
              :disabled="!hasPermission('noReconciled_reconciliation')"
              >对账</a-button
            >
          </div>
          <span slot="puTotalAmount" slot-scope="text, record">
            {{
              formatPrice(
                (+record.puTotalAmount || 0) - (+record.deductions || 0)
              )
            }}
          </span>
          <template tips="合计" slot="footer" slot-scope="currentPageData">
            本页合计：应付金额&nbsp;&lt;{{
              formatPrice(
                currentPageData.reduce((t, c) => {
                  return t + (+c.puTotalAmount || 0);
                }, 0)
              )
            }}&gt;
          </template>
        </a-table>
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
import { mapState } from "vuex";
import {
  GetList,
  ReconciliateListConfirm,
  exportData,
} from "../../services/settlement/payable/PayableToCheckFor";
import Reconciliation from "./Reconciliation.vue";
import { partnerType } from "@/services/userMa.js";
import { organization } from '../../services/commonSaasApi'
const columns = [
  {
    title: "单据号",
    dataIndex: "poCode",
    width: 200,
    align: "center",
  },
  {
    title: "柜号",
    dataIndex: "containerCode",
    width: 200,
    align: "center",
  },
  // {
  //   title: "供应商名称",
  //   dataIndex: "supplierName",
  //   key: "supplierName",
  //   width: 150,
  //   align: "center",
  // },
  {
    title: "代理公司名称",
    dataIndex: "agencyName",
    width: 200,
    align: "center",
  },

  {
    title: "采购日期",
    dataIndex: "poSubtime",
    width: 200,
    align: "center",
  },
  {
    title: "扣供应商款",
    dataIndex: "deductions",
    width: 200,
    align: "center",
  },
  {
    title: "预付款",
    dataIndex: "payAmount",
    width: 200,
    align: "center",
  },
  {
    title: "尾款",
    dataIndex: "noPayAmount",
    width: 200,
    align: "center",
  },
  {
    title: "应付金额",
    dataIndex: "puTotalAmount",
    width: 200,
    align: "center",
    scopedSlots: { customRender: "puTotalAmount" },
  },
  {
    title: "供应商名称",
    dataIndex: "supplierName",
    width: 150,
    align: "center",
  },
  // {
  //   title: "柜号",
  //   dataIndex: "containerCode",
  //   width: 200,
  //   align: "center",
  // },
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
      opList: [],
      searchForm: {},
      organizationOption: [],
      selectedRowKeys: [],
      selectedRows: [],
      btnLoading: false,
      supplierList: [],
      agencyList: [],
    };
  },
  methods: {
    handleOrganizationSearch(value) {
      organization({opName: value?.trim()}).then(res => res.data.code == '200' && (this.organizationOption = res.data.data))
    },
    supplierSearch(value) {
      this.getFriends(30, value);
    },
    supplierChange(option) {
      if (option === undefined) this.searchForm.supplierName = undefined;
      this.supplierList.forEach((item) => {
        if (option == item.id) {
          this.searchForm.supplierName = item.partnerName;
        }
      });
    },
    agencySearch(value) {
      this.getFriends(40, value);
    },
    agencyChange(option) {
      if (option === undefined) this.searchForm.agencyName = undefined;
      this.agencyList.forEach((item) => {
        if (option == item.id) {
          this.searchForm.agencyName = item.partnerName;
        }
      });
    },
    //合作伙伴
    async getFriends(type, value) {
      const params = {
        partnerName: value || "",
        partnerType: type || "",
      };
      let res = await partnerType(params);
      if (res.data.code == 200) {
        if (type == 30) {
          this.supplierList = res.data.data || [];
        }
        if (type == 40) {
          this.agencyList = res.data.data || [];
        }
      }
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
      link.setAttribute("download", "应付-待对账表");
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
      let temp = [];
       temp=JSON.parse(JSON.stringify(this.selectedRows))
      const params =
        [...temp];
      this.btnLoading = true;
      ReconciliateListConfirm(params)
        .then((res) => {
          this.selectedRowKeys = [];
          this.btnLoading = false;
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
        })
        .catch(() => {
          this.selectedRowKeys = [];
          this.btnLoading = false;
        });
    },
    searchList() {
      this.getList();
    },
    onSelectChange(selectedRowKeys,selectedRows) {
      console.log(selectedRowKeys);
      console.log(selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleReset() {
      this.searchForm = {};
    },
    handleDateChange(val) {
      this.searchForm.beginTime = val[0];
      this.searchForm.endTime = val[1];
      console.log(this.searchForm);
    },

    getList() {
      let temp = JSON.parse(JSON.stringify(this.pagination));
      delete temp.total;
      let tempS = JSON.parse(JSON.stringify(this.searchForm));
      delete tempS.orderDate;
      const params = {
        ...temp,
        ...tempS,
      };
      this.tableLoading = true;
      GetList(params)
        .then((res) => {
          this.tableLoading = false;
          this.tableList = res.data.rows;
          this.pagination.total = res.data.total;
        })
        .catch(() => (this.tableLoading = false));
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  activated() {
    this.getList();
    this.getFriends(30);
    this.getFriends(40);
    this.handleOrganizationSearch();
    this.$setPageTitle(
      "/balance/payable/payableNoReconciliation",
      "应付-待对账列表"
    );
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
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