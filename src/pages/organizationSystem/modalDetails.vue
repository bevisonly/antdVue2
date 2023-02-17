<template>
  <a-modal class="modalTop" :width='640' title="基本信息（OA）" :dialogStyle="{'top': '20%'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <a-row :gutter="20">
        <a-col :span=12><span class="widthRight fontWeight">人员编号：</span>{{allMsg.workcode}}</a-col>
        <!-- <a-col :span=12><span class="widthRight fontWeight">所在公司：</span>{{allMsg.subcompanyname}}</a-col> -->
        <a-col :span=12><span class="widthRight fontWeight">姓名：</span>{{allMsg.lastname}}</a-col>
        <a-col :span=12><span class="widthRight fontWeight">分部：</span>{{allMsg.subcompanyname}}</a-col>
        <a-col :span=12><span class="widthRight fontWeight">部门：</span>{{allMsg.departmentname}}</a-col>
        <a-col :span=12><span class="widthRight fontWeight">邮箱：</span>{{allMsg.email}}</a-col>
        <a-col :span=12><span class="widthRight fontWeight">手机号码：</span>{{allMsg.mobile}}</a-col>
        <a-col :span=12><span class="widthRight fontWeight">职务：</span>{{allMsg.jobcall}}</a-col>
        <a-col :span=12><span class="widthRight fontWeight">更新时间：</span>{{allMsg.modified}}</a-col>
      </a-row>
      <a-row>
        <p class="flex-ed submitBtn">
          <a-button class="btnMarginRight" type="primary" @click="cancelBtn">关闭</a-button>
        </p>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "modalDetails",
  data() {
    return {
      visibleLModal: !1,
      allMsg: {},
    }
  },
  methods: {
    openModal(record) {
      this.visibleLModal = !0
      this.allMsg = record
    },
    cancelBtn() {
      this.visibleLModal = !1
    }
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/ .ant-modal-header{
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 0px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .widthRight {
      display: inline-block;
      height: 30px;
      line-height: 1;
      width: 120px;
      text-align: right;
    }
    .fontWeight {
      font-weight: 600;
    }
    .submitBtn {
      margin-bottom: 0;
      height: 50px;
      line-height: 50px;
      .btnMarginRight {
        margin-right: 10px;
      }
    }
  }
}
</style>