<template>
  <a-modal class="modalTop" :width='600' :title="infoBox.flag == 'add' ? '添加人员' : '修改人员'" :dialogStyle="{'top': '150px'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <a-form-model layout="horizontal">
        <a-form-model-item label="工人名称">
          <a-input placeholder="请入工人名称" v-model="form.workerName"></a-input>
          <span class="redfont" v-show="form.workerName ? form.workerName.length > 10 ? true : false : false">工人名称最多十个字</span>
        </a-form-model-item>
        <a-form-model-item>
          <div class="flex-ed">
            <a-button type="primary" @click="okBtn">{{infoBox.flag == 'add' ? "确认" : "保存"}}</a-button>
            <a-button class="marginLeft" type="primary" @click="cancleBtn">取消</a-button>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-modal>
</template>

<script>
import { 
  workerInsert,
  workerUpdate,
} from '@/services/workerManager.js'
import { throttle } from "../../utils/tool";
export default {
  name: "modalAddWorker",
  data() {
    return {
      visibleLModal: false,
      form: {
        workerName: undefined,
      },
      infoBox: {
        flag: undefined,
        id: undefined,
        allMsg: undefined
      }
    }
  },
  methods: {
    openModal(flag, id , allMsg) {
      this.infoBox.flag = flag
      this.infoBox.id = id
      this.infoBox.allMsg = allMsg
      if (flag == "edit") {
        this.form.workerName = allMsg.workerName 
      } else {
        this.form.workerName = undefined
      }
      this.visibleLModal = true;
    },
    cancelModalBtn() {
      this.visibleLModal = false;
    },
    submitThrottle: throttle(function() {
      if (this.infoBox.flag == 'add') {
        if (this.typeis(this.form.workerName) == "string") {
          this.form.workerName = this.form.workerName.trim()
        }
        if ( this.typeis(this.form.workerName) == 'undefined' || this.form.workerName.length < 1 ) {
          this.$message.warn('名字不能为空')
          return
        }
        if (this.form.workerName.length > 10) {
          this.$message.warn('名字长度过长')
          return
        }
        workerInsert({workerName: this.form.workerName}).then(
          res => {
            if (res.data.code == '200') {
              this.$parent.pagination.page = 1
              this.$parent.pagination.size = 10
              this.$parent.submitPagination()
              this.visibleLModal = false;
              this.$message.success(res.data.message)
            } else {
              this.$message.warn(res.data.message)
            }
          }
        )
      } else {
        const params = {
          id: this.infoBox.id,
          workerName: this.form.workerName
        }
        workerUpdate(params).then(
          res => {
            if (res.data.code == '200') {
              this.$parent.submitPagination()
              this.visibleLModal = false;
              this.$message.success(res.data.message)
            } else {
              this.$message.warn(res.data.message)
            }
          }
        )
      }
    },3500),
    okBtn() {
      this.submitThrottle()
    },
    cancleBtn() {
      this.form.workerName = undefined
      this.visibleLModal = false
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
    padding-bottom: 15px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .marginLeft {
      margin-left: 10px;
    }
  }
}
</style>