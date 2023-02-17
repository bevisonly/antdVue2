<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="subTitle"
      @back="handleBack"
    />
    <div class="add-item" style="margin-top: 10px">
      <a-card
        title="产成品"
        class="card-info"
        :head-style="{ backgroundColor: '#f0f3f6' }"
        size="small"
      >
        <div class="add">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-select
                show-search
                v-model="itemValue"
                style="width: 100%"
                placeholder="请输入或选择加工商品"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearch"
                @select="getItemsSelect('add')"
              >
                <a-select-option
                  v-for="(item, index) in selectItems"
                  :key="index"
                  :value="item.processItemId"
                  >{{ item.processItemName }}({{
                    item.processItemCode
                  }})</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-input
                :disabled="!itemValue"
                v-model="itemQty"
                v-number
                placeholder="请输入成品数量"
                style="width: 100%"
              ></a-input>
            </a-col>

            <a-col :span="2">
              <a-button
                type="primary"
                :disabled="!itemValue"
                @click="addItems('add')"
                >添加</a-button
              >
            </a-col>
          </a-row>
        </div>
        <div class="table-item" style="margin-top: 20px">
          <a-form-model :model="form" :rule="rules" ref="form">
            <a-table
              rowKey="indexKey"
              :pagination="false"
              :columns="columns"
              :data-source="form.tableData"
              :scroll="{ y: 300 }"
            >
              <span slot="qtyTitle" class="table-formva"> 分拣数 </span>
              <span slot="unitTitle" class="table-formva"> 单位 </span>
              <span slot="workerTitle" class="table-formva"> 分拣人员 </span>
              <!-- 分拣数 -->
              <div slot="sortingNumber" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'tableData.' + index + '.sortingNumber'"
                  :rules="rules.sortingNumber"
                >
                  <a-input
                    v-number
                    v-model="record.sortingNumber"
                  ></a-input>
                </a-form-model-item>
              </div>
              <!-- 单位 -->
              <span slot="unit" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'tableData.' + index + '.unit'"
                  :rules="rules.unit"
                >
                  <a-select style="width: 100%" v-model="record.unit">
                    <a-select-option
                      v-for="item in unitList"
                      :key="item.id"
                      :value="item.dicText"
                      >{{ item.dicText }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <!--  -->
              <div slot="pickingWorkers" slot-scope="text, record, index">
                <!-- <span
                  v-if="
                    record.pickingWorkers && record.pickingWorkers.length > 0
                  "
                >
                  <span v-for="item in pickingWorkers" :key="item.workerId">
                    {{ item.workerName }}
                  </span>
                </span> -->
                <a-button type="link" @click="chooseWorker(record, index)"
                  >{{
                    record.pickingWorkers && record.pickingWorkers.length > 0
                      ? record.pickingWorkers[0].workerName
                      : "添加"
                  }}{{ record.pickingWorkers.length > 1 ? "等" : "" }}</a-button
                >
              </div>
              <div slot="opreation" slot-scope="text, record, index">
                <a-button type="link" @click="delItem(record, index, 'add')"
                  >删除</a-button
                >
              </div>
            </a-table>
          </a-form-model>
        </div>
      </a-card>
    </div>
    <!-- 退料 -->
    <div
      class="return-item"
      style="margin-top: 10px"
      v-if="pageState === 'complete' || pageState === 'complete-edit'"
    >
      <a-card
        title="退料登记"
        class="card-info"
        :head-style="{ backgroundColor: '#f0f3f6' }"
        size="small"
      >
        <div class="add">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-select
                show-search
                v-model="returnItemValue"
                style="width: 100%"
                placeholder="请输入或选择退料商品"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearchReturn"
                @select="getItemsSelect('return')"
              >
                <a-select-option
                  v-for="item in returnSelectItems"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.piItemName }}({{ item.piItemNo }})</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-input
                :disabled="!returnItemValue"
                v-model="returnItemQty"
                v-number
                placeholder="请输入成品数量"
                style="width: 100%"
              ></a-input>
            </a-col>

            <a-col :span="2">
              <a-button
                type="primary"
                :disabled="!returnItemValue"
                @click="addItems('return')"
                >添加</a-button
              >
            </a-col>
            <a-col :span="6">
              <span class="table-formva"> 退料人员 </span>
              <a-select
                style="width: 60%"
                mode="multiple"
                placeholder="选择退料人员(可多选)"
                @change="handleChangeReturnMen"
                :disabled="!form.returnTableData.length > 0"
                v-model="form.returnWorker"
              >
                <a-select-option
                  v-for="item in workersList"
                  :key="item.id"
                  :value="item.workerName"
                  >{{ item.workerName }}</a-select-option
                >
              </a-select>
            </a-col>
          </a-row>
        </div>
        <div class="table-item" style="margin-top: 20px">
          <a-form-model :model="form" :rule="rules" ref="form">
            <a-table
              rowKey="indexKey"
              :pagination="false"
              :columns="returnColumns"
              :data-source="form.returnTableData"
              :scroll="{ y: 300 }"
            >
              <span slot="qtyTitle" class="table-formva"> 退料数量 </span>
              <span slot="unitTitle" class="table-formva"> 单位 </span>

              <div slot="pickingNum" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'returnTableData.' + index + '.pickingNum'"
                  :rules="rules.pickingNum"
                >
                  <a-input
                    v-number
                    v-model="record.pickingNum"
                  ></a-input>
                </a-form-model-item>
              </div>
              <!-- 单位 -->
              <span slot="unit" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'returnTableData.' + index + '.unit'"
                  :rules="rules.unit"
                >
                  <a-select style="width: 100%" v-model="record.unit">
                    <a-select-option
                      v-for="item in unitList"
                      :key="item.id"
                      :value="item.dicText"
                      >{{ item.dicText }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark"></a-input>
              </span>
              <!--  -->
              <div slot="opreation" slot-scope="text, record, index">
                <a-button type="link" @click="delItem(record, index, 'return')"
                  >删除</a-button
                >
              </div>
            </a-table>
          </a-form-model>
        </div>
      </a-card>
    </div>
    <!-- 报损 -->
    <div
      class="damage-item"
      style="margin-top: 10px"
      v-if="pageState === 'complete' || pageState === 'complete-edit'"
    >
      <a-card
        title="报损登记"
        class="card-info"
        :head-style="{ backgroundColor: '#f0f3f6' }"
        size="small"
      >
        <div class="add">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-select
                show-search
                v-model="damageItemValue"
                style="width: 100%"
                placeholder="请输入或选择报损商品"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearchDamage"
                @select="getItemsSelect('damage')"
              >
                <a-select-option
                  v-for="item in damageSelectItems"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.piItemName }}({{ item.piItemNo }})</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-input
                :disabled="!damageItemValue"
                v-model="damageItemQty"
                v-number
                placeholder="请输入成品数量"
                style="width: 100%"
              ></a-input>
            </a-col>

            <a-col :span="2">
              <a-button
                type="primary"
                :disabled="!damageItemValue"
                @click="addItems('damage')"
                >添加</a-button
              >
            </a-col>
            <a-col :span="6">
              <span class="table-formva"> 报损人员 </span>
              <a-select
                style="width: 60%"
                mode="multiple"
                placeholder="选择报损人员(可多选)"
                @change="handleChangeDamageMen"
                :disabled="!form.damageTableData.length > 0"
                v-model="form.damageWorker"
              >
                <a-select-option
                  v-for="item in workersList"
                  :key="item.id"
                  :value="item.workerName"
                  >{{ item.workerName }}</a-select-option
                >
              </a-select>
            </a-col>
          </a-row>
        </div>
        <div class="table-item" style="margin-top: 20px">
          <a-form-model :model="form" :rule="rules" ref="form">
            <a-table
              rowKey="indexKey"
              :pagination="false"
              :columns="damageColumns"
              :data-source="form.damageTableData"
              :scroll="{ y: 300 }"
            >
              <span slot="qtyTitle" class="table-formva"> 报损数量 </span>
              <span slot="unitTitle" class="table-formva"> 单位 </span>
              <span slot="damageTitle" class="table-formva"> 报损原因 </span>

              <div slot="pickingNum" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'damageTableData.' + index + '.pickingNum'"
                  :rules="rules.pickingNum"
                >
                  <a-input
                    v-number
                    v-model="record.pickingNum"
                  ></a-input>
                </a-form-model-item>
              </div>
              <!-- 单位 -->
              <span slot="unit" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'damageTableData.' + index + '.unit'"
                  :rules="rules.unit"
                >
                  <a-select style="width: 100%" v-model="record.unit">
                    <a-select-option
                      v-for="item in unitList"
                      :key="item.id"
                      :value="item.dicText"
                      >{{ item.dicText }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <!-- 报损原因 -->
              <span slot="damageReason" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="'damageTableData.' + index + '.damageReason'"
                  :rules="rules.damageReason"
                >
                  <a-select style="width: 100%" v-model="record.damageReason">
                    <a-select-option
                      v-for="item in damageReasonList"
                      :key="item.id"
                      :value="item.dicText"
                      >{{ item.dicText }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark"></a-input>
              </span>
              <!--  -->
              <div slot="opreation" slot-scope="text, record, index">
                <a-button type="link" @click="delItem(record, index, 'damage')"
                  >删除</a-button
                >
              </div>
            </a-table>
          </a-form-model>
        </div>
      </a-card>
    </div>

    <div
      class="footer-btn"
      style="
        text-align: right;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      "
    >
      <a-space>
        <a-button @click="handleBack"> 返回列表 </a-button>
        <a-button
          v-if="pageState === 'add'"
          :loading="btnLoading"
          type="primary"
          @click="handleInsert"
        >
          新增
        </a-button>
        <a-button
          v-if="pageState === 'edit'"
          :loading="btnLoading"
          type="primary"
          @click="handleEdit"
        >
          保存
        </a-button>
        <a-button
          v-if="pageState === 'complete'"
          :loading="btnLoading"
          type="primary"
          @click="completeToWarehouse"
        >
          完工入库
        </a-button>
        <a-button
          v-if="pageState === 'complete-edit'"
          :loading="btnLoading"
          type="primary"
          @click="completeToWarehouse"
        >
          保存
        </a-button>
      </a-space>
    </div>
    <SortingMan ref="sortingMan" />
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import { debounce } from "../../utils/tool";
import SortingMan from "./SortingMan.vue";
import {
  GetItems,
  GetUnits,
  InsertItems,
  GetSingleItems,
  EditItems,
  GetBomItems,
  CompleteItems,
  GetWorkers,
} from "../../services/sortingProcessing/SortingProcessingOrder";
export default {
  mixins: [mixin],
  components: {
    SortingMan,
    // VNodes: {
    //   functional: true,
    //   render: (h, ctx) => ctx.props.vnodes,
    // },
  },
  data() {
    return {
      columns: [
        {
          title: "产成品",
          dataIndex: "piItemName",
          // width: 150,
          align: "center",
        },

        {
          slots: { title: "qtyTitle" },
          dataIndex: "sortingNumber",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "sortingNumber" },
        },
        {
          slots: { title: "unitTitle" },
          dataIndex: "unit",
          // width: 80,
          align: "center",
          scopedSlots: { customRender: "unit" },
        },
        {
          slots: { title: "workerTitle" },
          dataIndex: "pickingWorkers",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "pickingWorkers" },
        },
        {
          title: "操作",
          dataIndex: "opreation",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      returnColumns: [
        {
          title: "退料商品",
          dataIndex: "piItemName",
          // width: 150,
          align: "center",
        },

        {
          slots: { title: "qtyTitle" },
          dataIndex: "pickingNum",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "pickingNum" },
        },
        {
          slots: { title: "unitTitle" },
          dataIndex: "unit",
          // width: 80,
          align: "center",
          scopedSlots: { customRender: "unit" },
        },
        {
          title: "备注",
          dataIndex: "remark",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
        {
          title: "操作",
          dataIndex: "opreation",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      damageColumns: [
        {
          title: "报损商品",
          dataIndex: "piItemName",
          // width: 150,
          align: "center",
        },

        {
          slots: { title: "qtyTitle" },
          dataIndex: "pickingNum",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "pickingNum" },
        },
        {
          slots: { title: "unitTitle" },
          dataIndex: "unit",
          // width: 80,
          align: "center",
          scopedSlots: { customRender: "unit" },
        },
        {
          slots: { title: "damageTitle" },
          dataIndex: "damageReason",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "damageReason" },
        },
        {
          title: "备注",
          dataIndex: "remark",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
        {
          title: "操作",
          dataIndex: "opreation",
          // width: 100,
          align: "center",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      rules: {
        sortingNumber: [
          {
            required: true,
            message: "分拣数量不能为空",
            trigger: "change",
          },
        ],
        unit: [
          {
            required: true,
            message: "单位不能为空",
            trigger: "change",
          },
        ],
        pickingNum: [
          {
            required: true,
            message: "必填",
            trigger: "change",
          },
        ],
        damageReason: [
          {
            required: true,
            message: "必填",
            trigger: "change",
          },
        ],
      },
      form: {
        tableData: [],
        returnTableData: [],
        damageTableData: [],
      },
      itemValue: undefined,
      returnItemValue: undefined,
      damageItemValue: undefined,
      addItemObj: {
        processItemId: "",
        processItemName: "",
        processItemCode: "",
      },
      returnItemObj: {
        itemId: "",
        itemName: "",
        itemCode: "",
      },
      damageItemObj: {
        itemId: "",
        itemName: "",
        itemCode: "",
      },
      itemQty: "",
      returnItemQty: "",
      damageItemQty: "",
      unitList: [],
      addLoading: false,
      selectItems: [],
      returnSelectItems: [],
      damageSelectItems: [],
      pagination: {
        rows: 10,
        page: 1,
        sort: "id",
        order: "DESC",
      },
      btnLoading: false,
      pageState: "",
      subTitle: "",
      editId: "",
      damageReasonList: [],
      workersList: [],
    };
  },
  watch: {
    tableData(val) {
      console.log("watch arr", val);
    },
  },
  methods: {
    handleChangeDamageMen(value, options) {
      console.log(value);
      console.log(options);
      this.form.lossWorkerName = value.join(",");
      if (options) {
        let temp = [];
        options.forEach((item) => {
          temp.push(item.key);
        });
        this.form.lossWorkerId = temp.join(",");
      }
      this.$forceUpdate();
      console.log(`${this.form.lossWorkerName}+${this.form.lossWorkerId}`);
    },
    handleChangeReturnMen(value, options) {
      this.form.outboundWorkerName = value.join(",");
      if (options) {
        let temp = [];
        options.forEach((item) => {
          temp.push(item.key);
        });
        this.form.outboundWorkerId = temp.join(",");
      }
      this.$forceUpdate();
      console.log(
        `${this.form.outboundWorkerName}+${this.form.outboundWorkerId}`
      );
    },
    getWorkersList(val) {
      GetWorkers({ name: val }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.workersList = data.data;
        } else {
          this.workersList = [];
          this.$message.error(data.message);
        }
      });
    },
    getEditDetails(id) {
      GetSingleItems({ id: id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.form.tableData = data.data.pickingDetails || [];
          this.form.returnTableData = data.data.returnPickingDetails || [];
          this.form.damageTableData = data.data.damagePickingDetails || [];
          if (data.data.outboundWorkerId && data.data.outboundWorkerName) {
            this.form.outboundWorkerId = data.data.outboundWorkerId;
            this.form.outboundWorkerName = data.data.outboundWorkerName;
            let temp = data.data.outboundWorkerName;
            this.form.returnWorker = temp.split(",");
          }
          if (data.data.lossWorkerId && data.data.lossWorkerName) {
            this.form.lossWorkerId = data.data.lossWorkerId;
            this.form.lossWorkerName = data.data.lossWorkerName;
            let temp = data.data.lossWorkerName;
            this.form.damageWorker = temp.split(",");
          }
          console.log(this.form);
        } else {
          this.$messgage.error(
            data.message ? data.message : "获取分拣单数据失败"
          );
        }
      });
    },
    handleEdit() {
      if (!this.form.tableData.length > 0) {
        this.$message.warning("请先添加商品");
        return;
      }
      let tempArr = [];
      this.form.tableData.forEach((item) => {
        console.log(item);
        if (!item.pickingWorkers || !item.pickingWorkers.length > 0) {
          console.log(1);
          tempArr.push(item.piItemName);
        }
      });
      console.log(tempArr);
      if (tempArr.length > 0) {
        let str = tempArr.join(",");
        this.$message.warning(`${str}的分拣工人未登记`);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            id: this.editId,
            pickingDetails: [...this.form.tableData],
          };
          this.btnLoading = true;
          EditItems(params).then((res) => {
            this.btnLoading = false;
            const data = res.data;
            if (data.code === "200") {
              this.$closePage(
                "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
                "/sortingProcessing/processingSorting/sortingProcessingOrder"
              );
              this.$message.success(data.message);
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    completeToWarehouse() {
      if (!this.form.tableData.length > 0) {
        this.$message.warning("请先添加产成品");
        return;
      }
      let tempArr = [];
      this.form.tableData.forEach((item) => {
        console.log(item);
        if (!item.pickingWorkers || !item.pickingWorkers.length > 0) {
          tempArr.push(item.piItemName);
        }
      });
      console.log(tempArr);
      if (tempArr.length > 0) {
        let str = tempArr.join(",");
        this.$message.warning(`${str}的分拣工人未登记`);
        return;
      }
      console.log(this.form);
      if (this.form.returnTableData && this.form.returnTableData.length > 0) {
        if (!this.form.outboundWorkerId || !this.form.outboundWorkerName) {
          this.$message.error("存在退料数据请选择退料人员再入库");
          return;
        }
      }
      if (this.form.damageTableData && this.form.damageTableData.length > 0) {
        if (!this.form.lossWorkerId || !this.form.lossWorkerName) {
          this.$message.error("存在报损数据请选择报损人员再入库");
          return;
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            id: this.editId,
            outboundWorkerId: this.form.outboundWorkerId,
            outboundWorkerName: this.form.outboundWorkerName,
            lossWorkerId: this.form.lossWorkerId,
            lossWorkerName: this.form.lossWorkerName,
            pickingDetails: [...this.form.tableData],
            returnPickingDetails: [...this.form.returnTableData],
            damagePickingDetails: [...this.form.damageTableData],
          };
          this.btnLoading = true;
          if (this.pageState === "complete") {
            CompleteItems(params).then((res) => {
              this.btnLoading = false;
              const data = res.data;
              if (data.code === "200") {
                this.$closePage(
                  "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
                  "/sortingProcessing/processingSorting/sortingProcessingOrder"
                );
                this.$message.success(data.message);
              } else {
                this.$message.error(data.message);
              }
            });
          }
          if (this.pageState === "complete-edit") {
            EditItems(params).then((res) => {
              this.btnLoading = false;
              const data = res.data;
              if (data.code === "200") {
                this.$closePage(
                  "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
                  "/sortingProcessing/processingSorting/sortingProcessingOrder"
                );
                this.$message.success(data.message);
              } else {
                this.$message.error(data.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    handleSearch(value) {
      debounce(this.getItems(value));
    },
    handleSearchReturn(value) {
      debounce(this.getItemsDetails(value, "return"));
    },
    handleSearchDamage(value) {
      debounce(this.getItemsDetails(value, "damage"));
    },
    handleBack() {
      this.$closePage(
        "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
        "/sortingProcessing/processingSorting/sortingProcessingOrder"
      );
    },
    handleInsert() {
      if (!this.form.tableData.length > 0) {
        this.$message.warning("请先添加产成品");
        return;
      }
      let tempArr = [];
      this.form.tableData.forEach((item) => {
        if (!item.pickingWorkers || !item.pickingWorkers.length > 0) {
          tempArr.push(item.piItemName);
        }
      });
      if (tempArr.length > 0) {
        let str = tempArr.join(",");
        this.$message.warning(`${str}的分拣工人未登记`);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = [...this.form.tableData];
          this.btnLoading = true;
          InsertItems(params).then((res) => {
            this.btnLoading = false;
            const data = res.data;
            if (data.code === "200") {
              this.$closePage(
                "/sortingProcessing/processingSorting/sortingProcessingOrderAdd",
                "/sortingProcessing/processingSorting/sortingProcessingOrder"
              );
              this.$message.success(data.message);
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    receiveData(data, index) {
      console.log(data);
      console.log(index);
      this.form.tableData[index].pickingWorkers = [];
      this.form.tableData[index].pickingWorkers = JSON.parse(
        JSON.stringify(data)
      );
      this.$forceUpdate();
      this.$refs.sortingMan.handleCancel();
    },
    chooseWorker(row, index) {
      console.log(row);
      this.$refs.sortingMan.showModal(row, index);
    },
    getUnitData(type) {
      GetUnits({ type: type }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (type == 10) {
            this.unitList = data.data;
          }
          if (type == 27) {
            this.damageReasonList = data.data;
          }
        } else {
          this.$message.error(data.message ? data.message : "获取单位数据失败");
        }
      });
    },
    delItem(val, i, state) {
      switch (state) {
        case "add":
          this.form.tableData.splice(i, 1);
          break;
        case "return":
          this.form.returnTableData.splice(i, 1);
          break;
        case "damage":
          this.form.damageTableData.splice(i, 1);
          break;

        default:
          break;
      }
    },
    addItems(state) {
      console.log(this.addItemObj);
      if (state === "add") {
        if (!this.itemValue) {
          this.$message.info("请先选择商品");
          return;
        }

        let tempData = {
          sortingNumber: this.itemQty,
          piItemId: this.addItemObj.processItemId,
          piItemName: this.addItemObj.processItemName,
          piItemNo: this.addItemObj.processItemCode,
          pickingWorkers: [],
          // itemCode: this.addItemObj.itemCode,
          unit: this.addItemObj.defUom || "",
        };
        let errorMsg = false;
        if (this.form.tableData && this.form.tableData.length > 0) {
          this.form.tableData.forEach((item) => {
            if (item.piItemId == tempData.piItemId) {
              this.$message.error(
                `列表中已含有${item.piItemName},请直接修改数量即可`
              );
              errorMsg = true;
            }
          });
        }
        if (errorMsg) {
          return;
        }
        this.form.tableData.push(tempData);
        this.form.tableData.forEach((item, index) => {
          item.keyIndex = index;
        });
        this.itemValue = undefined;
        this.itemQty = "";
      }
      if (state === "return") {
        if (!this.returnItemValue) {
          this.$message.info("请先选择商品");
          return;
        }
        let tempData = {
          pickingNum: this.returnItemQty,
          piItemId: this.returnItemObj.piItemId,
          piItemName: this.returnItemObj.piItemName,
          piItemNo: this.returnItemObj.piItemNo,
          lotId: this.returnItemObj.lotId||'',
          unit: this.returnItemObj.unit || "",
        };
        this.form.returnTableData.push(tempData);
        this.form.returnTableData.forEach((item, index) => {
          item.keyIndex = index;
        });
        this.returnItemValue = undefined;
        this.returnItemQty = "";
      }
      if (state === "damage") {
        if (!this.damageItemValue) {
          this.$message.info("请先选择商品");
          return;
        }
        let tempData = {
          pickingNum: this.damageItemQty,
          piItemId: this.damageItemObj.piItemId,
          piItemName: this.damageItemObj.piItemName,
          piItemNo: this.damageItemObj.piItemNo,
          unit: this.damageItemObj.unit || "",
          lotId: this.damageItemObj.lotId||'',
        };
        this.form.damageTableData.push(tempData);
        this.form.damageTableData.forEach((item, index) => {
          item.keyIndex = index;
        });
        this.damageItemValue = undefined;
        this.damageItemQty = "";
      }
    },
    getItemsSelect(state) {
      if (state === "add") {
        const itemData = this.selectItems.find((item) => {
          return item.processItemId === this.itemValue;
        });
        this.addItemObj = itemData;
      }
      if (state === "return") {
        const itemData = this.returnSelectItems.find((item) => {
          return item.id === this.returnItemValue;
        });
        this.returnItemObj = itemData;
      }
      if (state === "damage") {
        const itemData = this.damageSelectItems.find((item) => {
          return item.id === this.damageItemValue;
        });
        this.damageItemObj = itemData;
      }
    },
    getItems(value) {
      const params = { processItemName: value };
      GetItems(params).then((res) => {
        const data = res.data;
        this.selectItems = data.data;
      });
    },
    getItemsDetails(value, state) {
      const params = { sorHeadId: this.editId, piItemName: value };
      GetBomItems(params).then((res) => {
        const data = res.data;
        if (!state) {
          this.returnSelectItems = data.data;
          this.damageSelectItems = data.data;
        }
        if (state === "return") {
          this.returnSelectItems = data.data;
        }
        if (state === "damage") {
          this.damageSelectItems = data.data;
        }
      });
    },
  },
  activated() {
    let record;
    if (Object.keys(this.$route.query).length) {
      record = this.$route.query.record;
      this.pageState = this.$route.query.state;
    }
    switch (this.pageState) {
      case "add":
        this.subTitle = "新增预加工单";
        break;
      case "edit":
        this.subTitle = "编辑分拣单";
        break;
      case "complete":
        this.subTitle = "分拣完成";
        break;
      case "complete-edit":
        this.subTitle = "已加工单编辑";
        break;

      default:
        break;
    }
    // this.subTitle = this.pageState === "add" ? "新增分拣单" : "编辑分拣单";
    console.log(record);
    if (record.id) {
      this.editId = record.id;
      this.getEditDetails(record.id);
    }
    if (this.pageState === "complete" || this.pageState === "complete-edit") {
      this.getWorkersList("");
      this.getItemsDetails("", "");
    }
    this.getUnitData(10);
    this.getUnitData(27);
    this.getItems("");
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
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>