import {request, METHOD} from '@/utils/request'

//! 运营主体
export function organization(params) {
  return request(`opSubject/listByOp.action`, METHOD.GET, params)
}

//! 关联合同（必填项）
export function mustContract(params) {
  return request(`opSubject/getContractRequiredOrgIds.action`, METHOD.GET, params)
}