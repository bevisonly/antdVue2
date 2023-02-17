import { request, METHOD } from '@/utils/request'

//! 业务单元
export function op(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 客户名称
export function customer(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 应收账款明细账龄分析-查询
export function getListPageAgeAnalysisReport(params) {
  return request(
    `overdueRecord/listPageAgeAnalysis.action`,
    METHOD.POST,
    params
  )
}

//! 应收账款明细账龄分析-导出
export function exportListPageAgeAnalysisData(params) {
  return request(
    `overdueRecord/listPageAgeAnalysisExport.action`,
    METHOD.POST,
    params,
    {
      responseType: 'blob'
    }
  )
}
