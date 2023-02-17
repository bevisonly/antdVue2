var directiveObject = {
  directive: function (_Vue) {
    let flag = true
    let timer = undefined
    //! 冷却(事件立即触发后将进入冷却时间),间隔为下次Axios请求结束后刷新指令,初始默认时间为3.5s
    _Vue.directive('refresh', {
      inserted(el, binding) {
        el.onclick =  () => flag && (flag = false, binding.value(), setTimeout(() => flag = true, binding.arg || 3500))
      }
    })
    //! 防抖(事件连续多次触发，只执行最后一次事件)
    _Vue.directive('debounce', {
      inserted(el, binding) {
        el.onclick = () => timer && clearTimeout(timer) || (timer = setTimeout(() => binding.value(), binding.arg || 1500))
      }
    })
    //! 节流(事件每隔1.5s, 事件才能触发)
    _Vue.directive('throttle', {
      inserted(el, binding) {
        el.onclick = () => flag && (flag = false, setTimeout(() => (flag = true, binding.value()), binding.arg || 1500))
      }
    })
    _Vue.directive('LimitInputNumber', {
      bind(el) {
        el.onkeypress = (event) => {
          return (/[\d,.]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8;
        };
        el.oninput = () => {
          el.value = el.value.replace(/[^0-9.]/g, "").replace(/(\.)(\d*)(\1*)/g, "$1$2")
        };
      },
    });
    //! 数据类型为字符串,不可直接转化为数字，防止无法输入小数点(指令无法v-model响应式效果，最好配合a-input-number使用)
    _Vue.directive('number', {
      bind(el, binding) {
        el.oninput = () => {
          let rule = new RegExp(`(?<=\\.{1}[0-9]{${+binding.arg || 8}}).*`)
          el.value = (el.value+"").replace(/[^0-9.-]/g, "").replace(rule, '').replace(/(?<=\.+|[0-9]+)-(?=\.?|[0-9]?)/g,'');
        }
        el.onpaste = () => {
          let rule = new RegExp(`(?<=\\.{1}[0-9]{${+binding.arg || 8}}).*`)
          el.value = (el.value+"").replace(/[^0-9.-]/g, "").replace(rule, '').replace(/(?<=\.+|[0-9]+)-(?=\.?|[0-9]?)/g,'')
        }
      }
    })
  }
}
export default directiveObject