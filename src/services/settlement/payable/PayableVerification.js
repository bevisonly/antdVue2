import { request, METHOD } from '@/utils/request'

// 费用
export function GetFeeList(params) {
    return request(`/shouldPay/getPurchaseFeeList.action`, METHOD.GET, params)
}
// 待分页列表
export function GetList(params) {
    return request(`/shouldPay/listPage.action`, METHOD.POST, params)
}
// 已分页列表
export function GetListOff(params) {
    return request(`/shouldPay/listPageWrittenOff.action`, METHOD.POST, params)
}

// 详情列表
export function GetDetails(params) {
    return request(`/shouldPay/listDetail.action`, METHOD.POST, params)
}
// 核销
export function UpdateStatus(params) {
    return request(`/shouldPay/updateStatus.action`, METHOD.GET, params)
}
// 核销单据
export function GetUploadFiles(params) {
    return request(`/uploadFile/getUploadList.action`, METHOD.POST, params,{ 'Content-Type': 'multipart/form-data', })
}
// 导出待核销列表
export function ExportListWait(params) {
    return request(`/shouldPay/exportWaitingWriteOffList.action`, METHOD.POST, params, { responseType: 'blob' })
}
// 导出核销列表
export function ExportList(params) {
    return request(`/shouldPay/exportWrittenWriteOffList.action`, METHOD.POST, params, { responseType: 'blob' })
}
// 导出明细
export function ExportDetails(params) {
    return request(`/shouldPay/exportWriteOffInfoList.action`, METHOD.GET, params, { responseType: 'blob' })
}
//! 获取id
export function getIds(params) {
    return request(`yocylAccount/findRelateData.action`, METHOD.POST, params)
}
//! 获取银行流水
export function getBankFlow(params) {
    return request(`yocylAccount/findByIds.action`, METHOD.POST, params)
}
//! 应付批量核销
export function checkMore2(params) {
    return request(`shouldPay/updateListStatus.action`, METHOD.GET, params)
}
//! 应付详情发票信息
export function ListByApInvoiceId(params) {
    return request(`/apReceipt/listByApInvoiceId.action`, METHOD.GET, params)
}
//! 应付详情发票通过
export function AuditPassReceipt(params) {
    return request(`/apReceipt/auditPassReceipt.action`, METHOD.POST, params)
}
//! 应付详情发票退回
export function AuditFailReceipt(params) {
    return request(`/apReceipt/auditFailReceipt.action`, METHOD.POST, params)
}