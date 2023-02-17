<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="specs-top">
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
                      v-model.trim="searchForm.specCode"
                      placeholder="规格编码"
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
                      <a-button type="primary" @click="handleSearch"
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
          title="数据列表"
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div class="new-add" style="margin-top: 10px">
            <a-button
              type="primary"
              @click="toAddSpec"
              :disabled="!hasPermission('itemSpec_add')"
              >新增规格</a-button
            >
          </div>
          <a-table
            :columns="columns"
            :data-source="tableList"
            rowKey="id"
            :pagination="false"
            style="margin-top: 10px"
            size="middle"
            :loading="tableLoading"
          >
            <template slot="opreation" slot-scope="text, record">
              <a-button
                type="link"
                @click="specDetails(record)"
                :disabled="!hasPermission('itemSpecChild_list')"
                >规格明细</a-button
              >
              <a-button
                type="link"
                @click="editSpec(record)"
                :disabled="!hasPermission('itemSpec_add')"
                >编辑</a-button
              >
              <!-- <a-button type="link" @click="specDetele(record)">删除</a-button> -->
              <a-popconfirm
                title="确定删除此规格?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="specDetele(record)"
                :disabled="!hasPermission('item_spec_delete')"
              >
                <a-button
                  type="link"
                  :disabled="!hasPermission('item_spec_delete')"
                  >删除</a-button
                >
              </a-popconfirm>
            </template>
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
        </a-card>
      </div>
    </div>
    <spec-edit ref="specEdit"></spec-edit>
    <spec-details ref="specDetails"></spec-details>
  </div>
</template>

<script>
import {
  GetList,
  SpecDelete,
} from "../../services/product/ProductSpecifications";
import { debounce } from "../../utils/tool";
import { mapState } from "vuex";
import SpecEdit from "./specEdit.vue";
import SpecDetails from "./specDetails.vue";
export default {
  name: "ProductSpecifications",
  components: { SpecEdit, SpecDetails },
  data() {
    return {
      tipText: "数据加载中",
      tableLoading: false,
      columns: [
        {
          align: "center",
          title: "编码",
          dataIndex: "specCode",
        },
        {
          align: "center",
          title: "名称",
          dataIndex: "specName",
        },
        {
          align: "center",
          title: "转换数量",
          dataIndex: "amount",
        },
        {
          align: "center",
          title: "转换单位",
          dataIndex: "defUom",
        },
        {
          align: "center",
          title: "描述",
          dataIndex: "description",
        },
        {
          align: "center",
          title: "操作",
          dataIndex: "opreation",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "desc",
      },
      tableList: [],
      searchForm: {
        specCode: "",
      },
    };
  },
  activated() {
    this.getTableList();
  },
  methods: {
    specDetele(record) {
      SpecDelete({ id: record.id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(data.message);
          this.getTableList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    editSpec(record) {
      console.log(record);
      this.$refs.specEdit.openModal("规格编辑", record);
    },
    toAddSpec() {
      this.$refs.specEdit.openModal("规格新增", "");
    },
    handleReset() {
      // this.pagination.page=1
      this.searchForm = {
        specCode: "",
      };
    },
    handleSearch() {
      debounce(this.getTableList());
    },
    //列表数据
    getTableList() {
      let temp = JSON.parse(JSON.stringify(this.pagination));
      delete temp.total;
      const params = {
        ...temp,
        ...this.searchForm,
      };
      this.tableLoading = true;
      GetList(params).then((res) => {
        this.tableLoading = false;
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
      });
    },
    //规格明细
    specDetails(record) {
      this.$refs.specDetails.openModal(record);
    },
    //分页
    pageChange(index) {
      this.pagination.page = index;
      this.getTableList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.page = 1;
      this.pagination.rows = pageSize;
      this.getTableList();
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
@import "index";
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>