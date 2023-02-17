<template>
  <div>
    <a-modal
      title="发票登记"
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
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="发票名称" prop="invoiceType">
              <a-select v-model="form.invoiceType">
                <a-select-option :value="1">增值税专用发票</a-select-option>
                <a-select-option :value="2">增值税普通发票</a-select-option>
                <!-- <a-select-option :value="3"
                  >增值税普通发票(免税)</a-select-option
                > -->
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="发票抬头">
              <a-input disabled v-model="form.payName"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="发票代码" prop="invoiceCode">
              <a-input
                :maxLength="30"
                v-inputLimit="0"
                v-model="form.invoiceCode"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开票公司名称">
              <a-input disabled v-model="form.invoiceName"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="发票号码" prop="invoiceNumber">
              <a-input
                :maxLength="30"
                v-inputLimit="0"
                v-model="form.invoiceNumber"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开票公司税号">
              <a-input disabled v-model="form.taxNo"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="开票日期" prop="invoiceDate">
              <a-date-picker
                style="width: 100%"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                v-model="form.invoiceDate"
              ></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开票公司开户行">
              <a-select
                v-if="bankList && bankList.length > 1"
                v-model="form.depositBank"
                @change="depositBankChange"
              >
                <a-select-option
                  v-for="(item, index) in bankList"
                  :key="index"
                  :value="item.bankBranch"
                  >{{ item.bankBranch }}</a-select-option
                >
              </a-select>
              <a-input v-else disabled v-model="form.depositBank"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="发票金额" prop="invoiceAmount">
              <a-input
                :maxLength="30"
                v-model="form.invoiceAmount"
                v-inputLimit="2"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="关联结算单号">
              <a-input
                type="textarea"
                v-model="form.apInvoiceCodeList"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="发票用途">
              <a-input :maxLength="30" v-model="form.invoiceUse"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="state">
            <a-form-model-item label="发票状态">
              <a-tag v-if="form.invoiceState == 1" color="blue">待登记</a-tag>
              <a-tag v-if="form.invoiceState == 2" color="orange">已登记</a-tag>
              <a-tag v-if="form.invoiceState == 3" color="red">审核失败</a-tag>
              <a-tag v-if="form.invoiceState == 4" color="purple">已修正</a-tag>
              <a-tag v-if="form.invoiceState == 5" color="green">已核销</a-tag>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="备注">
              <a-input
                type="textarea"
                :maxLength="100"
                v-model="form.invoiceMessage"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="state">
            <a-form-model-item label="审核意见">
              <a-input
                type="textarea"
                :value="form.auditMsg"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="14">
            <a-form-model-item>
              <span slot="label" class="form-required">上传发票图片</span>
              <div class="flex-fs uploadbox">
                <div v-if="fileList.length > 0" class="flex-fs imgWrap">
                  <div
                    class="uploadImgs"
                    v-for="(item, index) in fileList"
                    :key="index"
                  >
                    <span class="imgDelete" @click="deleteUploads(item, index)">
                      <a-icon type="close" />
                    </span>
                    <img :src="item" alt="发票" @click="preView(item)" />
                  </div>
                </div>
                <a-upload
                  v-if="fileList.length < 2"
                  accept=".jpg,.png,.webpage"
                  :before-upload="beforeUpload"
                  :showUploadList="false"
                >
                  <div class="uploadImgIcon flex-ct">
                    <a-icon type="plus" />
                  </div>
                </a-upload>
              </div>
              <!-- <a-upload
                :file-list="fileList"
                list-type="picture-card"
                :beforeUpload="beforeUpload"
                accept=".jpg,.png,.webpage"
                @preview="handlePreview"
              >
                <div v-if="fileList.length < 2">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload> -->
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <div style="width: 100%; text-align: center">
            <a-space>
              <a-button
                type="primary"
                @click="register"
                v-if="state != 'edit'"
                :loading="btnLoading"
                >登记</a-button
              >
              <a-button
                type="primary"
                v-if="state == 'edit'"
                :loading="btnLoading"
                @click="register"
                >重新登记</a-button
              >
              <a-button @click="visible = false">取消</a-button>
            </a-space>
          </div>
        </a-row>
      </a-form-model>
      <a-modal
        :visible="previewVisible"
        :footer="null"
        @cancel="previewVisible = false"
        width="40%"
      >
        <img alt="发票" style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-modal>
  </div>
