<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    :width="600"
    @cancel="handleCancel"
    destroyOnClose
  >
    <a-form-model :model="form" :rules="rules" ref="infoform">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="12">
          <a-form-model-item label="运营主体" prop="opId">
            <a-select
              :disabled="!isAdmin"
              allowClear
              v-model="form.opId"
              placeholder="所属运营主体"
            >
              <a-select-option
                :value="item.id"
                v-for="item in orgData"
                :key="item.id"
              >
                {{ item.opName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col class="gutter-row" :span="12">
          <a-form-model-item label="仓库编号" prop="whCode">
            <a-input v-model="form.whCode" placeholder="仓库编号"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="12">
          <a-form-model-item label="仓库名称" prop="whName">
            <a-input v-model="form.whName" placeholder="仓库名称"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col class="gutter-row" :span="12">
          <a-form-model-item label="联系人">
            <a-input v-model="form.contactName" placeholder="联系人"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="12">
          <a-form-model-item label="联系电话">
            <a-input
              v-model="form.contactPhone"
              placeholder="联系电话"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col class="gutter-row" :span="12">
          <a-form-model-item label="联系地址">
            <a-input v-model="form.address" placeholder="联系地址"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <template slot="footer">
      <a-button @click="handleCancel"> 取消 </a-button>
      <a-button type="primary" @click="handleSubmit"> 确定 </a-button>
    </template>
  </a-modal>
</template>

<script>
import { tenantQuery } from "../../services/roleMa";
import { warehouseInsert, warehouseUpdate } from "../../services/warehouse";
export default {
  name: "addWareHouse",
  data() {
    return {
      modalTitle: "新增仓库",
      visible: false,
      form: {
        opId: undefined,
        whCode: "",
        whName: "",
        contactName: "",
        contactPhone: "",
        address: "",
      },
      rules: {
        opId: [
          {
            required: true,
            message: "请选择所属运营主体",
            trigger: "change",
          },
        ],
        whCode: [
          {
            required: true,
            message: "请输入仓库编号",
            trigger: "blur",
          },
        ],
        whName: [
          {
            required: true,
            message: "请输入仓库名称",
            trigger: "blur",
          },
        ],
      },
      orgData: [],
      isAdmin: false,
      modalState: "",
    };
  },
  methods: {
    getopSubjectGetLoginInfo() {
      tenantQuery().then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.orgData = data.data;
          this.isAdmin = localStorage.getItem("isAdmin") === "true";
        } else {
          this.$message.error("获取数据失败！");
        }
      });
    },
    openModal(state, row) {
      this.modalState = state;
      if (this.modalState === "add") {
        const orgId = localStorage.getItem("orgId");
        const orgObj = this.orgData.find((item) => {
          return orgId == item.orgId;
        });
        if (!this.isAdmin) {
          this.form.opId = orgObj.id;
        }
        this.modalTitle = "新增仓库";
      } else if (this.modalState === "edit") {
        this.modalTitle = "修改仓库";
        this.form = JSON.parse(row);
      }
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.clearForm();
    },
    clearForm() {
      this.form = {
        opId: undefined,
        whCode: "",
        whName: "",
        contactName: "",
        contactPhone: "",
        address: "",
      };
      this.$refs.infoform.clearValidate();
    },
    handleSubmit() {
      this.$refs.infoform.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form,
          };
          if (this.modalState === "add") {
            warehouseInsert(params).then((res) => {
              const data = res.data;
              if (data.code === "200") {
                this.visible = false;
                this.$message.success("新增成功！");
                this.$parent.getTableList();
                this.clearForm();
              } else {
                this.$message.error("新增失败！");
              }
            });
          } else if (this.modalState === "edit") {
            warehouseUpdate(params).then((res) => {
              const data = res.data;
              if (data.code === "200") {
                this.visible = false;
                this.$message.success("修改成功！");
                this.$parent.getTableList();
                this.clearForm();
              } else {
                this.$message.error("修改失败！");
              }
            });
          }
        }
      });
    },
  },
  computed: {},
  created() {
    this.$nextTick(() => {
      this.getopSubjectGetLoginInfo();
    });
  },
};
</script>


<style scoped lang="less">
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>