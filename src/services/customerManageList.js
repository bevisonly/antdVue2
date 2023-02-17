import axios from 'axios'
let api
if (
  process.env.NODE_ENV == 'development' ||
  process.env.VUE_APP_TITLE == 'test'
) {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 客户
export function customer(params) {
  return axios.get(`${api}/partnerCenter/list.action`, { params })
}

//! 分页查询
export function partnerListPartnerByPartnerDto(params) {
  return axios.post(`${api}/partner/listPartnerByPartnerDto.action`, params)
}

//! 更新
export function partnerUpdatepartner(params) {
  return axios.post(`${api}/partner/updatepartner.action`, params)
}

//! 新增
export function partnerAddcustomer(params) {
  return axios.post(`${api}/partner/addcustomer.action`, params)
}

//! 删除(新)
export function partnerDelete(params) {
  return axios.get(`${api}/partner/deleteWithCondition.action`, { params })
}

//租户--运营主体
export function opSubjectList(params) {
  return axios.get(`${api}/opSubject/list.action`, { params })
}

//租户--运营主体内In
export function opSubjectListIn(params) {
  return axios.get(`${api}/opSubject/list.action`, { params })
}

//! 启禁
export function customerInvalidinformation(params) {
  return axios.get(`${api}/supplier/Invalidinformation.action`, { params })
}

//! 是否限额
export function customerLimitOperation(params) {
  return axios.get(`${api}/partner/updateLimit.action`, { params })
}
