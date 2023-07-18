import Vue from 'vue'
import './styles/common.css'
import './assets/fonts/iconfont.css'
import Directives from './directives'
Vue.use(Directives)
import { CCCDeskSDK } from '@/class/cccDeskSDK.js'
import { Popover, Tooltip, Button, Input } from 'element-ui'
// import 'babel-polyfill'
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Input)
let CCCDeskSDKInstance = CCCDeskSDK.init({
  // 渲染组件
  domId: 'callBar_cccDesk',
  // lang: 'en',
  options: {
    seatName: '2011@CSZHL', //租户名称 必填
    // seatName: '2009@CSZHL', //租户名称 必填
    seatPassword_MD5: 'e10adc3949ba59abbe56e057f20f883e', // 坐席密码，MD5加密32位小写  必填
    wsUrl: 'wss://dev.arccocc.com/nws',
    // wsUrl: 'ws://192.168.110.69:8084/ws',
    // wsUrl: 'ws://192.168.16.23:8085/ws',
    phoneType: 3, // 登录方式 "0"手机, "1"硬话机, "2"webcall , "3"webrtc
    extraOpts: { b: 2 }
  },
  onReady($wsInstance) {
    console.log($wsInstance)
    //如需实时获取WebSocket的数据,可在此回调中获取
    $wsInstance.getStatus((data) => {
      console.log(data)
      const { body, name: type } = data
      switch (type) {
        // 振铃
        case 'ring':
          if ($wsInstance.getIsOutbound(body) === 1) {
            alert('外呼振铃')
          } else if ($wsInstance.getIsOutbound(body) === 0) {
            console.log('呼入振铃')
          }
          break
      }
      //data格式:{
      //   agentId: "2011@CSZHL",
      //   aicc: "event",
      //   body: {timestamp: 1679562380878, status: 0, reason: "Success",…},
      //   name: "logon",
      //  }
    })
  }
})
