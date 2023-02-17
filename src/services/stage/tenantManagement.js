
import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 查OA
export function oa(params) {
  return axios.get(`${api}/oa/listOrganization.action`, { params })
}

//! 租户新增
export async function AddTenant(params) {
  return axios.post(`${api}/opSubject/addOpSubject.action`, params)
}

//! 租户修改
export async function UpdateTenant(params) {
  return axios.post(`${api}/opSubject/updateOpSubject.action`, params)
}

//! 租户查询
export async function GetTenantList(params) {
  return axios.get(`${api}/opSubject/listPage.action`, { params })
}

//! 启用/禁用租户
export async function UpdateOpSubjectState(params) {
  return axios.get(`${api}/opSubject/updateOpSubjectState.action`, { params })
}

//! 获取默认orgId
export async function GetDefaultOrgId(params) {
  return axios.get(`${api}/opSubject/getDefaultOrgId.action`, { params })
}