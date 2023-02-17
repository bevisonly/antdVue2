import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 查(企业)
export function search(params) {
  return axios.get(`${api}/openSeaCompany/auditedList.action`, { params })
}

//! 查(合同)
export function searchContract(params) {
  return axios.get(`${api}/contract/listPage.action`, { params })
}

//! 查(合同Id)
export function searchById(params) {
  return axios.get(`${api}/contract/getById.action`, { params })
}

//! 增
export function add(params) {
  return axios.post(`${api}/contract/insert.action`, params )
}

//! 删
export function del(params) {
  return axios.get(`${api}/contract/delete.action`, { params })
}

//! 改
export function update(params) {
  return axios.post(`${api}/contract/update.action`, params )
}

//! 字典
export function dictionary(params) {
  return axios.get(`${api}/dictionary/list.action`, { params })
}

//! 法人
export function op(params) {
  return axios.get(`${api}/operateEntity/listPage.action`, { params })
}

//! 业务单元
export function business(params) {
  return axios.get(`${api}/opSubject/simpleList.action`, { params })
}