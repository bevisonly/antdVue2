import {request, METHOD} from '@/utils/request'

//!工人-分页列表查询
export function workerGetPageList(params) {
  return request(`/worker/getPageList.action`, METHOD.POST, params)
}

//!工人-新增
export function workerInsert(params) {
  return request(`/worker/insert.action`, METHOD.POST, params)
}

//!工人-更新
export function workerUpdate(params) {
  return request(`/worker/update.action`, METHOD.POST, params)
}

//!工人-删除
export function workerDelete(params) {
  return request(`/worker/delete.action`, METHOD.GET, params)
}

//!工人-获取详情
export function workerGetSingle(params) {
  return request(`/worker/getSingle.action`, METHOD.GET, params)
}

//!工人-启用
export function workerActivate(params) {
  return request(`/worker/activate.action`, METHOD.GET, params)
}

//!工人-禁用
export function workerDisable(params) {
  return request(`/worker/disable.action`, METHOD.GET, params)
}
