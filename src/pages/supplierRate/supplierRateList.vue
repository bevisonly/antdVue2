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
                v-model.trim="searchform.partnerName"
                placeholder="供应商名称"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-select v-model="searchform.type" allowClear placeholder="状态">
                <a-select-option :value="1"> 未匹配 </a-select-option>
                <a-select-option :value="2"> 已匹配 </a-select-option>
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
            @click="toChose(record)"
            :disabled="!hasPermission('supplier_rate_configuration_rules')"
          >
            配置规则
          </a-button>
          <a-popconfirm
            :disabled="!hasPermission('supplier_rate_cancel_match')"
            title="确定要取消匹配数据的规则吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteRule(record)"
            @cancel="cancel"
          >
            <a-button
              type="link"
              :disabled="!hasPermission('supplier_rate_cancel_match')"
            >
              取消匹配
            </a-button>
          </a-popconfirm>
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
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { formatDate } from "../../utils/util";
import {
  taxratePartnerGetPartnerList,
  taxratePartnerDeleteRules,
} from "../../services/rate";
import { tenantQuery } from "../../services/roleMa";
export default {
  mixins: [mixin],
  name: "supplierRateList",
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === "true",
      orgData: [],
      tableLoading: false,
      searchform: {
        partnerName: "",
        type: undefined,
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
          title: "供应商名称",
          dataIndex: "partnerName",
          width: 200,
          align: "center",
        },
        {
          title: "供应商编码",
          dataIndex: "partnerCode",
          width: 150,
          align: "center",
        },
        {
          title: "客户类型",
          dataIndex: "partnerTypeName",
          width: 100,
          align: "center",
        },
        {
          title: "运营主体",
          dataIndex: "opName",
          width: 200,
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createDate",
          width: 150,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "typeName",
          width: 100,
          align: "center",
        },
        {
          title: "税率规则名称",
          dataIndex: "taxRateRuleName",
          width: 200,
          align: "center",
        },
        {
          title: "操作",
          key: "operation",
          width: 240,
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
    cancel() {
      this.$message.error("取消");
    },
    deleteRule(row) {
      const params = {
        id: row.id,
      };
      taxratePartnerDeleteRules(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success("取消匹配成功！");
          this.getTableList();
        } else {
          this.$message.error("取消匹配失败！");
        }
      });
    },
    toChose(row) {
      this.$router.push({
        path: "/basicDataManagement/rate/chooseRate",
        query: {
          partner: {
            partnerId: row.id,
            partnerCode: row.partnerCode,
            partnerName: row.partnerName,
          },
          type: 1,
        },
      });
    },
    search() {
      this.pagination.pageIndex = 1;
      this.getTableList();
    },
    clearSearch() {
      this.searchform = {
        type: undefined,
        partnerName: "",
        orgId: localStorage.getItem("orgId")
          ? parseInt(localStorage.getItem("orgId"))
          : undefined,
      };
    },
    getTableList() {
      const params = {
        order: "DESC",
        sort: "id",
        rows: this.pagination.pageSize,
        page: this.pagination.pageIndex,
        partnerType: 30,
        ...this.searchform,
      };
      this.tableLoading = true;
      taxratePartnerGetPartnerList(params).then((res) => {
        this.tableLoading = false;
        const data = res.data;
        if (data.code === "200") {
          this.tableData = data.data;
          this.pagination.total = data.totalNum;
          this.tableData.forEach((item) => {
            switch (item.type) {
              case 1:
                item.typeName = "未匹配";
                break;
              case 2:
                item.typeName = "已匹配";
                break;
            }
            switch (item.partnerType) {
              case 20:
                item.partnerTypeName = "客户";
                break;
              case 30:
                item.partnerTypeName = "供应商";
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
    this.getopSubjectGetLoginInfo();
    this.getTableList();
  },
};
</script>


<style scoped lang="less">
@import "index.less";
</style>