import {request, METHOD} from '@/utils/request'

//! 查
export function search(params) {
  return request(`BusinessReport/businessReportSoDetails.action`, METHOD.POST, params)
}

//! 导
export function exportData(params) {
  return request(`BusinessReport/exportBusinessReportSoDetails.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 品类
export function classItem(params) {
  return request(`itemType/getPrimaryClassification.action`, METHOD.GET, params)
}

//! 产品名称
export function product(params) {
  return request(`component/getItems.action`, METHOD.POST, params)
}