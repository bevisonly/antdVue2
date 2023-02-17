
import { request, METHOD } from '@/utils/request'

/**
 
 */

//功能权限查询
export async function GetResourceList(params) {
  return request('/resource/listResourceTree.action', METHOD.GET, params)
}
//权限修改
export async function UpdateResource(params) {
  return request('/resource/update.action', METHOD.POST, params)
}
//权限新增
export async function InsertResource(params) {
  return request('/resource/insert.action', METHOD.POST, params)
}
//权限删除
export async function DelResource(params) {
  return request('/resource/delete.action', METHOD.GET, params)
  // return request('/opDept/delete.action', METHOD.POST,params)
}


