<template>
  <div>
    <keep-alive>
    <!--//! <keep-alive>确保组件的生命周期钩子函数能被正确激活 -->
      <component :is="changePage"></component>
    </keep-alive>
  </div>
</template>

<script>
import detailsComp from './modalDetails.vue'
import indexComp from './clearingAccountsNeedpay.vue'
export default {
  name: 'index',
  components: {detailsComp, indexComp},
  data() {
    return {
      flag: true,
      changePage: 'indexComp',
      dataSubPage: {},
      subPageFlag: 'details'
    }
  },
  methods: {
    changeComponent(flag, allMsg) {
      this.dataSubPage = allMsg || {}
      this.subPageFlag = flag || 'details'
      this.flag = !flag
      this.changePage = this.flag ? "indexComp" : "detailsComp"
    }
  },
  activated() {
    this.subPageFlag = 'details'
    this.dataSubPage = {}
    this.changePage = 'indexComp'
  },
}
</script>