import enquireJs from 'enquire.js'

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

const _toString = Object.prototype.toString


// 时间转换
//转化时间方法使用方法:formatDate(date, 'yyyy-MM-dd hh:mm:ss')
export const formatDate = (date, format) => {
  const time = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in time) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? time[k] : ('00' + time[k]).substr(('' + time[k]).length));
    }
  }
  return format;
}

//判断，null，undefind,'',NaN但是不包括0.可以传一个数组，数组中只要有一个空，null，undefind，就返回true
//使用方法if(isFalse(val)){...} val中存在或者val为空，null，undefind此值为true,进入执行if中的代码
export const isFalse = (val) => {
  if (Array.isArray(val)) {
    return val.some(e => {
      return e === undefined || e === null || e === ''
    })
  } else {
    if (val === undefined || val === null || val === '') return true;
    return false;
  }
}

/**
 * 简单实现防抖方法
 * @param fn 要防抖的函数
 * @param delay 防抖的毫秒数
 * @returns {Function}
 */
export function debounce(fn, delay = 100) {
  let timer = null
  return function () {
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}


//data为一个字符串数组，存放商品信息。比如['苹果10斤','葡萄20箱']
export function getStr(data) {
  let resArr = [];
  data.forEach((item) => {
    //反转字符
    item = item.split("").reverse().join("");
    let strArr = item.match(/(\d+\.)?\d+/g); //这里是获取字符中的数字，获取倒序的数字
    let numStr = strArr?.length ? strArr[0] : 0; //这是数量
    let index = item.indexOf(numStr);
    let unitStr = item?.length ? item.substring(0, index) : '';
    let nameStr = item.substring(index + numStr.length, item.length);
    let obj = {
      name: "",
      unit: "",
      num: null,
    };
    obj.name = nameStr ? nameStr.split("").reverse().join("") : "";
    obj.unit = unitStr ? unitStr.split("").reverse().join("") : "";
    obj.num = numStr ? parseFloat(numStr.split("").reverse().join("")) : 0;
    resArr.push(obj);
  });
  data.forEach((val,i) => resArr[i].name = val)
  return resArr;
}