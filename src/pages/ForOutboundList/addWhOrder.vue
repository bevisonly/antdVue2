<template>
  <div class="add-item">
    <a-modal
      title="出库单新增"
      v-model="visible"
      cnetered
      destroyOnClose
      width="70%"
      :maskClosable="false"
    >
      <div class="info-item">
        <a-card
          title="出库商品"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <a-form-model :model="form" :rules="rules" ref="form">
            <a-row :gutter="24">
              <a-col :span="4">
                <a-form-model-item
                  label="出库类型"
                  prop="imItemType"
                  ref="imItemType"
                >
                  <a-select
                    v-model="form.imItemType"
                    @change="imItemTypeChange"
                    :disabled="tableData.length > 0"
                  >
                    <a-select-option :value="98">其他出库</a-select-option>
                    <a-select-option :value="12">退货出库</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8" v-if="form.imItemType == 12">
                <a-form-model-item
                  label="供应商"
                  prop="partnerId"
                  ref="partnerId"
                >
                  <a-select
                    v-model="form.partnerId"
                    @change="partnerChange"
                    show-search
                    @search="partnerSearch"
                    :filter-option="false"
                  >
                    <a-select-option
                      v-for="item in partnerList"
                      :key="item.id"
                      :value="item.id"
                      class="selectclass"
                      >{{ item.partnerName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="10">
                <a-form-model-item label="商品选择">
                  <div ref="selectClass">
                    <!-- :getPopupContainer="() => this.$refs.selectClass" -->
                    <a-select
                      v-model="itemValue"
                      style="width: 100%"
                      placeholder="请输入商品名称/编码/关键字"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      @search="getItems($event)"
                      show-search
                      @select="getItemsSelect"
                      @popupScroll="handlePopupScroll"
                      :disabled="
                        form.imItemType == 12
                          ? !form.imItemType || !form.partnerId
                          : !form.imItemType
                      "
                    >
                      <a-spin
                        v-if="productLoading && selectItems.length === 0"
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
                            v-if="productLoading && selectItems.length > 0"
                            size="small"
                          ></a-spin>
                        </div>
                      </div>
                      <a-select-option
                        v-for="(item, index) in selectItems"
                        :key="index"
                        :value="item.id"
                        :title="
                          item.itemName +
                          '' +
                          item.itemCode +
                          '' +
                          '(' +
                          item.measureUnit +
                          ')' +
                          '' +
                          '入库时间:' +
                          item.prodDate +
                          '' +
                          '可用数:' +
                          item.balance
                        "
                      >
                        <!-- class="selectclass" -->
                        <span class="maincolor">商品:</span>
                        {{ item.itemName }}({{ item.itemCode }})&nbsp;{{
                          item.measureUnit
                        }}&nbsp;{{ item.itemSpec }}&nbsp;
                        <span class="maincolor">入库时间 : </span
                        >{{ item.prodDate
                        }}<span class="maincolor">可用数:</span
                        >{{ item.balance }}</a-select-option
                      >
                    </a-select>
                  </div>
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
                <a-form-model-item label="添加数量">
                  <a-input
                    :disabled="!itemValue"
                    v-model="itemQty"
                    v-number
                    placeholder="请输入需要添加的数量"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :span="2" v-if="balance > 0">
                <a-form-model-item label="可用数量">
                  <a-input v-model="balance" readOnly></a-input>
                </a-form-model-item>
              </a-col> -->

              <a-col :span="6">
                <a-form-model-item label="仓库" prop="whId">
                  <a-select
                    style="width: 100%"
                    allowClear
                    @change="warehouseChange"
                    placeholder="出库仓库( 必选 )"
                    v-model="form.whId"
                  >
                    <a-select-option
                      v-for="item in warehouseList"
                      :key="item.id"
                      :value="item.id"
                      class="selectclass"
                      >{{ item.whName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="4" style="margin-top: 44px">
                <a-space>
                  <a-button
                    type="primary"
                    @click="addItems"
                    :disabled="
                      form.imItemType == 12
                        ? !form.imItemType || !form.partnerId
                        : !form.imItemType
                    "
                    >添加</a-button
                  >
                  <a-button
                    type="primary"
                    @click="clearItems"
                    v-if="tableData.length > 0"
                    >清空商品</a-button
                  >
                </a-space>
              </a-col>
            </a-row>
          </a-form-model>
          <div class="table-item">
            <a-table
              rowKey="id"
              :pagination="false"
              :columns="columns"
              :data-source="tableData"
              :scroll="{ y: 300, x: 850 }"
            >
              <span slot="qtyTitle" class="table-formva"> 数量</span>
              <span slot="poPriceTitle" class="table-formva"> 单价</span>
              <span slot="totalTitle" class="table-formva"> 商品金额</span>
              <div slot="qty" slot-scope="text, record">
                <a-input
                  v-model="record.qty"
                  v-number
                  @change="qtyChange"
                ></a-input>
              </div>
              <div slot="poPrice" slot-scope="text, record">
                <a-input
                  v-model="record.poPrice"
                  v-number
                  @change="priceChange"
                  readOnly
                ></a-input>
              </div>
              <div slot="totalCostOfWarehousing" slot-scope="text, record">
                <a-input
                  v-model="record.totalCostOfWarehousing"
                  v-number
                ></a-input>
                <!-- @change="totalChange(record)" -->
              </div>
              <!-- <div slot="totalCostOfWarehousing">
                {{ amount ? formatPrice(amount) : "--" }}
              </div> -->
              <!-- 计价单位 -->
              <span slot="unitTitle" class="table-formva"> 计价单位</span>
              <span slot="unit" slot-scope="text, record">
                <a-select style="width: 100%" v-model="record.unit">
                  <a-select-option
                    v-for="item in unitList"
                    :key="item.id"
                    :value="item.dicText"
                    >{{ item.dicText }}
                  </a-select-option>
                </a-select>
              </span>
              <div slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark"></a-input>
              </div>
              <div slot="opreation" slot-scope="text, record, index">
                <a-button type="link" @click="delItem(record, index)"
                  >删除</a-button
                >
              </div>
            </a-table>
          </div>
        </a-card>
      </div>
      <div slot="footer">
        <a-button type="primary" @click="addOrder" :loading="addLoading"
          >新增</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script>
import { debounce } from "../../utils/util";
import {
  GetItems,
  GetUnits,
  InsertNoImItem,
} from "../../services/warehouseManagement/outWarehouse/ForOutboundList";
import { partnerType } from "@/services/userMa.js";
export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      productLoading: false,
      rules: {
        partnerId: [{ required: true, message: "供应商必选" }],
        whId: [{ required: true, message: "仓库必选" }],
        imItemType: [{ required: true, message: "出库类型必选" }],
      },
      columns: [
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 150,
          align: "center",
        },
        {
          title: "商品编码",
          dataIndex: "itemCode",
          width: 150,
          align: "center",
        },

        {
          slots: { title: "qtyTitle" },
          dataIndex: "qty",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "qty" },
        },
        {
          // slots: { title: "unitTitle" },
          title: "计价单位",
          dataIndex: "unit",
          width: 100,
          align: "center",
          // scopedSlots: { customRender: "unit" },
        },
        {
          slots: { title: "poPriceTitle" },
          dataIndex: "poPrice",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "poPrice" },
        },
        {
          slots: { title: "totalTitle" },
          dataIndex: "totalCostOfWarehousing",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "totalCostOfWarehousing" },
        },
        // {
        //   title: "可用数量",
        //   dataIndex: "balance",
        //   width: 100,
        //   align: "center",
        // },
        {
          title: "备注",
          dataIndex: "remark",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
        {
          title: "操作",
          dataIndex: "opreation",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      tableData: [],
      visible: false,
      warehouseList: [],

      pagination: {
        rows: 10,
        page: 1,
        sort: "id",
        order: "DESC",
      },
      totals: 0,
      selectItems: [],
      itemValue: undefined,
      addItemObj: {
        qty: "",
        itemId: "",
        itemName: "",
        itemCode: "",
        totalCostOfWarehousing: "",
      },
      // productLoading: false,
      itemQty: "",
      unitList: [],
      addLoading: false,
      balance: 0,
      form: { imItemType: 98, whId: "", whCode: "", whName: "", partnerId: "" },
      partnerList: [],
      itemName: "",
    };
  },
  computed: {
    amount() {
      let num = "";
      this.tableData.forEach((item) => {
        console.log(item);
        if (!item.qty || !item.poPrice) {
          return;
        }
        num = item.qty * item.poPrice;
      });
      return num;
    },
  },
  methods: {
    modalClear() {
      this.itemValue = undefined;
      this.itemQty = "";
      // this.balance = 0;
      this.pagination.page = 1;
      this.getItems("");
    },
    clearItems() {
      this.tableData = [];
    },
    imItemTypeChange(value) {
      this.modalClear();
      if (value == 98) {
        this.form.partnerId = undefined;
        this.form.partnerName = "";
      }
    },
    partnerSearch(value) {
      this.getSuppliers(value);
    },
    partnerChange(value) {
      if (value) {
        this.getItems(this.itemName);
        this.partnerList.forEach((item) => {
          if (value === item.id) {
            this.form.partnerName = item.partnerName;
          }
        });
      } else {
        this.form.partnerName = "";
      }
    },
    async getSuppliers(value) {
      const res = await partnerType({
        partnerType: 30,
        partnerName: value || "",
        isEnable: 1
      });
      if (res.data.code == 200) {
        this.partnerList = res.data.data || [];
        console.log(this.partnerList);
        this.$forceUpdate();
      }
    },
    totalChange(record) {
      record.poPrice =
        record.totalCostOfWarehousing && record.qty
          ? this.formatPrice(
              Number(record.totalCostOfWarehousing) / Number(record.qty)
            )
          : "";
    },
    qtyChange() {
      this.getTotalCostOfWarehousing();
    },
    priceChange() {
      this.getTotalCostOfWarehousing();
    },
    getTotalCostOfWarehousing() {
      this.tableData.forEach((item) => {
        if (item.qty && item.poPrice) {
          item.totalCostOfWarehousing = this.formatPrice(
            Number(item.qty) * Number(item.poPrice)
          );
        } else {
          item.totalCostOfWarehousing = "";
        }
      });
    },
    addOrder: debounce(function () {
      if (this.tableData.length === 0) {
        this.$message.info("请添加商品数据");
        return;
      }
      let errorState = false;
      // if (!this.form.whId) {
      //   errorState = true;
      // }
      this.tableData.forEach((item) => {
        if (
          !item.qty ||
          !item.poPrice ||
          !item.unit ||
          !item.totalCostOfWarehousing
        ) {
          errorState = true;
        }
      });
      if (errorState) {
        this.$message.error(
          "请核对必填项( 仓库 , 价格 , 数量 , 单位 ,商品金额 )"
        );
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          let tempData = JSON.parse(JSON.stringify(this.tableData));
          // tempData.forEach((k) => {
          //   k.totalCostOfWarehousing = k.poPrice * k.qty;
          // });
          const params = {
            ...this.form,
            imItemDetailDtoList: [...tempData],
          };
          this.addLoading = true;
          InsertNoImItem(params).then((res) => {
            this.addLoading = false;
            const data = res.data;
            if (data.code == 200) {
              this.visible = false;
              this.$message.success(
                data.message == "OK" ? "新增出库单成功" : data.message
              );
              this.$parent.getList();
            } else {
              this.$message.error(
                data.message ? data.message : "新增出库单失败"
              );
            }
          });
        } else {
          return false;
        }
      });
    }, 1000),
    getUnitData() {
      GetUnits({ type: 10 }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.unitList = data.data;
        } else {
          this.$message.error(data.message ? data.message : "获取单位数据失败");
        }
      });
    },
    delItem(val, i) {
      console.log(i);
      this.tableData.splice(i, 1);
    },
    addItems() {
      console.log(this.addItemObj);
      if (!this.itemValue || !this.itemQty) {
        this.$message.info("请先选择商品和填写数量");
        return;
      }
      let tempData = {
        qty: this.itemQty,
        itemId: this.addItemObj.itemId,
        itemName: this.addItemObj.itemName,
        itemCode: this.addItemObj.itemCode,
        poPrice: this.addItemObj.poPrice,
        unit: this.addItemObj.measureUnit || "",
        totalCostOfWarehousing:
          this.addItemObj.poPrice && this.itemQty
            ? this.formatPrice(
                Number(this.addItemObj.poPrice) * Number(this.itemQty)
              )
            : "",
        invId: this.addItemObj.id,
        balance: this.addItemObj.balance,
      };
      this.tableData.push(tempData);
      this.itemValue = undefined;
      this.itemQty = "";
      // this.balance = 0;
      this.pagination.page = 1;
      this.getItems("");
    },
    getItemsSelect() {
      const itemData = this.selectItems.find((item) => {
        return item.id === this.itemValue;
      });
      this.addItemObj = itemData;
      // this.balance = this.addItemObj.balance || 0;
      console.log(this.addItemObj);
    },
    handlePopupScroll(e) {
      if (
        e.target.scrollTop + e.target.offsetHeight >
        e.target.scrollHeight - 4
      ) {
        if (this.pagination.page >= this.totals) {
          return;
        }
        this.getItems(this.itemName, "scroll");
      }
    },
    getItems: debounce(function (value, state) {
      this.itemName = value;
      if (state) {
        this.pagination.page++;
      }
      const params = {
        itemName: this.itemName,
        ...this.pagination,
        supplierId: this.form?.partnerId ?? "",
        whName: this.form?.whName ?? "",
      };
      this.productLoading = true;
      GetItems(params).then((res) => {
        this.productLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.selectItems = state
            ? this.selectItems.concat(data.data)
            : data.data;
          this.totals = data.totalPage;
          console.log(this.totals);
        } else {
          this.$message.error(data.message ? data.message : "获取商品数据失败");
        }
      });
    },1000),
    warehouseChange(value) {
      if (value) {
        this.warehouseList.forEach((item) => {
          if (item.id === value) {
            this.form.whName = item.whName;
            this.form.whCode = item.whCode;
          }
        });
      } else {
        this.form.whName = "";
        this.form.whCode = "";
      }
      this.itemValue = undefined;
      this.itemQty = "";
      this.pagination.page = 1;
      this.getItems(this.itemName, "");
    },
    showModal(data) {
      console.log(data);
      this.tableData = [];
      this.visible = true;
      this.warehouseList = JSON.parse(JSON.stringify(data));
      this.form.whId = data && data.length > 0 ? data[0].id : "";
      this.form.whCode = data && data.length > 0 ? data[0].whCode : "";
      this.form.whName = data && data.length > 0 ? data[0].whName : "";
      this.form.imItemType = 98;
      this.form.partnerId = undefined;
      this.form.partnerName = "";
      this.getUnitData();
      this.getSuppliers();
      this.modalClear();
      // debounce(this.getItems());
    },
  },
};
</script>
<style>
.selectclass {
  overflow: visible !important;
  display: block;
}
</style>
<style lang="less" scoped>
// /deep/.ant-form-item {
//   margin-bottom: 0;
// }
.maincolor {
  color: @primary-color;
  padding: 0 4px;
}
input[v-number] {
  -moz-appearance: textfield;
}
input[v-number]::-webkit-inner-spin-button,
input[v-number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: "*";
}
</style>