import { request, METHOD } from '@/utils/request'

// 已生成凭证分页列表
export function getList(params) {
    return request(`/receivable/signed/listSigned.action`, METHOD.GET, params)
}
// 还原
export function InvalidOrder(params) {
    return request(`/receivable/signed/recover.action`, METHOD.POST, params)
}
// 详情
export function GetDetails(params) {
    return request(`/receivable/signed/listSignedPageDetails.action`, METHOD.POST, params)
}
//应收的列表导出
export function exportData(params) {
    return request(`/receivable/signed/exportListSigned.action`, METHOD.POST, params,{ responseType: 'blob' })
}