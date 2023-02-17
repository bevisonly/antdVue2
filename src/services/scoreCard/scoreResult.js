import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
    api = 'http://basicdata.diligrp.com:8099'
} else {
    api = 'https://basicdata.diligrp.com'
}

//! 查
export function search(params) {
  return axios.get(`${api}/scoreResult/listPage.action`, { params })
}

//! 查轨迹
export function searchTrack(params) {
  return axios.get(`${api}/scoreResult/trackPageList.action`, { params })
}

//! 模型名称下拉
export function modelNameOption(params) {
  return axios.get(`${api}/scoreModel/list.action`, { params })
}

//! 详情
export function details(params) {
  return axios.get(`${api}/scoreResult/getById.action`, { params })
}

//! 导出全部
export function exportAll(params) {
  return axios.get(`${api}/scoreResult/export.action`, { params, responseType: 'blob' })
}

//! 导出详情
export function exportDetails(params) {
  return axios.get(`${api}/scoreResult/exportDetail.action`, { params, responseType: 'blob' })
}