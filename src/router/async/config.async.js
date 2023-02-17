import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'
// import TabsView from '@/layouts/tabs/TabsView'


// 异步路由配置
const routesConfig = [
  'root',
  'busLogin',
  // {
  //   router: 'busLogin',
  //   path: '/busLogin',
  //   name: '登录',
  //   component: () => import('@/pages/busLogin')
  // },
  {
    router: 'exp404',
    path: '*',
    name: '404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403'
  },

]

const options = {
  mode: "history",
  base:"/scm/",
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
