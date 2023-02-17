<template>
  <div class="new-page">
    <!-- 搜索 -->
    <div class="search" v-if="screen">
      <a-form :form="searchform">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item>
              <a-select v-model="searchform.poState" placeholder="订单状态">
                <a-select-option value=""> --全部-- </a-select-option>
                <a-select-option :value="201"> 采购订单草稿 </a-select-option>
                <a-select-option :value="210"> 待收货 </a-select-option>
                <a-select-option :value="220"> 已收货 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select v-model="searchform.supplierId" placeholder="请选择供应商" show-search :filter-option="filterOption"
                @select="supplierNameSelect">
                <a-select-option v-for="item in PartnerData.filter(supplierStrategy)" :key="item.id"
                  :value="item.id">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select v-model="searchform.agencyId" placeholder="请输入代理公司名称" show-search :filter-option="filterOption"
                @select="agencyNameSelect">
                <a-select-option v-for="item in PartnerData.filter(agencyStrategy)" :key="item.id"
                  :value="item.id">
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input v-model.trim="searchform.roCode" placeholder="需求单编号">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item>
              <a-input v-model.trim="searchform.poCode" placeholder="采购单编号">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input v-model.trim="searchform.soCode" placeholder="销售单编号">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input v-model.trim="searchform.orderCode" placeholder="外部订单号">
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
        <a-button type="primary" @click="add('gn')" :disabled="!hasPermission('purchaseOrderHead_add')">
          新增
        </a-button>
        <a-button type="primary" @click="add('gj')"
          :disabled="!hasPermission('globalPurchaseOrderHead_add')">
          新增国际单
        </a-button>
        <a-button type="primary" @click="tourist" :disabled="!hasPermission('purchaseOrderHead_applyFee')">
          资金申请
        </a-button>
        <a-button type="primary" @click="print" :disabled="!hasPermission('purchaseOrderHead_print')">
          打印
        </a-button>
        <a-button :loading="exportLoading" type="primary" @click="downloadOrder"
          :disabled="!hasPermission('purchaseOrderHead_export')">
          导出订单
        </a-button>
        <!-- <a-button type="primary" @click="importOrder">
          导入订单
        </a-button> -->
        <a-upload :show-upload-list="false"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :beforeUpload="beforeUpload">
          <a-button type="primary" :disabled="!hasPermission('purchaseOrderHead_upload')">
            导入订单
          </a-button>
        </a-upload>
        <a-button type="primary" :loading="templateExportLoading"
          :disabled="!hasPermission('purchaseOrderHead_download')" @click="templateDownload">
          下载模板
        </a-button>
      </a-button-group>
      <a-button-group>
        <checkboxList v-model="columns" width="320" />
        <a-button class="btnStyle" type="primary" :icon="screen ? 'fullscreen' : 'fullscreen-exit'" @click="screenBtn">
        </a-button>
      </a-button-group>
    </div>
    <!-- 表格 -->
    <div class="data-table" ref="dataTable">
      <a-table :loading="tableLoading" :columns="columns" :data-source="tableData" :pagination="false"
        :scroll="{ y: tableYHeight, x: 300 }" rowKey="id" :row-selection="{
          columnWidth: 50,
          onChange: rowSelectionChange,
          selectedRowKeys: selectedRowKeys,
        }">
        <span slot="poCode" slot-scope="text, record">
          <a-button type="link" @click="details(record)">
            {{ text }}
          </a-button>
        </span>
        <span slot="operation" slot-scope="text, record">
          <!-- 国内订单查看订单 -->
          <a-button type="link" @click="details(record)" v-if="record.poType === 1"
            :disabled="!hasPermission('purchaseOrderHead_view')">
            查看订单
          </a-button>
          <!-- 国际订单查看订单 -->
          <a-button type="link" @click="details(record)" v-if="record.poType === 2"
            :disabled="!hasPermission('globalPurchaseOrderHead_add_two')">
            查看订单
          </a-button>

          <!-- 国内订单编辑 -->
          <a-button type="link" @click="edit(record)"
            v-if="record.poType === 1 && !record.roId && record.poState !== 220"
            :disabled="!hasPermission('purchaseOrderHead_update')">
            编辑
          </a-button>
          <!-- 国际订单编辑 -->
          <a-button type="link" @click="edit(record)"
            v-if="record.poType === 2 && !record.roId && record.poState !== 220"
            :disabled="!hasPermission('globalPurchaseOrderHead_update')">
            编辑
          </a-button>
          <a-button type="link" @click="submit(record)" v-if="record.poState === 201" :disabled="
            record.poState === 201 &&
            !hasPermission('purchaseOrderHead_confirm')
          ">
            确认
          </a-button>
          <a-button type="link" @click="abolish(record)" v-if="record.poState !== 202 && record.poState !== 220"
            :disabled="!hasPermission('purchaseOrderHead_abolish')">
            撤回
          </a-button>
          <a-button type="link" @click="printDetails(record)" :disabled="!hasPermission('purchaseOrderHead_print')">
            打印
          </a-button>
          <a-button type="link" @click="edit(record, 'copy')" v-if="!record.roId && record.poState !== 220"
            :disabled="!hasPermission('purchaseOrderHead_copy')">
            复制
          </a-button>
        </span>
      </a-table>
      <!-- 分页 -->
      <div class="pagination">
        <a-pagination :page-size-options="['10', '20', '30', '40', '50']" :total="pagination.total" show-size-changer
          :page-size="pagination.pageSize" show-quick-jumper :current="pagination.pageIndex"
          :show-total="(total) => `共 ${total} 条记录`" @change="pageIndexChange" @showSizeChange="pageSizeChange">
        </a-pagination>
      </div>
    </div>
    <!-- 详情 -->
    <p-details ref="pDetails"></p-details>
    <!-- 新增修改 -->
    <!-- <p-addandedit ref="pAddandedit"></p-addandedit> -->
    <!-- 资金申请 -->
    <p-tourist ref="pTourist"></p-tourist>
    <!-- 打印 -->
    <p-printOrder ref="pPrintOrder"></p-printOrder>
    <p-print-details ref="pPrintDetails"></p-print-details>
    <!-- 导入 -->
    <p-importOrder ref="pImportOrder"></p-importOrder>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import {
  purchaseOrderHeadGetListPage,
  purchaseOrderHeadToConfirm,
  purchaseOrderHeadToAbolish,
  purchaseGlobalOrderExport,
  importExcel,
  exportTemplate
} from "../../services/purchaseSaleInventory";
import { formatDate } from "../../utils/util";
import pDetails from "./details.vue";
import pPrintDetails from "./printDetails.vue";
// import pAddandedit from "./addAndEdit.vue";
import pTourist from "./tourist.vue";
import pPrintOrder from "./printOrder.vue";
import pImportOrder from "./importOrder.vue";
import { partnerType } from "../../services/userMa";
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy';
export default {
  mixins: [mixin],
  name: "purchaseOrder",
  components: {
    pDetails,
    pPrintDetails,
    // pAddandedit,
    pTourist,
    pPrintOrder,
    pImportOrder,
  },
  data() {
    return {
      PartnerData: [],
      screen: !0,
      exportLoading: false,
      tableLoading: false,
      templateExportLoading: false,
      searchform: {
        poState: "",
        poCode: "",
        roCode: "",
        soCode: "",
        orderCode: "",
        supplierName: "",
        agencyName: "",
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
          dataIndex: "poCode",
          title: "采购订单号",
          width: 200,
          align: "center",
          scopedSlots: { customRender: "poCode" },
        },
        {
          title: "柜号",
          dataIndex: "containerCode",
          width: 200,
          align: "center",
        },
        {
          title: "需求订单号",
          dataIndex: "roCode",
          width: 200,
          align: "center",
        },
        {
          title: "销售订单号",
          dataIndex: "soCode",
          width: 200,
          align: "center",
        },

        {
          title: "外部订单号",
          dataIndex: "orderCode",
          width: 200,
          align: "center",
        },
        {
          title: "采购订单提交时间",
          dataIndex: "poSubtime",
          width: 200,
          align: "center",
        },
        {
          title: "供应商名称",
          dataIndex: "supplierName",
          width: 250,
          align: "center",
        },
        {
          title: "代理公司名称",
          dataIndex: "agencyName",
          width: 250,
          align: "center",
        },
        {
          title: "采购账户",
          dataIndex: "buyerAccountName",
          width: 250,
          align: "center",
        },
        {
          title: "供应商联系手机",
          dataIndex: "supplierPhone",
          width: 200,
          align: "center",
        },
        // {
        //   title: "采购重量",
        //   dataIndex: "purchaseWeight",
        //   width: 100,
        //   align: "center",
        // },
        {
          title: "采购件数",
          dataIndex: "purchaseQty",
          width: 100,
          align: "center",
        },
        {
          title: "采购总价",
          dataIndex: "poTotalAmount",
          width: 100,
          align: "center",
        },
        {
          title: "订单类型",
          dataIndex: "poTypeShow",
          width: 100,
          align: "center",
        },
        {
          title: "订单状态",
          dataIndex: "poStateShow",
          width: 100,
          align: "center",
        },
        {
          title: "收货时间",
          dataIndex: "deliveryTime",
          width: 200,
          align: "center",
        },
        {
          title: "签收时间",
          dataIndex: "signingTime",
          width: 200,
          align: "center",
        },
        {
          title: "收货地点",
          dataIndex: "deliveryAdress",
          width: 200,
          align: "center",
        },
        {
          title: '关联合同',
          dataIndex: 'contractTitle',
          width: 240
        },
        {
          title: "操作",
          key: "operation",
          dataIndex: "operation",
          width: 300,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
      rowSelectionChangeData: [],
      selectedRowKeys: [],
    };
  },
  methods: {
    supplierStrategy: PARTNER_STRATEGY.SUPPLIER,
    agencyStrategy: PARTNER_STRATEGY.AGENCY,
    getPartnerData() {
      // 收款主体，供应商/代理公司
      const params = {
        partnerTypes: [30, 40],
      };
      partnerType(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.PartnerData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    supplierNameSelect(id) {
      var obj = this.PartnerData.find(item => item.id == id)
      this.searchform.supplierName = obj.partnerName
    },
    agencyNameSelect(id) {
      var obj = this.PartnerData.find(item => item.id == id)
      this.searchform.agencyName = obj.partnerName
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    templateDownload() {
      this.templateExportLoading = true
      exportTemplate().then(
        res => {
          this.templateExportLoading = false
          if (res.data.type === "application/vnd.ms-excel" || res.data.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : 'Excel模板'
            this.getErrExcel(res.data, name)
          } else {
            this.$message.warn('下载失败')
          }
        }
      ).catch(() => this.templateExportLoading = false)
    },
    getErrExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], { type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    beforeUpload(file) {
      let formData = new FormData()
      formData.append("excel", file)
      importExcel(formData).then(
        res => {
          if (res.data.type.includes('application/vnd.ms-excel')) {
            this.$message.warn('上传失败,详情请看下载的文件......')
            let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : 'Excel文件'
            this.getErrExcel(res.data, name)
          } else if (res.data.size == 3 || res.data == 'suc') {
            this.$message.success('上传成功')
          } else if (res.data.size == 4 || res.data == 'noin') {
            this.$message.warn('无法定位表头......')
          } else if (res.data.size == 2 || res.data == 'er') {
            this.$message.warn('服务器内部错误......')
          } else if (res.data.size == 1 || res.data == 'n') {
            this.$message.warn('excel文件为空......')
          } else {
            this.$message.warn('未知错误......')
          }
        });
      return false;
    },
    downloadOrder() {
      const params = {
        ...this.searchform,
      };
      this.exportLoading = true;
      purchaseGlobalOrderExport(params).then((res) => {
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
      link.setAttribute("download", "采购订单列表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    importOrder() {
      this.$refs.pImportOrder.openModal();
    },
    submit(row) {
      const that = this;
      this.$confirm({
        title: "确认订单",
        content: "确定要确认这条订单吗？",
        okText: "确认",
        okType: "primary",
        cancelText: "取消",
        onOk() {
          const params = {
            id: row.id,
          };
          purchaseOrderHeadToConfirm(params).then((res) => {
            const data = res.data;
            if (data.code === "200") {
              that.getTableList();
              that.$message.success(data.message);
            } else {
              that.$message.error(data.message);
            }
          });
        },
        onCancel() {
          that.$message.warning("取消");
        },
      });
    },
    abolish(row) {
      const that = this;
      this.$confirm({
        title: "撤回订单",
        content: "确定要撤回这条订单吗？",
        okText: "确认",
        okType: "primary",
        cancelText: "取消",
        onOk() {
          const params = {
            id: row.id,
          };
          purchaseOrderHeadToAbolish(params).then((res) => {
            const data = res.data;
            if (data.code === "200") {
              that.getTableList();
              that.$message.success(data.message);
            } else {
              that.$message.error(data.message);
            }
          });
        },
        onCancel() {
          that.$message.warning("取消");
        },
      });
    },
    rowSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.rowSelectionChangeData = selectedRows;
    },
    print() {
      if (this.rowSelectionChangeData.length === 0) {
        this.$message.error("请选择一条数据进行操作！");
        return false;
      }
      if (this.rowSelectionChangeData.length > 1) {
        this.$message.error("最多只能选择一条数据！");
        return false;
      }
      this.$refs.pPrintOrder.openModal(this.rowSelectionChangeData[0]);
    },
    printDetails(record) {
      this.$refs.pPrintDetails.openModal(record);
    },
    tourist() {
      if (this.rowSelectionChangeData.length === 0) {
        this.$message.error("请选择一条数据进行操作！");
        return false;
      }
      this.$refs.pTourist.openModal(this.rowSelectionChangeData);
    },
    add(type) {
      // this.$refs.pAddandedit.openModal(type, "add");
      this.$router.push({
        path: "/enterSaleStore/purchase/purchaseOrderHeadAddEdit",
        query: {
          type: type,
          state: "add",
        },
      });
    },
    edit(row, copy) {
      // if (row.roId) {
      //   this.$router.push({
      //     path: "/enterSaleStore/purchase/requireOrderConfirm",
      //     query: { id: row.roId },
      //   });
      // }
      // else {
      copy && (row.copy = "copy")
      let type = row.poType;
      switch (type) {
        case 1:
          // this.$refs.pAddandedit.openModal("gn", "edit", row);
          this.$router.push({
            path: "/enterSaleStore/purchase/purchaseOrderHeadAddEdit",
            query: {
              type: "gn",
              state: "edit",
              row: row,
            },
          });
          break;
        case 2:
          // this.$refs.pAddandedit.openModal("gj", "edit", row);
          this.$router.push({
            path: "/enterSaleStore/purchase/purchaseOrderHeadAddEdit",
            query: {
              type: "gj",
              state: "edit",
              row: row,
            },
          });
          break;
      }
      // }
    },
    details(row) {
      this.$refs.pDetails.openModal(row);
    },
    search() {
      this.pagination.pageIndex = 1;
      this.getTableList();
    },
    clearSearch() {
      this.searchform = {
        poState: "",
        poCode: "",
        roCode: "",
        soCode: "",
        orderCode: "",
        supplierName: "",
        agencyName: "",
        containerCode: "",
      };
    },
    getTableList() {
      const params = {
        direction: this.pagination.direction,
        sortName: this.pagination.sortName,
        pageSize: this.pagination.pageSize,
        queryParam: {
          ...this.searchform,
        },
        currentPage: this.pagination.pageIndex,
      };
      this.tableLoading = true;
      purchaseOrderHeadGetListPage(params).then((res) => {
        this.selectedRowKeys = [];
        this.tableLoading = false;
        const data = res.data;
        if (data.code === "200") {
          this.tableData = data.data || [];
          this.pagination.total = data.totalNum;
          //处理时间
          this.tableData.forEach((item) => {
            item.poSubtime
              ? (item.poSubtime = formatDate(
                new Date(item.poSubtime),
                "yyyy-MM-dd hh:mm:ss"
              ))
              : (item.poSubtime = "-");
            item.deliveryTime
              ? (item.deliveryTime = formatDate(
                new Date(item.deliveryTime),
                "yyyy-MM-dd hh:mm:ss"
              ))
              : (item.deliveryTime = "-");
            item.signingTime
              ? (item.signingTime = formatDate(
                new Date(item.signingTime),
                "yyyy-MM-dd hh:mm:ss"
              ))
              : (item.signingTime = "-");

            //
            switch (item.poState) {
              case 201:
                item.poStateShow = "采购订单草稿";
                break;
              case 210:
                item.poStateShow = "待收货";
                break;
              case 202:
                item.poStateShow = "已作废";
                break;
              case 220:
                item.poStateShow = "已收货";
                break;
              case 230:
                item.poStateShow = "待采购";
                break;
              default:
                item.poStateShow = "-";
                break;
            }
            switch (item.poType) {
              case 1:
                item.poTypeShow = "国内订单";
                break;
              case 2:
                item.poTypeShow = "国际订单";
                break;
              default:
                item.poTypeShow = "-";
                break;
            }

            // item.poTotalAmount = item.poTotalAmount / 100;
            item.purchaseWeight = item.purchaseWeight
              ? item.purchaseWeight / 1000
              : 0;
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
    this.getPartnerData();
  },
};
</script>


<style scoped lang="less">
@import "index.less";

.btnStyle {
  width: 50px;
}
</style>