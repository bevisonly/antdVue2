<template>
  <!-- 分拣人员 -->
  <a-modal
    title="分拣人员"
    :visible="visible"
    width="65%"
    @cancel="handleCancel"
    @ok="handleOk"
    destroyOnClose
  >
    <div class="add-item">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-select
            style="width: 100%"
            show-search
            v-model="addObj.workerId"
            placeholder="请输入工人名称搜索"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :default-active-first-option="false"
            @search="handleSearch"
            @change="handleChange"
          >
            <a-select-option
              v-for="item in workersData"
              :value="item.id"
              :key="item.workerName"
            >
              {{ item.workerName }}
            </a-select-option>
          </a-select>
        </a-col>
        <!-- <a-col :span="6">
          <a-date-picker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            v-model="addObj.pickStartTime"
            placeholder="分拣开始时间"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="6">
          <a-date-picker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            v-model="addObj.pickEndTime"
            placeholder="分拣结束时间"
            style="width: 100%"
          />
        </a-col> -->
        <a-col :span="8">
          <a-range-picker
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            showTime
            @change="handleDateChange"
            :placeholder="['分拣开始时间', '结束时间']"
            v-model="sortingTime"
          ></a-range-picker>
        </a-col>
        <a-col :span="2">
          <a-button
            :disabled="
              !addObj.workerId || !addObj.pickStartTime || !addObj.pickEndTime
            "
            type="primary"
            @click="addWorkers"
            >添加</a-button
          >
        </a-col>
      </a-row>
    </div>
    <div class="table-item">
      <a-form-model :model="workersForm" rule="workersRules" ref="workersForm">
        <a-table
          :columns="columns"
          :data-source="workersForm.tableList"
          :loading="tableLoading"
          :pagination="false"
          style="margin-top: 10px"
          size="middle"
        >
          <span slot="titlePickNumber" class="table-formva">分拣数量</span>
          <span slot="titlePickCost" class="table-formva">人工费用</span>
          <div slot="pickNumber" slot-scope="text, record, index">
            <!-- 分拣数量 -->
            <a-form-model-item
              :prop="'tableList.' + index + '.pickNumber'"
              :rule="workersRules.pickNumber"
            >
              <a-input
                v-number
                v-model="record.pickNumber"
              ></a-input>
            </a-form-model-item>
          </div>
          <!-- 人工费用 -->
          <div slot="pickCost" slot-scope="text, record, index">
            <a-form-model-item
              :prop="'tableList.' + index + '.pickCost'"
              :rule="workersRules.pickCost"
            ></a-form-model-item>
            <a-input v-number v-model="record.pickCost"></a-input>
          </div>
          <div slot="opreation" slot-scope="text, record, index">
            <a-button type="link" @click="delWorkers(record, index)"
              >删除</a-button
            >
          </div>
        </a-table>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
const columns = [
  {
    title: "工人名称",
    dataIndex: "workerName",
    align: "left",
  },
  {
    title: "分拣开始时间",
    dataIndex: "pickStartTime",
    align: "left",
  },
  {
    title: "分拣结束时间",
    dataIndex: "pickEndTime",
    align: "left",
  },
  {
    title: "分拣时长(小时)",
    dataIndex: "duration",
    align: "left",
  },
  {
    // title: "分拣数量",
    dataIndex: "pickNumber",
    align: "left",
    scopedSlots: { customRender: "pickNumber", title: "titlePickNumber" },
  },
  {
    // title: "人工费用",
    dataIndex: "pickCost",
    align: "left",
    scopedSlots: { customRender: "pickCost", title: "titlePickCost" },
  },
  {
    title: "操作",
    dataIndex: "opreation",
    align: "center",
    scopedSlots: { customRender: "opreation" },
  },
];
import { GetWorkers } from "../../services/sortingProcessing/SortingProcessingOrder";
import { debounce, dateComputer } from "../../utils/tool";
export default {
  name: "SortingMan",
  data() {
    return {
      sortingTime: "",
      columns,
      visible: false,
      workersForm: { tableList: [] },
      tableLoading: false,
      addObj: {
        pickStartTime: undefined,
        pickEndTime: undefined,
        workerName: "",
        workerId: undefined,
        duration: "",
      },
      workersData: [],
      keyIndex: [],
      workersRules: {
        pickingNumber: [
          {
            required: true,
            message: "分拣数量不能为空",
            trigger: "change",
          },
        ],
        pickCost: [
          {
            required: true,
            message: "人工费用不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    handleDateChange(val) {
      this.addObj.pickStartTime = val[0];
      this.addObj.pickEndTime = val[1];
    },
    handleOk() {
      console.log(111111);
      let errorState = false;
      this.workersForm.tableList.forEach((item) => {
        if (!item.pickNumber || !item.pickCost) {
          errorState = true;
        }
      });
      if (errorState) {
        this.$message.error("请核对必填项");
        return;
      }
      this.$parent.receiveData(this.workersForm.tableList, this.keyIndex);
    },
    delWorkers(record, index) {
      this.workersForm.tableList.splice(index, 1);
    },
    addWorkers() {
      if (this.workersForm.tableList && this.workersForm.tableList.length > 0) {
        let errorState = false;
        this.workersForm.tableList.forEach((item) => {
          if (this.addObj.workerId == item.workerId) {
            errorState = true;
          }
        });
        if (errorState) {
          this.$message.warning('不可重复添加相同人员')
          return;
        }
      }
      if (this.addObj.pickStartTime && this.addObj.pickEndTime) {
        this.addObj.duration = dateComputer(
          this.addObj.pickStartTime,
          this.addObj.pickEndTime
        );
      } else {
        this.addObj.duration = "";
      }
      console.log(this.addObj);
      this.workersForm.tableList.unshift(this.addObj);
      this.addObj = {
        pickStartTime: undefined,
        pickEndTime: undefined,
        workerName: "",
        workerId: undefined,
        duration: "",
      };
      this.sortingTime = undefined;
    },
    getWorkers(value) {
      const params = {
        name: value,
      };
      GetWorkers(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.workersData = data.data;
        } else {
          this.$message.error("获取工人数据失败");
        }
      });
    },
    handleSearch(value) {
      // this.workerName = value;
      debounce(this.getWorkers(value));
    },
    handleChange(value, option) {
      this.addObj.workerName = option.data.key;
      this.$forceUpdate();
    },
    handleCancel() {
      this.visible = false;
    },
    showModal(row, index) {
      this.workersForm.tableList = row.pickingWorkers ? row.pickingWorkers : [];
      this.keyIndex = index;
      this.visible = true;
      this.getWorkers("");
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