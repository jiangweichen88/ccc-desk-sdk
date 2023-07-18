import Vue from 'vue'
import { i18n } from '@/locale/lang'
import { deepCopyArray, replaceArrayItem, removeArrayItem } from '@/utils'

/**
 * @description:
 * @param {*} sendArr ws发送请求需要的参数
 * @param {*} setSendArr 需要往ws实例存储的参数
 * @param {*} isShowStatus 是否在UI显示当前状态
 * @param {*} statusShowText 当前状态显示的文字，先取statusShowText再取name
 * @param {*} UIshow 配置展示的UI
 * @param {*} ThemeColor 主题颜色
 * @param {*} isUnlock 是不是解锁状态
 *
 * @return {*}
 */
const UIshow_actionBar = ['phoneNum_show', 'actionBar_show']
const UIshow_bridge = [
  ...UIshow_actionBar,
  'hangup_show',
  'hold_show',
  'quiet_show',
] // 通话中的UI
const UIshow_hangup = ['call_show'] // 话后的UI
const status = {
  locked: {
    name: i18n.t('status.locked'),
    id: 'locked',
    isShowStatus: true,
  },
  logon: {
    name: i18n.t('status.logon'),
    id: 'logon',
    isShowStatus: true,
    statusShowText: {
      success: i18n.t('status.logon') + i18n.t('main.success'),
      fail: {
        other: i18n.t('status.logon') + i18n.t('main.fail'),
        2: i18n.t('main.loginOther'),
      },
    },
    sendArr: [
      'agentId',
      'password',
      'phoneType',
      'workType',
      'phone',
      'callModel',
    ],
    setSendArr: '@all',
    isUnlock: true,
    UIshow: UIshow_hangup,
  },
  logout: {
    name: i18n.t('status.logout'),
    id: 'logout',
    isShowStatus: true,
    themeColor: '#FF3C34',
    isUnlock: true,
  },
  startCall: {
    name: i18n.t('status.startCall'),
    id: 'startCall',
    isShowStatus: true,
    sendArr: [
      'called',
      'caller',
      'followData',
      'callUui',
      'agentCaller',
      'callModel',
      'autoAnswer',
      'taskInfo',
    ],
  },

  ring: {
    name: i18n.t('status.ring'),
    id: 'ring',
    isShowStatus: true,
    UIshow: 'cache',
  },
  bridge: {
    name: i18n.t('status.bridge'),
    id: 'bridge',
    isShowStatus: true,
    sendArr: [],
    setSendArr: ['called', 'caller'],
    UIshow: UIshow_bridge,
  },
  hangup: {
    name: i18n.t('status.hangup'),
    id: 'startCall',
    isShowStatus: true,
    themeColor: '#FF3C34',
    isUnlock: true,
    UIshow: UIshow_hangup,
  },
  reconnection: {
    name: i18n.t('status.reconnection'),
    id: 'startCall',
    isShowStatus: true,
    sendArr: ['agentId', 'password', 'phoneType', 'workType'],
  },
  busy: {
    name: i18n.t('status.busy'),
    id: 'startCall',
    isShowStatus: true,
    themeColor: '#FF3C34',
    isUnlock: true,
  },
  free: {
    name: i18n.t('status.free'),
    id: 'startCall',
    isShowStatus: true,
    isUnlock: true,
  },
  quiet: {
    name: i18n.t('status.quiet'),
    id: 'quiet',
    isShowStatus: true,
    statusShowText: {
      success: i18n.t('status.quiet'),
      fail: i18n.t('status.quiet') + i18n.t('main.fail'),
    },
    UIshow: 'cache',
  },
  unQuiet: {
    name: i18n.t('status.unQuiet'),
    id: 'unQuiet',
    isShowStatus: true,
    statusShowText: {
      success: i18n.t('status.bridge'),
      fail: i18n.t('status.unQuiet') + i18n.t('main.fail'),
    },
    UIshow: 'cache',
  },
  hold: {
    name: i18n.t('status.hold'),
    id: 'hold',
    isShowStatus: true,
    statusShowText: getSuccessOrFail('hold'),
    statusShowText: {
      success: i18n.t('status.hold'),
      fail: i18n.t('status.hold') + i18n.t('main.fail'),
    },
    UIshow: 'cache',
  },
  unHold: {
    name: i18n.t('status.unHold'),
    id: 'unHold',
    isShowStatus: true,
    statusShowText: {
      success: i18n.t('status.bridge'),
      fail: i18n.t('status.unHold') + i18n.t('main.fail'),
    },
    UIshow: 'cache',
  },
  playNo: {
    name: i18n.t('status.playNo'),
    id: 'playNo',
    isShowStatus: true,
    isUnlock: false,
    UIshow: 'cache',
  },
  error: {
    name: i18n.t('status.error'),
    id: 'error',
    isShowStatus: true,
    isUnlock: false,
    themeColor: '#FF3C34',
  },
  // keepalive: {
  //   name: i18n.t('status.keepalive'),
  // },
}
function getSuccessOrFail(type) {
  return {
    success: i18n.t('status.' + type) + i18n.t('main.success'),
    fail: i18n.t('status.' + type) + i18n.t('main.fail'),
  }
}
export { status }
