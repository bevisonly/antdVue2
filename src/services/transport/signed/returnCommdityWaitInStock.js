import {request, METHOD} from '@/utils/request'

//! 退货待入库列表 查询按钮
export function searchInfo(params) {
  return request(`/returned/waitInListPage.action`, METHOD.POST, params)
}

//! 获取供应商，门店，客户
export function partnerName(params) {
  return request(`/partner/listByCondition.action`, METHOD.GET, params)
}

//! 转退供应商
export function returnSupplier(params) {
  return request(`/returned/returnSupplier.action`, METHOD.POST, params)
}

//! 退货确认
export function obsoleteInbound(params) {
  return request(`/returned/obsoleteInbound.action`, METHOD.POST, params)
}

//! 查看订单 详情
export function waitInDetail(params) {
  return request(`/returned/waitInDetail.action`, METHOD.POST, params)
}

//! 获取入库详情
export function inStockDetails(params) {
  return request(`/returned/obsoleteInboundDetail.action`, METHOD.POST, params)
}

//! 退货确认
export function returnConfirm(params) {
  return request(`/returned/obsoleteInbound.action`, METHOD.POST, params)
}

//! 入库仓库
export function getWarehouse(params) {
  return request(`/warehouse/listWarehouses.action`, METHOD.GET, params)
}

//! 单位
export function unitList(params) {
  return request(`/dictionary/list.action`, METHOD.GET, params)
}

//! 商品
export function getCommodity(params) {
  return request(`/component/getItems.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`/returned/exportReturnList.action`, METHOD.POST, params, {responseType: 'blob'})
}