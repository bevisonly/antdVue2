import {request, METHOD} from '@/utils/request'

//! 查
export function search(params) {
  return request(`BusinessReport/businessReportDate.action`, METHOD.POST, params)
}

//! 导
export function exportData(params) {
  return request(`BusinessReport/exportBusinessReportDate.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}