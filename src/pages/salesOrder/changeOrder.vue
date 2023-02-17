<template>
  <div class="modal">
    <a-modal
      title="转采购需求单"
      :visible="visible"
      :width="1100"
      @cancel="handleCancel"
      destroyOnClose
    >
      <div class="details">
        <div class="info">
          <p class="info-title">基本信息</p>
          <div class="info-form">
            <a-form-model :model="form" :rules="rules" ref="infoform">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="原销售单号">
                    <a-input readOnly v-model="form.soSonsList" />
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="供应商账户" prop="buyerId">
                    <a-select v-model="form.buyerId" placeholder="请选择供应商">
                      <a-select-option
                        v-for="item in PartnerData"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </div>
        <div class="table">
          <p class="table-title">商品信息</p>
          <div class="table-data">
            <a-table
              bordered
              :pagination="false"
              :columns="columns"
              :data-source="data"
              :scroll="{ y: 200, x: 850 }"
            >
            </a-table>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleCancel">返回 </a-button>
        <a-button type="primary" @click="handleSubmit">确定 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { partnerType } from "../../services/userMa";
import { requireOrderInsert } from "../../services/sales";
export default {
  name: "changeOrder",
  data() {
    return {
      visible: false,
      form: {
        soSonsList: "",
        soIdList: [],
        buyerId: undefined,
      },
      rules: {
        buyerId: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "change",
          },
        ],
      },
      data: [],
      columns: [
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 150,
          align: "center",
        },
        {
          title: "商品编码",
          dataIndex: "itemSno",
          width: 150,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "saleQty",
          width: 100,
          align: "center",
        },
        {
          title: "计价单位",
          dataIndex: "priceUnit",
          width: 100,
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "specs",
          width: 100,
          align: "center",
        },
        {
          title: "销售价",
          // title: "单价",
          dataIndex: "salePrice",
          width: 100,
          align: "center",
        },
        {
          title: "采购价",
          dataIndex: "supplyPrice",
          width: 100,
          align: "center",
        },
        {
          title: "增值税",
          dataIndex: "vat",
          width: 100,
          align: "center",
        },
      ],
      PartnerData: [],
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.infoform.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.data));
          data.forEach((item) => {
           item.salePrice = item.salePrice ? item.salePrice : '';
            item.supplyPrice = item.supplyPrice ? item.supplyPrice : '';
          });
          const params = {
            ...this.form,
            orderDetailList: data,
          };
          requireOrderInsert(params).then((res) => {
            const data = res.data;
            if (data.code == 200) {
              this.$message.success("操作成功");
              this.handleCancel();
              this.$parent.getTableList();
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleCancelPackage() {
      this.packageVisible = false;
    },
    openPackage(row) {
      this.packageData = row.pkgDetails;
      this.packageVisible = true;
    },
    getPartnerData() {
      const params = {
        partnerType: 30,
        isEnable: 1
      };
      partnerType(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.PartnerData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    openModal(data) {
      const formData = JSON.parse(JSON.stringify(data));
      console.log('formData: ', formData);
      let snos = [];
      let detais = [];
      formData.forEach((item) => {
        snos.push(item.sno);
        detais = detais.concat(item.orderDetailList);
        this.form.soIdList.push(item.id);
      });
      this.form.soSonsList = snos.join(",");
      this.form.contractId = formData[0]?.contractId;
      this.form.contractTitle = formData[0]?.contractTitle;
      this.data = detais;
      this.data.forEach((item, index) => {
           item.salePrice = item.salePrice ? item.salePrice : '';
        item.supplyPrice = item.supplyPrice ? item.supplyPrice : '';
        item.key = index;
      });
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.form = {
        soIdList: [],
        buyerId: undefined,
      };
      this.data = [];
    },
  },
  created() {
    this.getPartnerData();
  },
};
</script>
<style scoped lang="less">
.details {
  .info {
    margin-bottom: 10px;
    .info-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
  }
  /deep/.ant-form-item-label {
    line-height: 22px;
  }
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
  .table {
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    .table-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
    .table-data {
      padding: 10px;
    }
    .table-total {
      margin-bottom: 0;
      padding: 0 20px;
      line-height: 35px;
    }
  }
}
</style>