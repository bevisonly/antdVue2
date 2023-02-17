import {REPORTIMPORTEXCEL, REPORTFINDLIST, PARTNERLIST, REPORTDELETEBYID} from '@/services/api'
import {request, METHOD} from '@/utils/request'
import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
    api = 'http://basicdata.diligrp.com:8099'
} else {
    api = 'https://basicdata.diligrp.com'
}
//导入excel结算报表
export async function reportImportExcel(params) {
  return request(REPORTIMPORTEXCEL, METHOD.POST, params, { responseType: 'blob' })
}

//结算报表查询
export async function reportFindList(params) {
  return request(REPORTFINDLIST, METHOD.POST, params)
}

//导入excel结算报表模板
export async function reportExportTemplate(params) {
  return request(`/report/exportTemplate.action`, METHOD.GET, params, {responseType: 'blob'})
}

//导出excel结算报表
export async function reportExport(params) {
  return request(`/report/export.action`, METHOD.GET, params, {responseType: 'blob'})
}

//查询客户,门店,供应商
export async function partnerList(params) {
  return request(PARTNERLIST, METHOD.GET, params)
}

//! 查
export function partnerList2(params) {
  return axios.get(`${api}/partner/list.action`, { params })
}

//查询供应商 POST
export async function partnerListByName(params) {
  return request(`/partner/listByCondition.action`, METHOD.GET, params)
}

//查询供应商 POST
export async function partnerListByName2(params) {
  return axios.get(`${api}/partner/listByCondition.action`, { params })
}

//删除
export async function reportDeleteById(params) {
  return request(REPORTDELETEBYID, METHOD.GET, params)
}

//转待对账列表
export async function reportTranToReceive(params) {
  return request(`/report/tranToReceive.action`, METHOD.POST, params)
}