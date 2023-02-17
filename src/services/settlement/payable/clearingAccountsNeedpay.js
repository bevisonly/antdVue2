import {request, METHOD} from '@/utils/request'

//! 获取供应商
export function supplier(params) {
  return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}

//! 列表查询
export function search(params) {
  return request(`apInvoice/listPage.action`, METHOD.POST, params)
}

//! 详情
export function details(params) {
  return request(`apInvoiceDetail/apInvoiceDetailListPage.action`, METHOD.POST, params)
}

//! 撤销
export function cancel(params) {
  return request(`apInvoice/revokeAic.action`, METHOD.GET, params)
}

//! 结算
export function settlement(params) {
  return request(`apInvoiceDetail/settlement.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`apInvoice/export.action`, METHOD.POST, params, { responseType: 'blob' })
}

//! 获取文件路径(详情/结算)
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

//! 选项数据字典
export function dataList(params) {
  return request(`dictionary/list.action`, METHOD.GET, params)
}

//! 高级导出
export function exportDataHight(params) {
  return request(`apInvoice/seniorExport.action`, METHOD.GET, params, { responseType: 'blob' })
}

//! 获取id
export function getIds(params) {
  return request(`yocylAccount/findRelateData.action`, METHOD.POST, params)
}

//! 初始结算导入
export function uploadExcel(params) {
  return request(`/apInvoice/importExcel.action`, METHOD.POST, params, { responseType: 'blob' })
}

//! 导出模板
export function templateExcel(params) {
  return request(`/apInvoice/exportTemplate.action`, METHOD.POST, params, { responseType: 'blob' })
}

//! 关联合同
export function contract(params) {
  return request(`contract/list.action`, METHOD.GET, params)
}
//! 国际单结算
export function SettlementForGlobal(params) {
  return request(`/apInvoiceDetail/settlementForGlobal.action`, METHOD.POST, params)
}