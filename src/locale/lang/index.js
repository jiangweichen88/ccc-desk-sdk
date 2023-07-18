import Vue from 'vue'
import VueI18n from 'vue-i18n'
// 自己的多语言文件
Vue.use(VueI18n)

const i18n = new VueI18n({
  messages: {
    // js 方式
    zh: require('@/locale/lang/zh'), // 中文语言包
    en: require('@/locale/lang/en'), // 英文语言包
  },
  fallbackLocale: 'zh', // 匹配不到时默认的语言
  silentTranslationWarn: true, // 控制台的warning
  locale: localStorage.getItem('language') || 'zh', // set locale
})

// 非 vue 文件中使用这个方法
const translate = (localeKey) => {
  const locale = localStorage.getItem('language') || 'zh'
  const hasKey = i18n.te(localeKey, locale) // 使用i18n的 te 方法来检查是否能够匹配到对应键值
  const translatedStr = i18n.t(localeKey)
  if (hasKey) {
    return translatedStr
  }
  return localeKey
}

export { i18n, translate }
