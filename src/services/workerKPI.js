import {request, METHOD} from '@/utils/request'

//! 分页
export function workerGetWorkerPerformancePageList(params) {
  return request(`/worker/getWorkerPerformancePageList.action`, METHOD.POST, params)
}

//! 导出
export function workerExportList(params) {
  return request(`/worker/exportList.action`, METHOD.POST, params, { responseType: 'blob'})
}