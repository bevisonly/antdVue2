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
          <div slot="extra">
            <a-button
              type="link"
              v-if="searchState"
              @click="searchChange(false)"
            >
              收起<a-icon type="down"></a-icon>
            </a-button>
            <a-button
              type="link"
              v-if="!searchState"
              @click="searchChange(true)"
            >
              展开
              <a-icon type="up"></a-icon>
            </a-button>
          </div>
          <div class="search" v-if="searchState">
            <a-form :form="searchform">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="运营主体">
                    <a-select
                      style="width: 100%"
                      show-search
                      allowClear
                      v-model.trim="searchform.opId"
                      placeholder="请输入运营主体名称"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="opSearch"
                      @change="opChange"
                    >
                      <a-select-option v-for="item in opList" :key="item.id">{{
                        item.opName
                      }}</a-select-option>
                    </a-select></a-form-item
                  >
                </a-col>
                <a-col :span="6">
                  <a-form-item label="结算编号">
                    <a-input
                      v-model.trim="searchform.apInvoiceCode"
                      placeholder="请输入结算单编号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="供应商">
                    <a-select
                      v-model.trim="searchform.supplierId"
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
                <a-col :span="6">
                  <a-form-item label="代理公司">
                    <a-select
                      v-model.trim="searchform.agencyId"
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
                <a-col :span="6">
                  <a-form-item label="结算日期">
                    <a-range-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      showTime
                      @change="handleDateChange"
                      :placeholder="['开始时间', '结束时间']"
                      v-model="searchform.createDate"
                    ></a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item style="margin-top: 39px">
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
          <div style="margin-bottom: 16px; text-align: left" class="flex-sb">
            <a-space>
              <a-button
                :loading="exportLoading"
                type="primary"
                icon="download"
                @click="exportItem"
                :disabled="
                  resourceControl(
                    pageState === 'payableWaitVerification'
                      ? 'payable_wait_verification_export_list'
                      : 'payable_verification_export_list'
                  )
                "
              >
                导出列表
              </a-button>
              <a-button
                v-if="pageState === 'payableWaitVerification'"
                type="primary"
                icon="appstore"
                @click="checkMore"
                :disabled="resourceControl('receivable_verification_check')"
              >
                批量核销
              </a-button>
            </a-space>
            <div class="flex-ed">
              <a-button
                icon="bars"
                type="primary"
                title="筛选列"
                @click="showPopover"
              ></a-button>
              <a-popover
                v-model="popoverVisible"
                placement="bottomRight"
                :getPopupContainer="
                  (triggerNode) => {
                    return triggerNode.parentNode;
                  }
                "
              >
                <div slot="title">勾选即为显示该列数据</div>
                <template slot="content">
                  <div>
                    <a-checkbox-group
                      :options="columnFilters"
                      @change="onColumnChange"
                      v-model="selectedList"
                      :disabled="unchecked"
                    >
                    </a-checkbox-group>
                  </div>
                </template>
              </a-popover>
            </div>
          </div>
          <a-spin :tip="spinText" :spinning="spinning">
            <a-table
              :columns="columns"
              :data-source="tableList"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
              :scroll="{ x: 1300 }"
              :rowKey="id"
              :pagination="false"
            >
              <span slot="dataType" slot-scope="text">{{
                dataType[text] || "尾款"
              }}</span>
              <div slot="state" slot-scope="text">
                <a-tag v-if="text === 3">未核销</a-tag>
                <a-tag color="green" v-if="text === 4">已核销</a-tag>
              </div>
              <div slot="settleCycle" slot-scope="text">
                <span v-if="text === 1">自然月底</span>
                <span v-if="text === 2">每月15日</span>
                <span v-if="text === 3">自定义</span>
              </div>
              <div slot="operation" slot-scope="text, record">
                <a-button
                  type="link"
                  @click="toDetails(record)"
                  v-if="pageState === 'payableWaitVerification'"
                  :disabled="
                    !hasPermission('payable_wait_verification_verificate')
                  "
                  >核销</a-button
                >
                <a-button
                  type="link"
                  @click="toDetails(record)"
                  v-if="pageState === 'payableVerification'"
                  :disabled="!hasPermission('payable_verification_details')"
                  >详情</a-button
                >
              </div>
              <div slot="export" slot-scope="text, record">
                <a-button
                  type="link"
                  @click="exportDetails(record)"
                  :disabled="
                    resourceControl(
                      pageState === 'payableWaitVerification'
                        ? 'payable_wait_verification_export_details'
                        : 'payable_verification_export_details'
                    )
                  "
                  >导出明细</a-button
                >
              </div>
              <div slot="footer" class="table-footer">
                本页合计 :
                <span
                  >应付金额<span>{{ settlementAmountTo }}</span></span
                >|<span
                  >余款金额<span>{{ noPayAmountTo }}</span></span
                >
              </div>
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
import { GetOpList } from "../../services/signed/signed";
import {
  GetList,
  GetListOff,
  ExportListWait,
  ExportList,
  ExportDetails,
  checkMore2,
} from "../../services/settlement/payable/PayableVerification";
import { partnerType } from "@/services/userMa.js";
const columns = [
  {
    align: "center",
    title: "账单生成日期",
    dataIndex: "createDate",
    width: 150,
  },
  {
    align: "center",
    title: "核销状态",
    dataIndex: "state",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    align: "center",
    title: "核销类型",
    dataIndex: "dataType",
    width: 100,
    scopedSlots: { customRender: "dataType" },
  },
  {
    align: "center",
    title: "单据编号",
    dataIndex: "apInvoiceCode",
    width: 150,
  },
  {
    align: "center",
    title: "银行流水号",
    dataIndex: "relatedBankCode",
    width: 150,
  },
  { align: "center", title: "所属运营主体", dataIndex: "opName", width: 260 },
  {
    align: "center",
    title: "供应商名称",
    dataIndex: "supplierName",
    width: 250,
  },
  {
    align: "center",
    title: "代理公司名称",
    dataIndex: "agencyName",
    width: 250,
  },
  {
    align: "center",
    title: "结算周期",
    dataIndex: "settleCycle",
    width: 150,
    scopedSlots: { customRender: "settleCycle" },
  },
  {
    align: "center",
    title: "发票金额",
    dataIndex: "invoiceAmount",
    width: 150,
  },
  {
    align: "center",
    title: "包装金额",
    dataIndex: "packTotalAmount",
    width: 150,
  },
  { align: "center", title: "应付金额", dataIndex: "payAmounted", width: 150 },
  { align: "center", title: "预付金额", dataIndex: "payAmount", width: 150 },
  { align: "center", title: "余款金额", dataIndex: "noPayAmount", width: 150 },
  {
    align: "center",
    title: "折扣金额",
    dataIndex: "discountAmount",
    width: 150,
  },
  { align: "center", title: "账单日期", dataIndex: "billDate", width: 200 },
  {
    align: "center",
    title: "预付款日期",
    dataIndex: "advanceChargeDate",
    width: 200,
  },
  { align: "center", title: "核销人", dataIndex: "writeOffUser", width: 150 },
  { align: "center", title: "核销时间", dataIndex: "writeOffDate", width: 150 },
  // {align: "center",title: "关联合同",dataIndex: "contractTitle",width: 360,},
  //! glht
  {
    align: "center",
    title: "操作",
    dataIndex: "operation",
    width: 100,
    fixed: "right",
    scopedSlots: { customRender: "operation" },
  },
  {
    align: "center",
    title: "导出",
    dataIndex: "export",
    width: 100,
    fixed: "right",
    scopedSlots: { customRender: "export" },
  },
];
export default {
  mixins: [mixin],
  data() {
    return {
      exportLoading: false,
      selectedRowKeys: [],
      spinning: false,
      spinText: "",
      columns,
      tableList: [],
      searchform: {
        supplierId: undefined,
        apInvoiceCode: undefined,
        createDateStart: "",
        createDateEnd: "",
        createDate: [],
      },
      dataType: {
        1: "尾款",
        2: "预付款",
        3: "退款",
        4: "尾款，退款",
      },
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "create_date",
        order: "desc",
      },
      partnerList: [],
      columnFilters: [],
      popoverVisible: false,
      selectedList: [],
      unchecked: false,
      pageState: "",
      opList: [],
      searchState: true,
      supplierList: [],
      agencyList: [],
    };
  },
  activated() {
    // this.getOpSubject();
    console.log(this.$route);
    switch (this.$route.path) {
      case "/balance/payable/payableWaitVerification":
        this.pageState = "payableWaitVerification";
        break;
      case "/balance/payable/payableVerification":
        this.pageState = "payableVerification";
        break;

      default:
        break;
    }
    if (this.pageState === "payableWaitVerification") {
      let tempCol = [];
      let a = ["writeOffUser", "writeOffDate"];
      this.columns.forEach((item) => {
        if (a.indexOf(item.dataIndex) < 0) {
          tempCol.push(item);
        }
      });
      this.columns = tempCol;
    }
    this.getList();
    this.getFriends(30);
    this.getFriends(40);
    this.getOp();
    this.allColumns = JSON.parse(JSON.stringify(this.columns));
    this.columnFilters = [];
    this.selectedList = [];
    this.columns.forEach((item) => {
      if (item.title != "操作" || item.title != "导出") {
        this.columnFilters.push({
          value: item.dataIndex,
          label: item.title,
        });
        this.selectedList.push(item.dataIndex);
      }
    });
  },
  methods: {
    supplierSearch(value) {
      this.getFriends(30, value);
    },
    supplierChange(option) {
      if (option === undefined) this.searchform.supplierName = undefined;
      this.supplierList.forEach((item) => {
        if (option == item.id) {
          this.searchform.supplierName = item.partnerName;
        }
      });
    },
    agencySearch(value) {
      this.getFriends(40, value);
    },
    agencyChange(option) {
      if (option === undefined) this.searchform.agencyName = undefined;
      this.agencyList.forEach((item) => {
        if (option == item.id) {
          this.searchform.agencyName = item.partnerName;
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    checkMore() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.info("未选中任何数据");
        return;
      }
      let This = this;
      this.$confirm({
        title: "确定批量核销账单",
        content: `请确定是否批量核销账单?\n账单结算金额：${this.getTotal}`,
        okText: "确定核销",
        cancelText: "取消",
        async onOk() {
          checkMore2({ ids: This.selectedRowKeys.join(",") })
            .then((res) => {
              This.selectedRowKeys = [];
              if (res.data?.code == 200) {
                This.pagination.page = 1;
                This.searchList();
                This.$message.success(res.data.message);
              } else {
                This.$message.error("批量核销出错" + res?.data?.message, 3);
              }
            })
            .catch((vip) => {
              This.selectedRowKeys = [];
              This.$message.error("批量核销出错" + vip, 3);
            });
        },
      });
    },
    searchChange(val) {
      this.searchState = val;
    },
    resourceControl(value) {
      return !this.hasPermission(value);
    },
    opChange(value) {
      if (!value) {
        this.searchform.opName = "";
        return;
      }
      this.opList.forEach((item) => {
        if (value === item.id) {
          this.searchform.opName = item.opName;
        }
      });
    },
    opSearch(value) {
      this.getOp(value);
    },
    async getOp(value) {
      const res = await GetOpList({ opName: value || "" });
      this.opList = res.data.data || [];
    },
    onColumnChange(checkedValues) {
      if (checkedValues.length < 2) {
        // this.unchecked = true;
        this.$message.warning("请至少保留一列");
        return;
      }
      let tempColumns = JSON.parse(JSON.stringify(this.allColumns));
      tempColumns.forEach((item, index) => {
        if (!checkedValues.includes(item.dataIndex)) {
          tempColumns.splice(index, 1);
        } else {
          tempColumns[index] = item;
        }
      });
      this.columns = tempColumns;
    },
    showPopover() {
      this.popoverVisible = true;
    },
    toDetails(record) {
      this.$router.push({
        path: "/balance/payable/payableVerificationDetails",
        query: {
          state: this.pageState,
          record: record,
        },
      });
    },

    handleDateChange(val) {
      this.searchform.createDateStart = val[0];
      this.searchform.createDateEnd = val[1];
    },

    getList() {
      this.spinText = "数据加载中";
      let temp = JSON.parse(JSON.stringify(this.searchform));
      delete temp.createDate;
      const params = {
        ...this.pagination,
        ...temp,
      };
      this.spinning = true;
      switch (this.pageState) {
        case "payableWaitVerification":
          GetList(params)
            .then((res) => {
              this.spinning = false;
              this.tableList = res.data.data?.list ?? [];
              this.pagination.total = res.data.data?.total ?? 0;
            })
            .catch((error) => {
              console.log(error);
              this.spinning = false;
              this.$message.error("接口请求出错");
            });
          break;
        case "payableVerification":
          GetListOff(params)
            .then((res) => {
              this.spinning = false;
              this.tableList = res.data.data?.list ?? [];
              this.pagination.total = res.data.data?.total ?? 0;
            })
            .catch((error) => {
              console.log(error);
              this.spinning = false;
              this.$message.error("接口请求出错");
            });
          break;

        default:
          break;
      }
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
      const params = {
        ...temp,
      };
      this.exportLoading = true;
      this.spinning = true;
      this.spinText = "数据导出中请稍后";
      if (this.pageState === "payableWaitVerification") {
        ExportListWait(params)
          .then((res) => {
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
          })
          .catch((res) => {
            console.log(res);
            this.exportLoading = false;
            this.spinning = false;
            this.$message.error("接口请求出错");
          });
      }
      if (this.pageState === "payableVerification") {
        ExportList(params)
          .then((res) => {
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
          })
          .catch((res) => {
            console.log(res);
            this.exportLoading = false;
            this.spinning = false;
            this.$message.error("接口请求出错");
          });
      }
    },
    //导出
    exportDetails(record) {
      this.spinning = true;
      this.spinText = "数据导出中请稍后";
      const params = {
        id: record?.id ?? "",
      };
      ExportDetails(params)
        .then((res) => {
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
            this.downloadTem(url, true);
          } else {
            this.$message.error("导出失败！");
          }
        })
        .catch((res) => {
          console.log(res);
          this.exportLoading = false;
          this.spinning = false;
          this.$message.error("接口请求出错");
        });
    },
    downloadTem(url, state) {
      let link = document.createElement("a");
      if (state) {
        this.pageState === "payableWaitVerification"
          ? link.setAttribute("download", "应付-待核销详情")
          : link.setAttribute("download", "应付-已核销详情");
      } else {
        this.pageState === "payableWaitVerification"
          ? link.setAttribute("download", "应付-待核销列表")
          : link.setAttribute("download", "应付-已核销列表");
      }
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // getPartner() {
    //   const params = {
    //     partnerType: 30,
    //   };
    //   getPartner(params).then((res) => {
    //     if (res.data.code == 200) {
    //       this.partnerList = res.data.data;
    //     }
    //   });
    // },
    handleReset() {
      this.searchform = {
        createDateStart: "",
        createDateEnd: "",
        createDate: [],
        supplierId: undefined,
        supplierName: "",
        agencyId: undefined,
        agencyName: "",
        opName: "",
        opId: undefined,
      };
    },
    searchList() {
      this.pagination.page = 1;
      this.getList();
    },
    // handleChange(option) {
    //   if (option === undefined) this.searchform.supplierName = undefined;
    //   this.partnerList.forEach((item) => {
    //     if (option == item.id) {
    //       this.searchform.supplierName = item.partnerName;
    //     }
    //   });
    // },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    getTotal() {
      let money = [];
      this.selectedRowKeys.forEach((item) => {
        this.tableList.forEach((val) => {
          item == val.id && money.push(val.payAmounted);
        });
      });
      return money.reduce((t, c) => this.formatPrice(t + (+c || 0)), 0);
    },
    settlementAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.settlementAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    noPayAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.noPayAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    // taxAmountTo() {
    //   let num = 0;
    //   this.tableList.forEach((item) => {
    //     num += item?.taxAmount ?? 0;
    //   });
    //   return this.formatPrice(num);
    // },
    // includingTaxAmountTo() {
    //   let num = 0;
    //   this.tableList.forEach((item) => {
    //     num += item?.includingTaxAmount ?? 0;
    //   });
    //   return this.formatPrice(num);
    // },
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
.table-footer {
  span {
    margin: 0 10px;
  }
}
/deep/.ant-popover-inner-content {
  width: 300px !important;
  height: 200px !important;
  overflow: scroll;
}
// /deep/.ant-table-tbody > tr > td {
//   padding: 8px;
// }
</style>