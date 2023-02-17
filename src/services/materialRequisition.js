import {request, METHOD} from '@/utils/request'

//! 分页
export function pickingHeadFindList(params) {
  return request(`/pickingHead/findList.action`, METHOD.POST, params)
}

//! 新增
export function pickingHeadInsert(params) {
  return request(`/pickingHead/insert.action`, METHOD.POST, params)
}

//! 详情
export function pickingHeadFindById(params) {
  return request(`/pickingHead/findById.action`, METHOD.GET, params)
}

//! 更新
export function pickingHeadUpdate(params) {
  return request(`/pickingHead/update.action`, METHOD.POST, params)
}

//! 删除
export function pickingHeadDelete(params) {
  return request(`/pickingHead/delete.action`, METHOD.GET, params)
}

//! 确认领料
export function pickingHeadConfirm(params) {
  return request(`/pickingHead/confirm.action`, METHOD.POST, params)
}

//! 导出
export function pickingHeadExportList(params) {
  return request(`/pickingHead/exportList.action`, METHOD.POST, params, { responseType: 'blob'})
}

//! 领料商品
export function getCommodityName(params) {
  return request(`/component/getInventoryList.action`, METHOD.GET, params)
}

//! 产成品商品
export function doneCommodityName(params) {
  return request(`/item/listPage.action`, METHOD.POST, params)
}

//!单位
export function unitList(params) {
  return request(`/dictionary/list.action`, METHOD.GET, params)
}

//! 领料员(工人-分页列表查询)
export function getPickerName(params) {
  return request(`/worker/getWorkerList.action`, METHOD.GET, params)
}