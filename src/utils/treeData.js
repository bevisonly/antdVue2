export function findId(arr, id, data) {
    var returnedItem;
    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.id == id && !item.children.includes(data)) {
            // console.log('执行到条件');
            item.children.push(data)
            returnedItem = item;
            return returnedItem;
            //判断chlidren是否有数据
        } else if (item.children.length > 0) {
            findId(item.children, id, data); //递归调用
        }
    });
}

export function findParentId(arr, id) {
    var returnedItem;
    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.id == id) {
            // console.log('执行到条件');
            item.children = []
            returnedItem = item;
            return returnedItem;
            //判断chlidren是否有数据
        } else if (item.children.length > 0) {
            findId(item.children, id); //递归调用
        }
    });
}
//获取选中的id
export function findSelected(arr, codeList) {

    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.selected == true) {
            if (item.children.length > 0) {
                findSelected(item.children, codeList); //递归调用
            } else if (!codeList.includes(item.id)){
                codeList.push(item.id)
            }
        }

    });
}
export function findSelectedRole(arr, codeList) {
    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.selected == true && !codeList.includes(item.id)) {
            codeList.push(item.id)
        }
        if (item.children.length > 0) {
            findSelectedRole(item.children, codeList); //递归调用
        }
    });
}
export function findUnSelectedRole(arr, codeList) {
    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.selected == false && !codeList.includes(item.id)) {
            codeList.push(item.id)
        }
        if (item.children.length > 0) {
            findSelectedRole(item.children, codeList); //递归调用
        }
    });
}
export function findSelectedTenant(arr, codeList) {
    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.selected == true && !codeList.includes(item.baseId)) {
            codeList.push(item.baseId)
        }
        if (item.children.length > 0) {
            findSelectedTenant(item.children, codeList); //递归调用
        }

    });
}

//转换路由
export function transRouter(arr, ourRouter) {

    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        item.meta = {}
        if (item.type != 3 && item.code) {
            item.router = toHump(item.code)
            if (item.type == 2) {
                item.meta.href = item.url
            }
            // return item;
            //判断chlidren是否有数据
            if (item.children.length > 0) {
                // console.log(1111111111111);
                transRouter(item.children, ourRouter); //递归调用
            }
        }
        return item

    });
    ourRouter = arr
    return ourRouter
}
export function filterRouter(arr) {
    const newArr = arr.filter(item => item.type != 3)
    return newArr.map(item => {
        if (item.children) {
            item.children = filterRouter(item.children)
        }
        return item
    })

}
function toHump(name) {
    return name.replace(/_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

// 时间格式化
export function dateFormat(value) {
    var year = value.substr(0, 4)
    var month = value.substr(5, 2)
    var day = value.substr(8, 2)
    var hour = value.substr(11, 2)
    var min = value.substr(14, 2)
    var second = value.substr(17, 2)
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second
}

export function familyTree(list, id) {
    for (let i in list) {
        if (list[i].id == id) {
            return [list[i].id]
        }
        if (list[i].children) {
            let node = familyTree(list[i].children, id);
            if (node !== undefined) {
                return node.concat(list[i].id)
            }
        }
    }
}

//按钮权限

export function formatCode(arr, codeList) {
    //利用foreach循环遍历
    arr.forEach((item) => {
        //判断递归结束条件
        if (item.children && item.type != 3) {
            formatCode(item.children, codeList); //递归调用
        } else if (!codeList.includes(item.code)){
            codeList.push(item.code)
        }
    });
}

//商品分类
export function filterArray(data, parentId) {
    var tree = []
    var temp
    for (var i = 0; i < data.length; i++) {
        if (data[i].parentId == parentId) {
            var obj = data[i]
            temp = filterArray(data, data[i].id)
            if (temp.length > 0) {
                obj.children = temp
            }
            tree.push(obj)
        }
    }
    return tree
}


//商品分类
export function findPid(arr1, id) {
    var temp = []
    var forFn = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i]
            if (item.id === id) {
                temp.unshift(item.id)
                forFn(arr1, item.parentId)
                break
            } else {
                if (item.children) {
                    forFn(item.children, id)
                }
            }
        }
    }
    forFn(arr1, id)
    return temp
}








