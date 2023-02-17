import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 查
export function search(params) {
  return axios.get(`${api}/operateEntity/listPage.action`, { params })
}

//! 查(不分页)
export function searchList(params) {
  return axios.get(`${api}/operateEntity/list.action`, { params })
}

//! 增
export function add(params) {
  return axios.post(`${api}/operateEntity/insert.action`, params )
}

//! 删
export function del(params) {
  return axios.get(`${api}/operateEntity/delete.action`, { params })
}

//! 改
export function update(params) {
  return axios.post(`${api}/operateEntity/update.action`, params )
}