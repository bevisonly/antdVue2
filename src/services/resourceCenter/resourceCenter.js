// import { request, METHOD } from '@/utils/request'
import axios from 'axios'
let api
// = process.env.NODE_ENV == "development" ||
// process.env.VUE_APP_TITLE == "test"?'http://basicData.diligrp.com:8099':'https://basicData.diligrp.com'
if (process.env.NODE_ENV == "development" ||
    process.env.VUE_APP_TITLE == 'test') {
    api = 'http://basicdata.diligrp.com:8099'
} else {
    api = 'https://basicdata.diligrp.com'
}
//-----------------------------------------------------------------------------------
//公海企业分页查询
export function GetList(params) {
    return axios.get(`${api}/openSeaCompany/listPage.action`, { params })
}
//公海企业查询
export function GetGHList(params) {
    return axios.get(`${api}/openSeaCompany/list.action`, { params })
}
//公海企业删除
export function DeleteCompany(params) {
    return axios.get(`${api}/openSeaCompany/delete.action`, { params })
}
//公海企业删除批量
export function DeleteCompanyBatch(params) {
    return axios.post(`${api}/openSeaCompany/batchDelete.action`, params)
}
//公海企业新增
export function InsertCompany(params) {
    return axios.post(`${api}/openSeaCompany/insert.action`, params)
}
//公海企业编辑
export function UpdateCompany(params) {
    return axios.post(`${api}/openSeaCompany/update.action`, params)
}
//中台省份
export function GetProvinceList(params) {
    return axios.get(`${api}/cityDto/getProvinceList.action`, { params })
}
//中台城市/区县
export function GetCityOrDistrictList(params) {
    return axios.get(`${api}/cityDto/getCityOrDistrictList.action`, { params })
}
//===============================================================
//-------客户供应商
//列表
export function GetPartnerCenter(params) {
    return axios.get(`${api}/partnerCenter/listPage.action`, { params })
}
//下拉字典
export function GetPartnerCenterDic(params) {
    return axios.get(`${api}/partnerDictionary/dropDownList.action`, { params })
}
//删除
export function DeletePartnerCenter(params) {
    return axios.get(`${api}/partnerCenter/delete.action`, { params })
}
//批量删除
export function DeletePartnerCenterBatch(params) {
    return axios.post(`${api}/partnerCenter/batchDelete.action`, params)
}
//待审核列表
export function WaitSubmit(params) {
    return axios.get(`${api}/partnerCenter/pendingSubmitListPage.action`, { params })
}
//待审核列表
export function WaitAudit(params) {
    return axios.get(`${api}/partnerCenter/pendingAuditListPage.action`, { params })
}
//已审核列表
export function Audited(params) {
    return axios.get(`${api}/partnerCenter/auditedListPage.action`, { params })
}
//查询地利维系人
export function SearchDilier(params) {
    return axios.get(`${api}/userPartnerRef/list.action`, { params })
}
//查询轨迹
export function PartnerOperationTrack(params) {
    return axios.get(`${api}/partnerOperationTrack/list.action`, { params })
}
//新增
export function InsertPartnerCenter(params) {
    return axios.post(`${api}/partnerCenter/insert.action`, params)
}
//编辑
export function UpdatePartnerCenter(params) {
    return axios.post(`${api}/partnerCenter/update.action`, params)
}
//审核驳回
export function AuditPartnerCenter(params) {
    return axios.post(`${api}/partnerCenter/audit.action`, params)
}
//上传
export function DoUploadPartnerCenter(params) {
    return axios.post(`${api}/uploadFile/doUpload.action`, params, { 'Content-Type': 'multipart/form-data', })
}
//上传关联保存
export function BatchAddUploadUrl(params) {
    return axios.post(`${api}/uploadFile/batchAddUploadUrl.action`, params,)
}
//上传关联查询
export function GetUploadTreeList(params) {
    return axios.post(`${api}/uploadFile/getUploadTreeList.action`, params, { 'Content-Type': 'multipart/form-data', })
}
//银行字典(下拉)
export function BankName(params) {
    return axios.get(`${api}/bankDictionary/list.action`, { params })
}
