import {request, METHOD} from '@/utils/request'

//! 获取供应商
export function supplier(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 列表查询
export function search(params) {
  return request(`payable/reconciled/listPage.action`, METHOD.GET, params)
}

//! 导出
export function exportData(params) {
  return request(`payable/reconciled/listPageExport.action`, METHOD.GET, params, { responseType: 'blob' })
}

//! 生成结算单
export function settlement(params) {
  return request(`apInvoice/batchCustCreateIds.action`, METHOD.POST, params)
}

//! 详情
export function details(params) {
  return request(`payable/noReconciled/detailListPage.action`, METHOD.POST, params)
}

//! 撤回
export function cancel(params) {
  return request(`payable/reconciled/undo.action`, METHOD.POST, params)
}