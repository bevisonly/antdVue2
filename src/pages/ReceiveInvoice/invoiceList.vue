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
                  <a-form-item label="客户名称">
                    <a-select
                      show-search
                      v-model="searchform.customerId"
                      style="width: 100%"
                      placeholder="请输入客户名称"
                      :filter-option="filterOption"
                      allowClear
                      @change="handleChange"
                      :disabled="!searchform.opId"
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
                  <a-form-item label="门店名称">
                    <a-select
                      show-search
                      v-model="searchform.storeId"
                      style="width: 100%"
                      placeholder="请输入门店名称"
                      :filter-option="filterOption"
                      allowClear
                      @change="handleChangeStore"
                      :disabled="!searchform.opId || !searchform.customerId"
                    >
                      <a-select-option
                        v-for="d in storeList"
                        :key="d.id"
                        :value="d.id"
                      >
                        {{ d.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="开票状态">
                    <a-select
                      show-search
                      v-model="searchform.issueState"
                      style="width: 100%"
                      placeholder="选择开票状态"
                      allowClear
                    >
                      <a-select-option :value="0"
                        >待申请（未开票）
                      </a-select-option>
                      <a-select-option :value="1">全部开票 </a-select-option>
                      <a-select-option :value="2">已红冲 </a-select-option>
                      <a-select-option :value="3">已蓝补 </a-select-option>
                      <a-select-option :value="4">部分开票 </a-select-option>
                      <a-select-option :value="5">待开票 </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="领票状态">
                    <a-select
                      show-search
                      v-model="searchform.collectState"
                      style="width: 100%"
                      placeholder="选择领票状态"
                      allowClear
                    >
                      <a-select-option :value="1">待领票 </a-select-option>
                      <a-select-option :value="2">部分领票 </a-select-option>
                      <a-select-option :value="3">全部领票 </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="结算单号">
                    <a-input
                      v-model.trim="searchform.arInvoiceCode"
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
                <a-col :span="6">
                  <a-form-item label="发票名称">
                    <a-select
                      show-search
                      v-model="searchform.invoiceType"
                      style="width: 100%"
                      placeholder="选择发票名称"
                      allowClear
                    >
                      <a-select-option :value="1"
                        >增值税普通发票
                      </a-select-option>
                      <a-select-option :value="2"
                        >增值税专用发票</a-select-option
                      >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="申请开票时间">
                    <a-range-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      showTime
                      @change="handleDateChange"
                      :placeholder="['开始时间', '结束时间']"
                      v-model="searchform.applyDate"
                    ></a-range-picker>
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
              getCheckboxProps: (record) => ({
                props: {
                  disabled: record.issueState === 1,
                },
              }),
            }"
            @change="tableChange"
            rowKey="id"
            :scroll="{ x: 1100 }"
            @refresh="searchList"
          >
            <span slot="invoiceType" slot-scope="{ text }">
              <span v-if="text == 1">增值税普通发票</span>
              <span v-if="text == 2">增值税专用发票</span>
            </span>
            <span slot="chargeReceived" slot-scope="{ text }">
              <span v-if="text == 1">已收货款</span>
              <span v-if="text == 0">未收货款</span>
            </span>
            <span slot="issueState" slot-scope="{ text }">
              <a-tag v-if="text == 0" color="grey">待申请</a-tag>
              <a-tag v-if="text == 1" color="green">全部开票</a-tag>
              <a-tag v-if="text == 2" color="red">已红冲</a-tag>
              <a-tag v-if="text == 3" color="blue">已蓝补</a-tag>
              <a-tag v-if="text == 4" color="orange">部分开票</a-tag>
              <a-tag v-if="text == 5" color="skyblue">待开票</a-tag>
            </span>
            <span slot="collectState" slot-scope="{ text }">
              <a-tag v-if="text == 1">待领票</a-tag>
              <a-tag v-if="text == 2">部分领票</a-tag>
              <a-tag v-if="text == 3">全部领票</a-tag>
            </span>
            <span slot="invoiceRate" slot-scope="{ text }">
              <span v-if="text||text==0">
                {{text}}%
              </span>
            </span>
            <template slot="operation" slot-scope="{ record }">
              <div>
                <a-button type="link" @click="toDetails(record)" :disabled='!hasPermission("aRreceipt_detail")'>查看</a-button>
                <a-button
                  type="link"
                  @click="toRegister('', record)"
                  :disabled="record.issueState == 1||!hasPermission('aRreceipt_register')"
                  >开立发票</a-button
                >
              </div>
            </template>
            <template slot="footer">
              <div>
                本页合计：
                <span>结算单：<span class="font-color">{{tableList.length||0}}</span>笔&nbsp;</span>
              <span v-for="(item, j) in footerTotal" :key="item.name">
                <span class="greyfont">{{ item.name }}</span
                >：&nbsp;
                <span class="font-color">{{
                  tableList.reduce(
                    (t, c) => formatPrice(+t + +c[item.value]),
                    0
                  )
                }}</span>
                <a-divider
                  v-show="j != footerTotal.length - 1"
                  type="vertical"
                />
              </span>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "../../utils/mixins";
import { getPartner, GetOpList } from "../../services/signed/signed";
import advanceTable from "../../components/table/advance";
import invoiceRegister from "./invoiceRegister.vue";
import { GetList, exportData } from "../../services/settlement/receive/invoice";
const columns = [
  {
    align: "center",
    title: "单据编号",
    dataIndex: "arInvoiceCode",
    width: 180,
  },
  {
    align: "center",
    title: "申请开票日期",
    dataIndex: "applyDate",
    width: 150,
  },
  {
    align: "center",
    title: "开票主体名称",
    dataIndex: "opName",
    width: 200,
  },
  {
    align: "center",
    title: "客户名称",
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
    title: "发票名称",
    dataIndex: "invoiceType",
    width: 150,
    scopedSlots: { customRender: "invoiceType" },
  },
  {
    align: "center",
    title: "开票状态",
    dataIndex: "issueState",
    width: 100,
    scopedSlots: { customRender: "issueState" },
  },
  {
    align: "center",
    title: "领票状态",
    dataIndex: "collectState",
    width: 100,
    scopedSlots: { customRender: "collectState" },
  },
  {
    align: "center",
    title: "申请开票金额",
    dataIndex: "invoiceAmount",
    width: 150,
  },
  {
    align: "center",
    title: "已开票金额",
    dataIndex: "invoiceAmounted",
    width: 150,
  },
  {
    align: "center",
    title: "待开票金额",
    dataIndex: "waitInvoiceAmount",
    width: 150,
  },

  {
    align: "center",
    title: "发票代码",
    dataIndex: "invoiceCode",
    width: 150,
    scopedSlots: { customRender: "invoiceCode" },
  },
  {
    align: "center",
    title: "发票号码",
    dataIndex: "invoiceNumber",
    width: 150,
    scopedSlots: { customRender: "invoiceNumber" },
  },
  {
    align: "center",
    title: "货款是否收取",
    dataIndex: "chargeReceived",
    width: 150,
    scopedSlots: { customRender: "chargeReceived" },
  },
  {
    align: "center",
    title: "发票税率",
    dataIndex: "invoiceRate",
    width: 100,
    scopedSlots: { customRender: "invoiceRate" },

  },
  {
    align: "center",
    title: "预计收款周期",
    dataIndex: "receivedCycle",
    width: 150,
  },
  {
    align: "center",
    title: "不含税金额",
    dataIndex: "includingTaxAmount",
    width: 150,
  },
  {
    align: "center",
    title: "扣点金额",
    dataIndex: "deductionAmount",
    width: 100,
  },
  {
    align: "center",
    title: "应收金额",
    dataIndex: "receivableAmount",
    width: 100,
  },
  {
    align: "center",
    title: "包装金额",
    dataIndex: "packTotalAmount",
    width: 100,
  },
  {
    align: "center",
    title: "账单日期",
    dataIndex: "billDate",
    width: 150,
  },
  {
    align: "center",
    title: "账单生成日期",
    dataIndex: "billCreateDate",
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
        apInvoiceCode: undefined,
        applyDateStart: undefined,
        applyDateEnd: undefined,
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
        { name: "合并开立发票", disabled: false },
      ],
      orgId: "",
      storeList: [],
      stateTxt: ["未收款", "部分收款", "已收款", "已核销"],
       footerTotal: [
        { name: "申请开票金额", value: "invoiceAmount" },
        { name: "已开发票金额", value: "invoiceAmounted" },
        { name: "待开发票金额", value: "waitInvoiceAmount" },
       
      ],
    };
  },
  activated() {
    this.getList();
    // this.getPartner();
    this.getOp();
    this.$setPageTitle(
      "/balance/receiveable/ArInvoiceReceipt",
      "应收-发票管理"
    );
  },
  created() {
    this.btnList.forEach((item) => {
      if (item.name == "导出列表" && !this.hasPermission("aRreceipt_export")) {
        item.disabled = true;
      }
      if (
        item.name == "合并开立发票" &&
        !this.hasPermission("aRreceipt_register_batch")
      ) {
        item.disabled = true;
      }
    });
  },
  methods: {
    toDetails(record) {
      this.$router.push({
        path: "/balance/receiveable/arInvoiceDetails",
        query: {
          id: record.id||'',
        },
      });
    },
    toRegister(state, record) {
      if (state == "batch") {
        if (this.selectedList && this.selectedList.length > 0) {
          if (
            this.selectedList.findIndex(
              (item) =>
                item.opId != this.selectedList[0].opId ||
                item.customerId != this.selectedList[0].customerId ||
                item.invoiceType != this.selectedList[0].invoiceType ||
                item.payName != this.selectedList[0].payName ||
                item.payTaxNo != this.selectedList[0].payTaxNo ||
                item.payBank != this.selectedList[0].payBank ||
                item.taxNo != this.selectedList[0].taxNo ||
                item.depositBank != this.selectedList[0].depositBank ||
                item.invoiceRate != this.selectedList[0].invoiceRate
            ) != -1
          ) {
            this.$info({
              title: "提示",
              content:
                "仅支持将相同主体、客户、发票名称、开票税率、购买方开户行及账号的结算单合并登记为一张发票上，请确认",
              okText: "关闭",
              centered: true,
            });
            return;
          }
          this.$refs.invoiceRegister.showModal(
            this.selectedList,
            1,
            "invoiceList"
          );
        } else {
          this.$message.info("未选中任何数据");
          return;
        }
      } else {
        this.$refs.invoiceRegister.showModal(record, "", "invoiceList");
      }
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
        case "合并开立发票":
          this.spinning = false;
          this.toRegister("batch");
          break;

        default:
          break;
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedList = [];
      this.selectedRowKeys = [];
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
      this.searchform.customerId = "";
      this.searchform.customerName = "";
      this.searchform.storeId = "";
      this.searchform.storeName = "";
      if (!value) {
        this.searchform.opName = "";
        this.getOp("");
        return;
      }
      this.opList.forEach((item) => {
        if (value === item.id) {
          this.searchform.opName = item.opName;
          this.orgId = item.orgId || "";
        }
      });
      this.getPartner(20, "", this.orgId);
    },
    opSearch(value) {
      this.getOp(value);
    },
    async getOp(value) {
      const res = await GetOpList({ opName: value || "" });
      this.opList = res.data.data || [];
    },
    handleDateChange(val) {
      this.searchform.applyDateStart = val[0];
      this.searchform.applyDateEnd = val[1];
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
      exportData(params)
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
      link.setAttribute("download", "应收-发票管理列表");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async getPartner(type, parentId, orgId) {
      const params = {
        partnerType: type,
        parentId: parentId || "",
        orgId: orgId || "",
      };
      let res = await getPartner(params);
      if (res.data.code == 200) {
        switch (type) {
          case 20:
            this.partnerList = res.data.data;
            break;
          case 22:
            this.storeList = res.data.data;
            break;

          default:
            break;
        }
      }
    },
    handleReset() {
      this.searchform = {};
    },
    searchList() {
      this.pagination.page = 1;
      this.getList();
    },
    handleChange(option) {
      this.searchform.storeId = undefined;
      this.searchform.storeName = "";
      if (option) {
        this.getPartner(22, option, this.orgId);
      }
      if (option === undefined) this.searchform.customerName = undefined;
      this.partnerList.forEach((item) => {
        if (option == item.id) {
          this.searchform.customerName = item.partnerName;
        }
      });
    },
    handleChangeStore(option) {
      if (option === undefined) this.searchform.storeName = undefined;
      this.storeList.forEach((item) => {
        if (option == item.id) {
          this.searchform.storeName = item.partnerName;
        }
      });
      this.$forceUpdate();
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
  },
};
</script>
<style scoped lang="less">
@import "index";
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