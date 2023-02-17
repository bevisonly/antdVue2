import { request, METHOD } from '@/utils/request'

//! 应收-已对账运营商主体查询
export const getOperatorList = params => {
  return request('opSubject/listByOp.action', METHOD.GET, params)
}
//! 应收-已对账列表
export const getPageList = params => {
  return request(
    'receivable/reconciliated/listPage.action',
    METHOD.POST,
    params
  )
}
//! 应收-已对账列表详情查询
export const getListDetail = params => {
  return request(
    'receivable/noReconciliation/listDetailPage.action',
    METHOD.POST,
    params
  )
}
//! 应收-已对账生成结算单
export const createSettlement = params => {
  return request('arInvoice/custCreateSettlement.action', METHOD.POST, params)
}
//! 应收-已对账撤销单号
export const orderUndo = params => {
  return request(
    'receivable/reconciliated/orderUndo.action',
    METHOD.POST,
    params
  )
}
//! 应收-已结账导出
export const exportData = params => {
  return request(
    `receivable/reconciliated/export.action`,
    METHOD.POST,
    params,
    {
      responseType: 'blob'
    }
  )
}
//! 获取文件路径(单据图片)
export function getImgURL(params) {
  return request(`uploadFile/getUploadList.action`, METHOD.GET, params, {
    'Content-Type': 'multipart/form-data'
  })
}
