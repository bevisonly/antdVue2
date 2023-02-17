import {request, METHOD} from '@/utils/request'

//! 租户--运营主体
export function opSubjectList(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 分页
export function itemInvLotListPage(params) {
  return request(`itemInvLot/listPage.action`, METHOD.POST, params)
}

//! 导出
export async function itemInvLotExportList(params) {
  return request(`itemInvLot/exportList.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 供应商下拉框
export function partnerListPartnerByKey(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 仓库
export function getWarehouse(params) {
  return request(`dataPermission/warehousePermissionList.action`, METHOD.GET, params)
}