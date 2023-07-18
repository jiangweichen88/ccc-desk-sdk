<template>
  <div class="ccc-sdk-main">
    <!-- 状态栏 -->
    <div class="status-bar dis-f flex1 a-center fl" :style="{ 'background-color': themeColor }">
      <div v-show="phoneNum_show" class="phone-num" v-copy="phoneNum">
        {{ phoneNum }}
      </div>
      <div class="status dis-f">
        <el-popover placement="bottom" width="200" trigger="click" :disabled="isDisabledStatus">
          <ul class="status-ul">
            <li @click="change_status(item)" class="item" v-for="item in selectOptions" :key="item.id">
              <span>{{ item.name }}</span>
            </li>
          </ul>
          <span class="trig-box" slot="reference"
            >{{ statusName }}
            <div v-show="!isDisabledStatus" class="trig"></div
          ></span>
        </el-popover>
        <div class="time" v-show="wsInstance">
          <span>{{ time }}</span>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="telbtns dis-f">
      <!-- 拨打、接听、按钮 -->
      <span v-show="call_show" class="call btn">
        <el-popover v-show="!answer_show" placement="bottom" width="258" trigger="click">
          <div id="CallCenter_call_div" class="enternum" style="display: block">
            <div class="arrow"></div>
            <div class="popover_content">
              <div class="dis-f">
                <el-input @keyup.enter.native="call" v-model.trim="callNum" size="mini" :placeholder="$t('main.callNumPlaceholder')"></el-input>
                <el-button class="marl10" @click="call" size="mini" round>{{ $t('main.call') }}</el-button>
              </div>
            </div>
          </div>
          <el-tooltip slot="reference" class="item" effect="dark" :content="$t('main.call')" placement="top">
            <i class="iconfont icon-waihu"> </i>
          </el-tooltip>
        </el-popover>
        <el-tooltip v-show="answer_show" class="item" effect="dark" :content="$t('main.answer')" placement="top">
          <i @click="answer" class="iconfont icon-jieting"> </i>
        </el-tooltip>
      </span>
      <!-- 挂断按钮 -->
      <el-tooltip v-show="hangup_show || answer_show" class="item" effect="dark" :content="$t('main.hangup')" placement="top">
        <i @click="wsInstance.request('hangup')" class="iconfont icon-guaduan"> </i>
      </el-tooltip>
      <div v-show="actionBar_show" class="actionBar dis-f">
        <!-- 取消保持 -->
        <el-tooltip v-show="unHold_show" class="item" effect="dark" :content="$t('status.unHold')" placement="top">
          <i @click="wsInstance.request('unHold')" class="iconfont icon-quxiaobaochi"> </i>
        </el-tooltip>
        <!-- 保持 -->
        <el-tooltip v-show="hold_show" class="item" effect="dark" :content="$t('status.hold')" placement="top">
          <i @click="wsInstance.request('hold')" class="iconfont icon-baochi"> </i>
        </el-tooltip>
        <div v-show="holdBox_show" class="dis-f">
          <!-- 静音 -->
          <el-tooltip v-show="quiet_show" class="item" effect="dark" :content="$t('status.quiet')" placement="top">
            <i @click="wsInstance.request('quiet')" class="iconfont icon-quxiaojingyin"> </i>
          </el-tooltip>

          <!-- 取消静音 -->
          <el-tooltip v-show="unQuiet_show" class="item" effect="dark" :content="$t('status.unQuiet')" placement="top">
            <i @click="wsInstance.request('unQuiet')" class="iconfont icon-jingyin"> </i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { status } from 'ccc-desk-sdk-noui/src/module/status.js'
