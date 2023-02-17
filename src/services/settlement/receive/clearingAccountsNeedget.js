import {request, METHOD} from '@/utils/request'
//! 获取供应商，门店，客户
export function customerStore(params) {
  return request(`partner/listByCondition.action`, METHOD.GET, params)
}

//! 运营主体
export function organization(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 分页查询
export function search(params) {
  return request(`arInvoice/waitSettlement/listPage.action`, METHOD.POST, params)
}

//! 详情--列表查询
export function details(params) {
  return request(`arInvoice/settlement/listDetailPage.action`, METHOD.POST, params)
}

//! 收款确认--全部收款确认
export function allConfirmGetMoney(params) {
  return request(`arInvoice/waitSettlement/collectConfirm.action`, METHOD.POST, params)
}

//! 收款确认--部分收款确认
export function partConfirmGetMoney(params) {
  return request(`arInvoice/waitSettlement/collectPortionConfirm.action`, METHOD.POST, params)
}

//! 撤销
export function cancel(params) {
  return request(`arInvoice/waitSettlement/undoSettlement.action`, METHOD.GET, params)
}

//! 开票--全部开票确认
export function ticketAllConfirm(params) {
  return request(`arInvoice/waitSettlement/saveInvoice.action`, METHOD.POST, params)
}

//! 开票--部分开票确认
export function ticketPartConfirm(params) {
  return request(`arInvoice/waitSettlement/saveInvoicePortion.action`, METHOD.POST, params)
}

//! 导出
export function exportData(params) {
  return request(`arInvoice/export.action`, METHOD.POST, params, {responseType: 'blob'})
}

//! 红冲
export function redGo(params) {
  return request(`arInvoice/waitSettlement/reverseInvoice.action`, METHOD.GET, params)
}

//! 开票/蓝补列表
export function blueAddOrTicket(params) {
  return request(`arInvoice/waitSettlement/listInvoicePage.action`, METHOD.POST, params)
}

//! 批量打印
export function batchPrint(params) {
  return request(`arInvoice/waitSettlement/invoicePrint.action`, METHOD.GET, params)
}

//! 获取文件路径(详情/开票/收款确认/蓝补)
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
  return request(`arInvoice/seniorExport.action`, METHOD.GET, params, {responseType: 'blob'})
}

//! 打印结算单
export function saleOrderPrint(params) {
  return request(`arInvoice/seniorPrint.action`, METHOD.GET, params)
}

//! 获取id
export function getIds(params) {
  return request(`yocylAccount/findRelateData.action`, METHOD.POST, params)
}

//! 导出模板
export function templateExcel(params) {
  return request(`arInvoice/exportTemplate.action`, METHOD.GET, params, {responseType: 'blob'})
}

//! 初始结算单导入
export function uploadExcel(params) {
  return request(`arInvoice/importArInvoice.action`, METHOD.POST, params, {responseType: 'blob', 'Content-Type': 'multipart/form-data'
  })
}

//! 关联合同
export function contract(params) {
  return request(`contract/list.action`, METHOD.GET, params)
}