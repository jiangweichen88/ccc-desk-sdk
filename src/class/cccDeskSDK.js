import Vue from 'vue'
import Lib from '@/Lib.vue'
import { i18n } from '@/locale/lang'
class CCCDeskSDK {
  constructor(option = {}, cb) {
    localStorage.setItem('language', option.lang || 'zh')
    this.extraOpts = option.options.extraOpts || {}
    // 单例
    if (!CCCDeskSDK.instance) {
      CCCDeskSDK.renderDom(option, cb)
      CCCDeskSDK.instance = this
    }
    return CCCDeskSDK.instance
  }
  // 渲染vue
  static renderDom(option, cb) {
    // 先判断参数
    if (!option) {
      console.log('缺少参数')
      return
    }
    // 1.创建或挂载节点
    const { domId = 'callBar_cccDesk', lang } = option
    //没有此dom就新建
    if (!document.getElementById(domId)) {
      let outer = document.createElement('div')
      outer.setAttribute('id', domId)
      document.body.appendChild(outer)
    }
    // 2.vue挂载
    new Vue({
      i18n,
      render: (h) => h(Lib)
    }).$mount('#' + domId)
    // 3.传入的参数绑定到全局，方便统一调用
    // Vue.prototype.$keyA = option.keyA
    // Vue.prototype.$keyB = option.keyB
    Vue.prototype.$sdkOption = option

    // 4.绑定成功的回调，完成弹框功能后，通知用户
    Vue.prototype.$successCb = cb
  }
  // 初始化
  static init(option, cb) {
    if (!this.instance) {
      this.instance = new CCCDeskSDK(option, cb)
    }
    Vue.prototype.$sdkInstance = this.instance
    return this.instance
  }
  static test() {
    console.log(666666)
  }
}
export { CCCDeskSDK }
