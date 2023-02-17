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
              <a-form-item>
                <a-input
                  v-model="searchForm.deptName"
                  placeholder="所属部门"
                  :disabled="true"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model.trim="searchForm.itemName"
                  placeholder="商品"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model.trim="searchForm.supplierName"
                  placeholder="供应商"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model.trim="searchForm.containerCode"
                  placeholder="柜号"
                ></a-input>
              </a-form-item>
            </a-col>
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
                  :placeholder="['订单开始时间', '结束时间']"
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
                  :placeholder="['到港开始时间', '结束时间']"
                  v-model="searchForm.arriveDate"
                ></a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleReset">清 空</a-button>
                  <a-button type="primary" @click="onSearch">查 询</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>
    <div class="international" style="margin-top: 16px">
      <a-card
        title="数据列表"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
      >
        <div class="flex-sb">
          <a-button type="primary" :loading="loadingExport" @click="exportBtn">
            导出
          </a-button>
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

        <a-table
          style="margin-top: 16px"
          :columns="columns"
          bordered
          size="middle"
          :data-source="tableList"
          :loading="tableLoading"
          :scroll="{ x: 1200 }"
          rowKey="id"
          :pagination="false"
        >
          <div slot="marketSalesPriceAvg" slot-scope="text, record">
            {{
              record.marketSalePrice && record.saleQty
                ? ((record.marketSalePrice / record.saleQty).toFixed(8) *
                    100000000) /
                  100000000
                : "-"
            }}
          </div>
        </a-table>
        <!-- 分页 -->
        <div class="pagination">
          <a-pagination
            :page-size-options="['10', '20', '30', '40', '50']"
            :total="pagination.total"
            show-size-changer
            :page-size="pagination.pageSize"
            show-quick-jumper
            :current="pagination.currentPage"
            :show-total="(total) => `共 ${total} 条记录`"
            @change="pageChange"
            @showSizeChange="pageSizeChange"
          >
          </a-pagination>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mixin } from "../../utils/mixins";
