import { request, METHOD } from '@/utils/request'

// 待加工订单------主体
export function GetTenant(params) {
    return request(`/opSubject/list.action`, METHOD.GET, params)
}
// 待加工订单------列表
export function GetList(params) {
    return request(`/spProcessOrder/waitProcessOrderList.action`, METHOD.POST, params)
}
// 已加工订单------列表
export function GetListComplete(params) {
    return request(`/spProcessOrder/processOrderList.action`, METHOD.POST, params)
}
// 待加工订单------生成加工单
export function CreateProcessOrder(params) {
    return request(`/spProcessOrder/createProcessOrder.action`, METHOD.POST, params)
}
// 待加工订单------作废订单列表
export function CancelProcessOrderList(params) {
    return request(`/spProcessOrder/cancelProcessOrderList.action`, METHOD.POST, params)
}
// 待加工订单------作废订单
export function CancelProcess(params) {
    return request(`/spProcessOrder/cancelProcess.action`, METHOD.POST, params)
}
// 待加工订单------还原订单
export function ResetProcessOrder(params) {
    return request(`/spProcessOrder/resetProcessOrder.action`, METHOD.POST, params)
}