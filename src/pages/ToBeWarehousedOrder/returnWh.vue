<template>
  <div class="return-item">
    <a-modal
      title="入库"
      v-model="visible"
      centered
      destroyOnClose
      width="85%"
      :maskClosable="false"
    >
      <div class="info-item" style="display: flex">
        <a-card
          title="商品清单"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
          :style="paramsData.imItemType === '23' ? 'width: 35%' : 'width:100%'"
        >
          <a-tag slot="extra">按商品入库</a-tag>
          <a-form-model :model="form" ref="form">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-model-item label="入库仓库" prop="warehouse" class="form-required">
                  <a-select
                    style="width: 100%"
                    allowClear
                    @change="warehouseChangePro"
                    placeholder="入库仓库( 必选 )"
                    v-model="productWh.whId"
                  >
                    <a-select-option
                      v-for="item in warehouseList"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.whName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="入库时间" prop="deliveryTime" class="form-required">
                  <a-date-picker
                    style="width: 100%"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="form.deliveryTime"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
          <a-table
            rowKey="id"
            :pagination="false"
            :columns="imItemType == 105 ? columns : columnsPro"
            :data-source="tableDataPro"
            :scroll="{ y: 300 }"
            :loading="tableLeftLoading"
            size="middle"
          >
            <span slot="qtyTitle" class="table-formva"> 数量</span>
            <div slot="qty" slot-scope="text, record">
              <a-input-number
                v-model="record.qty"
                @change="priceQtyChange(record)"
              ></a-input-number>
            </div>
            <span slot="priceTitle" class="table-formva"> 单价</span>
            <span slot="totalTitle" class="table-formva"> 商品金额</span>
            <span slot="containerCode" slot-scope="text, record">
              <a-input v-model.trim="record.containerCode"></a-input>
            </span>
            <span slot="itemSpec" slot-scope="text, record">
              <a-select v-model="record.itemSpec" style="width: 100%" @focus="getSpec(record)">
                <a-select-option v-for="specName in record.specList" :key="specName">{{specName}}</a-select-option>
              </a-select>
            </span>
            <span slot="inputTaxRate" class="table-formva">
              税率/抵扣率(%)</span
            >
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
                <span v-if="record.invoiceType == 1 || record.invoiceType == 2"
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
            <div slot="poPrice" slot-scope="text, record">
              <a-input-number
                v-model="record.poPrice"
                @change="priceQtyChange(record)"
              ></a-input-number>
            </div>
            <div slot="totalCostOfWarehousing" slot-scope="text, record">
              <a-input-number
                v-model="record.totalCostOfWarehousing"
                @change="totalChange(record)"
              ></a-input-number>
            </div>
          </a-table>
        </a-card>
      </div>
      <div slot="footer">
        <a-button type="primary" @click="addOrder" :loading="btnLoading"
          >入库确认</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script>
