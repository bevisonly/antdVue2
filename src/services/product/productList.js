import {SEARCHCATE,SEARCHITEM,UPDATECATE}  from '@/services/api'
// import {FUNAUTHLIST,FUNAUTHUPDATE,FUNAUTHDEL} from '@/services/api'
import {request, METHOD} from '@/utils/request'
import {GETIMG, ACTIVEITEM, ADDIMG, BEFOREDEL, CITYDATA, DELCATE, EDITORUPLOAD, INVALIDITEM, ITEMINSERT, LISTSPEC, MEASUREMENT, PACKAGELIST, PROVINCE, SINGLEITEM, UPANDDOWN, ITEMUPDATE, OTHERITEMADD, CUSTOMERITEM, SUPPLIERITEM, OTHERITEMDEL, PACKDATA, ONSALE } from '../api'

//查询分类
export async function cateList(params) {
  return request(SEARCHCATE, METHOD.POST,params)
}
//分类的新增和修改
export async function cateAdd(params) {
  return request(UPDATECATE, METHOD.POST,params)
}
//分类的删除之前
export async function cateBeforeDel(params) {
  return request(BEFOREDEL, METHOD.GET,params)
}
//分类的删除
export async function cateDel(params) {
  return request(DELCATE, METHOD.POST,params)
}
//查询商品列表
export async function itemList(params) {
  return request(SEARCHITEM, METHOD.POST,params)
}
//商品的上下架
export async function upDown(params) {
  return request(UPANDDOWN, METHOD.POST,params)
}
//商品的单据上传
// export async function upload(params) {
//   return request(UPLOAD, METHOD.POST,params)
// }
//商品作废
export async function invalidItem(params) {
  return request(INVALIDITEM, METHOD.GET,params)
}
//商品激活
export async function activeItem(params) {
  return request(ACTIVEITEM, METHOD.GET,params)
}
//商品省份数据
export async function provinceData(params) {
  return request(PROVINCE, METHOD.GET,params)
}
//商品市区数据
export async function cityData(params) {
  return request(CITYDATA, METHOD.GET,params)
}
//商品计量单位
export async function measure(params) {
  return request(MEASUREMENT, METHOD.GET,params)
}
//商品规格列表
export async function listSpec(params) {
  return request(LISTSPEC, METHOD.GET,params)
}
//商品包装列表
export async function packageList(params) {
  return request(PACKAGELIST, METHOD.GET,params)
}
//富文本上传
export async function editorUpload(params) {
  return request(EDITORUPLOAD, METHOD.POST,params)
}
//商品的新增
export async function itemInsert(params) {
  return request(ITEMINSERT, METHOD.POST,params)
}
//商品的修改
export async function itemUpdate(params) {
  return request(ITEMUPDATE, METHOD.POST,params)
}
//商品的单条信息
export async function singleItem(params) {
  return request(SINGLEITEM, METHOD.GET,params)
}
//新增文件上传记录
export async function addImg(params) {
  return request(ADDIMG, METHOD.POST,params)
}
//获取文件上传记录
export async function getImg(params) {
  return request(GETIMG, METHOD.POST,params)
}
//客户和商家的商品新增
export async function otherItemAdd(params) {
  return request(OTHERITEMADD, METHOD.POST,params)
}
//客户和商家的商品删除
export async function otherItemDel(params) {
  return request(OTHERITEMDEL, METHOD.GET,params)
}
//客户商品列表
export async function customerItem(params) {
  return request(CUSTOMERITEM, METHOD.GET,params)
}
//商家商品列表
export async function supplierItem(params) {
  return request(SUPPLIERITEM, METHOD.GET,params)
}
//已选择包装的列表
export async function packData(params) {
  return request(PACKDATA, METHOD.GET,params)
}
//上下架
export async function onSale(params) {
  return request(ONSALE, METHOD.GET,params)
}
//上传图片
export function uploadFiles(params) {
  return request(`/uploadFile/doUpload.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
//删除上传文件
export function delUploadFiles(params) {
  return request(`/uploadFile/doDeleteFile.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
//获取上传文件
export function getUploadFiles(params) {
  return request(`/uploadFile/getUploadList.action`, METHOD.POST, params, { 'Content-Type': 'multipart/form-data', })
}
//生产线
export async function ProductLine(params) {
  return request('/dictionary/list.action', METHOD.GET,params)
}

// export async function funAuthUpdate(params) {
//   return request(FUNAUTHUPDATE, METHOD.POST, params)
// }
// //删除
// export async function funAuthDel(params) {
//   return request(FUNAUTHDEL, METHOD.GET, params)
// }
// export async function funAuthAdd(params) {
//   return request(FUNAUTHADD, METHOD.POST, params)
// }
//规格新增
export function SpecAdd(params) {
  return request(`/itemSpec/insert.action`, METHOD.POST, params)
}
//客户门店供应商数据
export function PartnerList(params) {
  return request(`/partner/list.action`, METHOD.GET, params)
}
//品牌列表
export function BrandList(params) {
  return request(`/itemBrand/list.action`, METHOD.GET, params)
}
//品牌新增
export function BrandInsert(params) {
  return request(`/itemBrand/insert.action`, METHOD.POST, params)
}
//规格过滤
export function ListSpecByUom(params) {
  return request(`item/listSpecByUom.action`, METHOD.POST, params)
}