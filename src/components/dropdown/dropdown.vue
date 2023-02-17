<template>
  <a-select
    show-search
    placeholder="请选择或搜索一个关联的UAP账户"
    option-filter-prop="children"
    style="width: 300px; margin-left: 100px; height: 36px"
    :filter-option="filterOption"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  >
    <a-select-option
      v-for="(item, index) in itemlist"
      :key="index"
      :value="item.id"
    >
      {{ item.userName }}
    </a-select-option>
  </a-select>
</template>
<script>
export default {
  name: "dropdown",
  props: {
    itemlist: { type: Array },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleChange(value) {
      this.$emit("chooseItem", value);
    },
    handleBlur() {},
    handleFocus() {},
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>