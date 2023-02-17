<template>
  <div>
    <div class="dynamic-wrap" style="margin-left:12px" :style="{ maxHeight: wrapHeight + 'px' }">
      <div v-for="item in keysList" :key="item">
        <a-row :gutter="24">
          <a-col :span="4">
            <a-form-item label="供货供应商">
              <a-select
                placeholder=""
                v-decorator="[
                  `${title}supplierId[${item}]`,
                ]"
              >
                <a-select-option
                  v-for="(v) in supplierList"
                  :key="v.id"
                >
                  {{ v.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="供货占比">
              <a-input
                placeholder=""
                v-decorator="[
                  `${title}prop[${item}]`,
                  {
                    initialValue: arr[item] ? arr[item].prop : undefined,
                
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" style="padding-left: 0px;margin-top:40px">
            <a-form-item :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
              <template v-if="keysList.length > 1">
                <a-button
                  type="primary"
                  icon="minus"
                  @click="removeRow(item)"
                  class="minusRowBtn"
                ></a-button>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <!-- <a-button type="dashed" icon="plus" @click="addRow" class="addRowBtn">
       添加供应商
      </a-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "DynamicForm",
  props: {
    title: {
      type: String,
      default: "",
    },
    wrapHeight: {
      // 表单容器的高度
      type: Number,
      default: 120,
    },
    arr: {
      type: Array,
      default: function () {
        return [];
      },
    },
    supplierList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      id: 0,
      keysList: [],
    };
  },
  created() {
    this.form = this.$form.createForm(this);
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const arr = [0];
      if (this.arr.length !== 0) {
        for (let i = 1; i < this.arr.length; i++) {
          arr.push(i);
          this.id = this.id + 1;
        }
      }
      this.keysList = arr;
    },
    // 移除某行
    removeRow(k) {
      if (this.keysList.length === 1) {
        // 如果存在可以移除所有行的情况，把条件改为this.keysList.length === 0即可
        return;
      }
      this.keysList = this.keysList.filter((item) => item !== k);
    },
    // 新增一行
    addRow() {
      this.id = this.id + 1;
      this.keysList = this.keysList.concat(this.id);
    },
  },
};
</script>


<style>
</style>