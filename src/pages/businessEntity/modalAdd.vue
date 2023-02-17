<template>
  <a-modal class="modalTop" :title="flag == 'add' ? '新增' : '编辑'" :dialogStyle="{'top': '30px'}" :maskClosable="!1" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
    <a-form-model layout="vertical" :model="form">
      <a-row>
        <a-col :span=24>
          <a-form-model-item class="required" label="经营主体名称">
            <a-input v-model.trim="form.operateEntityName" />
          </a-form-model-item>
        </a-col>
        <a-col :span=24>
          <a-form-model-item class="required" label="经营主体编码">
            <a-input
              v-model.trim="form.coding"
              placeholder="数字、字母或（）《》“”@%&:#~￥！/*+-_"
              @input="form.coding = form.coding.replace(/[^\w\*\/:《》（）\-\+“”~！@#￥&%]|[\u4e00-\u9fa5]/,'')"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
      <div class="flex-ct">
        <a-space :size="20">
          <a-popconfirm v-if="flag != 'add'" placement="bottom" title="确定要修改信息吗？" ok-text="确定" cancel-text="取消" @confirm="closeModalBtn">
            <a-button>保存</a-button>
          </a-popconfirm>
          <a-button v-else @click="closeModalBtn">保存</a-button>
          <a-button @click="cancelBtn">取消</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  add,
  update
} from "@/services/stage/businessEntity"
export default {
  name: "modalAdd",
  data() {
    return {
      visibleLModal: false,
      flag: "add",
      form: {},
    }
  },
  methods: {
    forceUpdate() { this.$forceUpdate() },
    openAddModal(flag, record) {
      this.flag = flag
      this.form = {}
      this.form.id = record?.id
      this.form.operateEntityName = record?.operateEntityName
      this.form.coding = record?.coding
      this.visibleLModal = true
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof(obj) == 'object' && obj !== null)  {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i])
        }
      } else {
        objStorageBox = obj
      }
      return objStorageBox
    },
    closeModalBtn() {
      let validate = ["operateEntityName","coding"]
      if (validate.some(item => !this.form[item])) {
        this.$message.error('存在必填项为空', 3)
        return
      }
      if (this.form.operateEntityName.length > 50) {
        this.$message.error('经营主体名称最多50个文本', 3)
        return
      }
      if (this.form.coding.length > 10) {
        this.$message.error('经营主体编码最多10个文本', 3)
        return
      }
      let params = {...this.form}
      if (this.flag == 'add') {
        add(params).then(res => {
          if (res.data.code == 200) {
            this.$message.success("保存成功")
            this.$parent.submitPagination()
            this.visibleLModal = false
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => this.$message.error("保存失败"))
        return
      }
      update(params).then(res => {
        if (res.data.code == 200) {
          this.$message.success("保存成功")
          this.$parent.submitPagination()
          this.visibleLModal = false
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => this.$message.error("保存失败"))
    },
    cancelBtn() { this.visibleLModal = false },
  },
  activated() {
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/.ant-modal{
    width: 600px !important;
  }
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .ant-form-item {
      height: 74px;
      margin-bottom: 0;
    }
    /deep/.ant-form-item-label {
      padding: 0;
    }
    /deep/.ant-form-item-with-help{
      margin: 0;padding: 0;
    }
    /deep/.ant-form-explain {
      margin: 0;
    }
  }
}
</style>