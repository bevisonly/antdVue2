<template>
  <a-modal :width="600" class="modalTop" title="上传流水" :dialogStyle="{'top': '60px'}" v-model="visibleLO" :maskClosable='!1' :footer="null">
    <a-row :gutter="10">
      <a-col :span="6">请上传文件类型:</a-col>
      <a-col :span="18">
        <a-radio-group v-model="type">
          <a-radio v-for="(item, i) in bankOption" :key="i" :value="item.value">{{item.name}}</a-radio>
        </a-radio-group>
      </a-col>
      <a-col :span="6" class="letterSpacing">点击上传文件:</a-col>
      <a-col :span="18">
        <a-upload
          :show-upload-list="false"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :beforeUpload="beforeUpload"
        >
          <a-button type="primary" icon="upload" :loading="loadingUpload" title="文件类型为Excel,单个大小不超过20M">上传流水</a-button>
        </a-upload>
      </a-col>
      <a-col :span="6" class="letterSpacing">上传文件记录:</a-col>
      <a-col :span="18" style="height: auto;">
        <a-empty v-if="!fileRecord[0]" :description="!1" />
        <div v-else>
          <div
            v-for="(item, i) in fileRecord" :key="i"
            class="flex-sb"
            :class="item.status ? 'bgcSuccess' : 'bgcFail'"
            :title="!item.status && '删除并下载查看错误原因'"
          >
            <a-icon class="iconStyle" :type="item.status ? 'file-text' : 'warning'" :class="item.status ? 'greenfont' : 'redfont'"/>
            <div class="textwrap fontLayout" :title="item.name">{{item.name}}</div>
            <a-icon
              class="cursorPin deleteStyle"
              style="color: #4da125;"
              :type="item.status ? 'delete' : 'download'"
              @click="deleteItem(i, item)"
            />
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { uploadExcel } from '@/services/settlement/receive/bankFlow'
export default {
  name: "modalUpload",
  data() {
    return {
      visibleLO: !1,
      type: 1,
      bankOption: [
        {name: "系统模板", value: 1},
        {name: "中国银行", value: 2},
        {name: "中信银行", value: 3},
        {name: "工商银行", value: 4},
      ],
      loadingUpload: !1,
      fileRecord: [],
      status: !0,
      name: '文件名.xls',
    }
  },
  methods: {
    openModal() {
      this.visibleLO = !0;
      this.fileRecord = []
    },
    beforeUpload(file) {
      //! 20971520 = 20*1024*1024
      if (file.size > 20971520) {
        this.$message.error("最大文件为20M", 4)
        return
      }
      let formData = new FormData()
      let fileName = file.name?.slice(0, file.name?.lastIndexOf('.')) || "上传流水文件"
      formData.append("mode", "batch")
      formData.append("tableName", "arInvoice")
      formData.append("file", file)
      formData.append("tableType", this.type)
      this.loadingUpload = !0
      uploadExcel(formData).then((res) => {
        this.loadingUpload = !1
        if (res.data.type?.includes("excel")) {
          this.$message.warn('上传失败,查看原因请下载红色文件')
          let getName = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : 'Excel文件'
          let url = res.data;
          let name = getName?.slice(0, getName?.lastIndexOf('.'));
          this.fileRecord.push({status: !1, name, url})
          return
        }
        let reader = new FileReader();
        let This = this
        reader.addEventListener("loadend", function () {
          let res = JSON.parse(reader.result);
          if (res.code == '200') {
            This.$message.success(res.message, 3)
            This.fileRecord.push({status: !0, name: fileName})
          } else {
            This.$message.error(res.message, 3)
          }
        });
        reader.readAsText(res.data, 'utf-8');
      }).catch(() => {
        this.loadingUpload = !1
        this.$message.error('上传请求异常', 3.5)
      });
      return false;
    },
    deleteItem(index, item) {
      if (!item.status) {
        this.downloadFile(item.name, item.url)
      }
      this.fileRecord.splice(index, 1)
    },
    downloadFile(name, url) { this.$parent.getExcel(url, name) },
    cancelModalBtn() {
      this.visibleLO = !1;
    }
  },
}
</script>

<style lang="less" scoped>
@fontHeight: 30px;
.bgc() {
  height: @fontHeight;
  line-height: @fontHeight;
  margin: 6px 0;
  padding: 0 10px;
  border-radius: 4px;
  cursor: default;
}
.modalTop{
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/.ant-modal-title::after {
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
    line-height: 1;
    content: '请按文件类型上传,仅支持上传Excel文件,文件需要小于20M';
    color: #4d4d4d;
  }
  /deep/.ant-col {
    color: black;
    height: 40px;
    line-height: 40px;
  }
  .letterSpacing {
    letter-spacing: 2.2px;
  }
  .bgcSuccess {
    .bgc();
    background: linear-gradient(to right, #a9e7a9, #a6ff90);
    &:hover {
      background: linear-gradient(to right, #a4dfa4, #9ff58a);
    }
  }
  .bgcFail {
    .bgc();
    background: linear-gradient(to right, #e69090, #f89595);
    &:hover {
      background: linear-gradient(to right, #f09696, #ff9f9f);
    }
  }
  .iconStyle {
    margin-right: 6px;
    color: green;
  }
  .deleteStyle:hover {
    font-size: 20px;
  }
  .fontLayout {
    display: inline-block;
    width: 92%;
  }
  .redfont {
    color: #ca0707;
  }
  .greenfont {
    color: #4da125;
  }
}
</style>