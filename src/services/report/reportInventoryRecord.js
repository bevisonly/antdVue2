import { request, METHOD } from '@/utils/request'

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 产品名称
export function product(params) {
  return request(`component/getItems.action`, METHOD.POST, params)
}

//! 获取所有红冲记录
export function getInOutRecord(params) {
  return request(`inOutRecord/listPage.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`inOutRecord/exportInOutRecord.action`, METHOD.POST, params, {
    responseType: 'blob'
  })
}