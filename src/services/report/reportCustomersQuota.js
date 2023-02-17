import { request, METHOD } from '@/utils/request'

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 客户占用额度
export function getLimitationCustomer(params) {
  return request(
    `LinesReport/getLimitationCustomer.action`,
    METHOD.POST,
    params
  )
}

//! 关联查询客户列表
export function getPartnerList(params) {
  return request(`LinesReport/getPartnerList.action`, METHOD.POST, params)
}

//! 导出客户占用额度
export function exportLimitationCustomer(params) {
  return request(
    `LinesReport/exportLimitationCustomer.action`,
    METHOD.POST,
    params,
    {
      responseType: 'blob'
    }
  )
}
