<template>
  <div class="new-page">
    <!-- 搜索 -->
    <div class="search">
      <a-form :form="searchform">
        <a-row :gutter="16">
          <a-col :span="4">
            <a-form-item>
              <a-input v-model.trim="searchform.whName" placeholder="仓库名称">
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
    <div class="btns">
      <a-button-group>
        <a-button
          type="primary"
          icon="plus"
          @click="Add"
          :disabled="!hasPermission('warehouse_add')"
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
            @click="edit(record)"
            :disabled="!hasPermission('warehouse_edit')"
          >
            编辑
          </a-button>
          <a-popconfirm
            title="确定要删除此数据吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteWH(record)"
            @cancel="cancel"
            :disabled="!hasPermission('warehouse_del')"
          >
            <a-button type="link" :disabled="!hasPermission('warehouse_del')">
              删除
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
    <add-wareHouse ref="addWareHouse"></add-wareHouse>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import {
  warehouseListByWarehouseDto,
  warehouseDelete,
} from "../../services/warehouse";
import { formatDate } from "../../utils/util";
import addWareHouse from "./addWareHouse.vue";
export default {
  mixins: [mixin],
  name: "warehouseList",
  components: {
    addWareHouse,
  },
  data() {
    return {
      tableLoading: false,
      searchform: {
        whName: "",
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
          title: "编号",
          dataIndex: "id",
          width: 150,
          align: "center",
        },
        {
          title: "运营主体编号",
          dataIndex: "opCode",
          width: 150,
          align: "center",
        },
        {
          title: "运营主体名称",
          dataIndex: "itemNumber",
          width: 150,
          align: "center",
        },
        {
          title: "仓库编号",
          dataIndex: "whCode",
          width: 150,
          align: "center",
        },
        {
          title: "仓库名称",
          dataIndex: "whName",
          width: 150,
          align: "center",
        },
        {
          title: "联系人",
          dataIndex: "contactName",
          width: 150,
          align: "center",
        },
        {
          title: "联系电话",
          dataIndex: "contactPhone",
          width: 150,
          align: "center",
        },
        {
          title: "地址信息",
          dataIndex: "address",
          width: 150,
          align: "center",
        },
        {
          title: "添加时间",
          dataIndex: "createDate",
          width: 200,
          align: "center",
        },
        {
          title: "操作",
          key: "operation",
          width: 200,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
    };
  },
  methods: {
    deleteWH(row) {
      const params = {
        id: row.id,
      };
      warehouseDelete(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success("删除成功！");
          this.getTableList();
        } else {
          this.$message.error("删除失败！");
        }
      });
    },
    cancel() {
      this.$message.error("取消");
    },
    edit(row) {
      this.$refs.addWareHouse.openModal("edit", JSON.stringify(row));
    },
    Add() {
      this.$refs.addWareHouse.openModal("add");
    },
    search() {
      this.pagination.pageIndex = 1;
      this.getTableList();
    },
    clearSearch() {
      this.searchform = {
        whName: "",
      };
    },
    getTableList() {
      const params = {
        rows: this.pagination.pageSize,
        page: this.pagination.pageIndex,
        sort: "id",
        order: "DESC",
        ...this.searchform,
      };
      this.tableLoading = true;
      warehouseListByWarehouseDto(params).then((res) => {
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
  },
};
</script>


<style scoped lang="less">
@import "index.less";
</style>