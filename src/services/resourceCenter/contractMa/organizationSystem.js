import {request, METHOD} from '@/utils/request'

//! 查OA组织
export function search(params) {
  return request(`oa/organization/listOrganization.action`, METHOD.GET, params)
}

//! 查OA人员
export function details(params) {
  return request(`oa/organization/findOAUserListByDto.action`, METHOD.POST, params)
}