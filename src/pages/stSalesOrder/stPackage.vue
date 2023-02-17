<template>
  <!-- 包装选择 -->
  <a-modal
    title="包装选择"
    :visible="packageVisible"
    :width="700"
    @cancel="handleCancelPackage"
    :dialogStyle="{
      top: '160px',
    }"
    destroyOnClose
    :maskClosable='false'
  >
    <div class="details">
      <div class="table">
        <p class="table-title flex-sb">
          <span>包装列表</span>
          <span>
            <a-select
              ref="addPackageSelect"
              mode="multiple"
              v-model="valueSelectPackage"
              size="small"
              show-search
              placeholder="请选择包装"
              option-filter-prop="children"
              style="width: 200px; margin-right: 6px"
              :filter-option="filterOption"
              @change="chooseSelectPackage"
            >
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div
                  style="padding: 4px 8px; cursor: pointer"
                  @mousedown="(e) => e.preventDefault()"
                >
                  <a-button type="primary" size="small" @click="addPackage"
                    >确认</a-button
                  >
                </div>
              </div>
              <a-select-option
                v-for="item in packageListData"
                :key="item.packCode"
                :value="item.packCode"
              >
                {{ item.packName }}
              </a-select-option>
            </a-select>
            <!-- <a-button type="primary" size="small" @click="addPackage"
                >添加</a-button
              > -->
          </span>
        </p>
        <div class="table-data">
          <a-table
            rowKey="packCode"
            :pagination="false"
            :columns="packageColumns"
            :data-source="packageData"
            :scroll="{ y: 800 }"
          >
            <span slot="del" slot-scope="text, record, index">
              <a-popconfirm
                title="确定要删除这条数据吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="delPackageOne(record, index)"
                @cancel="cancel"
              >
                <a-button type="link"> 删除 </a-button>
              </a-popconfirm>
            </span>
            <span slot="PQTitle" class="table-formva"> 包装数量</span>
            <span slot="packQty" slot-scope="text, record">
              <a-input-number v-model="record.packQty" placeholder="必填"></a-input-number>
            </span>
            <span slot="unitPrice" slot-scope="text">
              <span>{{ text}}</span>
            </span>
          </a-table>
        </div>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="handleCancelPackage">取消 </a-button>
      <a-button type="primary" @click="handleSubmitPackage">确定 </a-button>
    </template>
  </a-modal>
</template>

<script>
import { packList } from "../../services/purchaseSaleInventory";
import { isFalse } from "../../utils/util";
export default {
  name: "stPackage",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      packageVisible: false,
      valueSelectPackage: [],
      packageListData: [],
      ItemsObj: {},
      packageData: [],
      packageColumns: [
        {
          dataIndex: "del",
          title: "操作",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "del" },
        },
        {
          title: "包装名称",
          dataIndex: "packName",
          width: 100,
          align: "center",
        },
        {
          title: "包装编号",
          dataIndex: "packCode",
          width: 150,
          align: "center",
        },
        {
          dataIndex: "packQty",
          slots: { title: "PQTitle" },
          width: 100,
          align: "center",
          scopedSlots: { customRender: "packQty" },
        },
        {
          title: "包装价格(元)",
          dataIndex: "unitPrice",
          width: 110,
          align: "center",
          scopedSlots: { customRender: "unitPrice" },
        },
      ],
    };
  },
  methods: {
    openPachage(row) {
      this.ItemsObj = row;
      this.packageVisible = true;
      this.packageData = row.packDetailList || row.itemPackList || [];
    },
    handleCancelPackage() {
      this.packageVisible = false;
    },
    handleSubmitPackage() {
      let packagePrice = 0;
      let packageDataArr = JSON.parse(JSON.stringify(this.packageData));
      let uniqArr = [];
      packageDataArr.forEach((item) => {
        let uPrice = item.packQty * item.unitPrice;
        packagePrice = packagePrice + uPrice;
        if (isFalse(item.packQty)) {
          uniqArr.push(item.packName);
        }
        item.packUnitPrice = item.unitPrice;
        item.packUnitWeight = item.unitWeight;
        item.packId = item.id;
      });
      if (uniqArr.length > 0) {
        let str = uniqArr.join(",");
        this.$message.error(`请填写${str}包装数量！`);
        return;
      }
      this.$parent.$parent.handleSubmitPackage(packageDataArr, packagePrice);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    cancel() {
      this.$message.error("取消");
    },
    delPackageOne(row, index) {
      this.packageData.splice(index, 1);
    },
    chooseSelectPackage() {
      let packageListValueDataArr = [];
      this.packageListData.forEach((item) => {
        if (this.valueSelectPackage.indexOf(item.packCode) > -1) {
          packageListValueDataArr.push(item);
        }
      });
      this.packageListValueData = JSON.parse(
        JSON.stringify(packageListValueDataArr)
      );
    },
    addPackage() {
      if (this.packageListValueData.length === 0) {
        this.$message.error(`请选择一条数据进行添加！`);
        return;
      }
      let quniPackages = [];
      this.packageData.forEach((item) => {
        this.packageListValueData.forEach((val) => {
          if (item.packCode === val.packCode) {
            quniPackages.push(item.packName);
          }
        });
      });
      if (quniPackages.length > 0) {
        let itemsStr = quniPackages.join(",");
        this.$message.error(`包装${itemsStr}已经存在！`);
        return;
      }
      this.packageData = this.packageData.concat(this.packageListValueData);
      this.packageListValueData = [];
      this.valueSelectPackage = [];
      this.$refs.addPackageSelect.blur();
    },
    getPackageList() {
      const params = {};
      packList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.packageListData = data.data;
          //   this.packageListData.forEach((item) => {
          //     item.packId = item.id;
          //     item.packUnitPrice = item.unitPrice;
          //     item.packUnitWeight = item.unitWeight;
          //   });
        } else {
          this.$message.error(data.message);
        }
      });
    },
  },
  created() {
    this.getPackageList();
  },
};
</script>
<style lang="less" scoped>
</style>