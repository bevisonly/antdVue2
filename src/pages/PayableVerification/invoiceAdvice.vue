<template>
  <!-- title="发票审核通过" -->
  <a-modal
    v-model="visible"
    centered
    destroyOnClose
    width="35%"
    :maskClosable="false"
  >
    <template slot="title">
      <div>
        <a-icon type="question-circle" style="color: #ffc71c"></a-icon>
        {{ state }}
      </div>
    </template>
    <div>
      请确认是否审核通过发票信息，发票金额为：{{ this.form.invoiceAmount }}
    </div>
    <a-form-model :model="form" :rules="rules" ref="form">
      <a-form-model-item label="审核意见" prop="auditMsg">
        <a-input
          type="textarea"
          v-model="form.auditMsg"
          :maxLength="100"
          :autoSize="{ minRows: 5, maxRows: 8 }"
          :placeholder="state == '发票审核失败' ? '请输入退回原因' : ''"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <div>
        <a-button @click="visible = false">取消</a-button>
        <a-button
          type="primary"
          v-if="state == '发票审核通过'"
          @click="auditPass"
          :loading="btnLoading"
          >确认通过</a-button
        >
        <a-button
          type="primary"
          v-if="state == '发票审核失败'"
          @click="auditReturn"
          :loading="btnLoading"
          >确认退回</a-button
        >
      </div>
    </template>
  </a-modal>
</template>
<script>
import {
  AuditPassReceipt,
  AuditFailReceipt,
} from "../../services/settlement/payable/PayableVerification";
export default {
  data() {
    return {
      visible: false,
      form: {},
      state: "",
      rules: {
        auditMsg: [{ required: true, message: "必填", trigger: "blur" }],
      },
      btnLoading: false,
    };
  },
  methods: {
    auditPass() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let temp = JSON.parse(JSON.stringify(this.form));
          delete temp.invoiceAmount;
          const params = {
            ...temp,
          };
          this.btnLoading = true;
          AuditPassReceipt(params).then((res) => {
            const data = res.data;
            this.btnLoading = false;
            if (data.code == 200) {
              this.$message.success(data.message);
              this.visible = false;
              this.$refreshPage('/balance/payable/payableVerificationDetails');
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    auditReturn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let temp = JSON.parse(JSON.stringify(this.form));
          delete temp.invoiceAmount;
          const params = {
            ...temp,
          };
          this.btnLoading = true;
          AuditFailReceipt(params).then((res) => {
            const data = res.data;
            this.btnLoading = false;
            console.log(data.code);
            if (data.code == 200) {
              this.$message.success(data.message);
              this.visible = false;
              this.$refreshPage('/balance/payable/payableVerificationDetails');
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    showModal(form, state) {
      console.log(form);
      console.log(state);
      console.log(this.$parent);
      this.state = state == "通过" ? "发票审核通过" : "发票审核失败";
      this.form = form;
      this.visible = true;
    },
  },
};
</script>

<style>
</style>