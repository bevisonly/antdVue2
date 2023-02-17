import {request, METHOD} from '@/utils/request'

//分页查询
export function lossOverflowGetData(params) {
  return request(`/lossOverflow/getData.action`, METHOD.POST, params)
}

//新增
export function lossOverflowAdd(params) {
  return request(`/lossOverflow/add.action`, METHOD.POST, params)
}

//更新
export function lossOverflowUpdate(params) {
  return request(`/lossOverflow/update.action`, METHOD.POST, params)
}

//删除
export function lossOverflowDelete(params) {
  return request(`/lossOverflow/delete.action`, METHOD.GET, params)
}

//详情
export function lossOverflowGetLossOverflowInfo(params) {
  return request(`/lossOverflow/getLossOverflowInfo.action`, METHOD.GET, params)
}

//审核
export function lossOverflowUpdateStatus(params) {
  return request(`lossOverflow/updateStatus.action`, METHOD.POST, params)
}

//商品下拉
export function lossOverflowGetItems(params) {
  return request(`/lossOverflow/getItems.action`, METHOD.POST, params)
}

//仓库列表
export function warehouseList(params) {
  return request(`/warehouse/list.action`, METHOD.GET, params)
}

//! 修复旧数据
export function fixOldData(params) {
  return request(`/repairImItemInvLot/addLoToRepairImItemInvLot.action`, METHOD.GET, params)
}

//! 报溢新增
export function overAdd(params) {
  return request(`lossOverflow/overAdd.action`, METHOD.POST, params)
}

//! 报溢更新
export function updateOverData(params) {
  return request(`lossOverflow/updateOverData.action`, METHOD.POST, params)
}

//! 报溢审核
export function updateOverState(params) {
  return request(`lossOverflow/updateOverStatus.action`, METHOD.POST, params)
}

//! 基础商品
export function baseCommodity(params) {
  return request(`lossOverflow/getBaseItems.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`lossOverflow/exportLossOverflow.action`, METHOD.GET, params, {responseType: 'blob'})
}