import { status } from '@/module/status.js'
import { secondsToHours } from '@/utils'
import { Message } from 'element-ui'
import CCCDeskSDK_noui from 'ccc-desk-sdk-noui'
export default {
  components: {},
  data() {
    return {
      phoneNum: '',
      statusName: this.$t('main.connection'),
      status_val: '',
      selectOptions: [
        {
          name: status.free.name,
          id: 'free'
        },
        {
          name: status.busy.name,
          id: 'busy'
        }
      ],
      time: '00:00:00',
      callNum: '',
      phoneNum_show: false,
      call_show: false,
      actionBar_show: false,
      hangup_show: false,
      unQuiet_show: false,
      unHold_show: false,
      quiet_show: true,
      hold_show: true,
      holdBox_show: true,
      answer_show: false,
      themeColor: '#00b972',
      isDisabledStatus: false,
      wsInstance: null //webSocket实例
    }
  },
  computed: {
    _time() {
      return this.time
    }
  },
  watch: {},
  name: 'phone',
  props: {},
  methods: {
    change_status(item) {
      this.wsInstance.request(item.id)
    },
    call() {
      this.wsInstance.request('startCall', { called: this.callNum })
    },
    updateUI(_status, body, wsOptions) {
      this.setUIvalues(_status, body, wsOptions)
      if (_status.isShowStatus) {
        this.setUIstatus(_status, body, wsOptions)
      }
    },
    setUIstatus(_status, body = {}, wsOptions) {
      if (_status.statusShowText && body.status === 0) {
        //成功
        this.statusName = _status.statusShowText.success
        this.status_val = _status.statusShowText.success
      } else if (_status.statusShowText && body.status !== 0) {
        //失败
        let failText = _status.statusShowText.fail
        if (typeof failText === 'object') {
          failText = failText[body.status] ? failText[body.status] : failText.default
        }
        this.statusName = failText
        this.failUI()
        Message.warning({
          message: body.reason || this.$t('main.requestFail'),
          type: 'warning',
          duration: 1000
        })
      } else {
        this.statusName = _status.name
      }
    },
    setUIvalues(_status, body = {}, wsOptions) {
      this.phoneNum = wsOptions.called || ''
      const { UIshow, themeColor, isUnlock } = _status
      //状态为0，成功；兼容处理不返回status默认是0
      if (!body.hasOwnProperty('status')) {
        body.status = 0
      }
      if (body.status != 0) {
        return
      }
      //显示隐藏
      if (UIshow && UIshow !== 'cache') {
        const arr = [
          'phoneNum_show', //电话号码
          'call_show', //拨打
          'actionBar_show',
          'hangup_show', //挂断
          'unQuiet_show',
          'unHold_show',
          'quiet_show',
          'hold_show'
        ]
        arr.forEach((item) => {
          if (UIshow.indexOf(item) > -1) {
            this[item] = true
          } else {
            this[item] = false
          }
        })
      } else if (UIshow && UIshow === 'cache') {
        // 需要缓存
        const type = _status.id
        const cacheParams = [
          'unQuiet_show',
          'unHold_show',
          'quiet_show',
          'hold_show' //特殊处理
        ]
        const exchange = {
          unQuiet_show: 'quiet_show',
          quiet_show: 'unQuiet_show',
          unHold_show: 'hold_show',
          hold_show: 'unHold_show'
        }
        this.holdBox_show = true
        this.hangup_show = true
        switch (type) {
          case 'ring':
            if (body.dir === 1) {
              //呼入
              this.call_show = false
            } else {
              //呼出
              this.call_show = true
              this.answer_show = true
            }
            break
          case 'hold':
            this.hangup_show = false
            this.hold_show = false
            this.unHold_show = true
            this.holdBox_show = false
            break
          case 'playNo':
            this.hangup_show = false
            this.call_show = false
            break
          default:
            this[type + '_show'] = false
            this[exchange[type + '_show']] = true
            break
        }
      }
      // 解锁状态
      if (isUnlock) {
        this.isDisabledStatus = false
      } else {
        this.isDisabledStatus = true
      }
      //主题色
      if (themeColor) {
        this.themeColor = themeColor
      } else {
        this.themeColor = '#00b972'
      }
    },
    // 时钟
    startTime() {
      this.UItime = 0
      this.time = secondsToHours(this.UItime)
      this.UItime_obj && clearInterval(this.UItime_obj)
      this.UItime_obj = setInterval(() => {
        this.UItime++
        this.time = secondsToHours(this.UItime)
      }, 1000)
    },
    resetUI() {},
    failUI() {
      this.themeColor = '#FF3C34'
      this.call_show = false
    },
    answer() {
      this.wsInstance.cccDesk_CallCenter.AcceptCall()
    }
  },
  mounted() {
    this.$nextTick(() => {
      let { $sdkOption: sdkOption, $sdkInstance } = this
      // 实例化无UI版
      let nouiInstance = new CCCDeskSDK_noui({
        options: {
          ...sdkOption.options,
          extraOpts: {}
        },
        onReady(_this) {
          // 渲染完成回调
          sdkOption.onReady && sdkOption.onReady(_this)
        }
      }).init()
      console.log(sdkOption, $sdkInstance, nouiInstance)
      this.wsInstance = nouiInstance.$wsInstance

      //获取ws状态数据
      nouiInstance.getStatus((data) => {
        // console.log(data)
        const wsOptions = nouiInstance.$wsInstance.wsOptions
        const type = data.name
        const body = data.body
        //开始计时
        if (type === 'logon' || type === 'startCall' || type === 'hangup') {
          this.startTime()
        }
        if (type === 'ring' && !this.wsInstance.isOutbound) {
          this.answer_show = true
        } else if (type !== 'keepalive') {
          this.answer_show = false
        }
        // 更新UI
        if (status[type]) {
          this.updateUI(status[type], body, wsOptions)
        }
        // 渲染完成回调,可能会优化这块的逻辑
        // if (type === 'logon' && body.status === 0) {
        //   sdkOption.onReady && sdkOption.onReady(nouiInstance)
        // }
      })
    })
  },
  beforeDestroy() {
    // document.removeEventListener('socket_onmessage')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ccc-sdk-main {
  font-weight: bold;
  height: 36px;
  line-height: 36px;
}
.iconfont {
  cursor: pointer;
  margin: 0 5px;
}
.telbtns {
  height: 36px;
  display: flex;
  align-items: center;
}
.ccc-sdk-main .status-bar {
  color: #fff;
  background-color: #00b972;
  /* max-width: 400px; */
  padding: 0 20px;
  border-radius: 4px;
  margin-right: 10px;
}
.status-ul li {
  cursor: pointer;
  padding: 4px 4px;
  margin-bottom: 6px;
}
.status-ul li:hover {
  cursor: pointer;
  background: #cecece;
}
.status-ul li.hover {
  background: #00b972;
}
.trig-box {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.trig {
  margin-left: 6px;
  width: 0;
  height: 0;
  border-top: 4px solid #fff;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  content: '';
}
.time {
  margin-left: 10px;
}
.status-select {
  width: 82px;
  height: 22px;
  outline: none;
  border: none;
  margin: 0 10px;
}
.status {
  margin-left: 10px;
}
.btn {
  display: block;
  cursor: pointer;
  width: 30px;
  /* height: 34px;
  width: 33px; */
}
.btn img {
  width: 100%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
