import { request, METHOD } from '@/utils/request'

//新增仓库
export function warehouseInsert(params) {
    return request(`/warehouse/insert.action`, METHOD.POST, params)
}
//仓库列表
export function warehouseListByWarehouseDto(params) {
    return request(`/warehouse/listByWarehouseDto.action`, METHOD.GET, params)
}
//修改仓库
export function warehouseUpdate(params) {
    return request(`/warehouse/update.action`, METHOD.POST, params)
}
//删除仓库
export function warehouseDelete(params) {
    return request(`/warehouse/delete.action`, METHOD.GET, params)
}