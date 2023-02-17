import { request, METHOD } from '@/utils/request'

// 分页列表
export function GetList(params) {
    return request(`/receivable/noReconciliation/listPage.action`, METHOD.GET, params)
}

// 对账详情
export function GetDetails(params) {
    return request(`/receivable/noReconciliation/listDetailPage.action`, METHOD.GET, params)
}
// 对账确认
export function ReconciliateConfirm(params) {
    return request(`/receivable/noReconciliation/reconciliateConfirm.action`, METHOD.POST, params)
}
// 批量对账确认
export function ReconciliateListConfirm(params) {
    return request(`/receivable/noReconciliation/reconciliateListConfirm.action`, METHOD.POST, params)
}
//应收的列表导出
export function exportData(params) {
    return request(`/receivable/noReconciliation/listPageExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}