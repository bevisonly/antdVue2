<template>
  <!-- 包装选择 -->
  <a-modal
    title="资金申请"
    :visible="visible"
    :width="400"
    @cancel="handleCancel"
    destroyOnClose
  >
    <div class="form" v-if="showForm">
      <a-form :form="form">
        <a-form-item label="申请金额">
          <a-input-number v-model="form.poTotalAmount" />
        </a-form-item>
        <a-form-item label="供应商名称">
          <a-input disabled v-model="form.supplierName" />
        </a-form-item>
      </a-form>
    </div>
    <div v-else>
      <a-alert :message="warnMessage" banner :closable="false" />
    </div>
    <template slot="footer">
      <a-button @click="handleCancel">关闭 </a-button>
      <a-button type="primary" @click="handleSubmit" v-if="showForm"
        >确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { fundsapproveInsert } from "../../services/purchaseSaleInventory";
export default {
  data() {
    return {
      visible: false,
      form: {
        poTotalAmount: "",
        supplierName: "",
      },
      showForm: false,
      poIdsStr: "",
      warnMessage: "",
    };
  },
  methods: {
    openModal(rows) {
      let uniArr = [];
      let poIds = [];
      let alPocodes = [];
      rows.forEach((item) => {
        console.log(item);
        uniArr.push(item.supplierId);
        poIds.push(item.id);
        if (item.fmId) {
          alPocodes.push(item.poCode);
        }
      });
      if (new Set(uniArr).size === 1) {
        if (alPocodes.length > 0) {
          this.warnMessage = `采购单号为：${alPocodes.join(
            ","
          )}的采购订单已经申请过资金，不可重复申请！`;
        } else {
          this.showForm = true;
          this.poIdsStr = poIds.join(",");
          this.form = JSON.parse(JSON.stringify(rows[0]));
        }
      } else {
        this.warnMessage = `不同供应商不能同时进行资金申请！`;
      }
      this.visible = true;
    },
    handleSubmit() {
      const params = {
        poIdsStr: this.poIdsStr,
        ...this.form,
      };
      fundsapproveInsert(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.$message.success(data.message);
          this.$parent.getTableList();
          this.form = {};
          this.showForm = false;
          this.visible = false;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleCancel() {
      this.form = {
        poTotalAmount: "",
        supplierName: "",
      };
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.form {
  /deep/.ant-form-item-label {
    line-height: 22px;
  }
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
}
</style>