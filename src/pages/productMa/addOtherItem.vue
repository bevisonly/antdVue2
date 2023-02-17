<template>
  <div>
    <a-modal
      centered
      v-model="visible"
      :title="other == 'saler' ? '商家商品' : '客户商品'"
      @ok="handleOk"
      width="55%"
      destroyOnClose
      :maskClosable='false'
    >
      <div class="add-item">
        <a-row :gutter="16">
          <a-col :span="6" v-if="other === 'saler'">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-model="addForm.partnerId"
                placeholder="请选择供应商"
                allowClear
                @change="handleSupplierrChange"
                @dropdownVisibleChange="dropGet"
              >
                <a-spin
                  v-if="supplierData.length === 0"
                  slot="notFoundContent"
                  size="small"
                ></a-spin>
                <a-select-option
                  :value="item.id"
                  v-for="item in supplierData"
                  :key="item.id"
                  :label="
                    (item.partnerCode ? item.partnerCode : '') +
                    ',' +
                    item.partnerName
                  "
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-if="other === 'customer'">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-model="addForm.partnerId"
                placeholder="请选择客户"
                allowClear
                @change="handleCustomerChange"
                @dropdownVisibleChange="dropGet"
              >
                <a-spin
                  v-if="customerData.length === 0"
                  slot="notFoundContent"
                  size="small"
                ></a-spin>
                <a-select-option
                  :value="item.id"
                  v-for="item in customerData"
                  :key="item.id"
                  :label="
                    (item.partnerCode ? item.partnerCode : '') +
                    ',' +
                    item.partnerName
                  "
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-if="other === 'customer'">
            <a-form-item>
              <a-select
                :disabled="!addForm.partnerId"
                style="width: 100%"
                allowClear
                v-model="addForm.storeId"
                placeholder="请选择客户门店"
                @change="storeChange"
              >
                <a-select-option
                  :value="item.id"
                  :key="item.id"
                  v-for="item in storeData"
                  :label="
                    (item.partnerCode ? item.partnerCode : '') +
                    ',' +
                    item.partnerName
                  "
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-button
                type="primary"
                @click="addProduct"
                :disabled="!addForm.partnerId"
                >添加商品</a-button
              >
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="table-item">
        <a-table
          :columns="other === 'customer' ? columnsCustomer : columnsSupplier"
          :data-source="otherItemData"
          size="middle"
          style="margin-top: 20px"
          rowKey="id"
          :pagination="false"
          :loading="tableLoading"
        >
          <span slot="titleItem" class="table-formva"
            >{{ other === "saler" ? "商家" : "客户" }}商品名称</span
          >
          <span slot="titleCode" class="table-formva"
            >{{ other === "saler" ? "商家" : "客户" }}商品编码</span
          >
          <div slot="nickname" slot-scope="text, record">
            <a-input v-model="record.nickname"></a-input>
          </div>
          <div slot="custId" slot-scope="text, record">
            <a-input v-model="record.custId"></a-input>
          </div>
          <div slot="operation" slot-scope="text, record, index">
            <a-popconfirm
              title="确定要删除这条数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="delProduct(record, index)"
            >
              <a-button type="link"> 删除 </a-button>
            </a-popconfirm>
          </div>
        </a-table>
      </div>
      <template slot="footer">
        <div>
          <a-button @click="handleCancle">取消</a-button>
          <a-button type="primary" @click="handleOk" :loading="submitLoading"
            >保存</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  otherItemAdd,
  supplierItem,
  customerItem,
  otherItemDel,
  PartnerList,
} from "../../services/product/productList";
const columnsCustomer = [
  {
    title: "商品名称",
    dataIndex: "itemName",
    align: "center",
  },
  {
    title: "商品编码",
    dataIndex: "itemCode",
    align: "center",
  },
  {
    title: "客户名称",
    dataIndex: "partnerName",
    align: "center",
  },
  {
    title: "客户门店",
    dataIndex: "storeName",
    align: "center",
  },
  {
    // title: "客户商品名称",
    dataIndex: "nickname",
    align: "center",
    scopedSlots: { customRender: "nickname", title: "titleItem" },
  },
  {
    // title: "客户商品编码",
    dataIndex: "custId",
    align: "center",
    scopedSlots: { customRender: "custId", title: "titleCode" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];
const columnsSupplier = [
  {
    title: "商品名称",
    dataIndex: "itemName",
    align: "center",
  },
  {
    title: "商品编码",
    dataIndex: "itemCode",
    align: "center",
  },
  {
    title: "供应商名称",
    dataIndex: "partnerName",
    align: "center",
  },
  {
    // title: "商家商品名称",
    dataIndex: "nickname",
    align: "center",
    scopedSlots: { customRender: "nickname", title: "titleItem" },
  },
  {
    // title: "商家商品编码",
    dataIndex: "custId",
    align: "center",
    scopedSlots: { customRender: "custId", title: "titleCode" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      visible: false,
      columnsCustomer,
      columnsSupplier,
      other: "",
      customerData: [],
      supplierData: [],
      storeData: [],
      addForm: {},
      otherItemData: [],
      itemObj: {},
      submitLoading: false,
      tableLoading: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    handleCancle() {
      this.visible = false;
    },
    delProduct(record, index) {
      console.log(record.id);
      if (!record.id) {
        this.otherItemData.splice(index, 1);
      }
      if (record.id) {
        otherItemDel({ id: record.id }).then((res) => {
          const data = res.data;
          if (data.code === "200") {
            this.otherItemData.splice(index, 1);
            this.$message.success(
              data.message === "OK" ? "删除成功" : data.message
            );
          } else {
            this.$message.error(data.message ? data.message : "删除失败");
          }
        });
      }
    },

    addProduct() {
      console.log(this.addForm);
      let errorState = false;
      if (this.other === "customer" && this.addForm.storeId) {
        this.otherItemData.forEach((item) => {
          if (this.addForm.storeId == item.storeId) {
            errorState = true;
          }
        });
      }
      if (this.other === "saler") {
        this.otherItemData.forEach((item) => {
          if (this.addForm.partnerId == item.partnerId) {
            errorState = true;
          }
        });
      }
      if (errorState) {
        if (this.other === "customer") {
          this.$message.error("同一个门店只能维护一个商品");
          this.addForm.storeId = "";
          this.addForm.storeCode = "";
          this.addForm.storeName = "";
        }
        if (this.other === "saler") {
          this.$message.error("同一个供应商只能维护一个商品");
        }

        return;
      }
      const temp = {
        ...this.itemObj,
        ...this.addForm,
      };
      this.otherItemData.unshift(temp);
      this.addForm = {};
    },
    getItemData(id, other) {
      this.tableLoading = true;
      if (other === "customer") {
        customerItem({ id: id }).then((resC) => {
          this.tableLoading = false;
          if (resC.data.code == 200) {
            this.otherItemData = resC.data.data;
          }
        });
      }
      if (other === "saler") {
        supplierItem({ id: id }).then((res) => {
          this.tableLoading = false;
          if (res.data.code == 200) {
            this.otherItemData = res.data.data;
          }
        });
      }
    },
    storeChange(val, option) {
      const data = option.componentOptions.propsData;
      console.log(data.label.split(",")[0]);
      console.log(data.label.split(",")[0] ? data.label.split(",")[0] : "");
      this.addForm.storeCode = data.label.split(",")[0]
        ? data.label.split(",")[0]
        : "";
      this.addForm.storeName = data.label.split(",")[1];
      console.log(this.addForm);
      this.$forceUpdate();
    },
    handleOk() {
      if (this.otherItemData.length > 0) {
        let errorState = false;
        this.otherItemData.forEach((item) => {
          if (!item.nickname || !item.custId) {
            errorState = true;
          }
        });
        if (errorState) {
          this.$message.error("请核对必填项");
          return;
        }
        let temp = [];
        if (this.other === "customer") {
          temp = JSON.parse(JSON.stringify(this.otherItemData));
          let tempObj = {};
          temp.forEach((item) => {
            if (item.storeId) {
              tempObj = JSON.parse(JSON.stringify(item));
              tempObj.partnerCode = item.storeCode;
              tempObj.partnerId = item.storeId;
              tempObj.partnerName = item.storeName;
              tempObj.partnerType = 22;
              temp.push(tempObj);
            }
          });
        }
        const params = [
          ...(this.other === "customer" ? temp : this.otherItemData),
        ];
        this.submitLoading = true;
        otherItemAdd(params).then((res) => {
          this.submitLoading = false;
          const data = res.data;
          if (data.code === "200") {
            this.$message.success(
              data.message === "OK" ? "保存成功" : data.message
            );
            this.visible = false;
          } else {
            this.$message.error(data.message ? data.message : "保存失败");
          }
        });
      } else {
        this.visible = false;
      }
    },
    dropGet() {
      if (this.other === "customer") {
        this.getCustumers(20, "");
      }
      if (this.other === "saler") {
        this.getCustumers(30, "");
      }
    },
    getCustumers(partnerType, parentId) {
      const params = {
        partnerType,
        parentId,
        isEnable: 1
      };
      PartnerList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (partnerType === 20) {
            this.customerData = data.data;
            console.log(this.customerData);
          } else if (partnerType === 22) {
            this.storeData = data.data;
          } else if (partnerType === 30) {
            this.supplierData = data.data;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleCustomerChange(val, option) {
      console.log(option);
      const data = option.componentOptions.propsData;
      this.addForm.partnerCode = data.label.split(",")[0]
        ? data.label.split(",")[0]
        : "";
      this.addForm.partnerName = data.label.split(",")[1];
      this.addForm.partnerType = 20;
      this.addForm.storeId = "";
      this.addForm.storeCode = "";
      this.addForm.storeName = "";
      this.getCustumers(22, val);
    },
    handleSupplierrChange(val, option) {
      const data = option.componentOptions.propsData;
      this.addForm.partnerCode = data.label.split(",")[0]
        ? data.label.split(",")[0]
        : "";
      this.addForm.partnerName = data.label.split(",")[1];
      this.addForm.partnerType = 30;
      console.log(this.addForm);
    },
    showModal(val, other) {
      console.log(val);
      console.log(other);
      this.other = other;
      this.itemObj = {
        itemId: val.id,
        itemName: val.itemName,
        itemCode: val.itemCode,
      };
      this.getItemData(val.id, other);
      this.visible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: "*";
}
</style>
