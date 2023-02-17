<template>
  <div class="add-item">
    <a-modal
      title="入库单新增"
      v-model="visible"
      centered
      destroyOnClose
      width="75%"
      :maskClosable="false"
    >
      <div class="info-item">
        <a-card
          title="入库商品"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <a-row :gutter="24">
            <a-col :span="6">
              <a-select
                v-model="itemValue"
                style="width: 100%"
                placeholder="请选择或输入商品名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="getItems($event)"
                @select="getItemsSelect"
                @popupScroll="handlePopupScroll"
                show-search
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
                  >{{ item.itemName }}({{ item.itemCode }})</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-input-number
                :disabled="!itemValue"
                v-model="itemQty"
                placeholder="请输入数量"
              ></a-input-number>
            </a-col>
            <a-col :span="5" style="margin-left: 20px">
              <a-select
                style="width: 100%"
                allowClear
                @change="warehouseChange"
                placeholder="入库仓库( 必选 )"
                v-model="whId"
              >
                <a-select-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.whName }}</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="addItems">添加</a-button>
            </a-col>
          </a-row>
          <div class="table-item" style="margin-top: 20px">
            <a-table
              rowKey="itemId"
              :pagination="false"
              :columns="columns"
              :data-source="tableData"
              :scroll="{ y: 300, x: 850 }"
              size="small"
              v-if="tableData && tableData.length > 0"
            >
              <span slot="qtyTitle" class="table-formva"> 数量</span>
              <span slot="poPriceTitle" class="table-formva"> 单价</span>
              <span slot="totalTitle" class="table-formva"> 商品金额</span>
              <span slot="inputTaxRate" class="table-formva">
                税率/抵扣率(%)</span
              >

              <div slot="qty" slot-scope="text, record">
                <a-input-number
                  v-model="record.qty"
                  @change="priceQtyChange(record)"
                ></a-input-number>
              </div>
              <div slot="poPrice" slot-scope="text, record">
                <a-input-number
                  v-model="record.poPrice"
                  @change="priceQtyChange(record)"
                ></a-input-number>
              </div>
              <div slot="itemAmount" slot-scope="text, record">
                <a-input-number
                  v-model="record.itemAmount"
                  @change="itemAmountChange(record)"
                ></a-input-number>
              </div>
              <span slot="containerCode" slot-scope="text, record">
                <a-input v-model.trim="record.containerCode"></a-input>
              </span>
              <span slot="itemSpec" slot-scope="text, record">
                <a-select v-model="record.itemSpec" style="width: 100%">
                  <a-select-option v-for="specName in record.specList" :key="specName">{{specName}}</a-select-option>
                </a-select>
              </span>
              <!-- 免税 -->
              <span slot="invoiceBusinessTypeTit" class="table-formva"
                >发票类型</span
              >
              <span slot="invoiceBusinessType" slot-scope="text, record">
                <a-select
                  v-model="record.invoiceBusinessType"
                  @click.stop.native
                  placeholder=""
                  style="width: 40%"
                  @change="getTotalCostOfWarehousing"
                >
                  <a-select-option :value="0">应税业务</a-select-option>
                  <a-select-option :value="1">免税业务</a-select-option>
                </a-select>
                <a-select
                  v-model="record.invoiceType"
                  @click.stop.native
                  placeholder=""
                  style="width: 60%"
                  @change="getTotalCostOfWarehousing"
                >
                  <a-select-option
                    v-for="(item, index) in invoiceOption"
                    :key="index"
                    :value="item.value"
                    :title="item.text"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </span>
              <template slot="inputTaxRate" slot-scope="text, record">
                <span style="width: 40%">
                  <span v-if="record.invoiceType == 3">抵扣率</span>
                  <span
                    v-if="record.invoiceType == 1 || record.invoiceType == 2"
                    >税率</span
                  >
                </span>
                <a-select
                  v-model="record.inputTaxRate"
                  placeholder="必填"
                  style="width: 50%; margin-left: 2px"
                  @change="getTotalCostOfWarehousing"
                >
                  <a-select-option v-for="item in rateOption" :key="item">{{
                    item
                  }}</a-select-option>
                </a-select>
              </template>
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
            <a-empty v-else></a-empty>
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
import {
  GetItems,
  GetUnits,
  InsertNoImItem,
} from "../../services/warehouseManagement/warehousing/ToBeWarehousedOrder";
import { isFalse ,debounce } from "../../utils/util";
export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      columns: [
        {
          title: "操作",
          dataIndex: "opreation",
          width: 80,
          align: "center",
          scopedSlots: { customRender: "opreation" },
        },
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
          slots: { title: "unitTitle" },
          dataIndex: "unit",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "unit" },
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
          dataIndex: "itemAmount",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "itemAmount" },
        },
        {
          title: "柜号",
          dataIndex: "containerCode",
          width: 180,
          align: "center",
          scopedSlots: { customRender: "containerCode" },
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
          width: 140,
          align: "center",
          scopedSlots: { customRender: "itemSpec" },
        },
        {
          align: "center",
          slots: { title: "invoiceBusinessTypeTit" },
          dataIndex: "invoiceBusinessType",
          scopedSlots: { customRender: "invoiceBusinessType" },
          key: 199,
          width: 280,
        },
        {
          align: "center",
          slots: { title: "inputTaxRate" },
          dataIndex: "inputTaxRate",
          scopedSlots: { customRender: "inputTaxRate" },
          key: 144,
          width: 200,
        },
        {
          title: "入库总成本金额",
          dataIndex: "totalCostOfWarehousing",
          width: 120,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
      ],
      tableData: [],
      visible: false,
      warehouseList: [],
      whId: "",
      whCode: "",
      whName: "",
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
      productLoading: false,
      itemQty: "",
      unitList: [],
      addLoading: false,
      invoiceOption: [
        { value: 1, text: "增值税普通发票" },
        { value: 2, text: "增值税专用发票" },
        { value: 3, text: "增值税普通发票(免税)" },
      ],
      rateOption: ["0", "1", "3", "6", "9", "11","13"],
    };
  },
  computed: {},
  methods: {
    priceQtyChange(record) {
      record.itemAmount =
        record.poPrice && record.qty
          ? this.formatPrice(+record.poPrice * +record.qty)
          : "";
      this.getTotalCostOfWarehousing();
    },
    itemAmountChange(record) {
      record.poPrice =
        record.itemAmount && record.qty
          ? this.formatPrice(+record.itemAmount / +record.qty)
          : "";
      this.getTotalCostOfWarehousing();
    },
    getTotalCostOfWarehousing() {
      //总数
      this.tableData.forEach((item) => {
        if (item.qty && item.poPrice) {
          if (item.invoiceType == 1 || item.invoiceType == 2) {
            item.priceExcludingTax =
              +item.itemAmount -
              (+item.itemAmount * (+item.inputTaxRate / 100)) /
                (1 + +item.inputTaxRate / 100);
          } else if (item.invoiceType == 3) {
            item.priceExcludingTax =
              +item.itemAmount - +item.itemAmount * (+item.inputTaxRate / 100);
          } else {
            item.priceExcludingTax = item.priceExcludingTax || 0;
          }
          item.priceExcludingTax = this.formatPrice(item.priceExcludingTax, 2);
          item.totalCostOfWarehousing = this.formatPrice(
            item.invoiceBusinessType == 0 &&
              (item.invoiceType == 2 || item.invoiceType == 3)
              ? +item.priceExcludingTax
              : +item.itemAmount
          );
        } else {
          item.totalCostOfWarehousing = "";
          item.itemAmount = "";
        }
      });
      this.$forceUpdate();
    },
    addOrder() {
      if (this.tableData.length === 0) {
        this.$message.info("请添加商品数据");
        return;
      }
      let errorState = this.tableData.some((item) =>
        isFalse([
          item.qty,
          item.poPrice,
          item.unit,
          item.itemAmount,
          item.invoiceType,
          item.inputTaxRate,
          item.invoiceBusinessType,
        ])
      );
      if (!this.whId) {
        errorState = true;
      }
      if (errorState) {
        this.$message.error("请核对必填项");
        return;
      }
      let tempData = JSON.parse(JSON.stringify(this.tableData));
      this.typeis(tempData, 'array') && tempData.forEach(vip => delete vip.specList)
      const params = {
        whId: this.whId,
        whCode: this.whCode,
        whName: this.whName,
        imItemDetailDtoList: [...tempData],
      };
      this.addLoading = true;
      InsertNoImItem(params).then((res) => {
        this.addLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.visible = false;
          this.$message.success(
            data.message == "OK" ? "新增入库单成功" : data.message
          );
          this.$parent.getList();
        } else {
          this.$message.error(data.message ? data.message : "新增入库单失败");
        }
      });
    },
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
    unique(arr) {
      !this.typeis(arr, 'array') && (arr = [])
      let specList = []
      arr.forEach(item => !specList.includes(item.specName) && specList.push(item.specName))
      return specList
    },
    addItems() {
      if (!this.itemValue) {
        this.$message.info("请先选择商品");
        return;
      }
      let tempData = {
        qty: this.itemQty,
        itemId: this.addItemObj.id,
        itemName: this.addItemObj.itemName,
        itemCode: this.addItemObj.itemCode,
        specList: this.unique(this.addItemObj.specList),
        unit: this.addItemObj.defUom || "",
        totalCostOfWarehousing: "",
        itemAmount: "",
        priceExcludingTax: "",
      };
      tempData.itemSpec = tempData.specList[0]
      this.tableData.push(tempData);
      this.itemValue = undefined;
      this.itemQty = "";
    },
    getItemsSelect() {
      const itemData = this.selectItems.find((item) => {
        return item.id === this.itemValue;
      });
      console.log(this.itemValue);
      this.addItemObj = itemData;
      console.log(this.addItemObj);
    },
    handlePopupScroll(e) {
      if (
        e.target.scrollTop + e.target.offsetHeight >
        e.target.scrollHeight - 4
      ) {
        if (this.pagination.page >= this.totals) {
          return false;
        }
        // this.pagination.page++;
        this.getItems(this.valueForSearch || "", "srcoll")
      }
    },
    getItems:debounce(function (value, state) {
      console.log(value);
      this.valueForSearch=value
      if (state) {
        this.pagination.page++;
      }
      const params = { likeItemName: this.valueForSearch, ...this.pagination };
      this.productLoading = true;
      GetItems(params).then((res) => {
        this.productLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.selectItems = state
            ? this.selectItems.concat(data.data)
            : data.data;
          this.totals = data.totalPage;
        } else {
          this.$message.error(data.message ? data.message : "获取商品数据失败");
        }
      });
    },1000),
    warehouseChange(value) {
      this.warehouseList.forEach((item) => {
        if (item.id === value) {
          this.whName = item.whName;
          this.whCode = item.whCode;
        }
      });
    },
    showModal(data) {
      console.log(data);
      this.tableData = [];
      this.visible = true;
      this.warehouseList = JSON.parse(JSON.stringify(data));
      this.whId = data && data.length > 0 ? data[0].id : "";
      this.whCode = data && data.length > 0 ? data[0].whCode : "";
      this.whName = data && data.length > 0 ? data[0].whName : "";
      this.getUnitData();
      this.getItems("")
    },
  },
};
</script>

<style lang="less" scoped>
input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
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