<template>
  <div class="new-page">
    <a-spin :spinning="spinning">
      <div class="form-details">
        <a-form-model :model="form" :rules="rules" ref="infoform">
          <div class="info">
            <p class="info-title">基本信息</p>
            <div class="info-form">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="5">
                  <a-form-model-item label="规则名称" prop="taxRateRuleName">
                    <a-input
                      :disabled="pageState === 'details'"
                      v-model="form.taxRateRuleName"
                      placeholder="请输入规则名称"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="5">
                  <a-form-model-item label="状态" prop="state">
                    <a-select
                      :disabled="pageState === 'details'"
                      v-model="form.state"
                      placeholder="请选择状态"
                    >
                      <a-select-option :value="1"> 已生效 </a-select-option>
                      <a-select-option :value="2"> 已关闭 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="5">
                  <a-form-model-item label="备注" prop="remark">
                    <a-input
                      :disabled="pageState === 'details'"
                      v-model="form.remark"
                      type="textarea"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="5">
                  <a-form-model-item label="选择商品模式">
                    <a-radio-group
                      style="width: 100%"
                      :value="form.itemModel"
                      @change="handleRadioChange"
                      :disabled="pageState === 'details'"
                    >
                      <a-radio-button :value="1"> 自定义商品 </a-radio-button>
                      <a-radio-button :value="2"> 商品类型 </a-radio-button>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-form-model>
      </div>
      <div class="table">
        <p class="table-title flex-sb">
          <span>商品信息</span>
          <span v-if="form.itemModel === 1 && pageState !== 'details'">
            <a-button type="primary" size="small" @click="openPrudoct"
              >商品列表</a-button
            >
          </span>
        </p>
        <div
          class="table-search"
          v-if="form.itemModel === 1 && pageState !== 'details'"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-select
                allowClear
                style="width: 100%"
                show-search
                v-model="addItemValue"
                placeholder="请输入商品名称/编码/关键字"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="getItemsNoPage($event)"
                @popupScroll="handlePopupScroll"
                @select="getItemsNoPageSelect"
              >
                <a-spin
                  v-if="productLoading && dataItemSource.length === 0"
                  slot="notFoundContent"
                  size="small"
                ></a-spin>
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <div
                    style="padding: 0 8px 4px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                  >
                    <a-spin
                      v-if="productLoading && dataItemSource.length > 0"
                      size="small"
                    ></a-spin>
                  </div>
                </div>
                <a-select-option v-for="d in dataItemSource" :key="d.itemCode">
                  {{ d.itemName }}({{ d.itemCode }})
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-button type="primary" @click="addItem">添加</a-button>
            </a-col>
          </a-row>
        </div>
        <!-- 表格 -->
        <div class="table-data" ref="dataTable">
          <a-table
            v-show="form.itemModel === 1"
            :columns="columnsCustomEvent"
            :data-source="dataCustomEvent"
            :scroll="{ y: 400 }"
            rowKey="id"
            :pagination="paginationTable"
            @change="handleTableDataChange"
          >
            <span slot="taxRateTitle" class="table-formva">税率</span>
            <span slot="taxRate" slot-scope="text, record">
              <a-select
                allowClear
                v-if="pageState !== 'details'"
                v-model="record.taxRate"
                @click.stop.native
                placeholder="请选择税率"
                style="width: 90%; max-width: 300px"
              >
                <a-select-option :value="0"> 0 </a-select-option>
                <a-select-option :value="1"> 1 </a-select-option>
                <a-select-option :value="3"> 3 </a-select-option>
                <a-select-option :value="6"> 6 </a-select-option>
                <a-select-option :value="9"> 9 </a-select-option>
                <a-select-option :value="11"> 11 </a-select-option>
                <a-select-option :value="13"> 13 </a-select-option>
              </a-select>
              <span v-else>
                {{ record.taxRate }}
              </span>
              <span>%</span>
            </span>
            <span slot="del" slot-scope="text, record, index">
              <a-popconfirm
                :disabled="pageState === 'details'"
                title="确定要删除这条数据吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="delOne(record, index)"
                @cancel="cancel"
              >
                <a-button type="link" :disabled="pageState === 'details'">
                  删除
                </a-button>
              </a-popconfirm>
            </span>
          </a-table>
          <a-table
            v-show="form.itemModel === 2"
            :columns="columnsType"
            :data-source="dataType"
            :scroll="{ y: 300 }"
            rowKey="id"
            :pagination="paginationTable"
            @change="handleTableDataChange"
            :customRow="pageState === 'details' ? '' : handleCustomRow"
            :row-selection="
              pageState === 'details'
                ? null
                : {
                    columnWidth: 50,
                    onChange: rowSelectionChange,
                    selectedRowKeys: selectedRowKeys,
                  }
            "
          >
            <span slot="taxRateTitle" class="table-formva">税率</span>
            <span slot="taxRate" slot-scope="text, record">
              <a-select
                v-if="pageState !== 'details'"
                allowClear
                v-model="record.taxrate"
                @click.stop.native
                placeholder="请选择税率"
                style="width: 90%; max-width: 300px"
              >
                <a-select-option :value="0"> 0 </a-select-option>
                <a-select-option :value="1"> 1 </a-select-option>
                <a-select-option :value="3"> 3 </a-select-option>
                <a-select-option :value="6"> 6 </a-select-option>
                <a-select-option :value="9"> 9 </a-select-option>
                <a-select-option :value="11"> 11 </a-select-option>
                <a-select-option :value="13"> 13 </a-select-option>
              </a-select>
              <span v-else>
                {{ record.taxrate }}
              </span>
              <span>%</span>
            </span>
            <span slot="del" slot-scope="text, record, index">
              <a-popconfirm
                title="确定要删除这条数据吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="delOne(record, index)"
                @cancel="cancel"
              >
                <a-button type="link"> 删除 </a-button>
              </a-popconfirm>
            </span>
          </a-table>
        </div>
      </div>
      <div class="btns">
        <a-space>
          <a-button
            type="primary"
            @click="submit"
            v-if="pageState !== 'details'"
          >
            确定
          </a-button>
          <a-button type="primary" @click="back"> 返回 </a-button>
        </a-space>
      </div>
    </a-spin>
    <st-addItems ref="stAddItems"></st-addItems>
  </div>
