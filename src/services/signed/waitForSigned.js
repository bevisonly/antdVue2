import { request, METHOD } from '@/utils/request'
//! 获取供应商
export function supplier(params) {
    return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}
// 待签收列表客户名称
export function getPartner(params) {
    return request(`/partner/listByCondition.action`, METHOD.GET, params)
}
// 待签收列表客户门店
export function getStore(params) {
    return request(`/partner/list.action`, METHOD.GET, params)
}
// 待签收列表运营主体
export function getOpSubject(params) {
    return request(`/opSubject/list.action`, METHOD.GET, params)
}
//待签收的列表接口
export function getListData(params) {
    return request(`/waitForSigned/listPage.action`, METHOD.POST, params)
}
//待签收的列表订单详情
export function getDetails(params) {
    return request(`/waitForSigned/viewOrder.action`, METHOD.GET, params)
}
//待签收的列表签收详情
export function getSignedDetails(params) {
    return request(`/waitForSigned/signedOrder.action`, METHOD.GET, params)
}
//待签收的列表单据删除
export function deleteImg(params) {
    return request(`/uploadFile/doDeleteFile.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
//待签收的列表库存单校验
export function checkLockInventoryOrder(params) {
    return request(`/waitForSigned/checkLockInventoryOrder.action`, METHOD.POST, params)
}
//待签收的列表签收确认
export function signedConfirm(params) {
    return request(`/waitForSigned/signedSoOrder.action`, METHOD.POST, params)
}
//待签收的列表导出
export function exportData(params) {
    return request(`/waitForSigned/export.action`, METHOD.POST, params,{ responseType: 'blob' })
}
//,{ responseType: 'blob' }