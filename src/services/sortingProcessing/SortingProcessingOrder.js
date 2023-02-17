import { request, METHOD } from '@/utils/request'
// 分拣加工订单------列表
export function GetList(params) {
    return request(`/sortingprocessing/getPageList.action`, METHOD.POST, params)
}
// 分拣单------加工品选择
export function GetItems(params) {
    return request(`/sortingprocessing/getBomHeadList.action`, METHOD.POST, params)
}
// 分拣单------退料报损选择
export function GetBomItems(params) {
    return request(`/sortingprocessing/getPickDetails.action`, METHOD.POST, params)
    // return request(`/sortingprocessing/getBomDetails.action`, METHOD.POST, params)
}
// 分拣单新增------
export function InsertItems(params) {
    return request(`/sortingprocessing/insert.action`, METHOD.POST, params)
}
// 分拣单编辑------
export function EditItems(params) {
    return request(`/sortingprocessing/update.action`, METHOD.POST, params)
}
// 完工入库已完成订单编辑------
export function CompleteItems(params) {
    return request(`/sortingprocessing/complete.action`, METHOD.POST, params)
}
// 分拣单删除------
export function DelItems(params) {
    return request(`/sortingprocessing/delete.action`, METHOD.GET, params)
}
// 分拣单详情------
export function GetSingleItems(params) {
    return request(`/sortingprocessing/getSingle.action`, METHOD.GET, params)
}
//数据字典单位
export function GetUnits(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//工人数据
export function GetWorkers(params) {
    return request(`/worker/getWorkerList.action`, METHOD.GET,params)
}
//产出比率报表
export function GetOutputRatio(params) {
    return request(`/sortingprocessing/getPageDetails.action`, METHOD.POST,params)
}
//产出比率报表导出
export function OutputRatioExport(params) {
    return request(`/sortingprocessing/detailsExport.action`,METHOD.POST, params,{ responseType: 'blob' })
}
