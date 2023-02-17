import { request, METHOD } from '@/utils/request'

// 已生成凭证分页列表
export function getList(params) {
    return request(`/payable/reconciled/signed/listSigned.action`, METHOD.GET, params)
}
// 供应商
export function getPartner(params) {
    return request(`/partner/list.action`, METHOD.GET, params)
}
// 还原
export function InvalidOrder(params) {
    return request(`/payable/reconciled/signed/recover.action`, METHOD.POST, params)
}
// 详情
export function GetDetails(params) {
    return request(`/payable/reconciled/signed/listSignedPageDetails.action`, METHOD.POST, params)
}
//应付的列表导出
export function exportData(params) {
    return request(`/payable/reconciled/signed/exportListSigned.action`, METHOD.POST, params,{ responseType: 'blob' })
}