// import { debounce } from "../../utils/tool";
import { formatDate } from "../../utils/util";
import {
  GetItems,
  // GetUnits,
  GetDetails,
  ReWarehousingConfirm,
} from "../../services/warehouseManagement/warehousing/ToBeWarehousedOrder";
import { isFalse } from "../../utils/util";
export default {
  data() {
    return {
      form: { deliveryTime: formatDate(new Date(), "YYYY-MM-dd hh:mm:ss") },
      columnsPro: [
        {
          title: "商品",
          dataIndex: "itemName",
          align: "center",
        },
        {
          slots: { title: "qtyTitle" },
          dataIndex: "qty",
          align: "center",
          scopedSlots: { customRender: "qty" },
        },
        {
          title: "单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          slots: { title: "priceTitle" },
          dataIndex: "poPrice",
          align: "center",
          scopedSlots: { customRender: "poPrice" },
        },
        {
          slots: { title: "totalTitle" },
          dataIndex: "itemAmount",
          align: "center",
          scopedSlots: { customRender: "itemAmount" },
        },
        {
          title: "柜号",
          dataIndex: "containerCode",
          align: "center",
          scopedSlots: { customRender: "containerCode" },
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
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
      ],
      columns: [
        {
          title: "商品",
          dataIndex: "itemName",
          align: "center",
        },
        {
          title: "柜号",
          dataIndex: "containerCode",
          align: "center",
          scopedSlots: { customRender: "containerCode" },
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
          align: "center",
          scopedSlots: { customRender: "itemSpec" },
        },
        {
          slots: { title: "qtyTitle" },
          dataIndex: "qty",
          align: "center",
          scopedSlots: { customRender: "qty" },
        },
        {
          title: "单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          slots: { title: "priceTitle" },
          dataIndex: "poPrice",
          align: "center",
          scopedSlots: { customRender: "poPrice" },
        },
        {
          title: "成本分摊单价",
          dataIndex: "price",
          align: "center",
        },
        {
          slots: { title: "totalTitle" },
          dataIndex: "totalCostOfWarehousing",
          align: "center",
          scopedSlots: { customRender: "totalCostOfWarehousing" },
        },
      ],
      tableDataPro: [],
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
      itemValue: "",
      addItemObj: {
        qty: "",
        itemId: "",
        itemName: "",
        itemCode: "",
        totalWarehousingPrice: "",
      },
      productLoading: false,
      itemQty: "",
      unitList: [],
      showState: "35%",
      productWh: {},
      rawWh: {},
      paramHead: {},
      btnLoading: false,
      tableLeftLoading: false,
      tableRightLoading: false,
      imItemType: "",
      paramsData: {},
      invoiceOption: [
        { value: 1, text: "增值税普通发票" },
        { value: 2, text: "增值税专用发票" },
        { value: 3, text: "增值税普通发票(免税)" },
      ],
      rateOption: ["0", "1", "3", "6", "9","11", "13"],
    };
  },
  methods: {
    unique(arr) {
      !this.typeis(arr, 'array') && (arr = [])
      let specList = []
      arr.forEach(item => !specList.includes(item.specName) && specList.push(item.specName))
      return specList
    },
    getSpec(record) {
      const params = {
        id: record.itemId,
        order: "DESC",
        page: 1,
        rows: 1,
        sort: "id"
      }
      GetItems(params).then(res => {
        if (res.data.code == 200) {
          record.specList = this.unique(res.data.data[0].specList)
          this.$forceUpdate()
        }
      })
    },
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
      this.getTotalCostOfWarehousing("no");
    },
    getTotalCostOfWarehousing() {
      //总数
      this.tableDataPro.forEach((item) => {
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
      let errorState = false;
      if (this.imItemType == 105) {
        this.tableDataPro.forEach((item) => {
          if (!item.qty || !item.poPrice || !item.totalCostOfWarehousing) {
            errorState = true;
          }
        });
      } else {
        errorState = this.tableDataPro.some((item) =>
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
      }
      if (!this.productWh.whId||!this.form.deliveryTime) {
        errorState = true;
      }

      let templeft = JSON.parse(JSON.stringify(this.tableDataPro)) || [];
      if (this.tableDataPro.length > 0) {
        templeft.forEach((item) => {
          delete item.specList
          item.typeForItem = 2;
          item.whId = this.productWh.whId;
          item.whCode = this.productWh.whCode;
          item.whName = this.productWh.whName;
        });
      }
      if (errorState) {
        this.$message.error("请先核对必填项");
        return;
      }
      const params = {
        ...this.paramsData,
        deliveryTime: this.form.deliveryTime,
        imItemDetailDtoList: [...templeft],
        ...this.productWh,
      };
      this.btnLoading = true;
      ReWarehousingConfirm(params).then((res) => {
        this.btnLoading = false;
        console.log(res);
        if (res.data.code == 200) {
          this.visible = false;
          this.$message.success(
            res.data.message == "OK" ? "入库成功" : res.data.message
          );
          this.$parent.getList();
        } else {
          this.$message.error(res.data.message ? res.data.message : "入库失败");
        }
      });
    },

    getProData(record) {
      this.tableLeftLoading = true;
      this.tableRightLoading = true;
      const params = {
        docNo: record.docNo ? record.docNo : record.imItemCode,
        type: record.imItemType,
      };
      GetDetails(params).then((res) => {
        this.tableLeftLoading = false;
        this.tableRightLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.productWh = {
            whId: data.data.whId ? data.data.whId : this.warehouseList[0].id,
            whName: data.data.whName
              ? data.data.whName
              : this.warehouseList[0].whName,
            whCode: data.data.whCod
              ? data.data.whCode
              : this.warehouseList[0].whCode,
          };
          this.tableDataPro = data.data.imItemDetailDtoList;
          // let temp = [];
          this.tableDataPro.forEach((k) => {
            k.specList = this.typeis(k.itemSpec, "string") ? [k.itemSpec] : []
            if (k.price) {
              k.poPrice = k.price;
            }
            if (isFalse([k.itemAmount])) {
              k.itemAmount =
                k.poPrice && k.qty
                  ? this.formatPrice(+k.poPrice * +k.qty)
                  : "";
            }
          });
          // temp.forEach((i, index) => {
          //   i.qty = i.compositionNumber;
          //   i.keyIndex = index;
          // });
          this.getTotalCostOfWarehousing();
          this.visible = true;
        } else {
          this.$message.error(
            data.message ? data.message : "获取商品单数据失败"
          );
        }
      });
    },
    delItem(val, i) {
      this.tableData.splice(i, 1);
    },
    getItemsSelect() {
      const itemData = this.selectItems.find((item) => {
        return item.id === this.itemValue;
      });
      this.addItemObj = itemData;
    },
    handlePopupScroll(e) {
      if (
        e.target.scrollTop + e.target.offsetHeight >
        e.target.scrollHeight - 10
      ) {
        if (this.pagination.page >= this.totals) {
          return false;
        }
        this.pagination.page++;
        this.getItems();
      }
    },
    // getItems: debounce(function () {
    //   const params = { ...this.pagination };
    //   this.productLoading = true;
    //   GetItems(params).then((res) => {
    //     this.productLoading = false;
    //     const data = res.data;
    //     if (data.code == 200) {
    //       this.selectItems = this.selectItems.concat(data.data);
    //       this.totals = data.data.totalPage;
    //     } else {
    //       this.$message.error(data.message ? data.message : "获取商品数据失败");
    //     }
    //   });
    // }, 1000),
    warehouseChange(value) {
      this.rawWh = {
        whId: value.split(",")[0],
        whCode: value.split(",")[1],
        whName: value.split(",")[2],
      };
    },
    warehouseChangePro(value) {
      this.warehouseList.forEach((item) => {
        if (item.id === value) {
          this.productWh.whName = item.whName;
          this.productWh.whCode = item.whCode;
        }
      });
    },
    async showModal(data, wh) {
      console.log(data);
      // this.imItemType = data.imItemType;
      this.paramsData = JSON.parse(JSON.stringify(data));
      this.tableDataPro = [];
      this.tableData = [];
      this.warehouseList = JSON.parse(JSON.stringify(wh));
      this.paramHead = JSON.parse(JSON.stringify(data));
      this.showState = "30%";
      // this.getUnitData();
      this.getProData(data);
      this.imItemType = data.imItemType;
      // this.getItems();
      this.form.deliveryTime = formatDate(new Date(), "YYYY-MM-dd hh:mm:ss");
    },
  },
};
</script>

<style lang="less" scoped>
.info-item {
  display: flex;
  //   justify-content: space-evenly;
  //   align-items: center;
}

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
.single-product {
  width: 30%;
}
</style>