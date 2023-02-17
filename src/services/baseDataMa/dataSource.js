import {request, METHOD} from '@/utils/request'

//! 增
export function add(params) {
  return request(`dictionary/addDictionary.action`, METHOD.POST, params)
}

//! 删
export function abolish(params) {
  return request(`dictionary/deleteDictionary.action`, METHOD.GET, params)
}

//! 改
export function update(params) {
  return request(`dictionary/updateDictionary.action`, METHOD.POST, params)
}

//! 查
export function search(params) {
  return request(`dictionary/listByPage.action`, METHOD.POST, params)
}