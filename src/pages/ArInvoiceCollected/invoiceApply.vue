<template>
  <div>
    <a-modal
      title="发票申请单"
      v-model="visible"
      centered
      destroyOnClose
      width="50%"
      :footer="null"
      :maskClosable="false"
    >
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
        ref="form"
      >
        <div style="display: flex">
          <div style="width: 50%">
            <a-form-model-item label="发票名称" prop="invoiceType">
              <a-select v-model="form.invoiceType" palceholder="请选择发票名称">
                <a-select-option :value="1">增值税普通发票</a-select-option>
                <a-select-option :value="2">增值税专用发票</a-select-option>
                <!-- <a-select-option :value="3"
                  >增值税普通发票(免税)</a-select-option
                > -->
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="开票税率" prop="invoiceRate">
              <a-input
                :maxLength="30"
                v-inputLimit="2"
                v-model="form.invoiceRate"
                addon-after="%"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="开票金额" prop="invoiceAmount">
              <a-input
                :maxLength="30"
                v-inputLimit="2"
                v-model="form.invoiceAmount"
                @change="amountChange"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item
              label="开票金额（大写）"
              prop="invoiceAmountUppercase"
            >
              <a-input disabled v-model="form.invoiceAmountUppercase">
                {{ form.invoiceAmountUppercase }}
              </a-input>
            </a-form-model-item>

            <a-form-model-item label="货款是否收取" prop="chargeReceived">
              <a-select
                v-model="form.chargeReceived"
                palceholder="请选择是否收取货款"
              >
                <a-select-option :value="1">已收货款</a-select-option>
                <a-select-option :value="0">未收货款</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="预计收款周期">
              <a-input :maxLength="30" v-model="form.receivedCycle"></a-input>
            </a-form-model-item>
            <a-form-model-item label="发票用途">
              <a-input :maxLength="30" v-model="form.invoiceUse"></a-input>
            </a-form-model-item>
          </div>
          <div style="flex: 1">
            <a-form-model-item label="开票主体名称">
              <a-input disabled v-model="form.payName"></a-input>
            </a-form-model-item>

            <a-form-model-item label="开票主体税号">
              <a-input disabled v-model="form.payTaxNo"></a-input>
            </a-form-model-item>

            <a-form-model-item label="开票主体开户行及账号">
              <a-input
                type="textarea"
                disabled
                v-model="form.payBank"
              ></a-input>
            </a-form-model-item>

            <a-form-model-item label="购买方名称">
              <a-input disabled v-model="form.customerName"></a-input>
            </a-form-model-item>

            <a-form-model-item label="购买方税号">
              <a-input v-model="form.taxNo" disabled></a-input>
            </a-form-model-item>

            <a-form-model-item label="购买方开户行及账号" prop="depositBank">
              <a-select v-model="form.depositBank">
                <a-select-option
                  v-for="(item, index) in form.customerBankList"
                  :key="index"
                  :value="item.bankName + '，' + item.bankAccount"
                  :title="item.bankName + '，' + item.bankAccount"
                  >{{
                    item.bankName + "，" + item.bankAccount
                  }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </div>
        </div>
        <a-form-model-item
          label="备注"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 19 }"
        >
          <a-input
            type="textarea"
            :maxLength="100"
            v-model="form.invoiceRemark"
          ></a-input>
        </a-form-model-item>
      </a-form-model>

      <div style="width: 100%; text-align: center">
        <a-space>
          <a-button type="primary" @click="applyFor" :loading="btnLoading"
            >申请开票</a-button
          >
          <a-button @click="visible = false">取消</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  GetInvoiceInfo,
  ApplyInvoice,
} from "../../services/settlement/receive/invoice";
import { priceUppercase } from "../../utils/tool";
export default {
  data() {
    return {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      visible: false,
      form: {
        arInvoiceId: "",
        arInvoiceCode: "",
        invoiceType: undefined,
        invoiceAmount: undefined,
        invoiceRate: undefined,
        invoiceAmountUppercase: undefined,
        invoiceUse: undefined,
        depositBank: undefined,
        chargeReceived: undefined,
        receivedCycle: undefined,
        invoiceRemark: undefined,
      },
      rules: {
        invoiceType: [{ required: true, message: "必填", trigger: "change" }],
        invoiceRate: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceAmount: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceAmountUppercase: [
          { required: true, message: "必填", trigger: "blur" },
        ],
        chargeReceived: [
          { required: true, message: "必填", trigger: "change" },
        ],
        depositBank: [{ required: true, message: "必填", trigger: "change" }],
      },
      state: "",
      btnLoading: false,
      arInvioceData: {
        arInvoiceId: "",
        arInvoiceCode: "",
      },
      editState: false,
    };
  },
  methods: {
    amountChange() {
      this.form.invoiceAmountUppercase =
        priceUppercase(this.form.invoiceAmount) || "";
      this.$forceUpdate();
    },
    async getInvoiceInfo() {
      let res = await GetInvoiceInfo({
        id: this.arInvioceData.arInvoiceId || "",
      });
      if (res.data.code == 200) {
        const data = res.data.data || [];
        this.form = { ...this.form, ...data };
      } else {
        this.$message.error("发票基本信息获取失败");
      }
    },
    applyFor() {
      console.log(this.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          let temp = JSON.parse(JSON.stringify(this.form));
          const params = {
            ...temp,
            ...this.arInvioceData,
          };
          this.btnLoading = true;
          ApplyInvoice(params).then((res) => {
            this.btnLoading = false;
            if (res.data.code == 200) {
              this.$message.success(res.data.message || "申请成功");
              this.visible = false;
              if (this.blueState) {
                if (this.titleState == 1) {
                  this.$parent.submitPagination();
                }
                if (this.titleState == 2) {
                  this.$parent.getList();
                }
              } else {
                console.log(22);
                switch (this.titleState) {
                  case 1:
                  case 2:
                    this.$refreshPage("/balance/receiveable/arInvoiceInfo");
                    break;
                  case 2.1:
                    this.$refreshPage(
                      "/balance/receiveable/arInvoiceCollectedDetails"
                    );
                    break;

                  default:
                    break;
                }
              }
            } else {
              this.$message.error(res.data.message || "申请失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    showModal(titleState, data, state, blueState) {
      this.editState = state || false;
      this.blueState = blueState || false;
      this.arInvioceData = {
        arInvoiceId: state ? data.arInvoiceId : data?.id || "",
        arInvoiceCode: data?.arInvoiceCode,
      };
      this.getInvoiceInfo();
      if (this.editState) {
        console.log(data);
        let temp = {};
        Object.keys(this.form).forEach((key) => {
          temp[key] = data[key];
        });
        this.form = JSON.parse(JSON.stringify(temp));
        this.form.id = data.id || "";
      } else {
        console.log(data);
        this.form = {};
        this.form.invoiceRate = 9;
      }
      console.log(titleState);
      this.titleState = titleState;
      this.visible = true;
    },
  },
};
</script>
