import { status } from '@/module/status.js'

function deepMerge(obj1, obj2) {
  let key
  for (key in obj2) {
    // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
    obj1[key] =
      obj1[key] && obj1[key].toString() === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : (obj1[key] = obj2[key])
  }
  return obj1
}
// 构造ws的请求参数
function getSendObj(type, wsOptions, extraObj) {
  let sendObj = {
    aicc: 'message',
    request: type,
    body: {
      timestamp: new Date().getTime(),
      ...extraObj,
    },
  }
  wsOptions &&
    status[type].sendArr &&
    status[type].sendArr.forEach((v) => {
      //实例上有此参数才获取，防止报错
      // Object.protopyte.hasOwnProperty.call(wsOptions, v)
      if (wsOptions.hasOwnProperty(v)) {
        sendObj.body[v] = wsOptions[v]
      }
    })
  return sendObj
}
//给ws实例追加属性
function setSendObj(type, _wsOptions, body = null) {
  let wsOptions = Object.assign({}, _wsOptions)
  const setSendArr = (status[type] && status[type].setSendArr) || null
  // 全量添加
  if (body && wsOptions && setSendArr && setSendArr === '@all') {
    wsOptions = { ...wsOptions, ...body }
  } else if (setSendArr && body) {
    //根据配置添加
    setSendArr.forEach((v) => {
      //返回的参数有才获取，防止报错
      if (body.hasOwnProperty(v)) {
        wsOptions[v] = body[v]
      }
    })
  }
  return wsOptions
}
export function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.onload = () => resolve()

    script.onerror = () => reject(new Error(`Load script from ${url} failed`))

    script.src = url
    const head = document.head || document.getElementsByTagName('head')[0]
    ;(document.body || head).appendChild(script)
  })
}
const RESOURCE_LIST = ['https://at.alicdn.com/t/c/font_3945904_8lgqy7wmzdf.js']

export function loadResourceList() {
  return RESOURCE_LIST.reduce(
    (res, el) => res.then(() => loadScript(el)),
    Promise.resolve(),
  )
    .then(() => {
      console.log('success')
    })
    .catch((error) => {
      console.error('图标加载失败:', error.name, error.message)
      return Promise.reject(error)
    })
}
// 秒转时间(HH:mm:ss)
function secondsToHours(sec) {
  var hrs = Math.floor(sec / 3600)
  var min = Math.floor((sec % 3600) / 60)
  sec = sec % 60
  sec = sec < 10 ? '0' + sec : sec
  min = min < 10 ? '0' + min : min
  hrs = hrs < 10 ? '0' + hrs : hrs
  return hrs + ':' + min + ':' + sec
}
//深拷贝数组
function deepCopyArray(arr) {
  let _arr = JSON.stringify(arr)
  let arrCopy = JSON.parse(_arr)
  return arrCopy
}
//替换数组中的某个元素
function replaceArrayItem(_arr, item_from, item) {
  let arr = deepCopyArray(_arr)
  let index = arr.indexOf(item_from)
  if (index > -1) {
    arr.splice(index, 1, item)
  }
  return arr
}
//删除数组中的某个元素
function removeArrayItem(_arr, item) {
  let arr = deepCopyArray(_arr)
  let index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}
// 字符串转dom
function parseDom(arg) {
  const objE = document.createElement('div')
  objE.innerHTML = arg
  return objE
}
export {
  deepMerge,
  getSendObj,
  setSendObj,
  secondsToHours,
  deepCopyArray,
  replaceArrayItem,
  removeArrayItem,
  parseDom,
}
