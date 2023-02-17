import {request, METHOD} from '@/utils/request'

//! 计价单位
export async function dictionaryList(params) {
  return request(`/dictionary/list.action`, METHOD.GET, params)
}

//! 租户--运营主体
export function opSubjectList(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 导出
export async function exportIsFinished(params) {
  return request(`/inventoryDailyReport/listDailyExport.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 查询
export function inventoryDailyReportListDailyPage(params) {
  return request(`inventoryDailyReport/listDailyPage.action`, METHOD.POST, params)
}

//! 供应商下拉框
export function partnerListPartnerByKey(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 查看入库详情
export function detailsInStock(params) {
  return request(`inventoryDailyReport/listInboundPage.action`, METHOD.POST, params)
}

//! 查看出库详情
export function detailsOutStock(params) {
  return request(`inventoryDailyReport/listOutboundPage.action`, METHOD.POST, params)
}

//! 出库类型
export function transType(params) {
  return request(`dictionary/list.action`, METHOD.GET, params)
}