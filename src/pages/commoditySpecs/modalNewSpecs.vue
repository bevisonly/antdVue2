<template>
  <a-modal
    :width="560"
    :dialogStyle="{ top: '96px' }"
    v-model="visibleNewSpecsModal"
    :title="
      editFlag == '编辑规格'
        ? '编辑规格'
        : editFlag == '添加类型保存'
        ? '编辑规格'
        : '新增规格'
    "
    :okText="okText !== '保存' ? okText : '保存'"
    @ok="handleOk"
  >
    <a-form-model
      ref="newSpecs"
      :model="newSpecsForm"
      :rules="rules"
      layout="vertical"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="编码" style="margin-bottom: 0">
            <a-input v-model="newSpecsForm.specCode" disabled></a-input>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="2"></a-col> -->
        <a-col :span="12">
          <a-form-model-item
            label="名称"
            style="margin-bottom: 0"
            prop="specName"
          >
            <a-input v-model="newSpecsForm.specName"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 4.1.0 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="数量" style="margin-bottom: 0">
            <a-input v-model="newSpecsForm.amount"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="计量单位" style="margin-bottom: 0">
            <a-select v-model="newSpecsForm.defUom">
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
      <!--  -->
      <a-row>
        <a-col :span="24">
          <a-form-model-item label="描述" style="margin-bottom: 0">
            <a-input
              v-model="newSpecsForm.description"
              type="textarea"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>
