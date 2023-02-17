import {request, METHOD} from '@/utils/request'

//! 租户--运营主体
export function opSubjectList(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 导出
export async function exportIsFinished(params) {
  return request(`itemTransaction/inStore/listPageExport.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 供应商下拉框
export function partnerListPartnerByKey(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 查询
export function itemTransactionInStoreLlistPage(params) {
  return request(`itemTransaction/inStore/listPage.action`, METHOD.POST, params)
}

//! 打印供货单
export function printSupplierOrder(params) {
  return request(`itemTransaction/print/supplyGoods.action`, METHOD.GET, params)
}

//! 打印入库单
export function printInStockOrder(params) {
  return request(`itemTransaction/print/inStock.action`, METHOD.GET, params)
}

//! 入库类型
export function transType(params) {
  return request(`dictionary/list.action`, METHOD.GET, params)
}

//! 仓库
export function getWarehouse(params) {
  return request(`dataPermission/warehousePermissionList.action`, METHOD.GET, params)
}