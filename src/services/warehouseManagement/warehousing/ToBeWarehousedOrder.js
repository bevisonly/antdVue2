import { request, METHOD } from '@/utils/request'

// 待入库分页列表
export function GetList(params) {
    return request(`/imItemHead/listNoImPage.action`, METHOD.GET, params)
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
    return request(`/component/getItems.action`, METHOD.POST, params)
}
//新增
export function InsertNoImItem(params) {
    return request(`/imItemHead/insertNoImItem.action`, METHOD.POST, params)
}
//入库
export function WarehousingConfirm(params) {
    return request(`imItemHead/inv.action`, METHOD.POST, params)
}
//退货入库
export function ReWarehousingConfirm(params) {
    return request(`imItemHead/inv.action`, METHOD.POST, params)
}
//删除入库单
export function DelOrder(params) {
    return request(`/imItemHead/update.action`, METHOD.GET, params)
}
export function GetWarehouse(params) {
    return request(`/warehouse/listWarehouses.action`, METHOD.GET, params)
}
export function GetOrderType(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//待入库的列表导出
export function exportData(params) {
    return request(`/imItemHead/listNoImPageExport.action`, METHOD.POST, params,{ responseType: 'blob' })
}