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
export default CCCDeskSDK
export { CCCDeskSDK }
