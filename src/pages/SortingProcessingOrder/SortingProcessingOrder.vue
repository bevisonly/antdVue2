<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="type-choose">
      <a-radio-group
        v-model="processState"
        button-style="solid"
        size="large"
        @change="processStateChange"
      >
        <a-radio-button :value="0"> 待加工单 </a-radio-button>
        <a-radio-button :value="1"> 已加工单 </a-radio-button>
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
              <a-col :span="4" v-if="isAdmin">
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
              <a-col :span="8">
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

              <a-col :span="4">
                <a-form-item>
                  <a-select v-model="searchForm.piState" placeholder="领料状态">
                    <a-select-option :value="1">未领料</a-select-option>
                    <a-select-option :value="2">已领料</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.piItemName"
                    placeholder="加工商品名称"
                  >
                  </a-input>
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
    <div class="table-item" style="margin-top: 10px">
      <a-card
        title="数据列表"
        class="card-table"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
        style="margin-top: 20px"
      >
        <div class="opreation-item">
          <a-button-group>
            <a-button
              type="primary"
              @click="orderAdd"
              v-if="processState == 0"
              :disabled="!hasPermission('sorting_processing_order_add')"
              >新增预加工单</a-button
            >
            <!-- <a-button type="primary">打印</a-button>
            <a-button type="primary">导出</a-button>
            <a-button type="primary" v-if="processState == 0">导入</a-button> -->
          </a-button-group>
        </div>
        <a-table
          :columns="columns"
          :data-source="tableData"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          :expandIcon="expandIcon"
          style="margin-top: 10px"
          size="middle"
        >
          <!-- :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }" -->
          <div slot="source" slot-scope="text">
            <a-tag v-if="text === 1">订单</a-tag>
            <a-tag v-if="text === 2">预生产</a-tag>
            <a-tag v-if="text === 3">领料</a-tag>
          </div>
          <div slot="opreation" slot-scope="text, record">
            <a-button
              type="link"
              @click="showDetails(record.id)"
              :disabled="
                !hasPermission(
                  'sorting_processing_order_details' ||
                    'sorting_processing_order_details_2'
                )
              "
              >详情</a-button
            >
            <a-button
              type="link"
              v-if="processState == 0"
              @click="toComplete(record)"
              :disabled="!hasPermission('sorting_processing_order_finished')"
              >分拣完成</a-button
            >
            <a-button
              type="link"
              v-if="processState == 1"
              @click="toCompleteEdit(record)"
              :disabled="!hasPermission('sorting_processing_order_edited')"
              >编辑</a-button
            >
            <a-button
              type="link"
              v-if="processState == 0"
              @click="orderEdit(record)"
              :disabled="!hasPermission('sorting_processing_order_edit')"
              >编辑</a-button
            >

            <a-popconfirm
              title="确定删除此单?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmDelete(record.id)"
              v-if="processState == 0"
              :disabled="!hasPermission('sorting_processing_order_delete')"
            >
              <a-button type="link" v-if="processState == 0">删除</a-button>
            </a-popconfirm>
          </div>
          <a-table
            :columns="innerColumns"
            slot="expandedRowRender"
            slot-scope="record"
            :data-source="record.pickingDetails"
            rowKey="id"
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
    <SortingDetails ref="sortingDetails" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import { throttle } from "../../utils/tool";
import { GetTenant } from "../../services/sortingProcessing/ToBeProcessedOrder";
import {
  GetList,
  DelItems,
} from "../../services/sortingProcessing/SortingProcessingOrder";
import SortingDetails from "./SortingDetails.vue";
const columns = [
  {
    title: "序号",
    dataIndex: "codeNum",
    align: "center",
  },
  {
    title: "分拣加工单号",
    dataIndex: "number",
    align: "center",
  },
  {
    title: "加工数量",
    dataIndex: "processNum",
    align: "center",
  },
  {
    title: "来源",
    dataIndex: "source",
    align: "center",
    scopedSlots: { customRender: "source" },
  },
  // {
  //   title: "备注",
  //   dataIndex: "mark",
  //   align: "center",
  //   scopedSlots: { customRender: "mark" },
  // },
  {
    title: "创建时间",
    dataIndex: "createDate",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    scopedSlots: { customRender: "opreation" },
  },
];
const innerColumns = [
  {
    title: "加工商品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "加工数量",
    dataIndex: "sortingNumber",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },

  {
    title: "生成加工人员",
    dataIndex: "workers",
    align: "center",
  },

  {
    title: "状态",
    dataIndex: "piItemPickstateDesc",
    align: "center",
  },
];

export default {
  mixins: [mixin],
  components: { SortingDetails },
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
        sort: "id",
        order: "DESC",
      },
      columns,
      innerColumns,
      tableData: [],
      tableDataR: [],
      searchForm: {
        orgId: localStorage.getItem("orgId") || "",
        orderDate: "",
        opId: "",
        piState: undefined,
        piItemName: "",
      },
      tenantList: [],
      checkedState: false,
      selectedRowKeys: [],
      selectedRows: [],
      processState: 0,
    };
  },
  methods: {
    confirmDelete(id) {
      DelItems({ id: id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(data.message);
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    showDetails(id) {
      this.$refs.sortingDetails.showModal(id);
    },
    orderAdd() {
      this.$router.push({
        path: "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
        query: { state: "add", record: "" },
      });
    },
    orderEdit(record) {
      this.$router.push({
        path: "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
        query: { state: "edit", record: record },
      });
    },
    toComplete(record) {
      this.$router.push({
        path: "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
        query: { state: "complete", record: record },
      });
    },
    toCompleteEdit(record) {
      this.$router.push({
        path: "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
        query: { state: "complete-edit", record: record },
      });
    },
    processStateChange() {
      this.getList();
    },

    // onSelectChange(selectedRowKeys, selectedRows) {
    //   console.log(selectedRows);
    //   console.log(selectedRowKeys);
    //   this.selectedRowKeys = selectedRowKeys;
    //   this.selectedRows = selectedRows;
    // },

    tenantChange(value, option) {
      console.log(value);
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
        opId: "",
        piState: undefined,
        piItemName: "",
      };
      this.getTenantList();
    },
    handleDateChange(val) {
      this.searchForm.beginTime = val[0];
      this.searchForm.endTime = val[1];
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
    expandIcon(props) {
      // console.log(props);
      if (props.record.pickingDetails.length > 0) {
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
        state: this.processState,
        ...temp,
        ...tempS,
      };
      this.tableLoading = true;
      GetList(params).then((res) => {
        this.tableLoading = false;
        this.tableData = res.data.data;
        this.pagination.total = res.data.totalNum;
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((item, index) => {
            item.codeNum = index + 1;
          });
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