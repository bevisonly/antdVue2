import { request, METHOD } from '@/utils/request'

//! 应收账款逾期账龄-查询
export function getOverdueAgingReport(params) {
  return request(`overdueAging/listPage.action`, METHOD.POST, params)
}

//! 应收账款逾期账龄-导出
export function exportOverdueAgingData(params) {
  return request(`overdueAging/listPageExport.action`, METHOD.POST, params, {
    responseType: 'blob'
  })
}
