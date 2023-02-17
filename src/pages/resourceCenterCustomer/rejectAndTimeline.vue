<template>
  <div>
    <a-modal
      :width="600"
      destroyOnClose
      v-model="visibleLittle"
      :maskClosable="false"
      :title="autoTitle"
      centered
      :footer="false"
    >
      <textarea-y
        v-if="autoTitle === '驳回原因'"
        style="height: 200px"
        v-model="rejectInfo"
        :showWordLimit="true"
        :maxLength="500"
        :autoSize="false"
        placeholder=""
      ></textarea-y>
      <div
        v-if="autoTitle === '轨迹'"
        style="display: flex; justify-content: center"
      >
        <a-timeline>
          <a-timeline-item v-for="item in timeLineList" :key="item.id">
            {{ item.operationTime }} {{ item.operationType }}
            {{ item.operationUserName
            }}{{ "(" + item.operationUserAccount + ")" }}
          </a-timeline-item>
        </a-timeline>
      </div>
      <div
        class="opreation"
        style="margin-top: 24px; text-align: center"
        v-if="autoTitle === '驳回原因'"
      >
        <a-space>
          <a-button type="primary" @click="toReject" v-if="rejectDisabled"
            >保存</a-button
          >
          <a-button @click="closeModal">取消</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script>
import textareaY from "../../components/textareaY/textareaY.vue";
import {
  AuditPartnerCenter,
  PartnerOperationTrack,
} from "../../services/resourceCenter/resourceCenter";
export default {
  components: { textareaY },
  data() {
    return {
      visibleLittle: false,
      autoTitle: "",
      rejectDisabled: false,
      timeLineList: [],
      rejectInfo: "",
      data: {},
    };
  },
  methods: {
    async toReject() {
      const params = {
        id: this.data.id,
        auditStatus: 4,
        rejectReason: this.rejectInfo,
      };
      const res = await AuditPartnerCenter(params);
      if (res.data.code === "200") {
        this.$message.success(res.data.message);
        this.visibleLittle = false;
        this.$parent.handleClose();
        this.$parent.$parent.getList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    async rejectReason(record, tit, unDisabled) {
      this.data = record;
      this.autoTitle = tit;
      if (tit == "驳回原因") {
        this.rejectInfo = record.rejectReason;
        this.rejectDisabled = unDisabled ?? false;
        this.visibleLittle = true;
      }
      if (tit === "轨迹") {
        const res = await PartnerOperationTrack({ partnerId: record.id });
        if (res.data.code === "200") {
          this.timeLineList = res.data.data;
          this.visibleLittle = true;
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    closeModal() {
      this.visibleLittle = false;
    },
  },
};
</script>

<style>
</style>