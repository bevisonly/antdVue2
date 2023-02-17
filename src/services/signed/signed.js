import { request, METHOD } from '@/utils/request'
import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 供应商2
export function supplier2(params) {
    return axios.get(`${api}/partner/listByCondition.action`, { params })
}
// 已签收列表客户名称
export function getPartner(params) {
    return request(`/partner/listByCondition.action`, METHOD.GET, params)
}
// 已签收列表客户门店
export function getStore(params) {
    return request(`/partner/list.action`, METHOD.GET, params)
}
// 已签收列表运营主体
export function getOpSubject(params) {
    return request(`/opSubject/list.action`, METHOD.GET, params)
}
//已签收的列表接口
export function getListData(params) {
    return request(`/signed/listPage.action`, METHOD.POST, params)
}
//已签收的列表订单详情
export function GetDetails(params) {
    return request(`/signed/viewOrder.action`, METHOD.GET, params)
}
//已签收的出库单仓库
export function GetWarehouse(params) {
    return request(`/signed/getOutWhNames.action`, METHOD.GET, params)
}
//已签收的编辑详情
export function GetEditOrder(params) {
    return request(`/signed/editOrder.action`, METHOD.GET, params)
}
//已签收的退货/转呆滞详情
export function GetReturnOrBadView(params) {
    return request(`/signed/returnOrBadView.action`, METHOD.GET, params)
}
//已签收的列表单据删除
export function deleteImg(params) {
    return request(`/uploadFile/doDeleteFile.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}

//已签收的列表再次编辑确认
export function ReSignedOrder(params) {
    return request(`/signed/reSignedOrder.action`, METHOD.POST, params)
}
//已签收的列表退货转呆滞提交
export function ReturnOrBadOrder(params) {
    return request(`/signed/returnOrBad.action`, METHOD.POST, params)
}
//已签收的列表导出
export function exportData(params) {
    return request(`/signed/export.action`, METHOD.POST, params, { responseType: 'blob' })
}
//已签收单条数据导出
export function ExportSignedSingle(params) {
    return request(`/signed/exportSigned.action`, METHOD.POST, params, { responseType: 'blob' })
}
//已签收的明细列表导出
export function SignedDetailExport(params) {
    return request(`/signed/signedDetailExport.action`, METHOD.POST, params, { responseType: 'blob' })
}
//,{ responseType: 'blob' }
//已签收明细的列表接口
export function GetDetailsList(params) {
    return request(`/signed/signedDetailList.action`, METHOD.POST, params)
}
//! 收货信息
export function receiveMsg(params) {
    return request(`billing/purchaseFees/getAllByType.action`, METHOD.POST, params)
}
//! 获取供应商
export function supplier(params) {
    return request(`partner/listPartnerByKey.action`, METHOD.GET, params)
}
//明细主体
export function GetOpList(params) {
    return request(`opSubject/listByOp.action`, METHOD.GET, params)
}
//明细商品一级分类
export function GetPrimaryClassification(params) {
    return request(`/itemType/getPrimaryClassification.action`, METHOD.GET, params)
}
//! 关联合同
export function contract(params) {
    return request(`contract/list.action`, METHOD.GET, params)
}