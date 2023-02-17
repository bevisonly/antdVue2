import { request, METHOD } from '@/utils/request'

// 待入库分页列表
export function GetList(params) {
    return request(`/imItemHead/listImPage.action`, METHOD.GET, params)
}
//详情
export function GetDetails(params) {
    return request(`imItemHead/infoStorage.action`, METHOD.GET, params)
}
//数据字典单位
export function GetUnits(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
export function GetWarehouse(params) {
    return request(`/warehouse/listWarehouses.action`, METHOD.GET, params)
}
export function GetOrderType(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//待入库的列表导出
export function exportData(params) {
    return request(`/imItemHead/listImPageExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}