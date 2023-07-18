import copy from './copy'
// import tip from './tooltip/index.js'

// 自定义指令
const directives = {
  copy,
  // tip,
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}
