import { request, METHOD } from '@/utils/request'

//待提货单列表
// export function pickUpOrderList(params) {
//     return request(`/pickUpOrder/listPage.action`, METHOD.POST, params)
// }
//待提货单列表
export function pickUpOrderList(params) {
    return request(`/pickUpOrder/listPagePurchaseOrderHead.action`, METHOD.POST, params)
}
//待提货单列表作废
export function pickUpOrderDel(params) {
    return request(`/purchaseOrderHead/toAbolish.action`, METHOD.GET, params)
}
//待提货单列表查询单条详情打印
export function pickUpOrderSingle(params) {
    return request(`/pickUpOrder/listPageForDetail.action`, METHOD.POST, params)
}
//待提货单列表按客户和商品分类列表
export function getPoDetailsForGroup(params) {
    return request(`/pickUpOrder/getPoDetailsForGroup.action`, METHOD.POST, params)
}
//待提货单列表计价单位
export function dictionary(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//待提货单列表费用类别
export function getFeeList(params) {
    return request(`/billing/purchaseFees/getAllByType.action`, METHOD.POST, params)
}
//待提货单国际订单详情
export function getOrderDetail(params) {
    return request(`/pickUpOrder/globalOrderDetail.action`, METHOD.GET, params)
}
//待提货单普通订单详情
export function getOrderDetailNormal(params) {
    return request(`/pickUpOrder/details.action`, METHOD.GET, params)
}
//! 仓库列表
export function GetWarehouseData(params) {
    return request(`dataPermission/warehouseListByUserOrg.action`, METHOD.GET, params)
}
//币种
export function GetCurrencyList(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//待提货单收货录入
export function pickUpOrder(params) {
    return request(`/pickUpOrder/pickUp.action`, METHOD.POST, params)
}
//已收货保存
export function received(params) {
    return request(`pickUpOrderEnd/pickUp.action`, METHOD.POST, params)
}
//! 关联合同
export function contract(params) {
    return request(`contract/list.action`, METHOD.GET, params)
}


