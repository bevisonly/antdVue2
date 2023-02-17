import Vue from 'vue'
import App from './App.vue'
import { initRouter } from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
// import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import './assets/css/commoncss.css'
import Print from "./utils/print"
import print from 'vue-print-nb'
import draglist from '@/components/drag/dragList'
import checkboxList from '@/components/checkboxList/checkboxList'
import prototypeFun from './utils/vue-prototype'
import directiveObj from './utils/vue-directive'
import * as inputNumberLimit from '@/utils/inputNumberLimit'
const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')
const vueUse = [Antd, VXETable, Print, print, Viser, Plugins]
const vueComponent = [draglist, checkboxList]

Vue.prototype.$XModal = VXETable.modal

Vue.config.productionTip = false

vueUse.forEach(component => Vue.use(component))

//! 注册全局组件
vueComponent.forEach(component => Vue.component(component.name, component))

//! 向vue原型循环挂载全局函数
prototypeFun[1].forEach((fun, i) => Vue.prototype[prototypeFun[0][i]] = fun)

//! 全局自定义指令
Vue.use({install: directiveObj.directive})
//限制2位小数输入
Vue.directive('inputLimit',inputNumberLimit.inputLimt) 
bootstrap({ router, store, i18n, message: Vue.prototype.$message })
// bootstrap({ router, store, message: Vue.prototype.$message })

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')