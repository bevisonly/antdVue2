<template>
  <div class="new-page">
    <!-- 搜索 -->
    <div class="search" v-if="screen">
      <a-form :form="searchform">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item>
              <a-range-picker style="width: 100%" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                showTime :placeholder="['开始送货日期', '结束送货日期']" v-model="searchform.deliveryDate"
                @change="handleDateChange">
              </a-range-picker>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select style="width: 100%" v-model="searchform.customerId" placeholder="请选择客户" allowClear show-search
                :filter-option="filterOption" @change="handleCustomerChange">
                <a-select-option :value="item.id" v-for="item in customerData" :key="item.id">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select :disabled="!searchform.customerId" style="width: 100%" allowClear v-model="searchform.storeId"
                show-search :filter-option="filterOption" placeholder="请选择客户门店">
                <a-select-option :value="item.id" :key="item.id" v-for="item in storeData">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select v-model="searchform.states" placeholder="请选择订单状态" mode="multiple">
                <a-select-option v-for="item in orderState" :key="item.state" :value="item.state">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item>
              <a-input v-model.trim="searchform.sno" placeholder="请输入销售订单号">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select v-model="searchform.type" allowClear placeholder="请选择订单类型">
                <a-select-option v-for="item in orderTtpe" :key="item.type" :value="item.type">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-range-picker style="width: 100%" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                showTime :placeholder="['开始创建日期', '结束创建日期']" v-model="searchform.createDate"
                @change="handleCreateDateChange">
              </a-range-picker>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input v-model.trim="searchform.containerCode" placeholder="柜号">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="4">
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
    <!-- 按钮 -->
    <div class="flex-sb btns">
      <a-button-group>
        <a-button type="primary" @click="changeOrder" :disabled="!hasPermission('order_conversionKind')">
          转采购需求
        </a-button>
        <a-button type="primary" :loading="exportLoading" @click="exportOrder"
          :disabled="!hasPermission('order_export')">
          导出订单
        </a-button>
        <a-button type="primary" @click="print('gonghuo')" :disabled="!hasPermission('slips_print')">
          打印供货单
        </a-button>
        <a-button type="primary" @click="print('chuku')"
          :disabled="!hasPermission('alternateorder_print')">
          打印销售单
        </a-button>
        <a-upload :show-upload-list="false"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :beforeUpload="beforeUpload">
          <a-button type="primary" :disabled="!hasPermission('alternateorder_upload')">
            上传订单
          </a-button>
        </a-upload>
        <a-button type="primary" :loading="templateExportLoading"
          :disabled="!hasPermission('alternateorder_download')" @click="templateDownload">
          下载模板
        </a-button>
      </a-button-group>
      <a-button-group>
        <checkboxList v-model="columns" width="240" />
        <a-button class="btnStyle" type="primary" :icon="screen ? 'fullscreen' : 'fullscreen-exit'" @click="screenBtn">
        </a-button>
      </a-button-group>
    </div>
    <div class="data-table" ref="dataTable">
      <a-table :loading="tableLoading" :columns="columns" :data-source="tableData" :pagination="false"
        :scroll="{ y: tableYHeight, x: 1200 }" rowKey="id" :row-selection="{
          columnWidth: 50,
          onChange: rowSelectionChange,
          selectedRowKeys: selectedRowKeys,
        }">
        <span slot="operation" slot-scope="text, record">
          <!-- 查看订单 -->
          <a-button type="link" @click="details(record)" :disabled="!hasPermission('order_details')">
            查看订单
          </a-button>
          <!-- 编辑 -->
          <a-button v-if="
            record.state !== 210104 &&
            record.state !== 220104 &&
            record.state !== 104
          " type="link" @click="edit(record, 'edit')" :disabled="!hasPermission('order_edit')">
            编辑
          </a-button>
          <a-popconfirm v-if="record.state === 201" title="确定要确认这条数据吗?" ok-text="确定" cancel-text="取消"
            @confirm="submitOrder(record, 203)" @cancel="cancel" :disabled="!hasPermission('order_confirm')">
            <a-button type="link" :disabled="!hasPermission('order_confirm')">
              确认
            </a-button>
          </a-popconfirm>

          <a-popconfirm v-if="
            record.state === 102 ||
            record.state === 103 ||
            record.state === 100 ||
            record.state === 201
          " title="确定要作废这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="submitOrder(record, 101)" @cancel="cancel"
            :disabled="!hasPermission('order_void')">
            <a-button v-if="
              record.state === 102 ||
              record.state === 103 ||
              record.state === 100 ||
              record.state === 201
            " type="link" :disabled="!hasPermission('order_void')">
              作废
            </a-button>
          </a-popconfirm>
          <!-- 复制 -->
          <a-button type="link" @click="edit(record, 'copy')" :disabled="!hasPermission('order_copy')">
            复制
          </a-button>
        </span>
      </a-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <a-pagination :page-size-options="['10', '20', '30', '40', '50']" :total="pagination.total" show-size-changer
        :page-size="pagination.pageSize" show-quick-jumper :current="pagination.pageIndex"
        :show-total="(total) => `共 ${total} 条记录`" @change="pageIndexChange" @showSizeChange="pageSizeChange">
      </a-pagination>
    </div>
    <sales-orderDetails ref="salesOrderDetails"></sales-orderDetails>
    <change-order ref="changeOrder"></change-order>
    <print-order ref="printOrder"></print-order>
  </div>
