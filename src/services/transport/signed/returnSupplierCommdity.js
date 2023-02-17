import {request, METHOD} from '@/utils/request'

//! 退供应商商品列表 查询按钮
export function searchInfo(params) {
  return request(`/returned/waitReturnSupplierList.action`, METHOD.POST, params)
}

//! 获取供应商，门店，客户
export function partnerName(params) {
  return request(`/partner/listByCondition.action`, METHOD.GET, params)
}

//! 退供应商查看详情
export function details(params) {
  return request(`/returned/waitReturnSupplierDetail.action`, METHOD.POST, params)
}

//! 退供应商撤销
export function cancel(params) {
  return request(`/returned/cancelReturnSupplier.action`, METHOD.POST, params)
}

//! 退供应商确认
export function confirm(params) {
  return request(`/returned/confirmReturnSupplier.action`, METHOD.POST, params)
}

//! 上传文件获得记录
export function uploadFile(params) {
  return request(`/uploadFile/doUpload.action`, METHOD.POST, params)
}

//! 上传文件
export function uploadFileUrl(params) {
  return request(`/uploadFile/addUploadUrl.action`, METHOD.POST, params,)
}

//! 获取文件列表
export function getUploadFile(params) {
  return request(`/uploadFile/getUploadList.action`, METHOD.POST, params, {'Content-Type': 'multipart/form-data'})
}

//! 删除文件列表
export function deleteUploadFile(params) {
  return request(`/uploadFile/doDeleteFile.action`, METHOD.POST, params, {'Content-Type': 'multipart/form-data'})
}

//! 打印
export function printFile(params) {
  return request(`/returned/printReturnNote.action`, METHOD.POST, params)
}