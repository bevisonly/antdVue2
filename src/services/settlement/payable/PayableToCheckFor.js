import { request, METHOD } from '@/utils/request'

// 分页列表
export function GetList(params) {
    return request(`/payable/noReconciled//listPage.action`, METHOD.GET, params)
}

// 对账详情
export function GetDetails(params) {
    return request(`/payable/noReconciled/loadDetailListPage.action`, METHOD.GET, params)
}
// 对账确认
export function ReconciliateConfirm(params) {
    return request(`/payable/noReconciled/reconciliateConfirm.action`, METHOD.POST, params)
}
// 批量对账确认
export function ReconciliateListConfirm(params) {
    return request(`/payable/noReconciled/batchReconciliate.action`, METHOD.POST, params)
}
//应收的列表导出
export function exportData(params) {
    return request(`/payable/noReconciled/listPageExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}
// 费用批量对账确认
export function ReconciliateFeeConfirm(params) {
    return request(`/payable/noReconciled/reconciliateFeeConfirm.action`, METHOD.POST, params)
}
// 费用编辑
export function PayableUpdateFee(params) {
    return request(`/payable/noReconciled/updateFee.action`, METHOD.POST, params)
}
// 费用撤回
export function ReconciliateFeeUndo(params) {
    return request(`/payable/noReconciled/reconciliateFeeUndo.action`, METHOD.POST, params)
}
// 单据撤回
export function OrderRecall(params) {
    return request(`/payable/reconciled/undo.action`, METHOD.POST, params)
}