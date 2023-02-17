<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="search-item">
      <a-card title="筛选查询" :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }" size="small">
        <div class="search">
          <a-form :form="searchform">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item>
                  <a-input v-model.trim="searchform.poCode" placeholder="单据编号">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-input v-model.trim="searchform.containerCode" placeholder="柜号">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-input v-model.trim="searchform.partnerName" placeholder="供应商名称">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-input v-model.trim="searchform.agencyName" placeholder="代理公司名称">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="handleReset">清 空</a-button>
                    <a-button type="primary" @click="searchPo">查 询</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-card title="待提货列表" class="card-table" :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }" size="small" style="margin-top: 20px">
        <div style="margin-bottom: 16px; text-align: left">
          <a-button type="primary" icon="printer" @click="printData" :disabled="!hasPermission('pickUpOrder_print')">
            打印
          </a-button>
          <span style="margin-left: 20px">待收货 : {{ pagination.total }}</span>
        </div>
        <a-table :columns="columns" :data-source="tableList" :scroll="{ y: 400, x: 1300 }" rowKey="id"
          :pagination="false" :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }" :loading="tableLoading" size="middle">
          <template slot="poState" slot-scope="text, record">
            <a-tag v-if="record.poState == 210">待收货</a-tag>
            <a-tag v-if="record.poState == 201">采购订单草稿</a-tag>
          </template>
          <template slot="purchaseWeight" slot-scope="text, record">
            <div v-if="record.purchaseWeight">
              {{ record.purchaseWeight / 1000 }}
            </div>
          </template>

          <template slot="opreation" slot-scope="text, record">
            <div v-if="record.supplierPhone != '合计'">
              <a-button type="link" size="small" icon="search" @click="showDetail(record)" :disabled="
                !hasPermission('pickUpOrder_view_two') ||
                !hasPermission('pickUpOrder_view')
              ">查看订单</a-button>
              <a-popconfirm title="确定撤回?" ok-text="确定" cancel-text="取消" @confirm="delOrder(record)">
                <a-button type="link" size="small">撤回</a-button>
              </a-popconfirm>

              <a-button type="link" size="small" icon="edit" @click="editOrder(record)" :disabled="
                !hasPermission('pickUpOrder_pickUp') ||
                !hasPermission('pickUpOrder_pickUp_two')
              ">收货录入</a-button>
            </div>
          </template>
          <template slot="footer">
            <div class="total">
              <!-- <span>采购总重量 : {{ weightTotal }}</span> -->
              <span>采购总数量 : {{ quantityTotal }}</span>
            </div>
          </template>
        </a-table>

        <!-- 分页 -->
        <div class="pagination">
          <a-pagination :page-size-options="['10', '20', '30', '40', '50']" :total="pagination.total" show-size-changer
            :page-size="pagination.rows" show-quick-jumper :current="pagination.page"
            :show-total="(total) => `共 ${total} 条记录`" @change="pageChange" @showSizeChange="pageSizeChange">
          </a-pagination>
        </div>
      </a-card>
    </div>
    <PrintPickupOrder :dataList="tableList" ref="printOrder" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { mapState } from "vuex";
import PrintPickupOrder from "./printPickupOrder.vue";
// import { formatDate } from "../../utils/util";
import {
  pickUpOrderList,
  pickUpOrderDel,
} from "../../services/pickUpOrder/pickUpOrderList";
import { add } from "../../utils/tool";
const columns = [
  {
    align: "center",
    title: "采购订单号",
    dataIndex: "poCode",
    // key: "poCode",
    // fixed: "left",
    width: 200,
  },
  {
    align: "center",
    title: "采购订单提交时间",
    dataIndex: "poSubtime",
    width: 200,
  },
  {
    align: "center",
    title: "柜号",
    dataIndex: "containerCode",
    width: 150,
  },
  {
    align: "center",
    title: "供应商名称",
    dataIndex: "supplierName",
    // key: "supplierName",
    width: 250,
  },
  {
    align: "center",
    title: "代理公司名称",
    dataIndex: "agencyName",
    width: 250,
  },
  {
    align: "center",
    title: "供应商联系手机",
    dataIndex: "supplierPhone",
    // key: "supplierPhone",
    width: 150,
  },

  {
    align: "center",
    title: "采购件数",
    dataIndex: "purchaseQty",
    // key: "purchaseQty",
    width: 120,
  },
  {
    align: "center",
    title: "订单状态",
    dataIndex: "poState",
    // key: "poState",
    width: 120,
    scopedSlots: { customRender: "poState" },
  },
  {
    align: "center",
    title: "收货地点",
    width: 120,
    dataIndex: "deliveryAdress",
    // key: "deliveryAdress",
  },
  {
    align: "center",
    title: "关联合同",
    width: 220,
    dataIndex: "contractTitle",
  },

  {
    align: "center",
    title: "操作",
    dataIndex: "opreation",
    // key: "opreation",
    width: 300,
    fixed: "right",
    scopedSlots: { customRender: "opreation" },
  },
];
export default {
  name: "pickUpOrderList",
  mixins: [mixin],
  components: { PrintPickupOrder },

  data() {
    return {
      quantityTotal: 0,
      weightTotal: 0,
      tableLoading: false,
      selectedRowKeys: [],
      selectedRows: [],
      columns,
      searchform: {
        poCode: "",
        partnerName: "",
        containerCode: "",
      },
      tableList: [],

      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "po_subtime",
        order: "desc",
      },
    };
  },
  activated() {
    this.getList();
  },
  methods: {
    editOrder(record) {
      this.$router.push({
        path: "/transport/pickUp/pickUpOrderPickUpRouter",
        query: {
          record: record,
          data: this.tableList,
          state: 1,
        },
      });
    },
    //收货单作废
    delOrder(record) {
      console.log(record);
      const params = {
        id: record.id,
        version: record.version,
      };
      pickUpOrderDel(params).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //查看详情
    showDetail(record) {
      this.$router.push({
        path: "/transport/pickUp/pickUpOrderPickUpRouter",
        query: {
          record: record,
          data: this.tableList,
          state: 0,
        },
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    printData() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error("请选择一条数据进行操作！");
        return false;
      }
      if (this.selectedRowKeys.length > 1) {
        this.$message.error("最多只能选择一条数据！");
        return false;
      }
      this.$refs.printOrder.showModal(this.selectedRows[0]);
    },
    //列表分页请求
    getList() {
      const params = {
        // rows: this.pagination.rows,
        // page: this.pagination.page,
        ...this.pagination,
        ...this.searchform,
      };
      this.tableLoading = true;
      pickUpOrderList(params).then((res) => {
        this.tableLoading = false;
        this.tableList = res.data.rows;
        // const temp = res.data.rows;
        this.quantityTotal = 0;
        this.weightTotal = 0;
        this.tableList.forEach((v) => {
          if (v.purchaseQty) {
            this.quantityTotal = add(this.quantityTotal, v.purchaseQty);
          }
        });

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
    handleReset() {
      this.searchform = {
        poCode: "",
        partnerName: "",
        containerCode: "",
      };
    },
    searchPo() {
      this.pagination.page = 1;
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

/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>