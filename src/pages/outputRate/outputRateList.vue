<template>
  <div class="new-page">
    <!-- 搜索 -->
    <div class="search">
      <a-form :form="searchform">
        <a-row :gutter="16">
          <a-col :span="4" v-if="isAdmin">
            <a-form-item>
              <a-select
                allowClear
                v-model="searchform.orgId"
                placeholder="所属运营主体"
              >
                <a-select-option
                  :value="item.orgId"
                  v-for="item in orgData"
                  :key="item.orgId"
                >
                  {{ item.opName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-input
                v-model.trim="searchform.taxRateRuleName"
                placeholder="税率规则名称"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-select
                allowClear
                v-model="searchform.state"
                placeholder="请选择状态"
              >
                <a-select-option :value="1"> 已生效 </a-select-option>
                <a-select-option :value="2"> 已关闭 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="clearSearch" icon="sync"
                  >清 空</a-button
                >
                <a-button type="primary" @click="search" icon="search"
                  >查 询</a-button
                >
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 按钮 -->
    <div class="btns">
      <a-button-group>
        <a-button
          type="primary"
          icon="plus"
          @click="toAdd"
          :disabled="!hasPermission('output_rate_insert')"
        >
          新增
        </a-button>
      </a-button-group>
    </div>
    <!-- 表格 -->
    <div class="data-table" ref="dataTable">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ y: tableYHeight, x: 1200 }"
        rowKey="id"
        :row-selection="{
          columnWidth: 50,
        }"
      >
        <span slot="operation" slot-scope="record">
          <a-button
            type="link"
            @click="details(record)"
            :disabled="!hasPermission('output_rate_details')"
          >
            详情
          </a-button>
          <a-button
            type="link"
            @click="seeCustomer(record)"
            :disabled="!hasPermission('output_rate_view_customers')"
          >
            查看客户
          </a-button>
          <a-button
            type="link"
            @click="edit(record)"
            :disabled="!hasPermission('output_rate_edit')"
          >
            编辑
          </a-button>
          <a-button
            type="link"
            @click="close(record)"
            :disabled="!hasPermission('output_rate_close')"
          >
            {{ record.state === 1 ? "关闭" : "开启" }}
          </a-button>
        </span>
      </a-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <a-pagination
        :page-size-options="['10', '20', '30', '40', '50']"
        :total="pagination.total"
        show-size-changer
        :page-size="pagination.pageSize"
        show-quick-jumper
        :current="pagination.pageIndex"
        :show-total="(total) => `共 ${total} 条记录`"
        @change="pageIndexChange"
        @showSizeChange="pageSizeChange"
      >
      </a-pagination>
    </div>
    <!-- 客户列表弹窗 -->
    <a-modal
      title="客户列表"
      :visible="modalVisible"
      :width="800"
      @cancel="handleCancel"
      destroyOnClose
    >
      <!--  -->
      <div class="modal-table">
        <a-table
          :columns="modalColumns"
          :data-source="modalTableData"
          :pagination="false"
          :scroll="{ y: 500 }"
          rowKey="id"
        >
        </a-table>
      </div>
      <template slot="footer">
        <a-button @click="handleCancel"> 取消 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import {
  taxrateGetPageList,
  taxrateGetPartner,
  taxrateClose,
  taxrateActivate,
} from "../../services/rate";
import { tenantQuery } from "../../services/roleMa";
import { formatDate } from "../../utils/util";
export default {
  mixins: [mixin],
  name: "outputRateList",
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === "true",
      orgData: [],
      modalColumns: [
        {
          title: "客户名称",
          dataIndex: "partnerName",
          width: 150,
          align: "center",
        },
        {
          title: "地址",
          dataIndex: "address",
          width: 200,
          align: "center",
        },
        {
          title: "电话",
          dataIndex: "contactPhone",
          width: 150,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 200,
          align: "center",
        },
      ],
      modalTableData: [],
      modalVisible: false,
      tableLoading: false,
      searchform: {
        state: undefined,
        type: 2,
        itemModel: "",
        taxRateRuleName: "",
        orgId: localStorage.getItem("orgId")
          ? parseInt(localStorage.getItem("orgId"))
          : undefined,
      },
      pagination: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        direction: "DESC",
        sortName: "id",
      },
      tableData: [],
      columns: [
        {
          title: "税率规则名称",
          dataIndex: "taxRateRuleName",
          width: 200,
          align: "center",
        },
        {
          title: "客户数",
          dataIndex: "customerNumber",
          width: 150,
          align: "center",
        },
        {
          title: "商品数",
          dataIndex: "itemNumber",
          width: 150,
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createUser",
          width: 200,
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createDate",
          width: 200,
          align: "center",
        },
        {
          title: "商品模式",
          dataIndex: "itemModelName",
          width: 200,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "stateName",
          width: 150,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 250,
          align: "center",
        },
        {
          title: "操作",
          key: "operation",
          width: 320,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
    };
  },
  methods: {
    getopSubjectGetLoginInfo() {
      tenantQuery().then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.orgData = data.data;
        } else {
          this.$message.error("获取数据失败！");
        }
      });
    },
    close(row) {
      const params = {
        id: row.id,
      };
      if (row.state === 1) {
        taxrateClose(params).then((res) => {
          const data = res.data;
          if (data.code === "200") {
            this.$message.success("关闭成功！");
            this.getTableList();
          } else {
            this.$message.error("获取数据失败！");
          }
        });
      } else if (row.state === 2) {
        taxrateActivate(params).then((res) => {
          const data = res.data;
          if (data.code === "200") {
            this.$message.success("开启成功！");
            this.getTableList();
          } else {
            this.$message.error("获取数据失败！");
          }
        });
      }
    },
    handleCancel() {
      this.modalVisible = false;
    },
    seeCustomer(row) {
      const params = {
        id: row.id,
      };
      taxrateGetPartner(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.modalTableData = data.data;
          this.modalVisible = true;
        } else {
          this.$message.error("获取数据失败！");
        }
      });
    },
    details(row) {
      this.$router.push({
        path: "/basicDataManagement/rate/addOutputRate",
        query: {
          type: 2,
          pageState: "details",
          id: row.id,
        },
      });
    },
    edit(row) {
      this.$router.push({
        path: "/basicDataManagement/rate/addOutputRate",
        query: {
          type: 2,
          pageState: "edit",
          id: row.id,
        },
      });
    },
    toAdd() {
      this.$router.push({
        path: "/basicDataManagement/rate/addOutputRate",
        query: {
          type: 2,
          pageState: "add",
          id: "",
        },
      });
    },
    search() {
      this.pagination.pageIndex = 1;
      this.getTableList();
    },
    clearSearch() {
      this.searchform = {
        state: undefined,
        type: 2,
        itemModel: "",
        taxRateRuleName: "",
        orgId: localStorage.getItem("orgId")
          ? parseInt(localStorage.getItem("orgId"))
          : undefined,
      };
    },
    getTableList() {
      const params = {
        order: this.pagination.direction,
        sort: this.pagination.sortName,
        rows: this.pagination.pageSize,
        page: this.pagination.pageIndex,
        ...this.searchform,
      };
      this.tableLoading = true;
      taxrateGetPageList(params).then((res) => {
        this.tableLoading = false;
        const data = res.data;
        if (data.code === "200") {
          this.tableData = data.data;
          this.pagination.total = data.totalNum;
          this.tableData.forEach((item) => {
            switch (item.state) {
              case 1:
                item.stateName = "已生效";
                break;
              case 2:
                item.stateName = "已关闭";
                break;
            }
            switch (item.itemModel) {
              case 1:
                item.itemModelName = "自定义商品";
                break;
              case 2:
                item.itemModelName = "商品类型";
                break;
            }
            item.createDate = formatDate(
              new Date(item.createDate),
              "yyyy-MM-dd hh:mm:ss"
            );
          });
        } else {
          this.$message.error("获取数据失败！");
        }
      });
    },

    //分页
    pageIndexChange(index) {
      this.pagination.pageIndex = index;
      this.getTableList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = pageSize;
      this.getTableList();
    },
  },
  computed: {},
  activated() {
    this.getTableList();
    this.getopSubjectGetLoginInfo();
  },
};
</script>


<style scoped lang="less">
@import "index.less";
</style>