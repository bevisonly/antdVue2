import { request, METHOD } from '@/utils/request'

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 产品名称
export function product(params) {
  return request(`component/getItems.action`, METHOD.POST, params)
}

//! 获取出入库汇总表记录
export function getItemTransactionReport(params) {
  return request(`inOutStorageReport/listPage.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`itemTransactionReport/exportPage.action`, METHOD.POST, params, {responseType: 'blob'})
}