<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="type-choose">
      <a-radio-group
        v-model="state"
        button-style="solid"
        size="large"
        @change="stateChange"
      >
        <a-radio-button :value="1"> 待提交 </a-radio-button>
        <a-radio-button :value="2"> 待审核 </a-radio-button>
        <a-radio-button :value="3"> 已审核 </a-radio-button>
      </a-radio-group>
    </div>
    <a-divider />
    <div class="search-item" style="margin-top: 10px">
      <a-col :span="12">
        <a-input-search
          v-model.trim="keyword"
          style="width: 60%"
          placeholder="请输入搜索内容"
          @change="searchItem"
        ></a-input-search>
        <a-select
          @change="selectChange"
          style="width: 30%; margin-left: 10px"
          placeholder="请选择状态"
          allowClear
          v-if="state === 1"
        >
          <a-select-option :value="1">待提交</a-select-option>
          <a-select-option :value="4">已驳回</a-select-option>
        </a-select>
      </a-col>

      <a-space>
        <a-button
          type="primary"
          v-if="state === 1"
          @click="editPartner('', 'add')"
          :disabled="
            resourceControl(
              companyType === 20 ? 'suppliers_add' : 'customers_add'
            )
          "
          >新增</a-button
        >
        <a-button
          type="primary"
          v-if="state !== 2"
          @click="batchDel"
          :disabled="
            resourceControl(
              companyType === 20
                ? 'suppliers_batch_delete'
                : 'customers_batch_delete'
            )
          "
          >删除</a-button
        >
      </a-space>
    </div>
    <div class="table-item" style="margin-top: 10px">
      <a-table
        :row-selection="
          state === 2
            ? null
            : {
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }
        "
        :loading="loading"
        rowKey="id"
        :pagination="false"
        :columns="columns"
        :data-source="tableList"
      >
        <div slot="auditStatus" slot-scope="text">
          <span v-if="text === 1">待提交</span>
          <span v-if="text === 2">待审核</span>
          <span v-if="text === 3">已审核</span>
          <span v-if="text === 4">已驳回</span>
          <span v-if="text === 5">已审核二次编辑</span>
        </div>
        <div slot="opreation" slot-scope="text, record">
          <a-button
            type="link"
            @click="editPartner(record, 'edit')"
            v-if="state !== 2"
            :disabled="
              resourceControl(
                companyType === 20 ? 'suppliers_edit' : 'customers_edit'
              )
            "
            >编辑</a-button
          >
          <a-button
            type="link"
            @click="editPartner(record, 'details')"
            v-if="state === 3"
            :disabled="
              resourceControl(
                companyType === 20 ? 'suppliers_details' : 'customers_details'
              )
            "
            >详情</a-button
          >
          <a-button
            type="link"
            @click="editPartner(record)"
            v-if="state === 2"
            :disabled="
              resourceControl(
                companyType === 20 ? 'suppliers_audit' : 'customers_audit'
              )
            "
            >审核</a-button
          >
          <a-button
            type="link"
            @click="rejectAndTime(record, '驳回原因')"
            v-if="record.auditStatus === 4"
            :disabled="
              resourceControl(
                companyType === 20
                  ? 'suppliers_reject_reason'
                  : 'customers_reject_reason'
              )
            "
            >驳回原因</a-button
          >
          <a-button
            type="link"
            @click="rejectAndTime(record, '轨迹')"
            v-if="state !== 1"
            :disabled="
              resourceControl(
                companyType === 20 ? 'suppliers_track' : 'customers_track'
              )
            "
            >轨迹</a-button
          >
          <a-popconfirm
            title="确定要删除这条数据吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="delItem(record)"
            :disabled="
              resourceControl(
                companyType === 20 ? 'suppliers_delete' : 'customers_delete'
              )
            "
          >
            <a-button
              type="link"
              v-if="state !== 2"
              :disabled="
                resourceControl(
                  companyType === 20 ? 'suppliers_delete' : 'customers_delete'
                )
              "
              >删除</a-button
            >
          </a-popconfirm>
        </div></a-table
      >
      <!-- 分页 -->
      <div class="pagination">
        <a-pagination
          :page-size-options="['10', '20', '30', '40', '50']"
          :total="pagination.total"
          show-size-changer
          :page-size="pagination.rows"
          show-quick-jumper
          :current="pagination.page"
          :show-total="(total) => `共 ${total} 条记录`"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        >
        </a-pagination>
      </div>
    </div>

    <EditInfo ref="editInfo" />
    <RejectAndTimeline ref="rejectAndTimeline" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import EditInfo from "./editInfo.vue";
import RejectAndTimeline from "./rejectAndTimeline.vue";

