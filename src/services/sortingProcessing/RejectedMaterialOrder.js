import { request, METHOD } from '@/utils/request'
// 退料单------列表
export function GetList(params) {
    return request(`/pickingOutboundHead/listOutboundPage.action`, METHOD.POST, params)
}
// 退料单------详情
export function GetDetails(params) {
    return request(`/pickingOutboundHead/listOutboundDetail.action`, METHOD.GET, params)
}
// 退料单------删除
export function DelItems(params) {
    return request(`/pickingOutboundHead/delete4State.action`, METHOD.GET, params)
}
// 退料单------导出
export function ExportData(params) {
    return request(`/pickingOutboundHead/listOutboundDetailsExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}
// 退料单------审核
export function AuditItems(params) {
    return request(`/pickingOutboundHead/listOutboundRequired.action`, METHOD.GET, params)
}