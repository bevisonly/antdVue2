import {request, METHOD} from '@/utils/request'

//! 客户
export function supplier(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 查询
export function search(params) {
  return request(`purchaseOrderDetail/listPage.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`purchaseOrderDetail/export.action`, METHOD.POST, params, {responseType: 'blob'})
}