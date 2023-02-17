import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 客户
export function supplier(params) {
  return axios.get(`${api}/partnerCenter/list.action`, { params })
}

//! 分页查询
export function supplierListSupplierByPartnerDto(params) {
  return axios.post(`${api}/supplier/listSupplierByPartnerDto.action`, params)
}

//! 编辑(更新)
export function supplierUpdate(params) {
  return axios.post(`${api}/supplier/update.action`, params)
}

//! 新增
export function supplierAddSupplier(params) {
  return axios.post(`${api}/supplier/addSupplier.action`, params)
}

//! 租户--运营主体
export function opSubjectList(params) {
  return axios.get(`${api}/opSubject/list.action`, { params })
}

//! 删除
export function supplierInvalidinformation(params) {
  return axios.get(`${api}/supplier/Invalidinformation.action`, { params })
}

//! 是否限额
export function supplierLimitOperation(params) {
  return axios.get(`${api}/partner/updateLimit.action`, { params })
}