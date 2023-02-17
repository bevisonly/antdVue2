<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="type-choose">
      <a-radio-group
        v-model="state"
        button-style="solid"
        size="large"
        @change="stateChange"
      >
        <a-radio-button :value="1"> 待提交 </a-radio-button>
        <a-radio-button :value="2"> 待审核 </a-radio-button>
        <a-radio-button :value="3"> 已审核 </a-radio-button>
      </a-radio-group>
    </div>
    <div class="search-item" style="margin-top: 10px">
      <a-card
        title="筛选查询"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
      >
        <div class="search">
          <a-form :form="searchForm">
            <a-row :gutter="24">
              <a-col :span="3" v-if="isAdmin">
                <a-form-item>
                  <a-select
                    v-model="searchForm.opId"
                    placeholder="主体"
                    @change="tenantChange"
                  >
                    <a-select-option
                      v-for="item in tenantList"
                      :value="item.id"
                      :key="item.orgId"
                      >{{ item.opName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    showTime
                    @change="handleDateChange"
                    :placeholder="['开始时间', '结束时间']"
                    v-model="searchForm.orderDate"
                  ></a-range-picker>
                </a-form-item>
              </a-col>

              <!-- <a-col :span="3">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.proLine"
                    placeholder="加工分拣线"
                  >
                  </a-input>
                </a-form-item>
              </a-col> -->

              <a-col :span="3">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.itemName"
                    placeholder="加工商品名称"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.customerName"
                    placeholder="客户名称"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.soSno"
                    placeholder="客户订单号"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="3">
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
    <div class="table-item" style="margin-top: 10px">
      <a-card
        title="数据列表"
        class="card-table"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
        style="margin-top: 20px"
      >
        <div class="opreation-item" v-if="processState === 1">
          <a-button
            type="primary"
            @click="batchOrder"
            :disabled="!hasPermission('to_be_processed_order_generate_batch')"
            >批量生成加工单</a-button
          >
          <a-checkbox style="margin-left: 20px" @change="onChange">
            扣减成品库存数
          </a-checkbox>
        </div>
        <a-table
          :columns="processState === 2 ? columnsM : columns"
          :data-source="tableData"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          :expandIcon="expandIcon"
          style="margin-top: 10px"
          size="middle"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
        >
          <span slot="source" slot-scope="text">
            <a-tag v-if="text === 1">客户订单</a-tag>
          </span>
          <span slot="state" slot-scope="text">
            <a-tag v-if="text == 0">待生成加工单</a-tag>
            <a-tag v-if="text == 1">已生成加工单</a-tag>
            <a-tag v-if="text == 4">作废</a-tag>
            <a-tag v-if="text == 5">加工中</a-tag>
            <a-tag v-if="text == 6">加工完成</a-tag>
          </span>
          <div slot="opreation" slot-scope="text, record">
            <a-popconfirm
              title="确定生成加工单吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="generatingOrder(record)"
              v-if="processState === 1"
              :disabled="!hasPermission('to_be_processed_order_generate')"
            >
              <a-button
                type="link"
                :disabled="!hasPermission('to_be_processed_order_generate')"
                >生成加工单</a-button
              >
            </a-popconfirm>
            <a-popconfirm
              title="确定作废该条数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="cancelOrder(record)"
              :disabled="!hasPermission('to_be_processed_order_cancel')"
              v-if="processState === 1"
            >
              <a-button
                type="link"
                :disabled="!hasPermission('to_be_processed_order_cancel')"
                >作废</a-button
              >
            </a-popconfirm>
            <a-popconfirm
              title="确定还原该加工单吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="resetOrder(record)"
              v-if="processState === 3"
              :disabled="!hasPermission('to_be_processed_order_revert')"
            >
              <a-button
                type="link"
                :disabled="!hasPermission('to_be_processed_order_revert')"
                >还原</a-button
              >
            </a-popconfirm>
          </div>
          <a-table
            :columns="innerColumns"
            slot="expandedRowRender"
            slot-scope="record"
            :data-source="record.processOrderDetail"
            rowKey="soSno"
            :pagination="false"
            size="small"
          ></a-table>
        </a-table>
      </a-card>
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
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import { throttle } from "../../utils/tool";
import {
  GetTenant,
  GetList,
  CreateProcessOrder,
  GetListComplete,
  CancelProcessOrderList,
  ResetProcessOrder,
  CancelProcess,
} from "../../services/sortingProcessing/ToBeProcessedOrder";
const columns = [
  {
    title: "序号",
    dataIndex: "codeNum",
    align: "center",
  },
  {
    title: "加工商品名称",
    dataIndex: "itemName",
    align: "center",
  },
  {
    title: "编码",
    dataIndex: "itemCode",
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "totalOrderQty",
    align: "center",
  },

  {
    title: "需加工数量",
    dataIndex: "processQty",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
  {
    title: "成品库存数量",
    dataIndex: "finishProductInvCount",
    align: "center",
  },
  {
    title: "加工单来源",
    dataIndex: "source",
    align: "center",
    scopedSlots: { customRender: "source" },
  },
  // {
  //   title: "生产线",
  //   dataIndex: "proLine",
  //   align: "center",
  // },
  {
    title: "加工状态",
    dataIndex: "state",
    align: "center",
    scopedSlots: { customRender: "state" },
  },

  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    scopedSlots: { customRender: "opreation" },
  },
];
const columnsM = [
  {
    title: "序号",
    dataIndex: "codeNum",
    align: "center",
  },
  {
    title: "加工单号",
    dataIndex: "processNo",
    align: "center",
  },
  {
    title: "加工商品名称",
    dataIndex: "itemName",
    align: "center",
  },
  {
    title: "编码",
    dataIndex: "itemCode",
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "totalOrderQty",
    align: "center",
  },

  {
    title: "需加工数量",
    dataIndex: "processQty",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
  {
    title: "成品库存数量",
    dataIndex: "finishProductInvCount",
    align: "center",
  },
  {
    title: "加工单来源",
    dataIndex: "source",
    align: "center",
    scopedSlots: { customRender: "source" },
  },
  // {
  //   title: "生产线",
  //   dataIndex: "proLine",
  //   align: "center",
  // },
  {
    title: "加工状态",
    dataIndex: "state",
    align: "center",
    scopedSlots: { customRender: "state" },
  },
];
const innerColumns = [
  {
    title: "订单号",
    dataIndex: "soSno",
    align: "center",
  },
  {
    title: "客户名称",
    dataIndex: "customerName",
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "orderQty",
    align: "center",
  },

  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },

  {
    title: "订单时间",
    dataIndex: "orderDate",
    align: "center",
  },
  {
    title: "送货时间",
    dataIndex: "deliveryDate",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "mark",
    align: "center",
  },
];

export default {
  mixins: [mixin],
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === "true",
      visible: false,
      tableLoading: false,
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
      },
      columns,
      columnsM,
      innerColumns,
      tableData: [],
      tableDataR: [],
      searchForm: {
        orgId: localStorage.getItem("orgId") || "",
        orderDate: "",
        soSno: "",
        customerName: "",
        itemName: "",
        // proLine: "",
        opId: "",
      },
      processState: 1,
      tenantList: [],
      checkedState: false,
      selectedRowKeys: [],
      selectedRows: [],
      state:1,
    };
  },
  methods: {
    stateChange(){},
    checkWatch(val) {
      if (val) {
        let tempData = JSON.parse(JSON.stringify(this.tableData));
        tempData.forEach((item) => {
          item.processQty =
            item.totalOrderQty - item.finishProductInvCount > 0
              ? item.totalOrderQty - item.finishProductInvCount
              : 0;
        });
        this.tableData = JSON.parse(JSON.stringify(tempData));
        this.$forceUpdate();
      } else {
        let tempData = JSON.parse(JSON.stringify(this.tableData));
        tempData.forEach((item) => {
          item.processQty = item.totalOrderQty;
        });
        this.tableData = JSON.parse(JSON.stringify(tempData));
      }
    },
    cancelOrder(record) {
      const params = { ...record };
      CancelProcess(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    resetOrder(record) {
      const params = { ...record };
      ResetProcessOrder(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    processStateChange() {
      this.getList();
    },
    batchOrder() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      let temp = JSON.parse(JSON.stringify(this.selectedRows));
      if (temp && temp.length > 0) {
        temp.forEach((item) => {
          item.subInv = this.checkedState;
        });
      }
      console.log(temp);
      const params = [...temp];
      CreateProcessOrder(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(
            data.message === "OK" ? "批量生成加工单成功" : data.message
          );
          this.getList();
        } else {
          this.$message.error(
            data.message ? data.message : "批量生成加工单失败"
          );
        }
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRows);
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    //生成加工单
    generatingOrder(record) {
      let temp = JSON.parse(JSON.stringify(record));
      temp.subInv = this.checkedState;
      const params = [temp];
      CreateProcessOrder(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(
            data.message === "OK" ? "生成加工单成功" : data.message
          );
          this.getList();
        } else {
          this.$message.error(data.message ? data.message : "生成加工单失败");
        }
      });
    },
    tenantChange(value, option) {
      this.searchForm.orgId = option.key;
      this.$forceUpdate();
      console.log(this.searchForm);
    },
    searchList() {
      throttle(this.getList());
    },
    handleReset() {
      this.searchForm = {
        orgId: localStorage.getItem("orgId") || "",
        orderDate: "",
        soSno: "",
        customerName: "",
        itemName: "",
        // proLine: "",
        createDateStart: "",
        createDateEnd: "",
        opId: "",
      };
      this.getTenantList();
    },
    handleDateChange(val) {
      this.searchForm.createDateStart = val[0];
      this.searchForm.createDateEnd = val[1];
    },
    getTenantList() {
      GetTenant().then((res) => {
        console.log(res);
        const data = res.data;
        if (data.code === "200") {
          this.tenantList = data.data;
          this.tenantList.forEach((item) => {
            if (item.orgId == this.searchForm.orgId) {
              this.searchForm.opId = item.id;
            }
          });
        } else {
          this.$message.error(data.message ? data.message : "获取主体数据失败");
        }
      });
    },
    onChange(e) {
      this.checkedState = e.target.checked;
      this.checkWatch(this.checkedState);
    },
    expandIcon(props) {
      // console.log(props);
      if (props.record.processOrderDetail.length > 0) {
        if (props.expanded) {
          //有数据-展开时候图标
          return (
            <a
              style="color: 'black',margin-right:0px"
              onClick={(e) => {
                props.onExpand(props.record, e);
              }}
            >
              <a-icon type="down" />{" "}
            </a>
          );
        } else {
          //有数据-未展开时候图标
          return (
            <a
              style="color: 'black' ,margin-right:0px"
              onClick={(e) => {
                props.onExpand(props.record, e);
              }}
            >
              <a-icon type="right" />
            </a>
          );
        }
      } else {
        //无数据-图标
        return (
          <span style="margin-right:0px">
            <a-icon />
          </span>
        );
      }
    },
    handleCancel() {
      this.visible = false;
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
      if (this.processState === 1) {
        GetList(params).then((res) => {
          this.tableLoading = false;
          this.tableData = res.data.rows;
          this.pagination.total = res.data.total;
          this.tableData.forEach((item, index) => {
            item.codeNum = index + 1;
            item.processQty = item.totalOrderQty;
          });
          this.checkWatch(this.checkedState);
        });
      }
      if (this.processState === 2) {
        GetListComplete(params).then((res) => {
          this.tableLoading = false;
          this.tableData = res.data.rows;
          this.pagination.total = res.data.total;
          this.tableData.forEach((item, index) => {
            item.codeNum = index + 1;
          });
        });
      }
      if (this.processState === 3) {
        CancelProcessOrderList(params).then((res) => {
          this.tableLoading = false;
          this.tableData = res.data.rows;
          this.pagination.total = res.data.total;
          this.tableData.forEach((item, index) => {
            item.codeNum = index + 1;
          });
        });
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
  },
  activated() {
    this.getTenantList();
    this.getList();
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
@import "index.less";
</style>