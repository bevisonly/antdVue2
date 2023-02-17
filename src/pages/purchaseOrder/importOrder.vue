<template>
  <a-modal
    title="导入订单"
    :visible="visible"
    :width="400"
    @cancel="handleCancel"
    destroyOnClose
  >
    <div class="details">
      <a-space>
        <a-upload
          :show-upload-list="false"
          accept=".xlsx,.xls,.csv"
          :beforeUpload="beforeUpload"
        >
          <a-button type="primary" icon="form"> 上传文件</a-button>
        </a-upload>
        <a-button type="primary" icon="download" @click="downloadTem">
          下载模板
        </a-button>
      </a-space>
    </div>
    <template slot="footer">
      <a-button @click="handleCancel"> 取消 </a-button>
    </template>
  </a-modal>
</template>
<script>
import { purchaseGlobalOrderImportExcel } from "../../services/purchaseSaleInventory";
export default {
  name: "importOrder",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    beforeUpload(file) {
      let params = new FormData();
      params.append("excel", file); // 文件对象
      purchaseGlobalOrderImportExcel(params).then((res) => {
        const data = res.data;
        if (data === "成功") {
          this.$parent.getTableList();
          this.$message.success("导入成功！");
          this.visible = false;
        } else {
          this.$message.error("导入失败！");
        }
      });
      return false;
    },
    downloadTem() {
      let link = document.createElement("a");
      link.setAttribute("download", "");
      link.setAttribute(
        "href",
        process.env.VUE_APP_API_BASE_URL +
          "/purchaseGlobalOrder/exportTemplate.action"
      );
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handleCancel() {
      this.visible = false;
    },
    handleSubmit() {},
    openModal() {
      this.visible = true;
    },
  },
};
</script>
<style lang="less" scoped>
</style>