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
                v-model="searchform.taxRateRuleName"
                placeholder="税率规则名称"
              >
              </a-input>
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
      >
        <span slot="matched" slot-scope="text, record">
          <div v-if="record.matched">已选择</div>
        </span>
        <span slot="operation" slot-scope="record">
          <a-button type="link" @click="choose(record)"> 选择 </a-button>
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
import {
  taxrateGetPageList,
  taxratePartnerConfigurationRules,
} from "../../services/rate";
import { formatDate } from "../../utils/util";
import { tenantQuery } from "../../services/roleMa";
export default {
  mixins: [mixin],
  name: "chooseRateList",
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === "true",
      tableLoading: false,
      searchform: {
        state: 1,
        type: null,
        itemModel: "",
        taxRateRuleName: "",
      },
      partner: {},
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
          width: 150,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "stateName",
          width: 150,
          align: "center",
        },
        {
          title: "匹配",
          dataIndex: "matched",
          width: 150,
          align: "center",
          scopedSlots: { customRender: "matched" },
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
          width: 150,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
      orgData: [],
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
    choose(row) {
      const params = {
        taxrateId: row.id,
        taxRateRuleName: row.taxRateRuleName,
        ...this.partner,
      };
      taxratePartnerConfigurationRules(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success("配置成功！");
          this.getTableList();
        } else {
          this.$message.error("配置失败！");
        }
      });
    },
    search() {
      this.pagination.pageIndex = 1;
      this.getTableList();
    },
    clearSearch() {
      this.searchform = {
        state: 1,
        type: this.$route.query.type,
        itemModel: "",
        taxRateRuleName: "",
      };
    },
    getTableList() {
      const params = {
        order: this.pagination.direction,
        sort: this.pagination.sortName,
        rows: this.pagination.pageSize,
        page: this.pagination.pageIndex,
        partnerId: this.partner.partnerId,
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
    if (Object.keys(this.$route.query).length) {
      this.searchform.type = this.$route.query.type;
      this.partner = this.$route.query.partner;
    }
    this.getTableList();
    this.getopSubjectGetLoginInfo();
  },
};
</script>


<style scoped lang="less">
@import "index.less";
</style>