</template>

<script>
import stAddItems from "./stAddItems.vue";
import { debounce } from "../../utils/util";
import { patchArray } from "../../utils/tool";
// import { debounce, isFalse } from "../../utils/util";
import { componentGetItems } from "../../services/sales";
import {
  taxrateInsert,
  itemGetItemTypeList,
  taxrateGetSingle,
  GetTaxRateItemsByTaxRateIdList,
  taxrateUpdate,
} from "../../services/rate";
export default {
  name: "addOutputRate",
  components: {
    stAddItems,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      spinning: false,
      addItemObj: {},
      form: {
        state: 1,
        taxRateRuleName: "",
        itemModel: 1,
        type: "",
        remark: "",
      },
      rules: {
        taxRateRuleName: [
          {
            required: true,
            message: "请输入规则名称",
            trigger: "blur",
          },
        ],
        state: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
      },
      rowSelection: null,
      tableLoading: false,
      dataCustomEvent: [],
      columnsCustomEvent: [
        {
          title: "商品名称",
          dataIndex: "itemName",
          align: "center",
        },
        {
          slots: { title: "taxRateTitle" },
          dataIndex: "taxRate",
          align: "center",
          scopedSlots: { customRender: "taxRate" },
        },
        {
          dataIndex: "del",
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "del" },
        },
      ],
      columnsType: [
        {
          title: "一级分类",
          dataIndex: "parentName",
          align: "center",
        },
        {
          title: "二级分类",
          dataIndex: "typeName",
          align: "center",
        },
        {
          slots: { title: "taxRateTitle" },
          dataIndex: "taxRate",
          align: "center",
          scopedSlots: { customRender: "taxRate" },
        },
      ],
      dataType: [],
      itemsPagination: {
        totalPage: 0,
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        direction: "",
        sortName: "",
      },
      getItemsNoPageVal: "",
      dataItemSource: [],
      productLoading: false,
      addItemValue: undefined,
      rowSelectionChangeData: [],
      selectedRowKeys: [],
      pageState: "",
      rateId: "",
      rateList: [0, 1, 3, 6, 9, 13],
      paginationTable: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total) => {
          return "共" + total + "条";
          // return range[0] + "-" + range[1] + "共" + total + "条";
        },
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
      },
    };
  },
  watch: {
    dataCustomEvent: {
      handler(val, oldval) {
        console.log(oldval);
        if (val && !this.rateId) {
          this.paginationTable.total = val.length;
        }
      },
      deep: true,
    },
  },
  methods: {
    handleTableDataChange(pagination) {
      this.paginationTable.current = pagination.current;
      this.paginationTable.pageSize = pagination.pageSize;
      if (this.rateId) {
        this.getSingleForPage(this.rateId);
      }
    },
    back() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs.infoform.validate((valid) => {
        if (valid) {
          let submitData = [];
          if (this.form.itemModel === 1) {
            submitData = this.dataCustomEvent;
            submitData.forEach((item) => {
              item.itemId ? "" : (item.itemId = item.id);
            });
          } else if (this.form.itemModel === 2) {
            submitData = this.rowSelectionChangeData;
            submitData.forEach((item) => {
              item.secondaryClassificationId
                ? ""
                : (item.secondaryClassificationId = item.id);
              item.secondaryClassificationName
                ? ""
                : (item.secondaryClassificationName = item.typeName);
            });
          }
          if (!submitData.length) {
            this.$message.error(`请至少选择添加一条数据！`);
            return false;
          }
          let nullArr = [];
          console.log(submitData);
          submitData.forEach((item) => {
            // console.log(isFalse([item.taxRate && item.taxrate]));
            // if (isFalse([item.taxRate && item.taxrate])) {
            //   nullArr.push(item.itemName || item.typeName);
            // }
            console.log(this.rateList.indexOf(item.taxRate));
            console.log(this.rateList.indexOf(item.taxrate));
            if (
              this.form.itemModel === 1 &&
              this.rateList.indexOf(item.taxRate) < 0
            ) {
              nullArr.push(item.itemName || item.typeName);
            }
            if (
              this.form.itemModel === 2 &&
              this.rateList.indexOf(item.taxrate) < 0
            ) {
              nullArr.push(item.itemName || item.typeName);
            }
          });
          if (nullArr.length > 0) {
            let str = nullArr.join(",");
            this.$message.error(`商品${str}的税率为必填项！`);
            return;
          }
          let params = {
            ...this.form,
          };
          if (this.form.itemModel === 1) {
            params.taxRateItems = submitData;
          } else if (this.form.itemModel === 2) {
            params.taxrateItemTypes = submitData;
          }
          if (this.pageState === "add") {
            taxrateInsert(params).then((res) => {
              const data = res.data;
              if (data.code == 200) {
                this.$message.success("新增成功！");
                this.clearForm();
                if (this.form.itemModel === 2) {
                  this.getTableList();
                }
              } else {
                this.$message.error(data.message);
              }
            });
          } else if (this.pageState === "edit") {
            taxrateUpdate(params).then((res) => {
              const data = res.data;
              if (data.code == 200) {
                this.$message.success("编辑成功！");
                this.getSingle(this.rateId);
              } else {
                this.$message.error(data.message);
              }
            });
          }
        }
      });
    },
    clearForm() {
      this.form.state = 1;
      this.form.taxRateRuleName = "";
      this.form.remark = "";
      this.dataCustomEvent = [];
      this.addItemValue = undefined;
      this.selectedRowKeys = [];
      this.rowSelectionChangeData = [];
      this.$refs.infoform.clearValidate();
    },
    delOne(row, index) {
      this.dataCustomEvent.splice(index, 1);
    },
    cancel() {
      this.$message.error("取消");
    },
    addItem() {
      const uniqArr = this.dataCustomEvent.filter((item) => {
        return item.itemCode === this.addItemValue;
      });
      if (uniqArr.length > 0) {
        this.$message.error(`商品已经存在！`);
        return;
      }
      if (!this.addItemValue) {
        this.$message.error(`请至少选择一条商品！`);
        return;
      }
      this.dataCustomEvent.push(JSON.parse(JSON.stringify(this.addItemObj)));
      patchArray(this.dataCustomEvent);
    },
    getItems(data) {
      let uniqArr = [];
      this.dataCustomEvent.forEach((item) => {
        data.forEach((val) => {
          if (item.itemCode === val.itemCode) {
            uniqArr.push(item.itemName);
          }
        });
      });
      if (uniqArr.length > 0) {
        let str = uniqArr.join(",");
        this.$message.error(`商品${str}已经存在！`);
        return;
      }
      this.dataCustomEvent = this.dataCustomEvent.concat(data);
      this.$refs.stAddItems.handleCancelItems();
    },
    openPrudoct() {
      this.$refs.stAddItems.openPrudoct();
    },
    getItemsNoPage: debounce(function (val, state) {
      this.getItemsNoPageVal = val;
      this.productLoading = true;
      const params = {
        likeItemName: this.getItemsNoPageVal,
        customerId: "",
        orderDate: "",
        rows: this.itemsPagination.pageSize,
        page: this.itemsPagination.pageIndex,
        sort: "id",
        order: "DESC",
      };
      componentGetItems(params).then((res) => {
        this.productLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.itemsPagination.totalPage = data.totalPage;
          if (state) {
            this.dataItemSource = this.dataItemSource.concat(data.data);
          } else {
            this.dataItemSource = data.data;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    }, 500),
    handlePopupScroll(e) {
      if (
        e.target.scrollTop + e.target.offsetHeight >
        e.target.scrollHeight-10
      ) {
        if (this.itemsPagination.pageIndex >= this.itemsPagination.totalPage) {
          return false;
        }
        this.itemsPagination.pageIndex++;
        this.getItemsNoPage(this.getItemsNoPageVal, "scroll");
      }
    },
    getItemsNoPageSelect() {
      const itemData = this.dataItemSource.find((item) => {
        return item.itemCode === this.addItemValue;
      });
      this.addItemObj = itemData;
      this.addItemObj.balance
        ? (this.addItemObjBalance = this.addItemObj.balance)
        : (this.addItemObjBalance = 0);
    },
    handleRadioChange(e) {
      this.form.itemModel = e.target.value;
      // this.dataCustomEvent = [];
      // this.tableLoading = false;
      // this.$refs.infoform.clearValidate();
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
              row.taxrate = undefined;
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
    getTableList() {
      itemGetItemTypeList().then((res) => {
        this.tableLoading = false;
        const data = res.data;
        if (data.code === "200") {
          this.dataType = data.data;
        } else {
          this.$message.error("获取数据失败！");
        }
      });
    },
    getSingle(id) {
      const params = {
        id,
      };
      this.spinning = true;
      taxrateGetSingle(params).then((res) => {
        const data = res.data;
        this.spinning = false;
        if (data.code === "200") {
          this.form = data.data;
          if (this.form.itemModel === 1) {
            // this.dataCustomEvent = data.data.taxRateItems;
            console.log(this.form.itemModel);
          } else if (this.form.itemModel === 2) {
            data.data.itemTypeDtos.forEach((item) => {
              if (item.taxrate) {
                this.rowSelectionChangeData.push(item);
                this.selectedRowKeys.push(item.id);
              }
            });
            if (this.pageState === "details") {
              this.dataType = this.rowSelectionChangeData;
            } else {
              this.dataType = data.data.itemTypeDtos;
            }
          }
        } else {
          this.$message.error("获取数据失败！");
        }
      });
    },

    getSingleForPage(id) {
      const params = {
        id: id,
        page: this.paginationTable.current,
        rows: 10,
      };
      GetTaxRateItemsByTaxRateIdList(params).then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          patchArray(this.dataCustomEvent);
          this.dataCustomEvent = res.data.data;
          this.paginationTable.total = res.data.totalNum;
          console.log(this.paginationTable.total);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
  computed: {},
  activated() {
    this.getItemsNoPage("");
    this.paginationTable.current=1
    this.paginationTable.total=0
    if (this.$route.query.type) {
      this.form.type = this.$route.query.type;
      this.pageState = this.$route.query.pageState;
      this.rateId = this.$route.query.id;
      if (this.pageState === "add") {
        this.getTableList();
        this.dataCustomEvent = [];
        patchArray(this.dataCustomEvent);
      }
      if (this.rateId) {
        this.getSingle(this.rateId);
        this.getSingleForPage(this.rateId);
      }
    }
  },
  deactivated() {
    if (this.pageState !== "add") {
      this.clearForm();
      this.form.itemModel = 1;
    }
  },
};
</script>


<style scoped lang="less">
@import "index.less";
</style>