import {request, METHOD} from '@/utils/request'

//!bom-新增
export function bomInsert(params) {
  return request(`/bom/insert.action`, METHOD.POST, params)
}

//!bom-更新
export function bomUpdate(params) {
  return request(`/bom/update.action`, METHOD.POST, params)
}

//!bom-删除
export function bomDelete(params) {
  return request(`/bom/delete.action`, METHOD.GET, params)
}

//!bom-获取详情
export function bomGetSingle(params) {
  return request(`/bom/getSingle.action`, METHOD.GET, params)
}

//!bom-分页列表
export function bomGetPageList(params) {
  return request(`/bom/getPageList.action`, METHOD.POST, params)
}

//!商品名称
export function commodityName(params) {
  return request(`/component/getItemsNomal.action`, METHOD.POST, params)
}

//!单位
export function UnitList(params) {
  return request(`/dictionary/list.action`, METHOD.GET, params)
}