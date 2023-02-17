import { request, METHOD } from '@/utils/request'

//国际业务报表列表
export function GetList(params) {
    return request(`/report/ReportInternational.action`, METHOD.POST, params)
}
// 供应商
/*export function getPartner(params) {
    return request(`/partner/list.action`, METHOD.GET, params)
}*/
// 导出
export function exportData(params) {
    return request(`/report/exportReportInternational.action`, METHOD.POST, params, { responseType: 'blob'})
}
