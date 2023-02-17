<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view/>
  </a-config-provider>
</template>

<script>
import {enquireScreen} from './utils/util'
import {mapState, mapMutations} from 'vuex'
import themeUtil from '@/utils/themeUtil';
import {getI18nKey} from '@/utils/routerUtil'
import { toLogin } from "./utils/request";
export default {
  name: 'App',
  data() {
    return {
      locale: {},
      isAlertShow:false
    }
  },
  created () {
    this.setHtmlTitle()
    this.setLanguage(this.lang)
    enquireScreen(isMobile => this.setDevice(isMobile))
  },
  mounted() {
   this.setWeekModeTheme(this.weekMode)
   //已登录
   document.addEventListener('visibilitychange',this.userChange)
  },
  beforeDestroy(){
   document.removeEventListener('visibilitychange',this.userChange)
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    lang(val) {
      this.setLanguage(val)
      this.setHtmlTitle()
    },
    $route() {
      this.setHtmlTitle()
    },
    'theme.mode': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
    },
    'theme.color': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
    },
    'layout': function() {
      window.dispatchEvent(new Event('resize'))
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
          break
        case 'HK':
          this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
          break
        case 'US':
        default:
          this.locale = require('ant-design-vue/es/locale-provider/en_US').default
          break
      }
    },
    setHtmlTitle() {
      const route = this.$route
      const key = route.path === '/' ? 'home.name' : getI18nKey(route.matched[route.matched.length - 1].path)
      document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key)
    },
    popContainer() {
      return document.getElementById("popContainer")
    },
    userChange(){
      const login_user=localStorage.getItem('userName')
      let globalName=sessionStorage.getItem('globalName')
      console.log(login_user);
      if (!localStorage.getItem('userName')&&!this.isAlertShow) {
        let path=window.location.protocol + "//" + window.location.host
        this.isAlertShow=true
        alert(`该用户已退出登录 , 点击确定跳转登录页面`)
        this.isAlertShow=false
        toLogin('/stage',path)
      }
     else if (globalName!==login_user&&!this.isAlertShow) {
        this.isAlertShow=true
        alert(`已登录${login_user} , 点击确定刷新本页面`)
        sessionStorage.setItem('globalName',localStorage.getItem('userName'))
        window.location.reload()
        this.isAlertShow=false
      }
    }

  }
}
</script>

<style lang="less" scoped>
  #id{
  }
</style>
