import { request, METHOD } from '@/utils/request'

// 分页列表
export function GetList(params) {
    return request(`/itemSpec/listPage.action`, METHOD.GET, params)
}
// 明细分页列表
export function GetListChild(params) {
    return request(`/itemSpecChild/listPage.action`, METHOD.POST, params)
}
// 删除
export function SpecDelete(params) {
    return request(`/itemSpec/delete.action`, METHOD.GET, params)
}
// 子规格删除
export function SpecChildDelete(params) {
    return request(`/itemSpecChild/delete.action`, METHOD.GET, params)
}
// 数据字典
export function GetDictionary(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
// 新增
export function SpecInsert(params) {
    return request(`/itemSpec/insert.action`, METHOD.POST, params)
}
// 子规格新增
export function SpecChildInsert(params) {
    return request(`/itemSpecChild/insert.action`, METHOD.POST, params)
}
// 编辑
export function SpecUpdate(params) {
    return request(`/itemSpec/update.action`, METHOD.POST, params)
}
// 子规格编辑
export function SpecChildUpdate(params) {
    return request(`/itemSpecChild/update.action`, METHOD.POST, params)
}

// 对账详情
export function GetDetails(params) {
    return request(`/payable/noReconciled/loadDetailListPage.action`, METHOD.GET, params)
}
// 对账确认
export function ReconciliateConfirm(params) {
    return request(`/payable/noReconciled/reconciliateConfirm.action`, METHOD.POST, params)
}
// 批量对账确认
export function ReconciliateListConfirm(params) {
    return request(`/payable/noReconciled/batchReconciliate.action`, METHOD.POST, params)
}
