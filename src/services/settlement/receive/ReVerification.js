import { request, METHOD } from '@/utils/request'

// 待分页列表
export function GetList(params) {
    return request(`/shouldCollection/list.action`, METHOD.POST, params)
}
// 已分页列表
export function GetListOff(params) {
    return request(`/shouldCollection/listWrittenOff.action`, METHOD.POST, params)
}

// 详情列表
export function GetDetails(params) {
    return request(`/shouldCollection/listDetail.action`, METHOD.POST, params)
}
// 核销
export function UpdateStatus(params) {
    return request(`/shouldCollection/updateStatus.action`, METHOD.GET, params)
}
// 核销单据
export function GetUploadFiles(params) {
    return request(`/uploadFile/getUploadList.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
// 导出待核销列表
export function ExportListWait(params) {
    return request(`/shouldCollection/exportWaitingWriteOffList.action`, METHOD.POST, params, { responseType: 'blob' })
}
// 导出核销列表
export function ExportList(params) {
    return request(`/shouldCollection/exportWrittenWriteOffList.action`, METHOD.POST, params, { responseType: 'blob' })
}
// 导出明细
export function ExportDetails(params) {
    return request(`/shouldCollection/exportWriteOffInfoList.action`, METHOD.POST, params, { responseType: 'blob' })
}

//! 获取id
export function getIds(params) {
    return request(`yocylAccount/findRelateData.action`, METHOD.POST, params)
}

//! 获取id
export function getBankFlow(params) {
    return request(`yocylAccount/findByIds.action`, METHOD.POST, params)
}

//! 应收批量核销
export function checkMore1(params) {
    return request(`shouldCollection/updateListStatus.action`, METHOD.GET, params)
}