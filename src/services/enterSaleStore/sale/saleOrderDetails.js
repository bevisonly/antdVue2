import {request, METHOD} from '@/utils/request'

//! 客户
export function supplier(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 运营主体
export function opMain(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 订单状态
export function orderState(params) {
  return request(`orderDetail/getOrderStateList.action`, METHOD.GET, params)
}

//! 订单类型
export function orderType(params) {
  return request(`orderDetail/getOrderTypeList.action`, METHOD.GET, params)
}

//! 查询
export function search(params) {
  return request(`orderDetail/listPage.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`orderDetail/export.action`, METHOD.POST, params, {responseType: 'blob'})
}