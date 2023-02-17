import { request, METHOD } from '@/utils/request'

// 发票管理列表
export function GetList(params) {
    return request(`/apReceipt/invoiceListPage.action`, METHOD.POST, params)
}
// 发票登记
export function ViewInvoiceRegister(params) {
    return request(`/apReceipt/viewInvoiceRegister.action`, METHOD.GET, params)
}
// 发票登记提交
export function InvoiceRegister(params) {
    return request(`/apReceipt/invoiceRegister.action`, METHOD.POST, params)
}
// 发票编辑页面
export function EditAndViewInvoice(params) {
    return request(`/apReceipt/editAndViewInvoice.action`, METHOD.POST, params)
}
// 发票编辑--登记--编辑
export function ViewReceipt(params) {
    return request(`/apReceipt/viewReceipt.action`, METHOD.GET, params)
}
// 发票编辑--登记--编辑保存
export function EditReceipt(params) {
    return request(`/apReceipt/editReceipt.action`, METHOD.POST, params)
}
// 发票编辑--登记--编辑删除
export function DeleteReceipt(params) {
    return request(`/apReceipt/deleteReceipt.action`, METHOD.GET, params)
}
// 发票导出
export function ExportReceipt(params) {
    return request(`/apReceipt/export.action`, METHOD.POST, params,{ responseType: 'blob' })
}
//文件
export function GetUploadList(params) {
    return request(`uploadFile/getUploadList.action`, METHOD.GET, params, {'Content-Type': 'multipart/form-data'})
  }