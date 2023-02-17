import {request, METHOD} from '@/utils/request'

//! 获取供应商/代理公司
export function supplier(params) {
  return request(`partner/list.action`, METHOD.GET, params)
}

//! 查询
export function search(params) {
  return request(`pickUpOrderEnd/listPage.action`, METHOD.GET, params)
}

//! 详情
export function details(params) {
  return request(`pickUpOrder/details.action`, METHOD.GET, params)
}

//! 编辑
export function saveEdit(params) {
  return request(`pickUpOrderEnd/pickUp.action`, METHOD.POST, params)
}

//! 作废
export function cancel(params) {
  return request(`pickUpOrderEnd/toAbolish.action`, METHOD.GET, params)
}

//! 打印
export function batchPrint(params) {
  return request(`purchaseOrderHead/poHeadPrint.action`, METHOD.GET, params)
}

//! 获取文件路径(详情/编辑)
export function getImgURL(params) {
  return request(`uploadFile/getUploadList.action`, METHOD.GET, params, {'Content-Type': 'multipart/form-data'})
}

//! 上传获得记录
export function transferFile(params) {
  return request(`uploadFile/doUpload.action`, METHOD.POST, params)
}

//! 上传保存文件
export function saveFile(params) {
  return request(`uploadFile/addUploadUrl.action`, METHOD.POST, params)
}

//! 删除文件列表
export function deleteFile(params) {
  return request(`uploadFile/doDeleteFile.action`, METHOD.POST, params, {'Content-Type': 'multipart/form-data'})
}

//! 收货信息
export function receiveMsg(params) {
  return request(`billing/purchaseFees/getAllByType.action`, METHOD.POST, params)
}

//! 计价单位
export async function unit(params) {
  return request(`dictionary/list.action`, METHOD.GET, params)
}

//! 包装
export async function getPackage(params) {
  return request(`component/package.action`, METHOD.POST, params)
}

//! 仓库
export function getWarehouse(params) {
  return request(`dataPermission/warehouseListByUserOrg.action`, METHOD.GET, params)
}

//! 关联合同
export function contract(params) {
  return request(`contract/list.action`, METHOD.GET, params)
}