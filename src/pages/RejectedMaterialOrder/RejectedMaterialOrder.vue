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
              <a-col :span="4">
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
                  <a-select v-model="searchForm.state" placeholder="审核状态">
                    <a-select-option value="1">待审核</a-select-option>
                    <a-select-option value="2">已审核</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-input
                    v-model.trim="searchForm.piItemName"
                    placeholder="商品名称"
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
        <a-spin :tip="spinText" :spinning="spinning">
          <a-table
            :columns="columns"
            :data-source="tableData"
            rowKey="id"
            :pagination="false"
            style="margin-top: 10px"
            size="middle"
          >
            <div slot="opreation" slot-scope="text, record">
              <a-button
                type="link"
                @click="toDetails(record)"
                :disabled="!hasPermission('rejected_material_order_details')"
                >详情</a-button
              >
              <a-popconfirm
                title="确定审核这条数据吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="toAudit(record)"
                :disabled="!hasPermission('rejected_material_order_audit')"
              >
                <a-button
                  type="link"
                  v-if="record.state === 1"
                  :disabled="!hasPermission('rejected_material_order_audit')"
                  >审核</a-button
                >
              </a-popconfirm>

              <a-button
                type="link"
                @click="toDetails(record, 'print')"
                :disabled="!hasPermission('rejected_material_order_print')"
                >打印</a-button
              >
              <a-button
                type="link"
                @click="exportItem(record)"
                :disabled="!hasPermission('rejected_material_order_export')"
                >导出</a-button
              >
              <a-popconfirm
                title="确定删除这条数据吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="toDelete(record.id)"
                :disabled="!hasPermission('rejected_material_order_delete')"
              >
                <a-button
                  type="link"
                  :disabled="!hasPermission('rejected_material_order_delete')"
                  >删除</a-button
                >
              </a-popconfirm>
            </div>
          </a-table>
        </a-spin>
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
    <Details ref="details" />
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
  ExportData,
  AuditItems,
} from "../../services/sortingProcessing/RejectedMaterialOrder";
import Details from "./details.vue";
const columns = [
  // {
  //   title: "序号",
  //   dataIndex: "codeNum",
  //   align: "center",
  // },
  {
    title: "退料单号",
    dataIndex: "outboundNo",
    align: "center",
  },
  {
    title: "退料时间",
    dataIndex: "createDate",
    align: "center",
  },
  {
    title: "分拣加工单",
    dataIndex: "sortingprocessingNumber",
    align: "center",
  },

  // {
  //   title: "退料仓库",
  //   dataIndex: "processQty",
  //   align: "center",
  // },
  {
    title: "退料人员",
    dataIndex: "pickingUserName",
    align: "center",
  },
  {
    title: "审核人",
    dataIndex: "pickingMakeUserName",
    align: "center",
  },
  {
    title: "审核时间",
    dataIndex: "updateDate",
    align: "center",
  },
  // {
  //   title: "创建时间",
  //   dataIndex: "proLine",
  //   align: "center",
  // },
  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    scopedSlots: { customRender: "opreation" },
    width: 350,
    fixed: "right",
  },
];
export default {
  mixins: [mixin],
  components: { Details },
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === "true",
      visible: false,
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "DESC",
      },
      columns,
      tableData: [],
      searchForm: {
        orgId: localStorage.getItem("orgId") || "",
        orderDate: "",
        piItemName: "",
        opId: "",
      },
      tenantList: [],
      checkedState: false,
      spinning: false,
      spinText: "",
    };
  },
  methods: {
    toAudit(record) {
      this.spinText = "审核中";
      const params = { outboundNo: record.outboundNo };
      this.spinning = true;
      AuditItems(params).then((res) => {
        this.spinning = false;
        const data = res.data;
        if (data.code == 200) {
          this.$message.success(data.message);
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    exportItem(record) {
      const params = { piHeadNo: record.outboundNo };
      this.spinText = "导出中";
      this.spinning = true;
      ExportData(params).then((res) => {
        console.log(res);
        const data = res.data;
        this.spinning = false;
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
      link.setAttribute("download", "退料单");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    toDelete(id) {
      DelItems({ id: id }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.$message.success(data.message);
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    toDetails(record, state) {
      console.log(record);
      this.$refs.details.showDetailModal(record, state);
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
        piItemName: "",
        opId: "",
        beginTime: "",
        endTime: "",
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
      this.spinText = "数据加载中";
      this.spinning = true;
      GetList(params).then((res) => {
        this.spinning = false;
        this.tableData = res.data.rows;
        this.pagination.total = res.data.total;
        // if (this.tableData && this.tableData.length > 0) {
        //   this.tableData.forEach((item, index) => {
        //     item.codeNum = index + 1;
        //   });
        // }
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