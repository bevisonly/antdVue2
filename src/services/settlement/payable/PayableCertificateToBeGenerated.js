import { request, METHOD } from '@/utils/request'

// 待生成凭证分页列表
export function getList(params) {
    return request(`/payable/reconciled/signed/listSignedPage.action`, METHOD.GET, params)
}
// 供应商
export function getPartner(params) {
    return request(`/partner/list.action`, METHOD.GET, params)
}
// 生成凭证
export function GenerateCredentials(params) {
    return request(`/payable/reconciled/signed/signed.action`, METHOD.POST, params)
}
// 作废
export function InvalidOrder(params) {
    return request(`/payable/reconciled/signed/canceling.action`, METHOD.POST, params)
}
// 详情
export function GetDetails(params) {
    return request(`/payable/reconciled/signed/listSignedPageDetails.action`, METHOD.POST, params)
}
//应付的列表导出
export function exportData(params) {
    return request(`/payable/reconciled/signed/exportListSignedPage.action`, METHOD.POST, params,{ responseType: 'blob' })
}