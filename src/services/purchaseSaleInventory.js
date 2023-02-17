import { request, METHOD } from '@/utils/request'

//采购列表
export function purchaseOrderHeadGetListPage(params) {
    return request(`/purchaseOrderHead/getListPage.action`, METHOD.POST, params)
}

//详情
export function purchaseOrderHeadGetSingle(params) {
    return request(`/purchaseOrderHead/getSingle.action`, METHOD.GET, params)
}

//仓库下拉
export function wareHouseList(params) {
    return request(`/warehouse/list.action`, METHOD.GET, params)
}

//! 仓库(有权限的)
export function getWarehouse2(params) {
    return request(`dataPermission/warehouseListByUserOrg.action`, METHOD.GET, params)
}
//新增采购单，商品选择列表
export function componentGetItemList(params) {
    return request(`/component/getItemList.action`, METHOD.POST, params)
}
//资金申请
export function fundsapproveInsert(params) {
    return request(`/fundsapprove/insert.action`, METHOD.GET, params)
}
//获取商品包装列表
export function itemPackRefGetListByItemId(params) {
    return request(`/itemPackRef/getListByItemId.action`, METHOD.GET, params)
}
//包装下拉
export function packList(params) {
    return request(`/pack/list.action`, METHOD.GET, params)
}
//单位
export function dictionaryList(params) {
    return request(`/dictionary/list.action`, METHOD.GET, params)
}
//新增采购单
export function purchaseOrderHeadInsertPo(params) {
    return request(`/purchaseOrderHead/insertPo.action`, METHOD.POST, params)
}

//修改国际采购单
export function purchaseOrderHeadUpdatePo(params) {
    return request(`/purchaseGlobalOrder/updatePo.action`, METHOD.POST, params)
}
//修改订单
export function updatePurchaseOrderHead(params) {
    return request(`/purchaseOrderHead/updatePurchaseOrderHead.action`, METHOD.POST, params)
}


//确认订单
export function purchaseOrderHeadToConfirm(params) {
    return request(`/purchaseOrderHead/toConfirm.action`, METHOD.GET, params)
}
//作废
export function purchaseOrderHeadToAbolish(params) {
    return request(`/purchaseOrderHead/toAbolish.action`, METHOD.GET, params)
}
//费用下拉
export function billingPurchaseFeesGetAllByType(params) {
    return request(`/billing/purchaseFees/getAllByType.action`, METHOD.POST, params)
}
//新增国际订单
export function purchaseGlobalOrderInsertPo(params) {
    return request(`/purchaseGlobalOrder/insertPo.action`, METHOD.POST, params)
}
//商品关键参数下拉框数据
export function itemDictionaryInfoList(params) {
    return request(`/dictionary/listByPage.action`, METHOD.POST, params)
}
//导入订单
export function purchaseGlobalOrderImportExcel(params) {
    return request(`/purchaseGlobalOrder/importExcel.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
//导出订单
export function purchaseGlobalOrderExport(params) {
    return request(`/purchaseGlobalOrder/export.action`, METHOD.GET, params, { responseType: 'blob' })
}
//国际单获取单条商品的规格
export function GetSpecList(params) {
    return request(`/itemSpec/getSpecList.action`, METHOD.GET, params)
}
//上传文件
export function importExcel(params) {
    return request(`/purchaseOrderHead/importExcel.action`, METHOD.POST, params, { responseType: 'blob' })
}
//下载模板
export function exportTemplate(params) {
    return request(`/purchaseOrderHead/exportTemplate.action`, METHOD.GET, params, { responseType: 'blob' })
}
//采购订单明细导出
export function PurchaseDetailExport(params) {
    return request(`/purchaseOrderDetail/export.action`, METHOD.GET, params, { responseType: 'blob' })
}
//采购订单明细列表
export function GetDetailsList(params) {
    return request(`/purchaseOrderDetail/listPage.action`, METHOD.POST, params)
}
//获取未确认订单的id
export function GetNoConfirmIds(params) {
    return request(`/purchaseOrderHead/getNoConfirmIds.action`, METHOD.GET, params)
}
//获取采购员
export function getBuyer(params) {
    return request(`/userPartnerRef/selectBuyer.action`, METHOD.GET, params)
}
//! 关联合同
export function contract(params) {
    return request(`contract/list.action`, METHOD.GET, params)
}