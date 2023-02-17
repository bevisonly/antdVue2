//! 按钮权限
function hasPermission(authName) {
  const autoCodeList = localStorage.getItem('codeList') ? localStorage.getItem('codeList') : []
  return (autoCodeList.length > 0 && autoCodeList.includes(authName));
}

//! 格式化数字，默认为8位
function formatPrice(val, fixNum = 8) {
  let num = +(+val || 0).toFixed(+fixNum || (~~fixNum + 2))
  return num
}

//! 判断数据类型,返回值为小写字符串，NaN返回NaN，如果传type，则返回布尔值
function typeis(params, type) {
  let dataType = Object.prototype.toString.call(params).slice(8, -1).toLowerCase()
  if (typeof params === 'symbol') return typeof type === 'undefined' ? 'symbol' : type === 'symbol'
  if (Number.isNaN(params)) return typeof type === 'undefined' ? 'NaN' : type === 'NaN'
  return typeof type === 'undefined' ? dataType : type === dataType
}

//! 检测到[null, undefined, '', NaN]则返回true
function isUndef(v) {
  arguments.length > 1 && (v = [...arguments])
  if (typeis(v, 'array')) return v.some(x => x == null || x === '' || Number.isNaN(x))
  return v == null || v === '' || Number.isNaN(v)
}

//路由返回
function handleBackRouter(a,b){
  // from a to b
  this.$closePage(a, b)
}
//! 解决函数被压缩后无法获取正确的函数名
export default [
  ['hasPermission', 'formatPrice', 'typeis', 'isUndef','handleBackRouter'],
  [hasPermission, formatPrice, typeis, isUndef,handleBackRouter],
]