<template>
  <div class="detail-item">
    <a-modal
      title="分拣加工单详情"
      v-model="visible"
      centered
      destroyOnClose
      width="50%"
    >
      <div class="item" v-if="itemData.length > 0">
        <a-card
          title="产成品"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <a-table
            :pagination="false"
            :data-source="itemData"
            :columns="columnsCCP"
            size="middle"
            rowKey="id"
          >
            <div slot="pickingWorkers" slot-scope="text, record">
              <a-button
                v-if="record.pickingWorkers && record.pickingWorkers.length > 0"
                type="link"
                @click="showWorkers(record)"
                >查看</a-button
              >
              <span v-else>暂无</span>
            </div>
          </a-table>
        </a-card>
      </div>
      <div
        class="picking-item"
        style="margin-top: 20px"
        v-if="pickingData.length > 0"
      >
        <a-card
          title="领料商品清单"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <div class="picking-man">领料员 :{{pickingUserName}}</div>
          <a-table
            :pagination="false"
            :data-source="pickingData"
            :columns="columnsLL"
            size="middle"
            rowKey="id"
          ></a-table>
        </a-card>
      </div>
      <div
        class="return-item"
        style="margin-top: 20px"
        v-if="returnData.length > 0"
      >
        <a-card
          title="退料清单"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <a-table
            :pagination="false"
            :data-source="returnData"
            :columns="columnsTL"
            size="middle"
            rowKey="id"
          ></a-table>
        </a-card>
      </div>
      <div
        class="damage-item"
        style="margin-top: 20px"
        v-if="damageData.length > 0"
      >
        <a-card
          title="报损清单"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
        >
          <a-table
            :pagination="false"
            :data-source="damageData"
            :columns="columnsBS"
            size="middle"
            rowKey="id"
          ></a-table>
        </a-card>
      </div>
      <template slot="footer">
        <div>
          <a-button type="primary" @click="handleClose">关闭</a-button>
        </div>
      </template>
    </a-modal>
    <a-modal
      title="分拣工人"
      v-model="visibleWorker"
      centered
      destroyOnClose
      width="50%"
      :footer="null"
    >
      <a-table
        :pagination="false"
        :data-source="workersData"
        :columns="columnsWorkers"
        size="middle"
        rowKey="id"

      ></a-table>
    </a-modal>
  </div>
</template>

<script>
import { GetSingleItems } from "../../services/sortingProcessing/SortingProcessingOrder";
const columnsCCP = [
  {
    title: "产成品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "实际分拣数",
    dataIndex: "sortingNumber",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
  {
    title: "需求数量",
    dataIndex: "preProductionNum",
    align: "center",
  },
  {
    title: "分拣人员",
    dataIndex: "pickingWorkers",
    align: "center",
    scopedSlots: { customRender: "pickingWorkers" },
  },
];
const columnsLL = [
  {
    title: "领料批次号",
    dataIndex: "piHeadNo",
    align: "center",
  },
  {
    title: "领料商品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "预领取数量",
    dataIndex: "prePickingNum",
    align: "center",
  },
  {
    title: "实际领料数量",
    dataIndex: "pickingNum",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
];
const columnsTL = [
  {
    title: "退料商品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "退料数量",
    dataIndex: "pickingNum",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
];
const columnsBS = [
  {
    title: "报损商品",
    dataIndex: "piItemName",
    align: "center",
  },
  {
    title: "报损数量",
    dataIndex: "pickingNum",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
  {
    title: "报损原因",
    dataIndex: "damageReason",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
];
const columnsWorkers = [
  {
    title: "工人名称",
    dataIndex: "workerName",
    align: "center",
  },
  {
    title: "分拣开始时间",
    dataIndex: "pickStartTime",
    align: "center",
  },
  {
    title: "分拣结束时间",
    dataIndex: "pickEndTime",
    align: "center",
  },
  {
    title: "分拣时长(小时)",
    dataIndex: "duration",
    align: "center",
  },
  {
    title: "分拣数量",
    dataIndex: "pickNumber",
    align: "center",
  },
  {
    title: "人工费用",
    dataIndex: "pickCost",
    align: "center",
  },
];
export default {
  data() {
    return {
      columnsWorkers,
      visible: false,
      visibleWorker: false,
      columnsCCP,
      columnsLL,
      columnsTL,
      columnsBS,
      itemData: [],
      pickingData: [],
      returnData: [],
      damageData: [],
      workersData: [],
      pickingUserName:'',
    };
  },
  methods: {
    showWorkers(record) {
      this.workersData = JSON.parse(JSON.stringify(record.pickingWorkers));
      this.visibleWorker = true;
    },
    getItems(id) {
      GetSingleItems({ id: id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.itemData = data.data.pickingDetails || [];
          this.pickingData = data.data.originalPickingDetails || [];
          this.returnData = data.data.returnPickingDetails || [];
          this.damageData = data.data.damagePickingDetails || [];
          this.pickingUserName=data.data.pickingUserName
          this.visible = true;
        } else {
          this.$messgage.error(
            data.message ? data.message : "获取分拣单详情失败"
          );
        }
      });
    },
    handleClose() {
      this.visible = false;
    },
    showModal(id) {
      console.log(id);
      this.getItems(id);
    },
  },
};
</script>

<style>
</style>