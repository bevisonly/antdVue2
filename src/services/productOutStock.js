import {request, METHOD} from '@/utils/request'

//! 租户--运营主体
export function opSubjectList(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 导出
export async function exportIsFinished(params) {
  return request(`/itemTransaction/exportList.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 客户
export function partnerListPartnerByKey(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 查询
export function itemTransactionOutStoreListPage(params) {
  return request(`itemTransaction/outStore/listPage.action`, METHOD.POST, params)
}

//! 出库类型
export function transType(params) {
  return request(`dictionary/list.action`, METHOD.GET, params)
}

//! 仓库
export function getWarehouse(params) {
  return request(`dataPermission/warehousePermissionList.action`, METHOD.GET, params)
}
//月加权平均
export function Calculate(params) {
  return request(`api/deliver/calculate`, METHOD.GET, params)
}