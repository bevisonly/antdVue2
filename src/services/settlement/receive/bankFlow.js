import {request, METHOD} from '@/utils/request'

//! 下拉框
export function selectOption(params) {
  return request(`yocylAccount/findDropDownBox.action`, METHOD.GET, params)
}

//! 查询
export function search(params) {
  return request(`yocylAccount/findList.action`, METHOD.POST, params)
}

//! 导出
export function exportList(params) {
  return request(`yocylAccount/exportList.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 下载模板
export function exportTemplate(params) {
  return request(`yocylAccount/exportTemplate.action`, METHOD.GET, params, {responseType: 'blob'})
}

//! 上传流水
export function uploadExcel(params) {
  return request(`yocylAccount/importBatchExcel.action`, METHOD.POST, params, {'Content-Type': 'multipart/form-data', responseType: 'blob'})
}

//! 删除
export function clear(params) {
  return request(`yocylAccount/deleteById.action`, METHOD.GET, params)
}

//! 同步流水
export function syncFlow(params) {
  return request(`api/yocylAccount/synYocylAccountDataManipulating`, METHOD.POST, params)
}