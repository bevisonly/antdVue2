import {request, METHOD} from '@/utils/request'

//分页
export function inventoryStockGetData(params) {
  return request(`/inventoryStock/getData.action`, METHOD.POST, params)
}

//详情
export function inventoryStockGetInventoryStockInfo(params) {
  return request(`/inventoryStock/getInventoryStockInfo.action`, METHOD.GET, params)
}

//更新
export function inventoryStockUpdate(params) {
  return request(`/inventoryStock/update.action`, METHOD.POST, params)
}

//删除
export function inventoryStockDelete(params) {
  return request(`/inventoryStock/delete.action`, METHOD.GET, params)
}

//保存
export function inventoryStockAdd(params) {
  return request(`/inventoryStock/add.action`, METHOD.POST, params)
}

//审核
export function inventoryStockUpdateStatus(params) {
  return request(`/inventoryStock/updateStatus.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`inventoryStock/exportInventoryStockInfo.action`, METHOD.GET, params, {responseType: 'blob'})
}