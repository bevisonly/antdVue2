import {request, METHOD} from '@/utils/request'

//列表
export function GetList(params) {
  return request(`/arInvoice/collected/listPage.action`, METHOD.POST, params)
}
//获取关联流水的id
export function FindRelateDataAr(params) {
  return request(`/yocylAccount/findRelateData.action`, METHOD.POST, params)
}
//获取关联流水列表
export function FindRelateDataById(params) {
  return request(`/yocylAccount/findByIds.action`, METHOD.POST, params)
}
//已结算单撤销
export function RevokeSettlement(params) {
  return request(`/arInvoice/collected/revokeSettlement.action`, METHOD.GET, params)
}
//应收的列表导出
export function ExportCollectedList(params) {
    return request(`/arInvoice/collected/export.action`, METHOD.POST, params,{ responseType: 'blob' })
}