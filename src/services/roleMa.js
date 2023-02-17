import {SEARCHROLE,INSERTROLE,UPDATEROLE,DELROLE,ASSIGNPERMISSION,TENANTQUERY,ROLEPERMISSIONLIST} from '@/services/api'
// import { SEARCHROLE, INSERTROLE,TENANTQUERY,ASSIGNPERMISSION } from '@/services/api'
import { request, METHOD } from '@/utils/request'
import { SEARCHUSERROLES } from './api'

/**
 * 角色查询
 * @param roleName  角色名   必须
 * @param orgId 租户id  必须
 * //暂时不传直接拉取
 *
 * @returns {Promise<AxiosResponse<T>>}
 */
//角色查询
export async function searchRole(params) {
  return request(SEARCHROLE, METHOD.GET,params)
}

//角色新增
export async function insertRole(params) {
  return request(INSERTROLE, METHOD.POST,params)
}

//角色修改
export async function updateRole(params) {
  return request(UPDATEROLE, METHOD.POST,params)
}

//角色删除
export async function delRole(params) {
  return request(DELROLE, METHOD.GET,params)
}
//分配权限
export async function assignPermission(params) {
  return request(ASSIGNPERMISSION, METHOD.POST,params)
}
//查询用户角色
export async function searchUserRoles(params) {
  return request(SEARCHUSERROLES, METHOD.GET,params)
}
//查询用户角色权限
export async function rolePermissionList(params) {
  return request(ROLEPERMISSIONLIST, METHOD.GET,params)
}

//租户查询
export async function tenantQuery(params) {
  return request(TENANTQUERY, METHOD.GET,params)
}