</template>
<script>
import printOrder from "./printOrder.vue";
import salesOrderDetails from "./salesOrderDetails.vue";
import changeOrder from "./changeOrder.vue";
import {
  ordergGetListPage,
  orderExport,
  orderOperate,
  importExcel,
  exportTemplate,
  // overallOrderConfirm,
  overallOrderInvalid,
} from "../../services/sales";
import { partnerList } from "../../services/reportSettlementMa";
import { mixin } from "../../utils/mixins";
export default {
  mixins: [mixin],
  name: "salesOrder",
  components: {
    salesOrderDetails,
    changeOrder,
    printOrder,
  },
  data() {
    return {
      screen: !0,
      exportLoading: false,
      templateExportLoading: false,
      searchform: {
        deliveryDate: [],
        deliveryDateStart: "",
        deliveryDateEnd: "",
        customerId: undefined,
        createDate: [],
        createDateStart: "",
        createDateEnd: "",
        storeId: undefined,
        states: [102, 201],
        type: undefined,
        sno: "",
      },
      tableLoading: false,
      orderTtpe: [
        {
          name: "销售单",
          type: 1,
        },
        {
          name: "库存单",
          type: 2,
        },
        {
          name: "服务单",
          type: 3,
        },
        {
          name: "换货单",
          type: 4,
        },
        {
          name: "直送单",
          type: 5,
        },
        {
          name: "销采一体单",
          type: 6,
        },
      ],
      orderState: [
        {
          name: "草稿",
          state: 99,
        },
        {
          name: "待确认",
          state: 100,
        },
        //! {
        //!   name: "销售订单作废",
        //!   state: 101,
        //! },
        {
          name: "待转需求单",
          state: 102,
        },
        {
          name: "待签收",
          state: 103,
        },
        {
          name: "已签收",
          state: 104,
        },
        {
          name: "待转采购订单",
          state: 200,
        },
        {
          name: "待确认",
          state: 201,
        },
        {
          name: "销采单已确认",
          state: 203,
        },
        {
          name: "待收货",
          state: 210,
        },
        {
          name: "呆滞品",
          state: 301,
        },
        {
          name: "待退货确认",
          state: 401,
        },
        {
          name: "已退货",
          state: 402,
        },
        {
          name: "待收货待签收",
          state: 210103,
        },
        {
          name: "待收货已签收",
          state: 210104,
        },
        {
          name: "已收货待签收",
          state: 220103,
        },
        {
          name: "已收货已签收",
          state: 220104,
        },
      ],
      columns: [
        {
          dataIndex: "sno",
          title: "销售单号",
          width: 200,
          align: "center",
          scopedSlots: { customRender: "sno" },
        },
        {
          title: "客户名称",
          dataIndex: "customerName",
          width: 260,
          align: "center",
        },
        {
          title: "门店名称",
          dataIndex: "storeName",
          width: 260,
          align: "center",
        },
        {
          title: "柜号",
          dataIndex: "containerCode",
          width: 180,
          align: "center",
        },
        {
          title: "送货日期",
          dataIndex: "deliveryDate",
          width: 180,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "totalQty",
          width: 180,
          align: "center",
        },
        // {
        //   title: "重量",
        //   dataIndex: "roughWeight",
        //   width: 100,
        //   align: "center",
        // },
        {
          title: "订单金额",
          dataIndex: "totalAmount",
          width: 180,
          align: "center",
        },
        {
          title: "付款方式",
          dataIndex: "payTypeDesc",
          width: 100,
          align: "center",
        },
        {
          title: "运营主体",
          dataIndex: "opName",
          width: 260,
          align: "center",
        },
        {
          title: "订单类型",
          dataIndex: "orderTypeDesc",
          width: 100,
          align: "center",
        },
        {
          title: "出货供应商",
          dataIndex: "supplierName",
          width: 150,
          align: "center",
        },
        {
          title: "订单来源",
          dataIndex: "orderSourceDesc",
          width: 100,
          align: "center",
        },
        {
          title: "订单状态",
          dataIndex: "stateDesc",
          width: 140,
          align: "center",
        },
        {
          title: "送货类型",
          dataIndex: "deliveryTypeDesc",
          width: 100,
          align: "center",
        },
        {
          title: "车牌号",
          dataIndex: "carPlate",
          width: 100,
          align: "center",
        },
        {
          title: "关联合同",
          dataIndex: "contractTitle",
          width: 240,
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createUser",
          width: 100,
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createDate",
          width: 180,
          align: "center",
        },
        {
          title: "操作",
          key: "operation",
          dataIndex: "operation",
          width: 330,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
      tableData: [],
      selectedRowKeys: [],
      customerData: [],
      PartnerData: [],
      rowSelectionChangeData: [],
      storeData: [],
      pagination: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        direction: "DESC",
        sortName: "id",
      },
    };
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    screenBtn() {
      this.screen = !+this.screen;
    },
    templateDownload() {
      this.templateExportLoading = true;
      exportTemplate()
        .then((res) => {
          this.templateExportLoading = false;
          if (
            res.data.type === "application/vnd.ms-excel" ||
            res.data.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            let name = res.headers["content-disposition"]
              ? decodeURIComponent(res.headers["content-disposition"]).match(
                /(?<=filename=).*(?=\.xl)/gm
              )[0]
              : "Excel模板";
            this.getErrExcel(res.data, name);
          } else {
            this.$message.warn("下载失败");
          }
        })
        .catch(() => (this.templateExportLoading = false));
    },
    getErrExcel(res, name) {
      const link = document.createElement("a");
      const blob = new Blob([res], {
        type: "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      link.href = URL.createObjectURL(blob);
      link.download = name;
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    beforeUpload(file) {
      let formData = new FormData();
      formData.append("excel", file);
      importExcel(formData).then((res) => {
        if (res.data.type.includes("application")) {
          this.$message.warn("上传失败,详情请看下载的文件......");
          let name = res.headers["content-disposition"]
            ? decodeURIComponent(res.headers["content-disposition"]).match(
              /(?<=filename=).*(?=\.xl)/gm
            )[0]
            : "Excel文件";
          this.getErrExcel(res.data, name);
        } else if (res.data.type.includes("text") || res.data.size == 0) {
          this.$message.success("上传成功");
        }
      });
      return false;
    },
    print(state) {
      if (this.rowSelectionChangeData.length === 0) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      if (this.rowSelectionChangeData.length > 1) {
        this.$message.error("最多只能选择一条数据！");
        return false;
      }
      this.$refs.printOrder.openModal(this.rowSelectionChangeData, state);
    },
    changeOrder() {
      if (this.rowSelectionChangeData.length === 0) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      let doArr = [];
      let onlyContract = []
      this.rowSelectionChangeData.forEach((item) => {
        !onlyContract.includes(item.contractId) && onlyContract.push(item.contractId)
        if (item.state !== 102) {
          doArr.push(item.sno);
        }
      });
      if (doArr.length > 0) {
        this.$message.error(`订单状态为待转需求单，才能进行此操作！`);
        return;
      }
      if (onlyContract.length > 1) {
        this.$message.error("当前订单的关联合同存在不一致，不可以合并操作")
        return
      }
      this.$refs.changeOrder.openModal(this.rowSelectionChangeData);
    },
    cancel() {
      this.$message.error("取消");
    },
    submitOrder(row, val) {
      if (row.type == 6 && val == 101) {
        overallOrderInvalid({ id: row.id || "" })
          .then((res) => {
            const data = res.data;
            if (data.code === "200") {
              this.$message.success(data.message);
              this.getTableList();
            } else {
              this.$message.error(data.message);
            }
          })
          .catch(() => {
            this.$message.error("接口请求失败");
          });
        return;
      }
      const params = {
        id: row.id,
        operate: val, //101 代表作废功能;203 代表确认功能
      };
      orderOperate(params)
        .then((res) => {
          const data = res.data;
          console.log(data);
          if (data.code === "200") {
            this.$message.success(data.message);
            this.getTableList();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(() => {
          this.$message.error("接口请求失败");
        });
    },
    exportOrder() {
      const params = {
        deliveryDateStart: this.searchform.deliveryDate[0],
        deliveryDateEnd: this.searchform.deliveryDate[1],
        createDateStart: this.searchform.createDate[0],
        createDateEnd: this.searchform.createDate[1],
        customerId: this.searchform.customerId,
        storeId: this.searchform.storeId,
        type: this.searchform.type,
        sno: this.searchform.sno,
        states: this.searchform.states,
        containerCode: this.searchform.containerCode
      };
      this.exportLoading = true;
      orderExport(params).then((res) => {
        const data = res.data;
        this.exportLoading = false;
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
      link.setAttribute("download", "销售订单列表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    edit(row, type) {
      this.$router.push({
        path: "/enterSaleStore/sale/saleOrderAdd",
        query: {
          orderId: row.id,
          type: type,
          orderType: row.type,
        },
      });
    },
    handleDateChange(val) {
      this.searchform.deliveryDateStart = val[0];
      this.searchform.deliveryDateEnd = val[1];
    },
    handleCreateDateChange(val) {
      this.searchform.createDateStart = val[0];
      this.searchform.createDateEnd = val[1];
    },
    handleCustomerChange(val) {
      this.searchform.storeId = undefined;
      this.getCustumers(22, val);
    },
    clearSearch() {
      this.searchform = {
        deliveryDate: [],
        deliveryDateStart: "",
        deliveryDateEnd: "",
        createDate: [],
        createDateStart: "",
        createDateEnd: "",
        customerId: undefined,
        storeId: undefined,
        states: [],
        type: undefined,
        sno: "",
        containerCode: undefined
      };
    },
    search() {
      this.pagination.pageIndex = 1;
      this.getTableList();
    },
    rowSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.rowSelectionChangeData = selectedRows;
    },
    getTableList() {
      const params = {
        sort: this.pagination.sortName,
        page: this.pagination.pageIndex,
        rows: this.pagination.pageSize,
        order: this.pagination.direction,
        deliveryDateStart: this.searchform.deliveryDate[0],
        deliveryDateEnd: this.searchform.deliveryDate[1],
        createDateStart: this.searchform.createDate[0],
        createDateEnd: this.searchform.createDate[1],
        customerId: this.searchform.customerId,
        storeId: this.searchform.storeId,
        type: this.searchform.type,
        sno: this.searchform.sno,
        states: this.searchform.states,
        containerCode: this.searchform.containerCode
      };
      this.tableLoading = true;
      ordergGetListPage(params).then((res) => {
        this.selectedRowKeys = [];
        this.tableLoading = false;
        const data = res.data;
        if (data.code === "200") {
          this.pagination.total = data.totalNum;
          this.tableData = data.data;
          this.tableData.forEach((item) => {
            item.totalAmount = item.totalAmount ? item.totalAmount : "";
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getCustumers(partnerType, parentId) {
      const params = {
        partnerType,
        parentId,
      };
      partnerList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (partnerType === 20) {
            this.customerData = data.data;
          } else if (partnerType === 22) {
            this.storeData = data.data;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    details(row) {
      this.$refs.salesOrderDetails.openModal(row);
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
  activated() {
    this.$nextTick(() => {
      this.getTableList();
      this.getCustumers(20, "");
      this.getCustumers(30, "");
    });
  },
};
</script>
<style lang="less" scoped>
@import "index.less";

.btnStyle {
  width: 50px;
}
</style>