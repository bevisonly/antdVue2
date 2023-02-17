
import { TENANTADD, TENANTSEARCH, TENANTUPDATE, TENANTCHANGE ,TENANTGETID} from '@/services/api'
import { request, METHOD } from '@/utils/request'

/**
 
 */
//新增

export async function TenantAdd(params) {
    return request(TENANTADD, METHOD.POST, params)
}
//查询

export async function TenantSearch(params) {
    return request(TENANTSEARCH, METHOD.GET, params)
}
//修改状态

export async function TenantChange(params) {
    return request(TENANTCHANGE, METHOD.GET, params)
}
//修改

export async function TenantUpdate(params) {
    return request(TENANTUPDATE, METHOD.POST, params)
}
//获取默认的orgid

export async function TenantGetId(params) {
    return request(TENANTGETID, METHOD.GET, params)
}

