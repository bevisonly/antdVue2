<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="wait-for-signed">
      <div class="search-item">
        <a-card
          title="筛选查询"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          size="small"
        >
          <div class="search">
            <a-form :form="searchform">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.itemCode"
                      placeholder="供应商名称"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      show-search
                      v-model="searchform.customerId"
                      style="width: 100%"
                      @change="handleChange"
                      placeholder="客户名称"
                      allowClear
                    >
                      <a-select-option
                        v-for="d in partnerList"
                        :key="d.id"
                        :value="d.id"
                      >
                        {{ d.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select
                      v-model="searchform.storeId"
                      :disabled="!searchform.customerId"
                      style="width: 100%"
                      placeholder="客户门店"
                      allowClear
                    >
                      <a-select-option
                        v-for="item in storeList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.poCode"
                      placeholder="采购单号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.itemCode"
                      placeholder="商品名称"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <!-- <a-col :span="4">
                  <a-form-item label="运营主体">
                    <a-select v-model="searchform.opId" style="width: 100%">
                      <a-select-option
                        v-for="item in opList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.opName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col> -->

                <a-col :span="6">
                  <a-form-item>
                    <a-range-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      showTime
                      @change="handleDateChange"
                      :placeholder="['采购日期开始时间', '采购日期结束时间']"
                      v-model="searchform.createDate"
                    ></a-range-picker>
                  </a-form-item>
                </a-col>

                <a-col :span="4">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.soCode"
                      placeholder="销售单号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>

                <a-col :span="4">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.roCode"
                      placeholder="需求单号"
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
      <div class="list-table" style="margin-top: 16px">
        <a-card
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div style="margin-bottom: 16px; text-align: left">
            <a-button
              :loading="exportLoading"
              type="primary"
              icon="download"
              @click="exportItem"
              :disabled="!hasPermission('signed_details_export')"
            >
              导出
            </a-button>
          </div>
          <a-spin :tip="spinText" :spinning="spinning">
            <a-table
              :columns="columns"
              :data-source="tableList"
              :scroll="{ x: 1300 }"
              rowKey="id"
              :pagination="false"
            >
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
          </a-spin>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "../../utils/mixins";
import { getOpSubject } from "../../services/signed/signed";
import { partnerType } from "@/services/userMa.js";
import {
  GetDetailsList,
  PurchaseDetailExport,
} from "../../services/purchaseSaleInventory";
const columns = [
  {
    align: "center",
    title: "采购日期",
    dataIndex: "createDate",
    width: 200,
  },
  {
    align: "center",
    title: "采购单号",
    dataIndex: "poCode",
    width: 180,
  },
  {
    align: "center",
    title: "需求单号",
    dataIndex: "reCode",
    width: 180,
  },
  {
    align: "center",
    title: "销售单号",
    dataIndex: "soCode",
    width: 180,
  },
  {
    align: "center",
    title: "商品名称",
    dataIndex: "itemName",
    width: 150,
  },
  {
    align: "center",
    title: "商品规格",
    dataIndex: "itemSpec",
    width: 150,
  },
  {
    align: "center",
    title: "供应商",
    dataIndex: "supplierName",
    width: 200,
  },
  {
    align: "center",
    title: "客户",
    dataIndex: "customerName",
    width: 200,
  },
  {
    align: "center",
    title: "门店名称",
    dataIndex: "storeName",
    width: 150,
  },
  {
    align: "center",
    title: "采购数量",
    dataIndex: "poQty",
    width: 100,
  },

  {
    align: "center",
    title: "采购单价",
    dataIndex: "poPrice",
    width: 100,
  },
  {
    align: "center",
    title: "销售订单件数",
    dataIndex: "soQty",
    width: 150,
  },
  {
    align: "center",
    title: "包装",
    dataIndex: "packingName",
    width: 100,
  },
  {
    align: "center",
    title: "包装费用",
    dataIndex: "packingCost",
    width: 100,
  },
  {
    align: "center",
    title: "采购总金额",
    dataIndex: "poTotalAmount",
    width: 150,
  },
  {
    align: "center",
    title: "采购人",
    dataIndex: "poSubuserName",
    width: 100,
  },
];
export default {
  mixins: [mixin],
  data() {
    return {
      exportLoading: false,
      spinning: false,
      spinText: "",
      columns,
      tableList: [],
      searchform: {
        customerName: "",
        customerId: undefined,
        storeId: undefined,
        createDate: "",
        beginTime: "",
        endTime: "",
        itemCode: undefined,
        poCode: "",
        soCode: "",
        roCode: "",
        supplierName: "",
      },
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "desc",
      },
      storeList: [],
      partnerList: [],
      opList: [],
    };
  },
  activated() {
    // this.getOpSubject();
    this.getList();
    this.getPartner();
  },
  methods: {
    handleDateChange(val) {
      this.searchform.beginTime = val[0];
      this.searchform.endTime = val[1];
    },
    getList() {
      this.spinText = "数据加载中";
      let temp = JSON.parse(JSON.stringify(this.searchform));
      delete temp.createDate;
      const params = {
        ...this.pagination,
        ...temp,
      };
      this.spinning = true;
      GetDetailsList(params).then((res) => {
        this.spinning = false;
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
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
    //导出
    exportItem() {
      let temp = JSON.parse(JSON.stringify(this.searchform));
      delete temp.createDate;
      const params = {
        ...this.searchform,
      };
      this.exportLoading = true;
      this.spinning = true;
      this.spinText = "数据导出中请稍后";
      PurchaseDetailExport(params).then((res) => {
        console.log(res);
        const data = res.data;
        this.exportLoading = false;
        this.spinning = false;
        if (data) {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          const url = URL.createObjectURL(blob);
          console.log(url);
          this.downloadTem(url);
        } else {
          this.$message.error("导出失败！");
        }
      });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      link.setAttribute("download", "采购订单明细");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    getOpSubject() {
      getOpSubject().then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          this.opList = res.data.data;
        }
      });
    },
    handleSearch(value) {
      if (!value) {
        this.partnerList = [];
        return;
      }
      console.log(value);
      this.searchform.customerId = value;
      this.getPartner();
    },
    handleChange(option) {
      this.searchform.storeId = "";
      this.partnerList.forEach((item) => {
        if (option == item.id) {
          this.searchform.customerName = item.partnerName;
        }
      });
      console.log(this.searchform);
      this.getStore();
    },
    getStore() {
      const params = {
        partnerType: 22,
        parentId: this.searchform.customerId,
      };
      partnerType(params).then((res) => {
        if (res.data.code == 200) {
          this.storeList = res.data.data;
        }
      });
    },
    getPartner() {
      const params = {
        partnerType: 20,
        partnerName: this.searchform.customerId || "",
      };
      // if (!params.name) {
      //   return;
      // }
      partnerType(params).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.partnerList = res.data.data;
        }
      });
    },
    handleReset() {
      this.searchform = {
        searchform: {
          customerName: "",
          customerId: undefined,
          storeId: undefined,
          createDate: "",
          beginTime: "",
          endTime: "",
          itemCode: undefined,
          poCode: "",
          soCode: "",
          roCode: "",
          supplierName: "",
        },
      };
    },
    searchList() {
      console.log(this.searchform);
      this.getList();
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
@import "index";
.search {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }

  /deep/.ant-card-head-title {
    padding: 0;
  }
}
/deep/.ant-table-tbody > tr > td {
  padding: 8px;
}
</style>