import axios from 'axios'
import {request, METHOD} from '@/utils/request'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 查个人权限
export function searchPerson(params) {
  return axios.get(`${api}/userPersonalPermissions/listResourceTree.action`, { params })
}

//! 改个人权限
export function updatePerson(params) {
  return axios.post(`${api}/userPersonalPermissions/insert.action`, params )
}

//! 获取oa信息(不分页)
export function oaMsg(params) {
  return axios.get(`${api}/oa/findOAUserList.action`, {params})
}
//! oa组织
export function org(params) {
  return axios.get(`${api}/oa/findOrganizationByDepartmentId.action`, {params})
}
//! oa新增
export async function add(params) {
  return request('/userPartnerRef/createUserFromOA.action', METHOD.POST, params)
}
// uap账户查询
export async function getUapUserList() {
  return request('/userPartnerRef/getUapUserList.action', METHOD.GET)
}
//分页查询账户
export async function UserListPage(params) {
  return request('/userPartnerRef/userListPage.action', METHOD.GET,params)
}
// //新增账户
export async function UserInsert(params) {
  return request('/userPartnerRef/insert.action', METHOD.POST,params)
}
// //启用/禁用账户
export async function UpdateUserState(params) {
  return request('/userPartnerRef/updateUserState.action', METHOD.GET,params)
}
// /查询用户角色
export async function GetUserRoles(params) {
  return request('/role/getRoleListByUserId.action', METHOD.GET,params)
}
// //修改账户
export async function UserUpdate(params) {
  return request('/userPartnerRef/update.action', METHOD.POST,params)
}
// //角色分配
export async function UserDistribution(params) {
  return request('/userPartnerRef/saveUserRole.action', METHOD.POST,params)
}
// //用户关联
export async function UserAssociate(params) {
  return request('/userPartnerRef/createUserFromUap.action', METHOD.POST,params)
}
// //查询客户门店供应商
// export async function partnerType(params) {
//   return request(PARTNERTYPE, METHOD.GET,params)
// }
//查询租户
export async function getTenant(params) {
  return request('/opSubject/list.action', METHOD.GET,params)
}
//查询租户
export async function getTenantOrganization(params) {
  return request('/opDept/list.action', METHOD.GET,params)
}
//查询数据权限
export async function getDataPermission(params) {
  return request('/dataPermission/list.action', METHOD.GET,params)
}
//租户数据权限保存
export async function tenantDataSave(params) {
  return request('/dataPermission/saveDeptPermission.action', METHOD.POST,params)
}
//查询客户/供应商数据权限
export async function getDataPartnerPermission(params) {
  return request('/dataPermission/partnerPermissionList.action', METHOD.GET,params)
}
//客户/供应商数据权限保存
export async function partnerDataSave(params) {
  return request('/dataPermission/savePartnerPermission.action', METHOD.POST,params)
}
//查询仓库数据权限列表
export async function whPermissionList(params) {
  return request('/dataPermission/whPermissionList.action', METHOD.GET,params)
}
//保存仓库数据权限
export async function saveWhPermission(params) {
  return request('/dataPermission/saveWhPermission.action', METHOD.POST,params)
}

