import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 查询代理公司列表
export function searchAgencyList(params) {
  return axios.post(`${api}/serviceProvider/listServiceProviderByPartnerDto.action`, params)
}

//! 查询代理公司下拉列表
export function dropDownAgencylist(params) {
  return axios.get(`${api}/serviceProvider/listPartnerName.action`, { params })
}

//! 新增代理企业
export function addAgency(params) {
  return axios.post(`${api}/serviceProvider/addServiceProvider.action`, params)
}