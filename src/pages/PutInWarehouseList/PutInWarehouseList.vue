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
                    v-model.trim="searchForm.itemCode"
                    placeholder="入库单号/关联单号"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-select
                    v-model="searchForm.whCode"
                    style="width: 100%"
                    allowClear
                    placeholder="入库仓库"
                  >
                    <a-select-option
                      :value="item.whCode"
                      v-for="item in warehouseList"
                      :key="item.id"
                      >{{ item.whName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-select
                    v-model="searchForm.imItemType"
                    style="width: 100%"
                    allowClear
                    placeholder="订单类型"
                  >
                    <a-select-option
                      :value="item.dicCode"
                      :key="item.id"
                      v-for="item in orderTypeList"
                      >{{ item.dicText }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="4">
                <a-form-item>
                  <a-input disabled="true" value="待入库"></a-input>
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
                    :placeholder="['入库时间开始', '结束']"
                    v-model="searchForm.orderDate"
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
    <div class="table-item">
      <a-card
        title="数据列表"
        class="card-table"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
        style="margin-top: 20px"
      >
        <div class="btn-bar" style="margin-bottom: 16px; text-align: left">
          <div class="right-btn">
            <a-button-group>
              <a-button
                type="primary"
                icon="printer"
                @click="printOrder"
                :disabled="!hasPermission('put_in_warehouse_list_print')"
              >
                打印入库单
              </a-button>
              <a-button
                :loading="exportLoading"
                type="primary"
                icon="download"
                @click="exportItem"
                :disabled="!hasPermission('put_in_warehouse_list_export')"
              >
                导出订单
              </a-button>
            </a-button-group>
          </div>
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
          <div slot="imItemTypeName" slot-scope="text">
            <a-tag>{{ text }}</a-tag>
            <!-- <a-tag v-if="text == 20">采购入库</a-tag>
            <a-tag v-if="text == 33">盘盈入库</a-tag>
            <a-tag v-if="text == 24">换货入库</a-tag>
            <a-tag v-if="text == 23">客户退货入库</a-tag>
            <a-tag v-if="text == 105">生产入库</a-tag>
            <a-tag v-if="text == 106">退料入库</a-tag>
            <a-tag v-if="text == 99">其他入库</a-tag> -->
          </div>
          <div slot="opreation" slot-scope="text, record">
            <a-button
              type="link"
              @click="showDetails(record)"
              :disabled="!hasPermission('put_in_warehouse_list_detail')"
              >查看订单</a-button
            >
          </div>
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
      <Details ref="details" />
      <PrintOrder ref="printOrder" />
    </div>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import {
  GetList,
  GetWarehouse,
  GetOrderType,
  exportData,
} from "../../services/warehouseManagement/warehousing/PutInWarehouseList";
import Details from "./details.vue";
import PrintOrder from "./printOrder.vue";
const columns = [
  {
    title: "入库订单号",
    dataIndex: "imItemCode",
    width: 200,
    align: "center",
  },
  {
    title: "关联单号",
    dataIndex: "docNo",
    width: 200,
    align: "center",
  },
  {
    title: "入库数量",
    dataIndex: "imItemQty",
    width: 100,
    align: "center",
  },
  {
    title: "入库仓库",
    dataIndex: "whName",
    width: 150,
    align: "center",
  },
  {
    title: "入库时间",
    dataIndex: "updateDate",
    width: 150,
    align: "center",
  },
  {
    title: "订单提交时间",
    dataIndex: "createDate",
    width: 150,
    align: "center",
  },

  {
    title: "订单类型",
    dataIndex: "imItemTypeName",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "imItemTypeName" },
  },
  {
    title: "供应商名称",
    dataIndex: "partnerName",
    width: 220,
    align: "center",
  },

  {
    title: "供应商联系手机",
    dataIndex: "partnerPhone",
    width: 150,
    align: "center",
  },

  {
    title: "供应商地点",
    dataIndex: "partnerAddress",
    width: 200,
    align: "center",
  },

  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "opreation" },
    fixed: "right",
  },
];

export default {
  mixins: [mixin],
  components: { Details, PrintOrder },
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
      selectedRowKeys: [],
      selectedRows: [],
      exportLoading: false,
      btnLoading: false,
      puTotalAmountTO: 0,
      warehouseList: [],
      orderTypeList: [],
    };
  },
  methods: {
    printOrder() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      if (this.selectedRows.length > 1) {
        this.$message.error("最多只能选择一条数据！");
        return false;
      }
      this.$refs.printOrder.openModal(this.selectedRows[0]);
    },
    showDetails(record) {
      this.$refs.details.showDetailModal(record);
    },
    showModal(record) {
      console.log(record);
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
      link.setAttribute("download", "已入库单");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    searchList() {
      this.getList();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRows);
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleReset() {
      this.searchForm = {};
    },
    handleDateChange(val) {
      this.searchForm.createDateStart = val[0];
      this.searchForm.createDateEnd = val[1];
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
      GetList(params).then((res) => {
        this.tableLoading = false;
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
      });
    },
    //获取仓库列表
    getWarehouse() {
      GetWarehouse().then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.warehouseList = res.data.data;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取仓库数据失败"
          );
        }
      });
    },
    getOrderType() {
      GetOrderType({ type: 25 }).then((res) => {
        if (res.data.code == 200) {
          this.orderTypeList = res.data.data;
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取订单类型数据失败"
          );
        }
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
    this.getWarehouse();
    this.getOrderType();
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