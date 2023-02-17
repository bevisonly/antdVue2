/*函数节流（时间差）：如果interval不传，则默认300ms*/
export function throttle(fn, interval) {
  let enterTime = 0; //触发的时间
  let gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    let context = this;
    let backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };

}

/*函数防抖（定时器）：如果interval不传，则默认1000ms*/
export function debounce(fn, interval) {
  let timer;
  let gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    let context = this;
    let args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}
//时间计算
export function dateComputer(d1, d2) {
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  let dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
  let dateEnd = new Date(d2.replace(/-/g, "/"));//获取当前时间
  let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
  let hours = (dateDiff / (3600 * 1000)).toFixed(2)//计算出小时数  保留两位
  return hours
}
//合计大写
// export function priceUppercase(number) {
//   var ret = "";
//   if (number != "" && number != null && number != "0") {
//     var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
//       str = "";
//     number += "00";
//     var point = number.indexOf(".");
//     if (point >= 0) {
//       number = number.substring(0, point) + number.substr(point + 1, 2);
//     }
//     unit = unit.substr(unit.length - number.length);
//     for (var i = 0; i < number.length; i++) {
//       str +=
//         "零壹贰叁肆伍陆柒捌玖".charAt(number.charAt(i)) + unit.charAt(i);
//     }
//     ret =
//       str
//         .replace(/零(仟|佰|拾|角)/g, "零")
//         .replace(/(零)+/g, "零")
//         .replace(/零(万|亿|元)/g, "$1")
//         .replace(/(亿)万|(拾)/g, "$1$2")
//         .replace(/^元零?|零分/g, "")
//         .replace(/元$/g, "元") + "整";
//   }
//   return ret;
// }
export function priceUppercase(money) {
  var cnMoney = "零元整";
  var strOutput = "";
  var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
  money += "00";
  var intPos = money.indexOf('.');
  if (intPos >= 0) {
    money = money.substring(0, intPos) + money.substr(intPos + 1, 2);
  }
  strUnit = strUnit.substr(strUnit.length - money.length);
  for (var i = 0; i < money.length; i++) {
    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(money.substr(i, 1), 1) + strUnit.substr(i, 1);
  }
  cnMoney = strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
  return cnMoney;
}


export function add(a, b) {
  let num1 = String(a).split('.')
  let num2 = String(b).split('.')
  let intSum = addTwo(num1[0], num2[0])
  let res = intSum

  if (num1.length > 1 || num2.length > 1) {
    let decimalSum = addTwo(num1[1], num2[1], true)

    if (decimalSum.length > (num1[1] || '0').length && decimalSum.length > (num2[1] || '0').length) {
      intSum = addTwo(intSum, decimalSum[0])
      decimalSum = decimalSum.slice(1)
      res = `${intSum}.${decimalSum}`
    } else {
      res = `${intSum}.${decimalSum}`
    }
  }
  return res

}
function addTwo(a = '0', b = '0', isHasDecimal = false) {
  //1.比较两个数长度  然后短的一方前面补0
  if (a.length > b.length) {
    let arr = Array(a.length - b.length).fill(0);
    b = isHasDecimal && (b + arr.join('')) || arr.join('') + b
  } else if (a.length < b.length) {
    let arr = Array(b.length - a.length).fill(0);
    a = isHasDecimal && (a + arr.join('')) || arr.join('') + a
  }

  //2.反转两个数 （这里是因为人习惯从左往右加 而数字相加是从右到左 因此反转一下比较好理解）
  a = a.split('').reverse();
  b = b.split('').reverse();


  //3.循环两个数组  并进行相加  如果和大于10 则 sign = 1,当前位置的值为(和%10)
  let sign = 0;//标记 是否进位
  let newVal = [];//用于存储最后的结果
  for (let j = 0; j < a.length; j++) {
    let val = a[j] / 1 + b[j] / 1 + sign; //除1是保证都为数字 这里也可以用Number()
    if (val >= 10) {
      sign = 1;
      newVal.unshift(val % 10) //这里用unshift而不是push是因为可以省了使用reverse
    } else {
      sign = 0;
      newVal.unshift(val)
    }
  }

  // 最后一次相加需要向前补充一位数字 ‘1’
  return sign && newVal.unshift(sign) && newVal.join('') || newVal.join('')
}
export function sub(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m - arg2 * m) / m
}
export function mul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { console.log(e); }
  try {
    m += s2.split(".")[1].length
  } catch (e) { console.log(e) }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
export function div(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) { console.log(e) }
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) { console.log(e) }

  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return (r1 / r2) * Math.pow(10, t2 - t1);

}
const patchArrayFun = (function () {
  const methodsToPatch = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "reverse",
    "sort",
  ];

  //设置对象属性的工具方法
  function def(obj, key, val) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  }

  const arrayProto = Array.prototype, //缓存Array的原型
    arrayMethods = Object.create(arrayProto); //继承Array的原型

  // methodsToPatch.forEach(function (method, index) {
  methodsToPatch.forEach(function (method) {
    def(arrayMethods, method, function (...args) {
      //首先调用Array原型的方法
      const res = arrayProto[method].apply(this, args);
      //data中每个数组都有一个__ob__的私有属性指向创建的Observer实例（有兴趣看看源码中的observe方法，这里不详述）
      const ob = this.__ob__;

      let inserted = null;

      //记录插入的值
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        //如果是调用了push、unshift、splice，则尝试对新插入的值进行响应式绑定，因为插入的值有可能是对象(Object)或者数组(Array)
        ob && ob.observeArray(inserted);
      }


      console.log("数组发生改变了");

      //向所有依赖发送通知，告诉它们数组的值发生变化了
      ob && ob.dep.notify();
      return res;
    });
  });

  return function (target) {
    //看看浏览器支不支持__proto__这个属性，通过改变__proto__的值，可以设置对象的原型
    if ("__proto__" in {}) {
      //将数组的原型指向arrayMethods，这样当数组调用上述的7个方法时，其实是调用arrayMethods中的方法而不是调用Array.prototype中的方法
      target.__proto__ = arrayMethods;
    } else {
      //如果浏览器不支持__proto__，则设置数组对应的属性，这样当数组调用上述的7个方法时，其实是调用数组对应属性指向的方法
      for (let i = 0, l = methodsToPatch.length; i < l; i++) {
        let key = methodsToPatch[i];
        def(target, key, arrayMethods[key]);
      }
    }
  };
})();
export function patchArray(val) {
  patchArrayFun(val)
}