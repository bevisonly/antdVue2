import { LOGIN, LOGOUT, ROUTES } from '@/services/api'
import { request, METHOD, removeAuthorization } from '@/utils/request'

/**
 * 登录服务
 * @param redirectUri 登录后跳转的地址
 * @param code 从授权服务器接收的授权码
 * @param state 从as跳转后的url获取
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(redirectUri, code, state) {
  return request(LOGIN, METHOD.GET, {
    redirectUri: redirectUri,
    code: code,
    state: state

  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export async function logout() {
  let res = await request(LOGOUT, METHOD.GET)
  if (res) {
    console.log(res);
  }
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  localStorage.clear()
  removeAuthorization()
}

export function resetPassword(params) {
  return request(`userPartnerRef/updatePsw.action`, METHOD.POST, params)
}

export default {
  login,
  logout,
  getRoutesConfig,
  resetPassword
}
