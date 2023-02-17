import axios from 'axios'
import Cookie from 'js-cookie'
import qs from 'qs'

// 跨域认证信息 header 名
// const xsrfHeaderName = 'Authorization'
const xsrfHeaderName = 'SCMAccessToken'


axios.defaults.timeout = 35000
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = xsrfHeaderName
axios.defaults.xsrfCookieName = xsrfHeaderName
const API_PROXY_PREFIX = '/api'
// base url
axios.defaults.baseURL= process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
let api
if (process.env.NODE_ENV == "development" || process.env.VUE_APP_TITLE == 'test') {
  api = 'http://basicdata.diligrp.com:8099'
} else {
  api = 'https://basicdata.diligrp.com'
}

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post',
  BD: {
    GET: 'GET',
    BDPOST: 'POST'
  }
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, config) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, {
        params,
        ...config,
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
    case METHOD.POST:
      return axios.post(url, params, config)
    case METHOD.BD.GET:
      url = url[0] !== '/' ? '/'+url : url
      return axios.get(`${api}${url}`, {
        params,
        ...config,
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
    case METHOD.BD.POST:
      url = url[0] !== '/' ? '/'+url : url
      return axios.post(`${api}${url}`, params, config)
    default:
      return axios.get(url, { params, ...config })
  }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.set(xsrfHeaderName, auth.SCM_accessToken, { expires: auth.expireAt })
      // Cookie.set(xsrfHeaderName, 'Bearer ' + auth.SCM_accessToken, {expires: auth.expireAt})
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.remove(xsrfHeaderName)
      Cookie.remove('refreshToken')
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookie.get(xsrfHeaderName)) {
        return true
      }
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
  return false
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors
  // 加载请求拦截器
  request.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    )
  })
  // 加载响应拦截器
  response.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}
//跳转as
function toLogin(lastRoute, currentUrl) {
  if (
    process.env.NODE_ENV == "development" ||
    process.env.VUE_APP_TITLE == "test"
  ) {
    window.location.href = `http://as.diligrp.com:8396/api/oauth-server/authorize?client_id=gyl&state=${window.btoa(
      lastRoute
    )}&redirect_uri=${currentUrl}/scm/busLogin&response_type=code`;
  } else {
    window.location.href = `https://as.diligrp.com/api/oauth-server/authorize?client_id=gyl&state=${window.btoa(
      lastRoute
    )}&redirect_uri=${currentUrl}/scm/busLogin&response_type=code`;
  }
}
export {
  METHOD,
  AUTH_TYPE,
  request,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams,
  toLogin
}
