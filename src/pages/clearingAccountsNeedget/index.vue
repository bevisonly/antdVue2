<template>
  <div>
    <keep-alive>
      <component :is="changePage"></component>
    </keep-alive>
  </div>
</template>

<script>
import detailsComp from './modalDetails.vue'
import indexComp from './clearingAccountsNeedget.vue'
import collectionConfirmComp from './modalCollectionConfirm.vue'
import ticketMaComp from './modalTicketMa.vue'
export default {
  name: 'index',
  components: {detailsComp, indexComp, collectionConfirmComp, ticketMaComp},
  data() {
    return {
      flag: true,
      changePage: 'indexComp',
      dataSubPage: {},
      subPageFlag: 'details',
      componentOption: {
        "details": "detailsComp",
        "index": "indexComp",
        "edit": "collectionConfirmComp",
        "ticket": "ticketMaComp",
        "bluePlus": "ticketMaComp",
      },
    }
  },
  methods: {
    changeComponent(flag, allMsg) {
      this.dataSubPage = allMsg || {}
      this.subPageFlag = flag || 'details'
      this.flag = !flag
      this.changePage = this.flag ? "indexComp" : this.componentOption[flag]
    }
  },
  activated() {
    this.subPageFlag = 'details'
    this.dataSubPage = {}
    this.changePage = 'indexComp'
  },
}
</script>