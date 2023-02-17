<template>
  <div>
    <a-modal
      title="开立发票"
      v-model="visible"
      centered
      destroyOnClose
      width="50%"
      :footer="null"
      :maskClosable="false"
    >
      <div style="display: flex">
        <div style="width: 50%">
          <a-form-model
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="rules"
            ref="form"
          >
            <a-form-model-item label="发票代码" prop="invoiceCode">
              <a-input
                :maxLength="30"
                v-inputLimit="0"
                v-model="form.invoiceCode"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="发票号码" prop="invoiceNumber">
              <a-input
                :maxLength="30"
                v-inputLimit="0"
                v-model="form.invoiceNumber"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="开票日期" prop="invoiceDate">
              <a-date-picker
                style="width: 100%"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                v-model="form.invoiceDate"
              ></a-date-picker>
            </a-form-model-item>
            <a-form-model-item label="发票金额" prop="invoiceAmount">
              <a-input
                :maxLength="30"
                v-inputLimit="2"
                v-model="form.invoiceAmount"
                @change="amountChange"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item
              label="发票金额（大写）"
              prop="invoiceAmountUppercase"
            >
              <a-input disabled v-model="form.invoiceAmountUppercase">
                {{ form.invoiceAmountUppercase }}
              </a-input>
            </a-form-model-item>

            <a-form-model-item label="开票类型" prop="invoiceState">
              <a-select
                v-model="form.invoiceState"
                palceholder="请选择开票类型"
                :disabled="addState == 1||disabledForm.applySource==2"
              >
                <a-select-option :value="1">部分开票</a-select-option>
                <a-select-option :value="2">全部开票</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="开票备注">
              <a-input
                type="textarea"
                :maxLength="30"
                v-model="form.invoiceMessage"
                :auto-size="{ minRows: 10, maxRows: 16 }"
              ></a-input>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div style="flex: 1">
          <a-form-model
            :model="disabledForm"
            :label-col="labelCol2"
            :wrapper-col="wrapperCol2"
          >
            <a-form-model-item label="发票名称">
              <a-select
                disabled
                v-model="disabledForm.invoiceType"
                palceholder="请选择发票名称"
              >
                <a-select-option :value="1">增值税普通发票</a-select-option>
                <a-select-option :value="2">增值税专用发票</a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="开票税率">
              <a-input
                disabled
                v-model="disabledForm.invoiceRate"
                addon-after="%"
              ></a-input>
            </a-form-model-item>

            <a-form-model-item label="开票金额">
              <a-input disabled v-model="disabledForm.invoiceAmount"></a-input>
            </a-form-model-item>
            <a-form-model-item label="已开票金额">
              <a-input
                disabled
                v-model="disabledForm.invoiceAmounted"
              ></a-input>
            </a-form-model-item>

            <a-form-model-item label="开票主体名称">
              <a-input disabled v-model="disabledForm.payName"></a-input>
            </a-form-model-item>
            <a-form-model-item label="开票主体税号">
              <a-input disabled v-model="disabledForm.payTaxNo"></a-input>
            </a-form-model-item>
            <a-form-model-item label="开票主体开户行及账号">
              <a-input
                type="textarea"
                disabled
                v-model="disabledForm.payBank"
              ></a-input>
            </a-form-model-item>

            <a-form-model-item label="购买方名称">
              <a-input v-model="disabledForm.customerName" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item label="购买方税号">
              <a-input v-model="disabledForm.taxNo" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item label="购买方开户行及账号">
              <a-input
                type="textarea"
                disabled
                v-model="disabledForm.depositBank"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="关联结算单号">
              <a-input
                type="textarea"
                disabled
                v-model="form.arInvoiceCodeList"
              ></a-input>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>

      <div style="width: 100%; text-align: center">
        <a-space>
          <a-button type="primary" @click="toRegister" :loading="btnLoading"
            >开立发票</a-button
          >
          <a-button @click="visible = false">取消</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ArInvoiceRegister } from "../../services/settlement/receive/invoice";

import { priceUppercase } from "../../utils/tool";
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      labelCol2: { span: 10 },
      wrapperCol2: { span: 14 },
      visible: false,
      form: {
        arInvoiceCodeList: [],
      },
      rules: {
        invoiceCode: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceNumber: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceDate: [{ required: true, message: "必填", trigger: "change" }],
        invoiceAmount: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceState: [{ required: true, message: "必填", trigger: "change" }],
      },
      state: "",
      btnLoading: false,
      arInvioceData: {
        arInvoiceId: "",
        arInvoiceCode: "",
      },
      disabledForm: {},
      addState: 0,
      formPage: "",
    };
  },
  methods: {
    amountChange() {
      this.form.invoiceAmountUppercase =
        priceUppercase(this.form.invoiceAmount) || "";
      this.$forceUpdate();
    },

    toRegister() {
      console.log(this.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          let temp = JSON.parse(JSON.stringify(this.form));
          const params = {
            ...temp,
          };
          this.btnLoading = true;
          ArInvoiceRegister(params)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code == 200) {
                this.$message.success(res.data.message || "开立发票成功");
                if (!this.formPage) {
                  this.$refreshPage("/balance/receiveable/arInvoiceDetails");
                }else{
                  this.$parent.getList()
                }
                this.visible = false;
              } else {
                this.$message.error(res.data.message || "开立发票失败");
              }
            })
            .catch(() => {
              this.$message.error("接口连接失败");
            });
        } else {
          return false;
        }
      });
    },
    showModal(data, state, formPage) {
      this.form = { arInvoiceCodeList: [], applyIdList: [] };
      console.log(data);
      //---state 0--单条申请 1--批量申请
      this.addState = state || 0;
      this.formPage = formPage || "";//弹框来源
      if (!state) {
        this.form.applyIdList.push(data.id || "");
        this.form.arInvoiceCodeList.push(data.arInvoiceCode || "");
        this.disabledForm = { ...data };
        console.log(this.disabledForm.customerName);
      }
      if (state==1) {
        if (data?.length>0) {
          let amount=0,amounted=0
          data.forEach(item=>{
            this.form.applyIdList.push(item.id||'')
            this.form.arInvoiceCodeList.push(item.arInvoiceCode||'')
            amount=+item.invoiceAmount+amount
            amounted=+item.invoiceAmounted+amounted
          })
          this.disabledForm={...data[0]}
          this.disabledForm.invoiceAmount=amount
          this.disabledForm.invoiceAmounted=amounted
          this.form.invoiceState=2
        }
      }
      if (this.disabledForm.applySource==2) {
        this.form.invoiceState=2
      }
      this.visible = true;
    },
  },
};
</script>
