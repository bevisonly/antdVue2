<template>
  <div>
    <a-modal
      centered
      v-model="visible"
      :title="setTitle"
      :width="650"
      destroyOnClose
      :maskClosable="false"
    >
      <div class="form-item">
        <a-form-model
          :model="specForm"
          :rules="specRules"
          ref="specForm"
          v-if="!parentCode"
        >
          <a-row :gutter="24">
            <a-col :span="12" v-if="setTitle !== '规格新增'">
              <a-form-model-item label="编码">
                <a-input v-model="specForm.specCode" disabled></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="setTitle !== '规格新增' ? 12 : 24">
              <a-form-model-item label="名称" prop="specName">
                <a-input v-model.trim="specForm.specName"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="转换数量">
                <a-input v-number v-model="specForm.amount"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="转换单位">
                <a-select v-model="specForm.defUom" show-search>
                  <a-select-option
                    v-for="(item, index) in unitList"
                    :key="index"
                    :value="item.dicText"
                  >
                    {{ item.dicText }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-form-model-item label="描述">
              <a-input
                type="textarea"
                v-model.trim="specForm.description"
              ></a-input>
            </a-form-model-item>
          </a-row>
        </a-form-model>
        <a-form-model
          :model="specFormChild"
          :rules="specRules"
          ref="specFormChild"
          v-if="parentCode"
        >
          <a-row :gutter="24">
            <a-col :span="12" v-if="setTitle !== '子规格新增'">
              <a-form-model-item label="编码">
                <a-input
                  v-model="specFormChild.childSpecCode"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="setTitle !== '子规格新增' ? 12 : 24">
              <a-form-model-item label="名称" prop="childSpecName">
                <a-input v-model.trim="specFormChild.childSpecName"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="转换数量">
                <a-input v-number v-model="specFormChild.amount"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="转换单位">
                <a-select v-model="specFormChild.defUom" show-search>
                  <a-select-option
                    v-for="(item, index) in unitList"
                    :key="index"
                    :value="item.dicText"
                  >
                    {{ item.dicText }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-form-model-item label="描述">
              <a-input
                type="textarea"
                v-model.trim="specFormChild.description"
              ></a-input>
            </a-form-model-item>
          </a-row>
        </a-form-model>
      </div>
      <template slot="footer">
        <div>
          <a-button :loading="submitLoading" type="primary" @click="submitSpec"
            >保存</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  SpecInsert,
  SpecChildInsert,
  GetDictionary,
  SpecUpdate,
  SpecChildUpdate,
} from "../../services/product/ProductSpecifications";
export default {
  data() {
    return {
      visible: false,
      setTitle: "",
      specForm: {
        specName: "",
        specCode: "",
        amount: "",
        defUom: "",
        description: "",
        version: 0,
      },
      specFormChild: {
        childSpecName: "",
        childSpecCode: "",
        amount: "",
        defUom: "",
        description: "",
        version: 0,
      },
      specRules: {
        specName: [
          { required: true, message: "名称为必填项", trigger: "blur" },
        ],
        childSpecName: [
          { required: true, message: "名称为必填项", trigger: "blur" },
        ],
      },
      unitList: [],
      submitLoading: false,
      parentCode: "",
    };
  },
  methods: {
    //数据字典
    getUnit() {
      GetDictionary({ type: 10 }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.unitList = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //提交
    submitSpec() {
      if (this.parentCode) {
        this.$refs.specFormChild.validate((valid) => {
          if (valid) {
            if (this.setTitle == "子规格新增") {
              console.log(this.setTitle);
              const params = {
                ...this.specFormChild,
                parentCode: this.parentCode,
              };
              this.submitLoading = true;
              SpecChildInsert(params).then((res) => {
                this.submitLoading = false;
                const data = res.data;
                if (data.code === "200") {
                  this.$message.success(data.message);
                  this.visible = false;
                  this.$parent.getList();
                } else {
                  this.$message.error(data.message);
                }
              });
            }
            if (this.setTitle == "子规格编辑") {
              console.log(this.setTitle);
              const params = {
                childSpecName: this.specFormChild.childSpecName,
                childSpecCode: this.specFormChild.childSpecCode,
                id: this.specFormChild.id,
                amount: this.specFormChild.amount,
                defUom: this.specFormChild.defUom,
                description: this.specFormChild.description,
                version: this.specFormChild.version || 0,
                parentCode: this.parentCode,
              };
              this.submitLoading = true;
              SpecChildUpdate(params).then((res) => {
                this.submitLoading = false;
                const data = res.data;
                if (data.code === "200") {
                  this.$message.success(data.message);
                  this.visible = false;
                  this.$parent.getList();
                } else {
                  this.$message.error(data.message);
                }
              });
            }
          } else {
            this.$message.warning("存在必填项为空请核对");
            return false;
          }
        });
      } else {
        this.$refs.specForm.validate((valid) => {
          if (valid) {
            if (this.setTitle == "规格新增") {
              console.log(this.setTitle);
              const params = {
                ...this.specForm,
              };
              this.submitLoading = true;
              SpecInsert(params).then((res) => {
                this.submitLoading = false;
                const data = res.data;
                if (data.code === "200") {
                  this.$message.success(data.message);
                  this.visible = false;
                  this.$parent.getTableList();
                } else {
                  this.$message.error(data.message);
                }
              });
            }

            if (this.setTitle == "规格编辑") {
              console.log(this.setTitle);
              const params = {
                specName: this.specForm.specName,
                specCode: this.specForm.specCode,
                id: this.specForm.id,
                amount: this.specForm.amount,
                defUom: this.specForm.defUom,
                description: this.specForm.description,
                version: this.specForm.version || 0,
              };
              this.submitLoading = true;
              SpecUpdate(params).then((res) => {
                this.submitLoading = false;
                const data = res.data;
                if (data.code === "200") {
                  this.$message.success(data.message);
                  this.visible = false;
                  this.$parent.getTableList();
                } else {
                  this.$message.error(data.message);
                }
              });
            }
          } else {
            this.$message.warning("存在必填项为空请核对");
            return false;
          }
        });
      }
    },
    openModal(title, record, parentCode) {
      this.setTitle = title;
      this.parentCode = parentCode || "";
      this.getUnit();
      if (record) {
        if (parentCode) {
          this.specFormChild = record;
        } else {
          this.specForm = record;
        }
      } else {
        this.specForm = {
          specName: "",
          specCode: "",
          amount: "",
          defUom: "",
          description: "",
          version: 0,
        };
        this.specFormChild = {
          childSpecName: "",
          childSpecCode: "",
          amount: "",
          defUom: "",
          description: "",
          version: 0,
        };
      }
      this.visible = true;
    },
  },
};
</script>

<style>
</style>