</template>

<script>
import {
  uploadFiles,
  // delUploadFiles,
} from "../../services/product/productList";
import {
  InvoiceRegister,
  EditReceipt,
} from "../../services/settlement/payable/invoice";
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      visible: false,
      form: {},
      num: 12.333,
      fileList: [],
      previewVisible: false,
      previewImage: "",
      rules: {
        invoiceType: [{ required: true, message: "必填", trigger: "change" }],
        invoiceCode: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceNumber: [{ required: true, message: "必填", trigger: "blur" }],
        invoiceDate: [{ required: true, message: "必填", trigger: "change" }],
        invoiceAmount: [{ required: true, message: "必填", trigger: "blur" }],
        // fileList: [{ required: true, message: "必填", trigger: "change" }],
      },
      state: "",
      btnLoading: false,
      bankList: [],
    };
  },
  methods: {
    depositBankChange() {
      this.$forceUpdate();
    },
    deleteUploads(item, index) {
      console.log(item);
      this.fileList.splice(index, 1);
    },
    preView(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    showModal(data, code, state) {
      console.log(data);
      this.form = {};
      this.fileList = [];
      this.state = state;
      if (state != "edit") {
        this.bankList = data.bankList || [];
        this.form.taxNo = data.taxNo;
        this.form.invoiceName = data.invoiceName;
        this.form.payName = data.payName;
        this.form.depositBank = data.bankList[0]?.bankBranch ?? "";
        this.form.apInvoiceCodeList = code;
      } else {
        let {
          id,
          invoiceType,
          invoiceCode,
          invoiceNumber,
          invoiceDate,
          invoiceAmount,
          invoiceUse,
          payName,
          invoiceName,
          taxNo,
          depositBank,
          invoiceMessage,
          invoiceState,
          auditMsg,
        } = data;

        this.form = {
          id,
          invoiceType,
          invoiceCode,
          invoiceNumber,
          invoiceDate,
          invoiceAmount,
          invoiceUse,
          payName,
          invoiceName,
          taxNo,
          depositBank,
          invoiceMessage,
          invoiceState,
          apInvoiceCodeList: [data.apInvoiceCode],
          auditMsg,
        };
        if (data.fileList && data.fileList.length > 0) {
          data.fileList.forEach((item) => {
            this.fileList.push(item.filePath);
          });
        }
      }
      this.visible = true;
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("仅支持上传20MB以下!");
        return;
      }
      let params = new FormData();
      params.append("file", file);
      params.append("mode", "batch");
      params.append("type", "item");
      params.append("tableName", "apReceipt");
      uploadFiles(params)
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.fileList.push(res.data.data[0].filePath || "");
          } else {
            this.$message.error(res.data.message || "上传图片失败");
          }
        })
        .catch(() => {
          this.$message.error("连接失败");
        });
    },
    async register() {
      this.form.fileUrlList = [];
      if (!this.fileList || this.fileList.length == 0) {
        this.$message.error("请至少上传一张发票图片");
        return;
      }
      this.fileList.forEach((item) => {
        this.form.fileUrlList.push(item);
      });
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true;
          const params = {
            ...this.form,
          };
          let res =
            this.state == "edit"
              ? await EditReceipt(params)
              : await InvoiceRegister(params);
          this.btnLoading = false;
          const data = res.data;
          if (data.code == 200) {
            this.visible = false;
            if (this.state) {
              this.$refreshPage("/balance/payable/payableInvoiceDetails");
            } else {
              this.$parent.getList();
            }
            this.$message.success(data.message || "发票登记成功");
          } else {
            this.$message.error(data.message);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang='less'>
@import "index";
</style>