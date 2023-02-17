<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <iframe
      id="iframebox"
      ref="iframebox"
      style="width: 100%; height: 100vh"
      :src="href"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import Cookie from "js-cookie";

export default {
  data() {
    return {
      href: "",
      UAP_accessToken: "",
      // refreshToken: "",
      xsrfHeaderName: "",
    };
  },
  methods: {
    // sendMessage() {
    //   console.log(this);
    //   let that = this;
    //   let xsrfHeaderName = this.xsrfHeaderName;
    //   console.log(this.$ref["iframebox"]);
    //   let cookie = Cookie.get(xsrfHeaderName);
    //   console.log(xsrfHeaderName);
    //   that.$ref["iframebox"].contentWindow.postMessage(cookie);
    // },
  },
  created() {
    // console.log(this.$route);
    // this.UAP_accessToken = localStorage.getItem("SCM_accessToken");
    // this.refreshToken = localStorage.getItem("refreshToken");
    // console.log(this.UAP_accessToken);
    // console.log(localStorage.getItem("UAP_accessToken"));
    this.href = this.$route.meta.href;
    // this.$route.meta.href + "?SCM_accessToken=" + this.UAP_accessToken;
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>

<style lang="less" scoped>
.new-page {
  height: 100%;
  background-color: @base-bg-color;
  text-align: center;
  padding: 30px 0 0 0;
  margin-top: -24px;
  overflow-x: auto;
  // position: relative;
  h1 {
    font-size: 48px;
  }
}
</style>