<script>
import {
  itemSpecUpdate,
  itemSpecInsert,
  itemSpecChildInsert,
  itemSpecChildUpdate,
  GetUnitList,
} from "@/services/commoditySpecs.js";
import { throttle } from "../../utils/tool";
export default {
  name: "modalDetails",
  data() {
    let validateSpecCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("编码不能为空"));
      } else if (!/^[a-zA-Z0-9]*[a-zA-Z0-9]*$/.test(value)) {
        callback(new Error("编码只能由数字和字母构成"));
      } else {
        callback();
      }
    };
    let validateSpecName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("名字不能为空"));
      } else {
        callback();
      }
    };
    return {
      visibleNewSpecsModal: false,
      okText: "增加",
      editFlag: "",
      specsCode: "",
      newSpecsForm: {
        specCode: "",
        specName: "",
        amount: "",
        defUom: "",
        description: "",
      },
      detailsUpdateId: "",
      rules: {
        specCode: [{ validator: validateSpecCode, trigger: "change" }],
        specName: [{ validator: validateSpecName, trigger: "change" }],
      },
      modifyPageInfoBox: {
        commonId: "",
        modifyPageCreateUser: "",
        modifyPageCreateDate: "",
        modifyPageVersion: "",
      },
      updateDateFun: "",
      detailsVersion: 0,
      onOff: true,
      //4.1.0
      unitList: [],
    };
  },
  methods: {
    //---单位
    getUnit() {
      GetUnitList({ type: 10 }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.unitList = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    openModal(
      id,
      editFlag,
      specCode,
      specName,
      amount,
      defUom,
      description,
      createUser,
      createDate,
      version
    ) {
      this.modifyPageInfoBox.commonId = id;
      this.editFlag = editFlag;
      if (editFlag == "编辑规格") {
        this.okText = "保存";
        this.newSpecsForm.specCode = specCode || "";
        this.newSpecsForm.specName = specName || "";
        this.newSpecsForm.amount = amount || "";
        this.newSpecsForm.defUom = defUom || "";
        this.newSpecsForm.description = description || "";
        this.modifyPageInfoBox.modifyPageCreateUser = createUser || "";
        this.modifyPageInfoBox.modifyPageCreateDate = createDate || "";
        this.modifyPageInfoBox.modifyPageVersion = version || "";
      } else if (editFlag == "添加类型" || editFlag == "添加类型保存") {
        //此代码块因参数位置原因，名字未能见名知意
        this.specsCode = id;
        this.updateDateFun = createDate;
        editFlag == "添加类型保存"
          ? (this.okText = "保存")
          : (this.okText = "添加");
        this.detailsUpdateId = specCode || "";
        this.detailsVersion = version || 0;
        this.newSpecsForm.specCode = specName || "";
        this.newSpecsForm.amount = amount || "";
        this.newSpecsForm.defUom = defUom || "";
        this.newSpecsForm.specName = description || "";
        this.newSpecsForm.description = createUser || "";
      } else {
        this.okText = "增加";
        this.newSpecsForm.specCode = "";
        this.newSpecsForm.specName = "";
        this.newSpecsForm.amount = "";
        this.newSpecsForm.defUom = "";
        this.newSpecsForm.description = "";
        this.modifyPageInfoBox.modifyPageCreateUser = "";
        this.modifyPageInfoBox.modifyPageCreateDate = "";
        this.modifyPageInfoBox.modifyPageVersion = "";
      }
      this.getUnit();
      this.visibleNewSpecsModal = true;
    },
    itemSpecChildUpdate() {
      const params = {
        parentCode: this.specsCode,
        id: this.detailsUpdateId,
        childSpecCode: this.newSpecsForm.specCode,
        childSpecName: this.newSpecsForm.specName,
        amount: this.newSpecsForm.amount,
        defUom: this.newSpecsForm.defUom,
        description: this.newSpecsForm.description,
        version: this.detailsVersion,
      };
      itemSpecChildUpdate(params)
        .then((res) => {
          if (res.data.code == "200") {
            this.$message.success("保存成功......");
            this.onOff = true;
            this.updateDateFun();
            this.visibleNewSpecsModal = false;
          } else {
            this.onOff = true;
            this.$message.warn("保存失败......");
          }
        })
        .catch(() => (this.onOff = true));
    },
    itemSpecUpdate() {
      const params = {
        id: this.modifyPageInfoBox.commonId,
        specCode: this.newSpecsForm.specCode,
        specName: this.newSpecsForm.specName,
        amount: this.newSpecsForm.amount,
        defUom: this.newSpecsForm.defUom,
        description: this.newSpecsForm.description,
        createUser: this.modifyPageInfoBox.modifyPageCreateUser || "",
        createDate: this.modifyPageInfoBox.modifyPageCreateDate || "",
        version: this.modifyPageInfoBox.modifyPageVersion || 0,
      };
      itemSpecUpdate(params)
        .then((res) => {
          if (res.data.code == "200") {
            this.$message.success("保存成功......");
            this.onOff = true;
            this.$parent.onSubmit();
            this.visibleNewSpecsModal = false;
          } else {
            this.onOff = true;
            this.$message.warn("保存失败......");
          }
        })
        .catch(() => (this.onOff = true));
    },
    itemSpecInsert() {
      const params = {
        id: "",
        specCode: this.newSpecsForm.specCode,
        specName: this.newSpecsForm.specName,
        amount: this.newSpecsForm.amount,
        defUom: this.newSpecsForm.defUom,
        description: this.newSpecsForm.description,
        createUser: "",
        createDate: "",
        version: "",
      };
      if (params.specName.length == 0) {
        this.$message.warn("名字不能为空......");
        return;
      }
      itemSpecInsert(params)
        .then((res) => {
          if (res.data.code == "200") {
            this.$message.success("新增成功......");
            this.onOff = true;
            this.$parent.onSubmit();
            this.visibleNewSpecsModal = false;
          } else {
            this.onOff = true;
            this.$message.warn("新增失败......");
          }
        })
        .catch(() => (this.onOff = true));
    },
    itemSpecChildInsert() {
      const params = {
        childSpecCode: this.newSpecsForm.specCode || "",
        childSpecName: this.newSpecsForm.specName || "",
        amount: this.newSpecsForm.amount,
        defUom: this.newSpecsForm.defUom,
        description: this.newSpecsForm.description || "",
        parentCode: this.specsCode || "",
      };
      if (this.newSpecsForm.specName == 0) {
        this.$message.warn("名字不能为空......");
        return;
      }
      itemSpecChildInsert(params)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success(res.data.result);
            this.visibleNewSpecsModal = false;
            this.onOff = true;
            this.updateDateFun();
          } else {
            this.onOff = true;
            this.$message.warn(res.data.result);
          }
        })
        .catch(() => (this.onOff = true));
    },
    submitThrottle: throttle(function () {
      if (this.onOff) {
        this.onOff = false;
        if (this.editFlag == "编辑规格") {
          this.itemSpecUpdate();
        } else if (this.editFlag == "添加类型") {
          this.itemSpecChildInsert();
        } else if (this.editFlag == "添加类型保存") {
          this.itemSpecChildUpdate();
        } else {
          this.itemSpecInsert();
        }
      } else {
        this.$message.warn("正在处理，请勿重复点击");
      }
    }, 1000),
    handleOk() {
      this.submitThrottle();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-modal-body {
  padding: 16px 24px 0 24px;
}
</style>