import { request, METHOD } from '@/utils/request'

//新增税率
export function taxrateInsert(params) {
    return request(`/taxrate/insert.action`, METHOD.POST, params)
}
//税率列表
export function taxrateGetPageList(params) {
    return request(`/taxrate/getPageList.action`, METHOD.POST, params)
}

//商品类型列表
export function itemGetItemTypeList(params) {
    return request(`/item/getItemTypeList.action`, METHOD.GET, params)
}
//根绝id获取详情
export function taxrateGetSingle(params) {
    return request(`/taxrate/getSingle.action`, METHOD.POST, params)
}

//根据id查看客户，供应商
export function taxrateGetPartner(params) {
    return request(`/taxrate/getPartner.action`, METHOD.GET, params)
}
//编辑税率
export function taxrateUpdate(params) {
    return request(`/taxrate/update.action`, METHOD.POST, params)
}
//关闭
export function taxrateClose(params) {
    return request(`/taxrate/close.action`, METHOD.GET, params)
}
//开启
export function taxrateActivate(params) {
    return request(`/taxrate/activate.action`, METHOD.GET, params)
}
//获取适配列表（客户，供应商）

export function taxratePartnerGetPartnerList(params) {
    return request(`/taxratePartner/getPartnerList.action`, METHOD.POST, params)
}

//配置规则
export function taxratePartnerConfigurationRules(params) {
    return request(`/taxratePartner/configurationRules.action`, METHOD.POST, params)
}
//删除规则/
export function taxratePartnerDeleteRules(params) {
    return request(`/taxratePartner/deleteRules.action`, METHOD.POST, params)
}
//查询所有租户
export function opSubjectGetLoginInfo(params) {
    return request(`/opSubject/getLoginInfo.action`, METHOD.GET, params)
}
//税率详情分页
export function GetTaxRateItemsByTaxRateIdList(params) {
    return request(`/taxrate/getTaxRateItemsByTaxRateIdList.action`, METHOD.POST, params)
}