import {
  GetPartnerCenter,
  DeletePartnerCenter,
  WaitSubmit,
  WaitAudit,
  Audited,
  DeletePartnerCenterBatch,
  // PartnerOperationTrack,
  // AuditPartnerCenter,
} from "../../services/resourceCenter/resourceCenter";
export default {
  name: "resourceCenterCustomer",
  components: { EditInfo, RejectAndTimeline },
  data() {
    return {
      columns: [
        {
          align: "center",
          title: "序号",
          dataIndex: "keyIndex",
        },
        {
          align: "center",
          title: "合作商ID",
          dataIndex: "companyCode",
        },
        {
          align: "center",
          title: "合作商名称",
          dataIndex: "companyName",
        },
        {
          align: "center",
          title: "地利维系人",
          dataIndex: "diliMaintainer",
        },
        {
          align: "center",
          title: "所在地",
          dataIndex: "city",
        },
        {
          align: "center",
          title: "状态",
          dataIndex: "auditStatus",
          scopedSlots: { customRender: "auditStatus" },
        },
        {
          align: "center",
          title: "操作",
          dataIndex: "opreation",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      tableList: [],
      keyword: "",
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
      },
      selectedRowKeys: [],
      loading: false,
      state: 1,
      companyType: "",
    };
  },
  activated() {
    switch (this.$route.name) {
      case "供应商":
        this.companyType = 20;
        break;
      case "客户":
        this.companyType = 30;
        break;
      default:
        break;
    }
    this.getList();
  },
  methods: {
    resourceControl(value) {
      return !this.hasPermission(value);
    },
    searchItem() {
      this.pagination.page = 1
      this.getList();
    },
    rejectAndTime(record, tit) {
      this.$refs.rejectAndTimeline.rejectReason(record, tit, false);
    },
    //批量删
    batchDel() {
      if (this.selectedRowKeys && this.selectedRowKeys.length === 0) {
        this.$warning({
          title: "请选中一条数据",
          centered: true,
          cancelText: "关闭",
        });
        return;
      }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        let temp = JSON.parse(JSON.stringify(this.selectedRowKeys));
        let _this = this;
        this.$confirm({
          title: "删除提示",
          content: "确定要删除吗?",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            const params = [...temp];
            DeletePartnerCenterBatch(params).then((res) => {
              const data = res.data;
              if (data.code === "200") {
                _this.$message.success(data.message);
                _this.getList();
              } else {
                _this.$message.error(data.message);
              }
            });
          },
        });
      }
    },
    delItem(record) {
      DeletePartnerCenter({ id: record.id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(data.message);
          this.getList("one");
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //选择状态
    selectChange(value) {
      // this.state = value;
      this.getList(value);
    },
    //列表
    getList(value) {
      if (value == 'one') {
        value = undefined
        this.pagination.page = 1
      }
      const params = {
        keyword: this.keyword,
        auditStatus: value || this.state,
        companyType: this.companyType,
        ...this.pagination,
      };
      if (value && this.state === 1) {
        GetPartnerCenter(params).then((res) => {
          this.tableList = res.data.rows || [];
          this.pagination.total = res.data.total;
          if (this.tableList && this.tableList.length > 0) {
            this.tableList.forEach((item, index) => {
              item.keyIndex = index + 1;
              item.city =
                item.officeOrRegistration.split("/")[1] ||
                item.officeOrRegistration;
            });
          }
        });
        return;
      }
      switch (this.state) {
        case 1:
          WaitSubmit(params).then((res) => {
            this.tableList = res.data.rows || [];
            this.pagination.total = res.data.total;
            if (this.tableList && this.tableList.length > 0) {
              this.tableList.forEach((item, index) => {
                item.keyIndex = index + 1;
                item.city =
                  item.officeOrRegistration.split("/")[1] ||
                  item.officeOrRegistration;
              });
            }
          });
          break;
        case 2:
          WaitAudit(params).then((res) => {
            this.tableList = res.data.rows || [];
            this.pagination.total = res.data.total;
            if (this.tableList && this.tableList.length > 0) {
              this.tableList.forEach((item, index) => {
                item.keyIndex = index + 1;
                item.city =
                  item.officeOrRegistration.split("/")[1] ||
                  item.officeOrRegistration;
              });
            }
          });
          break;
        case 3:
          Audited(params).then((res) => {
            this.tableList = res.data.rows || [];
            this.pagination.total = res.data.total;
            if (this.tableList && this.tableList.length > 0) {
              this.tableList.forEach((item, index) => {
                item.keyIndex = index + 1;
                item.city =
                  item.officeOrRegistration.split("/")[1] ||
                  item.officeOrRegistration;
              });
            }
          });
          break;

        default:
          break;
      }
    },

    stateChange() {
      this.pagination.page = 1
      this.getList();
    },
    editPartner(record, editState) {
      console.log(record);
      this.$refs.editInfo.showModal(
        record,
        this.companyType,
        editState,
        this.state
      );
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    pageChange(index) {
      this.pagination.page = index;
      this.getList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.page = 1;
      this.pagination.rows = pageSize;
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>
<style scoped lang="less">
@import "index";
/deep/.ant-form-item {
  margin-bottom: 0;
}
/deep/ .ant-divider-horizontal {
  margin: 8px 0;
}
</style>