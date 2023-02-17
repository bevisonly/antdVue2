<template>
  <div class="details-item">
    <a-modal
      title="退料详情"
      v-model="visible"
      cnetered
      destroyOnClose
      :width="800"
    >
      <div id="printReturn">
        <div class="info-item">
          <a-card
            title="退料基本信息"
            class="card-info"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
          >
            <a-form :form="infoForm">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="退料单号">
                    <span>{{ infoForm.outboundNo }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="退料仓库">
                    <span>{{ infoForm.docNo }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="退料时间">
                    <span>{{ infoForm.createDate }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="退料人">
                    <span>{{ infoForm.pickingUserName }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="审核人">
                    <span>{{ infoForm.pickingMakeUserName }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="审核时间"
                    ><span>{{ infoForm.updateDate }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>
        </div>
        <div class="table-item" style="margin-top: 20px">
          <a-card
            title="退料商品列表"
            size="small"
            :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
            :body-style="{ padding: '12px,2px' }"
          >
            <a-table
              :columns="columns"
              :data-source="tableDetail"
              :pagination="false"
              :loading="tableLoading"
              style="margin-top: 10px"
              size="small"
              rowKey="id"
            >
            </a-table
          ></a-card>
        </div>
      </div>
      <template slot="footer">
        <div>
          <a-button type='primary' v-if="printState" @click="printPage">打印</a-button>
        </div>
      </template>
    </a-modal>
  </div>
  <!-- :scroll="{ y: 300, x: 1300 }" -->
</template>

<script>
import { GetDetails } from "../../services/sortingProcessing/RejectedMaterialOrder";
export default {
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
          title: "原材料名称",
          dataIndex: "piItemName",
        },
        // {
        //   align: "center",
        //   title: "领料数量",
        //   dataIndex: "itemSpec",
        // },
        {
          align: "center",
          title: "退料数量",
          dataIndex: "pickingNum",
        },
        {
          align: "center",
          title: "单位",
          dataIndex: "unit",
        },
        // {
        //   align: "center",
        //   title: "损耗数量",
        //   dataIndex: "totalSignAmount1",
        // },
      ],
      visible: false,
      infoForm: {},
      tableDetail: [],
      tableLoading: false,
      printState: false,
    };
  },
  methods: {
    printPage(){
       this.$print(document.getElementById("printReturn"));
    },
    getDetailData(record) {
      this.tableLoading = true;
      const params = {
        outboundNo: record,
      };
      GetDetails(params).then((res) => {
        this.tableLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.tableDetail = data.data.pickingDetails;
          if (this.tableDetail&&this.tableDetail.length>0) {
              this.tableDetail.forEach((item,index)=>{
                  item.keyIndex=index+1
              })
          }
          this.infoForm = {
            createDate: data.data.createDate || "--",
            outboundNo: data.data.outboundNo || "--",
            pickingMakeUserName: data.data.pickingMakeUserName || "--",
            pickingUserName: data.data.pickingUserName || "--",
            // partnerPhone: data.data.partnerPhone || "--",
            updateDate: data.data.updateDate || "--",
          };
          this.visible = true;
        } else {
          this.$message.error(
            data.message ? data.message : "获取退料详情数据失败"
          );
        }
      });
    },
    showDetailModal(record,state) {
      this.printState=state==='print'?true:false
      this.tableDetail = [];
      this.getDetailData(record.outboundNo);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>