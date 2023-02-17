import {request, METHOD} from '@/utils/request'
//! 查询
export function search(params) {
  return request(`purchaseOrderDetail/listPageEnd.action`, METHOD.GET, params)
}

//! 导出
export function exportData(params) {
  return request(`purchaseOrderDetail/listPageExport.action`, METHOD.GET, params, {responseType: 'blob'})
}

//! 获取供应商
export function supplier(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 仓库
export function getWarehouse(params) {
  return request(`dataPermission/warehousePermissionList.action`, METHOD.GET, params)
}
//主体
export function GetOpList(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}
//商品一级分类
export function GetPrimaryClassification(params) {
  return request(`/itemType/getPrimaryClassification.action`, METHOD.GET, params)
}