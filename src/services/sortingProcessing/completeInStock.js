import {request, METHOD} from '@/utils/request'

//! 仓库列表
export function warehouseList(params) {
  return request(`warehouse/list.action`, METHOD.GET, params)
}

//! 产成品商品
export function doneCommodityName(params) {
  return request(`item/listPage.action`, METHOD.POST, params)
}

//! 分页查询
export function tableList(params) {
  return request(`sortingprocessing/getCompleteOrderList.action`, METHOD.POST, params)
}

//! 详情
export function details(params) {
  return request(`sortingprocessing/getCompleteOrder.action`, METHOD.POST, params)
}