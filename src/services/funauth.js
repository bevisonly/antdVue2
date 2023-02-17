import {FUNAUTHLIST,FUNAUTHADD,FUNAUTHDEL,FUNAUTHUPDATE} from '@/services/api'
// import {FUNAUTHLIST,FUNAUTHUPDATE,FUNAUTHDEL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 权限查询
 * @param name 名称 必须
 * @param code 资源编码  必须
 * @param type 资源的类型  1 目录 ,2 链接 ,3 按钮 必须
 * @param parent_id 父级id
 * @param description 描述
 * @param id 主键 必须
 * @returns {Promise<AxiosResponse<T>>}
 */
//查询
export async function funAuthList() {
  return request(FUNAUTHLIST, METHOD.GET)
}
// export async function funAuthList(params) {
//   return request(FUNAUTHLIST, METHOD.POST, params)
// }
export async function funAuthUpdate(params) {
  return request(FUNAUTHUPDATE, METHOD.POST, params)
}
//删除
export async function funAuthDel(params) {
  return request(FUNAUTHDEL, METHOD.GET, params)
}
export async function funAuthAdd(params) {
  return request(FUNAUTHADD, METHOD.POST, params)
}