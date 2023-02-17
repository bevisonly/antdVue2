import { request, METHOD } from '@/utils/request'

// 已出库分页列表
export function GetList(params) {
    return request(`/imItemHead/listDeliveryImPage.action`, METHOD.POST, params)
}
//详情
export function GetDetails(params) {
    return request(`imItemHead/infoStorage.action`, METHOD.GET, params)
}
//数据字典单位
export function GetUnits(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//新增的商品
export function GetItems(params) {
    return request(`/component/getInventoryList.action`, METHOD.GET, params)
}
//新增
export function InsertNoImItem(params) {
    return request(`/imItemHead/insertImItem.action`, METHOD.POST, params)
}
//出库确认
export function WarehousingConfirm(params) {
    return request(`/imItemHead/outInv.action`, METHOD.POST, params)
}

export function GetWarehouse(params) {
    return request(`/warehouse/listWarehouses.action`, METHOD.GET, params)
}
export function GetOrderType(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//出库的列表导出
export function exportData(params) {
    return request(`/imItemHead/listNoDeliveryExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}
//已出库
export function ExportData(params) {
    return request(`/imItemHead/listDeliveryExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}