const columns = [
  {
    align: "center",
    title: "柜号",
    width: 150,
    dataIndex: "containerCode",
  },
  {
    align: "center",
    title: "原产国",
    dataIndex: "itemCountryOrigin",
    width: 100,
  },
  {
    align: "center",
    title: "ETD Week",
    dataIndex: "sailDateWeek",
    width: 100,
  },
  {
    align: "center",
    title: "ETD",
    dataIndex: "sailDate",
    width: 150,
  },
  {
    align: "center",
    title: "目的港",
    dataIndex: "purposeHarbor",
    width: 100,
  },
  {
    align: "center",
    title: "船名",
    dataIndex: "shipName",
    width: 150,
  },
  {
    align: "center",
    title: "发货港",
    dataIndex: "shipmentPort",
    width: 150,
  },
  {
    align: "center",
    title: "ETA Week",
    dataIndex: "expectArrivalDateWeek",
    width: 100,
  },
  {
    align: "center",
    title: "ETA",
    width: 150,
    dataIndex: "expectArrivalDate",
  },

  {
    align: "center",
    title: "供应商",
    width: 200,
    dataIndex: "supplierName",
  },
  {
    align: "center",
    title: "采购员",
    width: 100,
    dataIndex: "buyer",
  },
  {
    align: "center",
    title: "商品",
    width: 150,
    dataIndex: "itemName",
  },
  {
    align: "center",
    title: "品种",
    width: 100,
    dataIndex: "itemType",
  },
  {
    align: "center",
    title: "净重",
    width: 100,
    dataIndex: "poNetweight",
  },
  {
    align: "center",
    title: "品牌",
    width: 100,
    dataIndex: "itemBrand",
  },
  {
    align: "center",
    title: "等级",
    width: 100,
    dataIndex: "itemLevel",
  },
  {
    align: "center",
    title: "规格",
    width: 100,
    dataIndex: "itemSpec",
  },
  {
    align: "center",
    title: "箱数",
    width: 100,
    dataIndex: "saleQty",
  },
  {
    align: "center",
    title: "板数",
    width: 100,
    dataIndex: "plateNumber",
  },
  {
    align: "center",
    title: "流向",
    width: 200,
    dataIndex: "flowDirection",
  },
  {
    align: "center",
    title: "定价方式",
    width: 100,
    dataIndex: "pricingState",
  },
  {
    align: "center",
    title: "条款",
    width: 100,
    dataIndex: "terms",
  },
  {
    align: "center",
    title: "发票价格",
    width: 100,
    dataIndex: "poPrice",
  },
  {
    align: "center",
    title: "发票金额",
    width: 100,
    dataIndex: "poAmount",
  },
  {
    align: "center",
    title: "市场销售均价￥",
    width: 150,
    dataIndex: "marketSalesPriceAvg",
    scopedSlots: { customRender: "marketSalesPriceAvg" },
  },
  {
    align: "center",
    title: "市场销售￥",
    width: 100,
    dataIndex: "marketSalePrice",
  },
  {
    align: "center",
    title: "市场费用￥",
    width: 100,
    dataIndex: "marketCost",
  },
  {
    align: "center",
    title: "销售费用￥",
    width: 100,
    dataIndex: "costSales",
  },
  {
    align: "center",
    title: "地利销售均价￥",
    width: 120,
    dataIndex: "diliAvgSale",
  },
  {
    align: "center",
    title: "地利销售￥",
    width: 100,
    dataIndex: "diliSale",
  },
  {
    align: "center",
    title: "清关费￥",
    width: 100,
    dataIndex: "customsClearanceFee",
  },
  {
    align: "center",
    title: "外区运杂费￥",
    width: 120,
    dataIndex: "outsideAreaFreightAndIncidentalCharges",
  },
  {
    align: "center",
    title: "关税￥",
    width: 100,
    dataIndex: "tariffs",
  },
  {
    align: "center",
    title: "增值税￥",
    width: 100,
    dataIndex: "valueAddedTax",
  },
  {
    align: "center",
    title: "海运费￥",
    width: 100,
    dataIndex: "seaFreightCharge",
  },
  {
    align: "center",
    title: "其他费用￥",
    width: 100,
    dataIndex: "otherFee",
  },
  {
    align: "center",
    title: "扣款",
    width: 100,
    dataIndex: "deductions",
  },
  {
    align: "center",
    title: "预付款",
    width: 100,
    dataIndex: "payAmount",
  },
  {
    align: "center",
    title: "预付款汇率",
    width: 120,
    dataIndex: "payAmountExchangeRate",
  },
  {
    align: "center",
    title: "尾款",
    width: 100,
    dataIndex: "noPayAmount",
  },
  {
    align: "center",
    title: "尾款汇率",
    width: 100,
    dataIndex: "noPayAmountExchangeRate",
  },
  {
    align: "center",
    title: "地利费用总计￥",
    width: 120,
    dataIndex: "allDiliFee",
  },
  {
    align: "center",
    title: "货款总计￥",
    width: 100,
    dataIndex: "allLoan",
  },
  {
    align: "center",
    title: "地利总成本￥",
    width: 120,
    dataIndex: "allDiliCost",
  },
  {
    align: "center",
    title: "地利成本单价￥",
    width: 120,
    dataIndex: "diliCostUnitPrice",
  },
  {
    align: "center",
    title: "总盈亏",
    width: 100,
    dataIndex: "totalProfitLoss",
  },
  {
    align: "center",
    title: "地利单件盈亏￥",
    width: 120,
    dataIndex: "profitLoss",
  },
  {
    align: "center",
    title: "Check",
    width: 100,
    dataIndex: "check",
  },
  {
    align: "center",
    title: "收入确认月份",
    width: 150,
    dataIndex: "orderMonth",
  },
];
import {
  GetList,
  exportData,
} from "../../services/reportManagement/internationalBusinessStatement";
export default {
  mixins: [mixin],
  data() {
    return {
      columns,
      loadingExport: false,
      searchForm: {
        containerCode: "",
        orderStartTime: "",
        orderEndTime: "",
        startExpectArrivalDate: "",
        endExpectArrivalDate: "",
        supplierName: "",
        itemName: "",
        deptName: JSON.parse(localStorage.getItem("userInfo")).deptName
          ? JSON.parse(localStorage.getItem("userInfo")).deptName
          : "暂无所属部门",
      },
      //--分页
      pagination: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
        sortName: "id",
        direction: "DESC",
      },
      tableList: [],
      allColumns: [],
      tableLoading: false,
      popoverVisible: false,
      columnFilters: [],
      selectedList: [],
      unchecked: false,
    };
  },
  activated() {
    this.getList();
  },
  created() {
    // let i = 1;
    // this.columns.forEach((item) => {
    //   item.key = i;
    //   i++;
    // });
    // console.log(this.columns);
    this.allColumns = JSON.parse(JSON.stringify(this.columns));
  },
  methods: {
    downloadTem(url) {
      let link = document.createElement("a");
      link.setAttribute("download", "国际业务报表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportBtn() {
      let temp = JSON.parse(JSON.stringify(this.searchForm));
      delete temp.deptName;
      delete temp.orderDate;
      delete temp.arriveDate;
      const params = {
        direction: "DESC",
        sortName: "id",
        currentPage: -1,
        queryParam: {
          ...temp,
        },
      };
      this.loadingExport = true;
      exportData(params)
        .then((res) => {
          const data = res.data;
          this.loadingExport = false;
          if (data) {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            this.downloadTem(url);
          } else {
            this.$message.error("导出失败！");
          }
        })
        .catch(() => {
          this.loadingExport = false;
          this.$message.warn("导出失败");
        });
    },
    showPopover() {
      this.columnFilters = [];
      let temp = [];
      this.popoverVisible = true;
      this.allColumns.forEach((item) => {
        this.columnFilters.push({
          value: item.dataIndex,
          label: item.title,
        });

        temp.push(item.dataIndex);
      });
      console.log(this.selectedList);
      if (this.selectedList.length == 0) {
        this.selectedList = JSON.parse(JSON.stringify(temp));
      }
    },
    onColumnChange(checkedValues) {
      if (checkedValues.length < 2) {
        this.unchecked = true;
        this.$message.warning("请至少保留一列");
        return;
      }
      console.log(checkedValues);
      console.log(this.selectedList);
      this.allColumns.forEach((item, index) => {
        if (!checkedValues.includes(item.dataIndex)) {
          this.columns.splice(index, 1);
        } else {
          this.columns[index] = item;
        }
      });
      console.log(this.columns);
    },
    handleDateChange(val) {
      this.searchForm.orderStartTime = val[0];
      this.searchForm.orderEndTime = val[1];
      console.log(this.searchForm);
    },
    handleDateChanges(val) {
      this.searchForm.startExpectArrivalDate = val[0];
      this.searchForm.endExpectArrivalDate = val[1];
    },
    getList() {
      let temp = JSON.parse(JSON.stringify(this.searchForm));
      let tempPages = JSON.parse(JSON.stringify(this.pagination));
      delete temp.deptName;
      delete tempPages.total;
      delete temp.orderDate;
      delete temp.arriveDate;
      const params = {
        ...tempPages,
        queryParam: { ...temp },
      };
      this.tableLoading = true;
      GetList(params).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const data = res.data.data;
          this.tableList = JSON.parse(JSON.stringify(data));
          this.pagination.total = res.data.totalNum;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取国际业务报表数据错误"
          );
        }
      });
    },
    handleReset() {
      console.log(11);
      this.searchForm = {
        arriveDate: [],
        orderDate: [],
        orderStartTime: "",
        orderEndTime: "",
        startExpectArrivalDate: "",
        endExpectArrivalDate: "",
        containerCode: "",
        deptName: JSON.parse(localStorage.getItem("userInfo")).deptName
          ? JSON.parse(localStorage.getItem("userInfo")).deptName
          : "暂无所属部门",
        supplierId: "",
        itemId: "",
      };
    },
    onSearch() {
      this.getList();
    },
    //分页
    pageChange(index) {
      this.pagination.currentPage = index;
      this.getList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getList();
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
/deep/.ant-form-item {
  margin-bottom: 0;
}
/deep/.ant-popover-inner-content {
  width: 300px !important;
  height: 200px !important;
  overflow: scroll;
}
.vshow {
  display: none;
}
@import "index";
</style>