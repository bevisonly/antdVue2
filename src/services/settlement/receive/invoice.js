import {request, METHOD} from '@/utils/request'

//列表
export function GetList(params) {
  return request(`/arReceipt/receiptApplyListPage.action`, METHOD.POST, params)
}
//申请发票获取基础数据
export function GetInvoiceInfo(params) {
  return request(`/arInvoice/waitSettlement/invoiceInfo.action`, METHOD.GET, params)
}
//申请发票新增/编辑
export function ApplyInvoice(params) {
  return request(`/arInvoice/waitSettlement/applyInvoice.action`, METHOD.POST, params)
}
//结算单申请发票信息
export function ReceiptByApInvoiceId(params) {
  return request(`/arReceipt/receiptByApInvoiceId.action`, METHOD.GET, params)
}
//结算单发票申请撤回
export function DeleteApply(params) {
  return request(`/arInvoice/waitSettlement/deleteApply.action`, METHOD.POST, params)
}
//发票详情
export function ViewReceiptApply(params) {
  return request(`/arReceipt/viewReceiptApply.action`, METHOD.POST, params)
}
//开立发票提交/批量
export function ArInvoiceRegister(params) {
  return request(`/arReceipt/invoiceRegister.action`, METHOD.POST, params)
}
//发票领取
export function ArCollectReceipt(params) {
  return request(`/arReceipt/collectReceipt.action`, METHOD.GET, params)
}
//发票撤回
export function ArInvoiceRevoke(params) {
  return request(`/arReceipt/invoiceRevoke.action`, METHOD.GET, params)
}
//待结算发票撤回到领取状态
export function ArInvoiceCollectRevoke(params) {
  return request(`/arReceipt/invoiceCollectRevoke.action`, METHOD.GET, params)
}
//应收的列表导出
export function exportData(params) {
    return request(`/arReceipt/export.action`, METHOD.POST, params,{ responseType: 'blob' })
}