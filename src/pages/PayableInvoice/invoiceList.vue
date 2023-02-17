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
          <div slot="extra">
            <a-button
              type="link"
              v-if="searchState"
              @click="searchChange(false)"
            >
              收起<a-icon type="down"></a-icon>
            </a-button>
            <a-button
              type="link"
              v-if="!searchState"
              @click="searchChange(true)"
            >
              展开
              <a-icon type="up"></a-icon>
            </a-button>
          </div>
          <div class="search" v-if="searchState">
            <a-form :form="searchform">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="运营主体">
                    <a-select
                      style="width: 100%"
                      show-search
                      allowClear
                      v-model.trim="searchform.opId"
                      placeholder="请输入运营主体名称"
                      :default-active-first-option="false"
                      :filter-option="filterOption"
                      :not-found-content="null"
                      @search="opSearch"
                      @change="opChange"
                    >
                      <a-select-option v-for="item in opList" :key="item.id">{{
                        item.opName
                      }}</a-select-option>
                    </a-select></a-form-item
                  >
                </a-col>
                <a-col :span="6">
                  <a-form-item label="供应商名称">
                    <a-select
                      show-search
                      v-model="searchform.supplierId"
                      style="width: 100%"
                      placeholder="请输入供应商名称"
                      :filter-option="filterOption"
                      allowClear
                      @change="handleChange"
                      :disabled='!searchform.opId'
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
                  <a-form-item label="发票状态">
                    <a-select
                      show-search
                      v-model="searchform.invoiceRegisterState"
                      style="width: 100%"
                      placeholder="选择发票状态"
                      allowClear
                    >
                      <a-select-option :value="1">待登记 </a-select-option>
                      <a-select-option :value="2">已登记 </a-select-option>
                      <a-select-option :value="3">审核失败 </a-select-option>
                      <a-select-option :value="4">已修正 </a-select-option>
                      <a-select-option :value="5">已核销 </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="账单生成日期">
                    <a-range-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      showTime
                      @change="handleDateChange"
                      :placeholder="['开始时间', '结束时间']"
                      v-model="searchform.createDate"
                    ></a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="结算单号">
                    <a-input
                      v-model.trim="searchform.apInvoiceCode"
                      placeholder="请输入结算单编号"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="发票代码">
                    <a-input
                      v-model.trim="searchform.invoiceCode"
                      placeholder="请输入发票代码"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="发票号码">
                    <a-input
                      v-model.trim="searchform.invoiceNumber"
                      placeholder="请输入发票号码"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item style="margin-top: 39px">
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
          <advanceTable
            :columns="columns"
            title=""
            size="middle"
            :dataSource="tableList"
            :btnList="btnList"
            @btnListClick="tableBtn($event)"
            :loading="spinning"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            @change="tableChange"
            rowKey="id"
            :scroll="{ x: 1100 }"
            @refresh="searchList"
          >
            <span slot="invoiceNumber" slot-scope="{ text }">
              <span v-if="text">
                <span v-if="text.indexOf(',') == -1"> {{ text }}</span>
                <span v-else>
                  <a-tooltip>
                    <template slot="title">
                      {{ text }}
                    </template>
                    {{ text.split(",")[0] }}...
                  </a-tooltip>
                </span>
              </span>
              <span v-else>-</span>
            </span>
            <span slot="invoiceCode" slot-scope="{ text }">
              <span v-if="text">
                <span v-if="text.indexOf(',') == -1">{{ text }}</span>
                <span v-else>
                  <a-tooltip>
                    <template slot="title">
                      {{ text }}
                    </template>
                    {{ text.split(",")[0] }}...
                  </a-tooltip>
                </span>
              </span>
              <span v-else>-</span>
            </span>
            <span slot="fileList" slot-scope="{ record }">
              <span v-if="record.fileList">
                <span
                  v-for="(item, index) in record.fileList.slice(0, 5)"
                  :key="index"
                >
                  <img
                    class="invoice-img"
                    :src="item.filePath"
                    @click="bigImg(item.filePath)"
                    alt="发票"
                  />
                </span>
                <span v-if="record.fileList.length > 5">...</span>
              </span>
              <span v-else>-</span>
            </span>
            <span slot="dataType" slot-scope="{ text }">
              <span v-if="text == 1">尾款</span>
              <span v-if="text == 2">预付款</span>
            </span>
            <span slot="invoiceRegisterState" slot-scope="{ text, record }">
              <a-tag v-if="text == 1" color="blue">待登记</a-tag>
              <a-tag v-if="text == 2" color="orange">已登记</a-tag>
              <a-tooltip v-if="text == 3">
                <template slot="title"> {{ record.auditMsg }} </template>
                <a-tag color="red">审核失败</a-tag>
              </a-tooltip>
              <a-tag v-if="text == 4" color="purple">已修正</a-tag>
              <a-tag v-if="text == 5" color="green">已核销</a-tag>
            </span>
            <span slot="settleCycle" slot-scope="{ text }">
              <span v-if="text == 1">自然月底</span>
              <span v-if="text == 2">每月15日</span>
              <span v-if="text == 3">自定义</span>
            </span>
            <template slot="operation" slot-scope="{ record }">
              <div>
                <a-button
                  type="link"
                  @click="toDetails(record)"
                  :disabled="
                    !hasPermission('invoice_view')
                  "
                  >详情</a-button
                >
                <a-button
                  type="link"
                  @click="toRegister('', record)"
                  :disabled="
                    record.invoiceRegisterState == 5 ||
                    !hasPermission('invoice_regist')
                  "
                  >登记发票</a-button
                >
              </div>
            </template>
            <template slot="footer">
              <div>
                本页合计 :
                <span class="footer-1"
                  >结算单 :
                  <span class="font-color">{{ tableList.length }}</span>
                  笔</span
                >
                <span class="footer-2" style="margin-left: 14px"
                  >应付金额 :
                  <span class="font-color">{{ settlementAmountTo }}</span></span
                >
                <span class="footer-3" style="margin-left: 14px"
                  >发票金额 :
                  <span class="font-color">{{ invoiceAmountTo }}</span></span
                >
              </div>
            </template>
          </advanceTable>
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
    <invoiceRegister ref="invoiceRegister" />
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
      width="40%"
    >
      <img alt="发票" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "../../utils/mixins";
