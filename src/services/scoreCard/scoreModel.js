import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
    api = 'http://basicdata.diligrp.com:8099'
} else {
    api = 'https://basicdata.diligrp.com'
}
//! 查
export function search(params) {
  return axios.get(`${api}/scoreModel/listPage.action`, { params })
}

//! 模型名称下拉
export function modelNameOption(params) {
  return axios.get(`${api}/scoreModel/list.action`, { params })
}

//! 详情
export function details(params) {
  return axios.get(`${api}/scoreResult/getById.action`, { params })
}

//! 批量启停
export function swapMore(params) {
  return axios.post(`${api}/scoreModel/batchUpdateStatus.action`, params)
}

//! 批量删除
export function cancelMore(params) {
  return axios.post(`${api}/scoreModel/batchDelete.action`, params)
}

//! 单个启停
export function swap(params) {
  return axios.get(`${api}/scoreModel/updateStatus.action`, { params })
}

//! 单个删除
export function cancel(params) {
  return axios.get(`${api}/scoreModel/delete.action`, { params })
}

//! 测试下拉选项
export function testOption(params) {
  return axios.get(`${api}/partnerCenter/list.action`, { params })
}

//! 测试
export function test(params) {
  return axios.get(`${api}/scoreModel/testModel.action`, { params })
}

//! 对象详细分类
export function list(params) {
  return axios.get(`${api}/partnerDictionary/list.action`, { params })
}

//! 对象详细分类2
export function dropDownList(params) {
  return axios.get(`${api}/partnerDictionary/dropDownList.action`, { params })
}

//! 新增
export function insert(params) {
  return axios.post(`${api}/scoreModel/insert.action`, params)
}

//! 修改
export function update(params) {
  return axios.post(`${api}/scoreModel/update.action`, params)
}

//! 查
export function searchTrack(params) {
  return axios.get(`${api}/scoreResult/trackPageList.action`, { params })
}

//! 导出详情
export function exportDetails(params) {
  return axios.get(`${api}/scoreModel/exportDetail.action`, { params, responseType: 'blob' })
}