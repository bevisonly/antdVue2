import {GETUAPUSERLIST,USERLISTPAGE,USERINSERT,UPDATEUSERSTATE,USERUPDATE,USERDISTRIBUTION,USERASSOCIATE} from '@/services/api'
// import {FUNAUTHLIST,FUNAUTHUPDATE,FUNAUTHDEL} from '@/services/api'
import {request, METHOD} from '@/utils/request'
import axios from 'axios'
import qs from 'qs'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
    api = 'http://basicdata.diligrp.com:8099'
} else {
    api = 'https://basicdata.diligrp.com'
}
//uap账户查询
export async function getUapUserList() {
  return request(GETUAPUSERLIST, METHOD.GET)
}
//分页查询账户
export async function UserListPage(params) {
  return request(USERLISTPAGE, METHOD.GET,params)
}
//新增账户
export async function UserInsert(params) {
  return request(USERINSERT, METHOD.POST,params)
}
//启用/禁用账户
export async function UpdateUserState(params) {
  return request(UPDATEUSERSTATE, METHOD.GET,params)
}
//修改账户
export async function UserUpdate(params) {
  return request(USERUPDATE, METHOD.POST,params)
}
//角色分配
export async function UserDistribution(params) {
  return request(USERDISTRIBUTION, METHOD.POST,params)
}
//用户关联
export async function UserAssociate(params) {
  return request(USERASSOCIATE, METHOD.POST, params)
}
// //查询客户门店供应商
// export async function partnerType(params) {
//   return request(PARTNERTYPE, METHOD.GET,params)
// }

//! 查
export function partnerType(params) {
  return axios.get(`${api}/partner/list.action`, {
    params,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