import { getPartner, GetOpList } from "../../services/signed/signed";
import advanceTable from "../../components/table/advance";
import invoiceRegister from "./invoiceRegister.vue";
import {
  GetList,
  ViewInvoiceRegister,
  ExportReceipt,
} from "../../services/settlement/payable/invoice";
const columns = [
  {
    align: "center",
    title: "结算单号",
    dataIndex: "apInvoiceCode",
    width: 150,
  },
  {
    align: "center",
    title: "账单生成日期",
    dataIndex: "createDate",
    width: 150,
  },
  {
    align: "center",
    title: "结算类型",
    dataIndex: "dataType",
    width: 100,
    scopedSlots: { customRender: "dataType" },
  },
  {
    align: "center",
    title: "供应商名称",
    dataIndex: "supplierName",
    width: 100,
  },
  {
    align: "center",
    title: "应付金额",
    dataIndex: "settlementAmount",
    width: 100,
  },
  {
    align: "center",
    title: "发票状态",
    dataIndex: "invoiceRegisterState",
    width: 100,
    scopedSlots: { customRender: "invoiceRegisterState" },
  },
  {
    align: "center",
    title: "发票金额",
    dataIndex: "invoiceAmount",
    width: 100,
  },
  {
    align: "center",
    title: "关联发票代码",
    dataIndex: "invoiceCode",
    width: 150,
    scopedSlots: { customRender: "invoiceCode" },
  },
  {
    align: "center",
    title: "关联发票号码",
    dataIndex: "invoiceNumber",
    width: 150,
    scopedSlots: { customRender: "invoiceNumber" },
  },
  {
    align: "center",
    title: "发票图片",
    dataIndex: "fileList",
    width: 150,
    scopedSlots: { customRender: "fileList" },
  },
  {
    align: "center",
    title: "已付金额",
    dataIndex: "payAmounted",
    width: 100,
  },
  { align: "center", title: "未付金额", dataIndex: "noPayAmount", width: 100 },
  { align: "center", title: "预付金额", dataIndex: "payAmount", width: 100 },
  {
    align: "center",
    title: "折扣金额",
    dataIndex: "discountAmount",
    width: 100,
  },
  {
    align: "center",
    title: "结算周期",
    dataIndex: "settleCycle",
    width: 100,
    scopedSlots: { customRender: "settleCycle" },
  },
  {
    align: "center",
    title: "账单日期",
    dataIndex: "billDate",
    width: 150,
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "operation",
    width: 200,
    fixed: "right",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  name: "invoiceList",
  mixins: [mixin],
  components: { advanceTable, invoiceRegister },
  data() {
    return {
      exportLoading: false,
      selectedRowKeys: [],
      spinning: false,
      columns,
      tableList: [],
      searchform: {
        supplierId: undefined,
        apInvoiceCode: undefined,
        createDateStart: undefined,
        createDateEnd: undefined,
        createDate: [],
      },
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        order: "desc",
      },
      partnerList: [],
      selectedList: [],
      pageState: "",
      opList: [],
      searchState: true,
      btnList: [
        { name: "导出列表", disabled: false },
        { name: "批量登记", disabled: false },
      ],
      previewVisible: false,
      previewImage: "",
    };
  },
  activated() {
    this.getList();
    // this.getPartner();
    this.getOp();
    this.$setPageTitle('/balance/payable/apInvoiceListInvoice','应付-发票管理')
  },
  created() {
    this.btnList.forEach((item) => {
      if (item.name == "导出列表" && !this.hasPermission("invoice_export")) {
        item.disabled = true;
      }
      if (
        item.name == "批量登记" &&
        !this.hasPermission("invoice_regist_batch")
      ) {
        item.disabled = true;
      }
    });
  },
  methods: {
    //图
    bigImg(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    toDetails(record) {
      this.$router.push({
        path: "/balance/payable/payableInvoiceDetails",
        query: {
          state: 0,
          record: record,
        },
      });
    },
    toRegister(state, record) {
      let apInvoiceCodeList = [];
      if (state) {
        if (this.selectedList && this.selectedList.length > 0) {
          if (
            this.selectedList.findIndex(
              (item) =>
                item.opId != this.selectedList[0].opId ||
                item.supplierId != this.selectedList[0].supplierId
            ) != -1
          ) {
            this.$info({
              title: "提示",
              content: "仅支持同一主体及供应商账单批量登记，请确认",
              okText: "关闭",
              centered: true,
            });
            return;
          }
        } else {
          this.$message.info("未选中任何数据");
          return;
        }
        this.selectedList.forEach((item) => {
          apInvoiceCodeList.push(item.apInvoiceCode);
        });
      }
      if (record) {
        apInvoiceCodeList.push(record.apInvoiceCode);
      }
      const params = { id: state ? this.selectedList[0].id : record.id };
      this.spinning = true;
      ViewInvoiceRegister(params)
        .then((res) => {
          this.spinning = false;
          const data = res.data;
          if (data.code == 200) {
            this.$refs.invoiceRegister.showModal(data.data, apInvoiceCodeList);
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(() => {
          this.spinning = false;
          this.$message.error("连接错误");
        });
    },
    tableChange(pagination, filters, sorter, options) {
      console.log(pagination);
      console.log(filters);
      console.log(sorter);
      console.log(options);
    },
    tableBtn(value) {
      console.log(value);
      this.spinning = true;
      switch (value) {
        case "导出列表":
          this.exportItem();
          break;
        case "批量登记":
          this.spinning = false;
          this.toRegister("batch");
          break;

        default:
          break;
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedList = selectedRows;
      console.log(selectedRowKeys);
    },

    searchChange(val) {
      this.searchState = val;
    },
    resourceControl(value) {
      return !this.hasPermission(value);
    },
    opChange(value) {
      if (!value) {
        this.searchform.opName = "";
        this.searchform.supplierId = "";
        this.searchform.supplierName = "";
        this.getOp('')
        return;
      }
      let id
      this.opList.forEach((item) => {
        if (value === item.id) {
          this.searchform.opName = item.opName;
          id=item.orgId||''
        }
      });
      this.getPartner(id)
    },
    opSearch(value) {
      this.getOp(value);
    },
    async getOp(value) {
      const res = await GetOpList({ opName: value || "" });
      this.opList = res.data.data || [];
    },
    handleDateChange(val) {
      this.searchform.createDateStart = val[0];
      this.searchform.createDateEnd = val[1];
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

      GetList(params)
        .then((res) => {
          this.spinning = false;
          this.tableList = res.data.rows || [];
          this.pagination.total = res.data.total || 0;
        })
        .catch((error) => {
          console.log(error);
          this.spinning = false;
          this.$message.error("接口请求出错");
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
        ...temp,
      };
      this.spinning = true;
      ExportReceipt(params)
        .then((res) => {
          console.log(res);
          const data = res.data;
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
        })
        .catch(() => {
          this.spinning = false;
          this.$message.error("连接错误");
        });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      link.setAttribute("download", "应付-发票管理列表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    getPartner(value) {
      const params = {
        partnerType: 30,
        orgId:value||''
      };
      getPartner(params).then((res) => {
        if (res.data.code == 200) {
          this.partnerList = res.data.data;
        }
      });
    },
    handleReset() {
      this.searchform = {
        createDateStart: "",
        createDateEnd: "",
        createDate: [],
        supplierId: undefined,
        supplierName: "",
        opName: "",
        opId: undefined,
      };
    },
    searchList() {
      this.pagination.page = 1;
      this.getList();
    },
    handleChange(option) {
      if (option === undefined) this.searchform.supplierName = undefined;
      this.partnerList.forEach((item) => {
        if (option == item.id) {
          this.searchform.supplierName = item.partnerName;
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
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    settlementAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.settlementAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    invoiceAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.invoiceAmount ?? 0;
      });
      return this.formatPrice(num);
    },
  },
};
</script>
<style scoped lang="less">
@import "index";
.invoice-img {
  width: 24px;
  height: 16px;
  margin-left: 4px;
}
.font-color {
  color: green;
}
.search {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }

  /deep/.ant-card-head-title {
    padding: 0;
  }
}
.table-footer {
  span {
    margin: 0 10px;
  }
}
/deep/.ant-popover-inner-content {
  width: 300px !important;
  height: 200px !important;
  overflow: scroll;
}
</style>