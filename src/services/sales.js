import { request, METHOD } from '@/utils/request'

//采购列表
export function componentGetItems(params) {
    return request(`/component/getItems.action`, METHOD.POST, params)
}

//订单新增
export function orderInsert(params) {
    return request(`/order/insert.action`, METHOD.POST, params)
}
//商品库存列表
export function componentGetInventoryList(params) {
    return request(`/component/getInventoryList.action`, METHOD.GET, params)
}
//上传单据
export function uploadFiledoUpload(params) {
    return request(`/uploadFile/doUpload.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
//订单列表破
export function ordergGetListPage(params) {
    return request(`/order/getListPage.action`, METHOD.POST, params)
}
//采销一体单新增
export function overallOrderInsert(params) {
    return request(`/overallOrder/insert.action`, METHOD.POST, params)
}
//获取详情
export function orderGetsingle(params) {
    return request(`/order/getsingle.action`, METHOD.GET, params)
}
//订单修改
export function orderUpdate(params) {
    return request(`/order/update.action`, METHOD.POST, params)
}
//订单导出
export function orderExport(params) {
    return request(`/order/export.action`, METHOD.POST, params, { responseType: 'blob' })
}
//作废订单
export function orderOperate(params) {
    return request(`/order/operate.action`, METHOD.GET, params)
}
//转采购需求
export function requireOrderInsert(params) {
    return request(`/requireOrder/insert.action`, METHOD.POST, params)
}
//草稿
export function orderInsertTodDraft(params) {
    return request(`/order/insertTodDraft.action`, METHOD.POST, params)
}
//采销一体单修改
export function overallOrderUpdate(params) {
    return request(`/overallOrder/update.action`, METHOD.POST, params)
}
//采销一体单草稿
export function overallOrderInsertDraft(params) {
    return request(`/overallOrder/insertDraft.action`, METHOD.POST, params)
}
//导出
export function importExcel(params) {
    return request(`/order/importExcel.action`, METHOD.POST, params, { responseType: 'blob' })
  }
//下载模板
export function exportTemplate(params) {
    return request(`/order/exportTemplate.action`, METHOD.GET, params, { responseType: 'blob' })
}
//220722采销一体单作废
export function overallOrderInvalid(params) {
    return request(`/overallOrder/invalid.action`, METHOD.GET, params)
}
//! 关联合同
export function contract(params) {
    return request(`contract/list.action`, METHOD.GET, params)
}