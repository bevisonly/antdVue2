/**
 * 限制输入框只能输入n为小数
 */
 export const inputLimt = {
    bind(el, binding) {
      var wins_0 = /[^\d]/g //整数判断
      var wins_1 = /[^\d^.]/g //小数判断
      var flag = true;
      var points = 0;
      var lengths = 0
      var remainder = 0
      var no_int = 0
      const target = el instanceof HTMLInputElement ? el : el.querySelector("input");
      target.addEventListener("compositionstart", e => {
        console.log(e);
        flag = false;
      });
      target.addEventListener("compositionend", e => {
        console.log(e);
        flag = true;
      });
      target.addEventListener("input", e => {
        setTimeout(function () {
          if (flag) {
            if (binding.value == 0) {
              if (wins_0.test(e.target.value)) {
                e.target.value = e.target.value.replace(wins_0, "");
                e.target.dispatchEvent(new Event("input")) //手动更新v-model值
              }
            }
            if (binding.value == 1) {
              if (wins_0.test(e.target.value.toString().replace(/\d+\.(\d*)/, '$1'))) {
                remainder = true
              }
              if ((e.target.value.split('.')).length - 1 > 1) {
                points = true
              }
              if (e.target.value.toString().split(".")[1] != undefined) {
                if (e.target.value.toString().split(".")[1].length > 1) {
                  lengths = true
                }
              }
              if (e.target.value.toString().indexOf(".") != -1) {
                no_int = false
              } else {
                no_int = true
              }
              if (wins_1.test(e.target.value) || lengths || points || remainder) {
                if (!no_int) {
                  e.target.value = e.target.value.replace(wins_1, "").replace('.', '$#$').replace(/\./g, '').replace(
                    '$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3').substring(0, e.target.value.indexOf(
                    ".") + 2)
                } else {
                  e.target.value = e.target.value.replace(wins_0, "")
                }
                e.target.dispatchEvent(new Event("input"))
              }
            }
            if (binding.value == 2) {
              if (wins_0.test(e.target.value.toString().replace(/\d+\.(\d*)/, '$1'))) {
                remainder = true
              }
              if ((e.target.value.split('.')).length - 1 > 1) {
                points = true
              }
              if (e.target.value.toString().split(".")[1] != undefined) {
                if (e.target.value.toString().split(".")[1].length > 2) {
                  lengths = true
                }
              }
              if (e.target.value.toString().indexOf(".") != -1) {
                no_int = false
              } else {
                no_int = true
              }
              if (wins_1.test(e.target.value) || lengths || points || remainder) {
                if (!no_int) {
                  e.target.value = e.target.value.replace(wins_1, "").replace('.', '$#$').replace(/\./g, '').replace(
                    '$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3').substring(0, e.target.value.indexOf(
                    ".") + 3)
                } else {
                  e.target.value = e.target.value.replace(wins_0, "")
                }
                e.target.dispatchEvent(new Event("input"))
              }
            }
          }
        }, 0)
      })
    }
  }