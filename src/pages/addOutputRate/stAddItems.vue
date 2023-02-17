<template>
  <!-- 选择商品 -->
  <a-modal
    title="选择商品"
    :visible="itemsVisible"
    :width="750"
    @cancel="handleCancelItems"
    :dialogStyle="{
      top: '160px',
    }"
    destroyOnClose
  >
    <div class="details">
      <div class="search">
        <a-form :form="itemsSearch">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item>
                <a-input v-model="itemsSearch.itemCode" placeholder="商品编号">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input v-model="itemsSearch.likeItemName" placeholder="名称">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model="itemsSearch.NameKeywords"
                  placeholder="名称批量检索(用,隔开)"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-row>
                  <a-col :span="12">
                    <a-button type="primary" @click="clearSearch"
                      >清 空</a-button
                    >
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" @click="search">查 询</a-button>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table">
        <p class="table-title">商品信息</p>
        <div class="table-data">
          <a-table
            :loading="addItemsLoading"
            rowKey="id"
            :pagination="false"
            :columns="itemsColumns"
            :data-source="ItemData"
            :scroll="{ y: 200, x: 500 }"
            :row-selection="{
              columnWidth: 50,
              onChange: rowSelectionChange,
              selectedRowKeys: selectedRowKeys,
            }"
            :customRow="handleCustomRow"
          >
          </a-table>
        </div>
      </div>
      <div class="pagination">
        <a-pagination
          :page-size-options="['10', '20', '30', '40', '50']"
          :total="itemsPagination.total"
          show-size-changer
          :page-size="itemsPagination.pageSize"
          :current="itemsPagination.pageIndex"
          :show-total="(total) => `共 ${total} 条记录`"
          @change="pageIndexChange"
          @showSizeChange="pageSizeChange"
        >
        </a-pagination>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="handleCancelItems"> 取消 </a-button>
      <a-button type="primary" @click="handleSubmitItems"> 确定 </a-button>
    </template>
  </a-modal>
</template>
<script>
import { componentGetItems } from "../../services/sales";
export default {
  name: "stAddItems",
  data() {
    return {
      itemsSearch: {
        resource: 0,
        itemCode: "",
        likeItemName: "",
        NameKeywords: "",
      },
      itemsPagination: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        direction: "",
        sortName: "",
      },
      itemsVisible: false,
      tableProductLoading: false,
      itemsColumns: [
        {
          title: "商品编码",
          dataIndex: "itemCode",
          width: 150,
          align: "center",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 100,
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "spec",
          width: 100,
          align: "center",
        },
      ],
      ItemData: [],
      addItemsLoading: false,
      rowSelectionChangeData: [],
      selectedRowKeys: [],
    };
  },
  methods: {
    handleCancelItems() {
      this.clearSearch();
      this.itemsVisible = false;
    },
    handleSubmitItems() {
      this.$parent.getItems(this.rowSelectionChangeData);
    },
    pageIndexChange(index) {
      this.itemsPagination.pageIndex = index;
      this.getItemList();
    },
    pageSizeChange(index, pageSize) {
      this.itemsPagination.pageIndex = 1;
      this.itemsPagination.pageSize = pageSize;
      this.getItemList();
    },
    clearSearch() {
      this.itemsSearch = {
        resource: 0,
        itemCode: "",
        likeItemName: "",
        NameKeywords: "",
      };
    },
    search() {
      this.itemsPagination.pageIndex = 1;
      this.getItemList();
    },
    openPrudoct() {
      this.selectedRowKeys = [];
      this.rowSelectionChangeData = [];
      this.itemsVisible = true;
      this.getItemList();
    },
    rowSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.rowSelectionChangeData = selectedRows;
    },
    handleCustomRow(row) {
      return {
        on: {
          click: () => {
            let rowKeys = this.selectedRowKeys;
            let rowdata = this.rowSelectionChangeData;
            if (rowKeys.length > 0 && rowKeys.includes(row.id)) {
              rowKeys.splice(rowKeys.indexOf(row.id), 1);
              rowdata.splice(rowKeys.indexOf(row.id), 1);
            } else {
              rowKeys.push(row.id);
              rowdata.push(row);
            }
            this.selectedRowKeys = rowKeys;
            this.rowSelectionChangeData = rowdata;
          },
        },
      };
    },
    getItemList() {
      let searchStr = this.itemsSearch.NameKeywords.replace(/，/gi, ","); //如果有中文逗号，就转为英文逗号
      const params = {
        likeItemName: this.itemsSearch.likeItemName,
        NameKeywords: searchStr.split(","),
        itemCode: this.itemsSearch.itemCode,
        customerId: this.customerId,
        orderDate: this.orderDate,
        rows: this.itemsPagination.pageSize,
        page: this.itemsPagination.pageIndex,
        sort: "id",
        order: "DESC",
      };
      this.addItemsLoading = true;
      componentGetItems(params).then((res) => {
        this.addItemsLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.itemsVisible = true;
          this.ItemData = data.data;
          this.itemsPagination.total = data.totalNum;
        } else {
          this.$message.error(data.message);
        }
      });
    },
  },
  created() {
    this.$nextTick(() => {});
  },
};
</script>
<style lang="less" scoped>
.details {
  .info {
    margin-bottom: 10px;
    .info-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
  }
  /deep/.ant-form-item-label {
    line-height: 22px;
  }
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
  .table {
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    .table-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
    .table-data {
      padding: 10px;
      .table-formva::before {
        display: inline-block;
        color: #f5222d;
        font-size: 14px;
        line-height: 1;
        content: "*";
      }
    }
    .table-total {
      margin-bottom: 0;
      padding: 0 20px;
      line-height: 35px;
    }
  }
  .search {
    padding-bottom: 8px;
  }
  .pagination {
    padding-top: 8px;
    text-align: right;
  }
}
</style>