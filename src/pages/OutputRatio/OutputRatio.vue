<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
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
              <a-col :span="6" v-if="isAdmin">
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

              <a-col :span="6">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.piItemName"
                    placeholder="商品名称"
                  >
                  </a-input>
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
    <div class="table-item" style="margin-top: 10px">
      <a-card
        title="数据列表"
        class="card-table"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
        style="margin-top: 20px"
      >
        <a-button type="primary" @click="exportItem" :disabled="!hasPermission('output_ratio_export')">导出</a-button>
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
          <span slot="source" slot-scope="text">
            <a-tag v-if="text == 1">订单</a-tag>
            <a-tag v-if="text == 2">预生产</a-tag>
            <a-tag v-if="text == 3">领料</a-tag>
          </span>
          <a-table
            :columns="innerColumns"
            slot="expandedRowRender"
            slot-scope="record"
            :data-source="record.pickingDetailsDto"
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
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import { throttle } from "../../utils/tool";
import { GetTenant } from "../../services/sortingProcessing/ToBeProcessedOrder";
import {
  GetOutputRatio,
  OutputRatioExport,
} from "../../services/sortingProcessing/SortingProcessingOrder";
const columns = [
  {
    title: "序号",
    dataIndex: "codeNum",
    align: "center",
  },
  {
    title: "分拣日期",
    dataIndex: "createDate",
    align: "center",
  },
  {
    title: "分拣商品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "分拣总数",
    dataIndex: "productNum",
    align: "center",
  },
  {
    title: "来源",
    dataIndex: "source",
    align: "center",
    scopedSlots: { customRender: "source" },
  },
];
const innerColumns = [
  {
    title: "原料商品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "领取数量",
    dataIndex: "preProductionNum",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },

  {
    title: "退料数量",
    dataIndex: "outboundNum",
    align: "center",
  },

  {
    title: "实际用料",
    dataIndex: "sortingNumber",
    align: "center",
  },
  {
    title: "损耗数量",
    dataIndex: "lossNum",
    align: "center",
  },
  {
    title: "产出比率",
    dataIndex: "proportion",
    align: "center",
  },
  {
    title: "损耗率",
    dataIndex: "lossProportion",
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
      innerColumns,
      tableData: [],
      tableDataR: [],
      searchForm: {
        orgId: localStorage.getItem("orgId") || "",
        orderDate: "",
        piItemName: "",
        opId: "",
      },
      tenantList: [],
      exportLoading: false,
    };
  },
  methods: {
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
        piItemName: "",
        opId: "",
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
      if (props.record.pickingDetailsDto.length > 0) {
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
      GetOutputRatio(params).then((res) => {
        this.tableLoading = false;
        const data = res.data;
        this.tableData = data.rows;
        this.pagination.total = data.total;
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((item, index) => {
            item.codeNum = index + 1;
            if (item.pickingDetailsDto && item.pickingDetailsDto.length > 0) {
              item.pickingDetailsDto.forEach((k) => {
                k.proportion = 1 - k.lossProportion;
              });
            }
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
    exportItem() {
      const params = { ...this.searchForm };
      this.exportLoading = true;
      OutputRatioExport(params).then((res) => {
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
      link.setAttribute("download", "产出比率表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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