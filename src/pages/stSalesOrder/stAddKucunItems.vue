<template>
  <!-- 选择商品 -->
  <a-modal
    class="modalTop"
    title="选择库存货品"
    :visible="itemsVisible"
    :width="1000"
    @cancel="handleCancelItems"
    :dialogStyle="{
      top: '30px',
    }"
    destroyOnClose
    :maskClosable="false"
  >
    <div class="details">
      <div class="search">
        <a-form :form="itemsSearch">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model.trim="itemsSearch.itemCode"
                  placeholder="商品编号"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input v-model.trim="itemsSearch.itemName" placeholder="名称">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model.trim="itemsSearch.itemVarieties"
                  placeholder="品种"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input
                  v-model.trim="itemsSearch.containerCode"
                  placeholder="柜号"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item>
                <a-input v-model.trim="itemsSearch.whName" placeholder="仓库">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-range-picker
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  showTime
                  :placeholder="['入库开始日期', '入库结束日期']"
                  v-model="itemsSearch.inDate"
                  @change="handleDateChange"
                >
                </a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-input v-model.trim="itemsSearch.docNo" placeholder="入库单号/采购单号" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="clearSearch">清 空</a-button>
                  <a-button type="primary" @click="search">查 询</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table">
        <p class="table-title">商品信息</p>
        <div class="table-data">
          <a-table
            bordered
            :loading="addItemsLoading"
            rowKey="id"
            size="middle"
            :pagination="false"
            :columns="itemsColumns"
            :data-source="ItemData"
            :scroll="{ y: ItemData.length > 10 ? 800 : 0,x:1140}"
            :row-selection="{
              columnWidth: 50,
              onChange: rowSelectionChange,
              selectedRowKeys: selectedRowKeys,
            }"
            :customRow="handleCustomRow"
          >
            <span slot="saleQty" slot-scope="text, record">
              <a-input
                v-limit-input-number
                @click.stop.native
                v-model="record.saleQty"
                @focus="pushId(record)"
              ></a-input>
            </span>
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
import { componentGetInventoryList } from "../../services/sales";
import { formatDate } from "../../utils/util";
export default {
  name: "stAddKucunItems",
  data() {
    return {
      itemsSearch: {
        resource: 0,
        itemCode: "",
        itemName: "",
        containerCode: "",
        inDate: [],
        startInDate: "",
        endInDate: "",
        whName: "",
        itemVarieties: "",
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
          title: "入库时间",
          dataIndex: "inDate",
          width: 160,
          align: "center",
        },
        {
          title: "入库单号",
          dataIndex: "invCode",
          width: 140,
          align: "center",
        },
        {
          title: "采购单号",
          dataIndex: "docNo",
          width: 200,
          align: "center",
        },
        // {
        //   title: "货品编号",
        //   dataIndex: "itemCode",
        //   width: 100,
        //   align: "center",
        // },
        {
          title: "货品名称",
          dataIndex: "itemName",
          width: 160,
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
          width: 100,
          align: "center",
        },
        {
          title: "品种",
          dataIndex: "itemVarieties",
          width: 100,
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "measureUnit",
          width: 80,
          align: "center",
        },
        {
          title: "可用数量",
          dataIndex: "balance",
          width: 100,
          align: "center",
        },
        {
          title: "仓库",
          dataIndex: "whName",
          width: 100,
          align: "center",
        },
        {
          title: "柜号",
          dataIndex: "containerCode",
          width: 140,
          align: "center",
        },
        {
          title: "出库数量",
          dataIndex: "saleQty",
          width: 120,
          align: "center",
          fixed: 'right',
          scopedSlots: { customRender: "saleQty" },
        },
      ],
      ItemData: [],
      addItemsLoading: false,
      rowSelectionChangeData: [],
      selectedRowKeys: [],
      customerId: "",
      saleChecked: false,
      pageFlag: undefined,
    };
  },
  methods: {
    pushId(row) {
      let newData = this.ItemData
      let rowKeys = this.selectedRowKeys;
      this.rowSelectionChangeData = []
      if (!this.selectedRowKeys.includes(row.id)) rowKeys.push(row.id)
      this.selectedRowKeys = rowKeys
      newData.forEach((x) => {
        rowKeys.find((y) => {
          if (x.id === y) {
            this.rowSelectionChangeData.push(x)
            return !0
          }
        })
      })
    },
    handleDateChange(val) {
      this.itemsSearch.startInDate = val[0];
      this.itemsSearch.endInDate = val[1];
    },
    handleCancelItems() {
      this.clearSearch();
      this.itemsVisible = false;
    },
    handleSubmitItems() {
      if (this.rowSelectionChangeData.length === 0) {
        this.$message.error("请选择一条数据进行添加！");
        return;
      }
      let normalDataQty = [];
      let nullData = [];
      this.rowSelectionChangeData.forEach((item) => {
        if (item.saleQty > item.balance) {
          normalDataQty.push(item.itemName);
        }
        if (!item.saleQty) {
          nullData.push(item.itemName);
        }
        item.invId = item.id;
        item.deliveryCount = item.saleQty;
        item.deliveryUnit = item.measureUnit;
        item.costPrice = item.poPrice;
        item.supplyPrice = this.pageFlag == 2 ? item.poPrice : undefined;
        item.supplyPrice = item.poPrice;
        item.costQty = item.saleQty;
        item.vat = item.outputTaxRate;
        item.specs = item.itemSpec || "";
      });
      if (nullData.length > 0) {
        this.$message.error(`商品${nullData.join(",")}的出库数量为必填项！`);
        return;
      }
      // if (normalDataQty.length > 0) {
      //   this.$message.error(
      //     `商品${normalDataQty.join(",")}的出库数量不能大于可用数量！`
      //   );
      //   return;
      // }
      this.$parent.$parent.getItems(this.rowSelectionChangeData, "kucun");
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
        itemName: "",
        containerCode: "",
        inDate: [],
        startInDate: "",
        endInDate: "",
        whName: "",
        itemVarieties: "",
      };
    },
    search() {
      this.itemsPagination.pageIndex = 1;
      this.getItemList();
    },
    openPrudoct(customerId, saleChecked, flag) {
      this.itemsPagination.pageSize = 10
      this.itemsPagination.total = 0
      this.itemsPagination.pageIndex = 1
      this.ItemData = []
      this.pageFlag = flag
      this.customerId = customerId;
      this.saleChecked = saleChecked;
      this.selectedRowKeys = []
      this.rowSelectionChangeData = []
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
            let newData = this.ItemData
            let rowKeys = this.selectedRowKeys;
            let idIndex = rowKeys.indexOf(row.id)
            console.log('idIndex: ', idIndex);
            idIndex == -1 ? rowKeys.push(row.id) : rowKeys.splice(idIndex, 1)
            this.selectedRowKeys = rowKeys;
            newData.forEach((x) => {
              rowKeys.find((y) => {
                if (x.id === y) {
                  this.rowSelectionChangeData.push(x)
                  return !0
                }
              })
            })
          },
        },
      };
    },
    getItemList() {
      const params = {
        customerId: this.customerId,
        itemName: this.itemsSearch.itemName,
        itemCode: this.itemsSearch.itemCode,
        startInDate: this.itemsSearch.startInDate,
        endInDate: this.itemsSearch.endInDate,
        containerCode: this.itemsSearch.containerCode,
        itemVarieties: this.itemsSearch.itemVarieties,
        whName: this.itemsSearch.whName,
        docNo: this.itemsSearch.docNo,
        rows: this.itemsPagination.pageSize,
        page: this.itemsPagination.pageIndex,
        hasContainerCode: this.saleChecked,
        sort: "id",
        order: "DESC",
      };
      this.addItemsLoading = true;
      componentGetInventoryList(params).then((res) => {
        this.selectedRowKeys = [];
        this.addItemsLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.itemsVisible = true;
          this.ItemData = data.data || [];
          this.itemsPagination.total = data.totalNum;
          this.ItemData.forEach((item) => {
            item.inDate = item.inDate ? formatDate(new Date(item.inDate), "YYYY-MM-dd hh:mm:ss") : "-";
            item.priceUnit = item.measureUnit
          });
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
.modalTop{
  /deep/.ant-modal{
    width: 95% !important;
    min-width: 1100px !important;
    max-width: 1400px !important;
  }
}
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