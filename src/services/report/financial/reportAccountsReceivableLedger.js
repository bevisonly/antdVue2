import { request, METHOD } from '@/utils/request'

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 客户名称
export function customer(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 应收账款明细报表查询
export function getOverdueRecordReport(params) {
  return request(`overdueRecord/listPage.action`, METHOD.POST, params)
}

//! 应收账款汇总表查询
export function getOverdueSummaryReport(params) {
  return request(`overdueRecord/overdueSummary.action`, METHOD.POST, params)
}

//! 应收账款明细表导出
export function exportOverdueRecordData(params) {
  return request(`overdueRecord/listPageExport.action`, METHOD.POST, params, {
    responseType: 'blob'
  })
}

//! 应收账款汇总表导出
export function exportOverdueSummaryData(params) {
  return request(
    `overdueRecord/overdueSummaryExport.action`,
    METHOD.POST,
    params,
    { responseType: 'blob' }
  )
}
