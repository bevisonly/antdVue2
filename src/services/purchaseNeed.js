import {REQUIREORDERLISTPAGE, REQUIREORDERFINDINFO, REQUIREORDERNEWTRANSFERPURCHASE, REQUIREORDERDOTRANSFERPURCHASE, COMPONENTPACKAGE, REQUIREORDERNEWTRANSFERPURCHASESPLIT, REQUIREORDERINVALID, DICTIONARYLIST} from '@/services/api'
import {request, METHOD} from '@/utils/request'

//条件查询
export async function requireOrderListPage(params) {
  return request(REQUIREORDERLISTPAGE, METHOD.POST, params)
}

//详情
export async function requireOrderFindInfo(params) {
  return request(REQUIREORDERFINDINFO, METHOD.GET, params)
}

//详情 新接口
export async function requireOrderNewtransferPurchase(params) {
  return request(REQUIREORDERNEWTRANSFERPURCHASE, METHOD.GET, params)
}

//采购
export async function requireOrderDoTransferPurchase(params) {
  return request(REQUIREORDERDOTRANSFERPURCHASE, METHOD.POST, params)
}

//包装条件查询
export async function componentPackage(params) {
  return request(COMPONENTPACKAGE, METHOD.POST, params)
}

//拆单
export async function requireOrderNewTransferPurchaseSplit(params) {
  return request(REQUIREORDERNEWTRANSFERPURCHASESPLIT, METHOD.GET, params)
}

//作废
export async function requireOrderInvalid(params) {
  return request(REQUIREORDERINVALID, METHOD.GET, params)
}

//计价单位 DICTIONARYLIST
export async function dictionaryLList(params) {
  return request(DICTIONARYLIST, METHOD.GET, params)
}

//商品名称
export function commodityName(params) {
  return request(`/component/getItems.action`, METHOD.POST, params)
}

//根据供应商id 和 商品id查询 当前商品的税率
export function taxrateGetTaxRateByPartner(params) {
  return request(`/taxrate/getTaxRateByPartner.action`, METHOD.POST, params)
}

//带出采购价
export function requireOrderGetSalePrice(params) {
  return request(`/requireOrder/getSalePrice.action`, METHOD.GET, params)
}

//导出
export function requireOrderExport(params) {
  return request(`/requireOrder/export.action`, METHOD.POST, params, { responseType: 'blob' })
}

//! 采购 客户级联门店
export function partnerPartnerCascadeList(params) {
  return request(`partner/partnerCascadeList.action`, METHOD.GET, params)
}

//! 仓库
export function getWarehouse(params) {
  return request(`dataPermission/warehouseListByUserOrg.action`, METHOD.GET, params)
}

//! 关联合同
export function contract(params) {
  return request(`contract/list.action`, METHOD.GET, params)
}