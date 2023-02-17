import axios from 'axios'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

//! 角色列表
export async function roleList(params) {
  return axios.get(`${api}/role/listPage.action`, { params })
}

//! 角色权限列表
export async function permissionList(params) {
  return axios.get(`${api}/resource/listResourceTreeByRoleId.action`, { params })
}

//! 租户列表
export async function tenantList(params) {
  return axios.get(`${api}/opSubject/list.action`, { params })
}

//! 分配权限保存
export async function saveRoleResource(params) {
  return axios.post(`${api}/role/saveRoleResource.action`, params)
}

//! 角色新增
export async function InsertRole(params) {
  return axios.post(`${api}/role/insert.action`, params)
}

//! 角色修改
export async function UpdateRole(params) {
  return axios.post(`${api}/role/update.action`, params)
}

//! 角色删除
export async function DelRole(params) {
  return axios.get(`${api}/role/delete.action`, { params })
}