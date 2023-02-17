import { request, METHOD } from '@/utils/request'

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 供应商占用额度
export function getLimitationSupplier(params) {
  return request(
    `LinesReport/getLimitationSupplier.action`,
    METHOD.POST,
    params
  )
}

//! 关联查询供应商列表
export function getSupplierList(params) {
  return request(`LinesReport/getSupplierList.action`, METHOD.POST, params)
}

//! 导出供应商占用额度
export function exportLimitationSupplier(params) {
  return request(
    `LinesReport/exportLimitationSupplier.action`,
    METHOD.POST,
    params,
    {
      responseType: 'blob'
    }
  )
}
