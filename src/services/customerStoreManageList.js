import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 查询
export function partnerListPartnerStoreByPartnerDto(params) {
  return axios.get(`${api}/partner/listPartnerStoreByPartnerDto.action`, { params })
}

//! 更新
export function partnerUpdateStore(params) {
  return axios.post(`${api}/partner/updateStore.action`, params)
}

//! 新增
export function partnerAddPartnerStore(params) {
  return axios.post(`${api}/partner/addPartnerStore.action`, params)
}

//! 删除
export function partnerDelete(params) {
  return axios.get(`${api}/partner/delete.action`, { params })
}

//! 租户下拉框
export function opSubjectList(params) {
  return axios.get(`${api}/opSubject/list.action`, { params })
}

//! 客户下拉框
export function partnerList(params) {
  return axios.get(`${api}/partner/list.action`, { params })
}
