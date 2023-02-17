<template>
  <a-layout-sider
    :theme="sideTheme"
    :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']"
    width="216px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  >
    <!-- width="256px" -->
    <div :class="['logo', theme]">
      <!-- <router-link > -->
      <img src="@/assets/img/dili-logo.png" />
      <h1>{{ systemName }}</h1>
      <!-- </router-link> -->
    </div>
    <i-menu
      :theme="theme"
      :collapsed="collapsed"
      :options="menuData"
      @select="onSelect"
      class="menu"
    />
    <!-- 改 -->

    <!--  -->
  </a-layout-sider>
</template>

<script>
import IMenu from "./menu";
import { mapState } from "vuex";
export default {
  name: "SideMenu",
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menuData: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: "dark",
    },
  },
  computed: {
    sideTheme() {
      return this.theme == "light" ? this.theme : "dark";
    },
    ...mapState("setting", ["isMobile", "systemName"]),
  },
  methods: {
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
  },
};
</script>
<style lang="less">
.ant-menu-item {
  padding-left: 24px !important;
  text-align: left;
}
.ant-menu-inline > .ant-menu-item {
  height: 26px !important;
  line-height: 26px !important;
}
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 28px !important;
  line-height: 28px !important;
}
.ant-menu-submenu-title {
  padding-left: 6px !important;
}
</style>
<style lang="less" scoped>
@import "index";
</style>
<style>
#subItemSpan > .anticon {
  margin-right: 4px !important;
}
</style>
