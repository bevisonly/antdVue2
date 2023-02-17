import axios from 'axios'
import {request, METHOD} from '@/utils/request'
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

/**
 
 */

//! 查(不分页)
export function searchList(params) {
  return axios.get(`${api}/operateEntity/list.action`, { params })
}
//组织结构列表
export async function GetOrganization(params) {
    return request('/opDept/list.action', METHOD.GET,params)
  }
//租户查询
export async function GetTenant(params) {
    return request('/opSubject/list.action', METHOD.GET,params)
  }
//租户组织修改
export async function UpdateTenant(params) {
    return request('/opDept/update.action', METHOD.POST,params)
  }
//租户组织新增
export async function AddTenant(params) {
    return request('/opDept/insert.action', METHOD.POST,params)
  }
//租户组织删除
export async function DelTenant(params) {
    return request('/opDept/delete.action', METHOD.GET,params)
    // return request('/opDept/delete.action', METHOD.POST,params)
  }


