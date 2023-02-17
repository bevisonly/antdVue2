import {
  ITEMSPECLISTPAGE,
  ITEMSPECDELETE,
  ITEMSPECCHILDDELETE,
  ITEMSPECINSERT,
  ITEMSPECCHILDLISTPAGE,
  ITEMSPECUPDATE,
  ITEMSPECCHILDUPDATE,
  ITEMSPECCHILDINSERT
} from '@/services/api'
import {request, METHOD} from '@/utils/request'

//列表查询
export async function itemSpecListPage(params) {
  return request(ITEMSPECLISTPAGE, METHOD.POST, params)
}

//删除
export async function itemSpecDelete(params) {
return request(ITEMSPECDELETE, METHOD.GET, params)
}

//删除(规格详细)
export async function itemSpecChildDelete(params) {
return request(ITEMSPECCHILDDELETE, METHOD.GET, params)
}

//新增
export async function itemSpecInsert(params) {
 return request(ITEMSPECINSERT, METHOD.POST, params)
}

//规格明细
export async function itemSpecChildListPage(params) {
 return request(ITEMSPECCHILDLISTPAGE, METHOD.POST, params)
}

//更新
export async function itemSpecUpdate(params) {
 return request(ITEMSPECUPDATE, METHOD.POST, params)
}

//更新(规格详细)
export async function itemSpecChildUpdate(params) {
 return request(ITEMSPECCHILDUPDATE, METHOD.POST, params)
}

//规格详情的新增规格
export async function itemSpecChildInsert(params) {
  return request(ITEMSPECCHILDINSERT, METHOD.POST, params)
}
//规格详情的新增规格
export async function GetUnitList(params) {
  return request(`/dictionary/list.action`, METHOD.GET, params)
}