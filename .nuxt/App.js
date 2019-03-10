import Vue from 'vue'
import NuxtLoading from './components/nuxt-loading.vue'

import '../static/fontello/css/icon-font.css'

import '../assets/scss/index.scss'

import _24df4daa from '../layouts/centered.vue'
import _6f6c098b from '../layouts/default.vue'

const layouts = { "_centered": _24df4daa,"_default": _6f6c098b }

export default {
  head: {"title":"brophy.org","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Matt Brophy&#39;s Personal Website"},{"http-equiv":"x-ua-compatible","content":"ie=edge"},{"name":"apple-mobile-web-app-capable","content":"yes"},{"name":"apple-mobile-web-app-status-bar-style","content":"black-translucent"},{"name":"apple-mobile-web-app-title","content":"brophy.org"},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"author","name":"author","content":"Matt Brophy"},{"hid":"theme-color","name":"theme-color","content":"#fff"},{"hid":"og:type","name":"og:type","property":"og:type","content":"website"},{"hid":"og:title","name":"og:title","property":"og:title","content":"brophy.org"},{"hid":"og:site_name","name":"og:site_name","property":"og:site_name","content":"brophy.org"},{"hid":"og:description","name":"og:description","property":"og:description","content":"Matt Brophy&#39;s Personal Website"}],"link":[{"rel":"manifest","href":"\u002Fstatic\u002Fmanifest.json"},{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon\u002Ffavicon.ico"},{"rel":"shortcut icon","type":"image\u002Fx-icon","href":"\u002Ffavicon\u002Ffavicon.ico"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"57x57","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-57x57.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"60x60","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-60x60.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"72x72","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-72x72.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"76x76","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-76x76.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"114x114","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-114x114.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"120x120","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-120x120.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"144x144","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-144x144.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"152x152","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-152x152.png"},{"rel":"apple-touch-icon","type":"image\u002Fx-icon","sizes":"180x180","href":"\u002Fstatic\u002Ffavicon\u002Fapple-touch-icon-180x180.png"},{"rel":"icon","type":"image\u002Fpng","sizes":"32x32","href":"\u002Fstatic\u002Ffavicon\u002Ffavicon-32x32.png"},{"rel":"icon","type":"image\u002Fpng","sizes":"192x192","href":"\u002Fstatic\u002Ffavicon\u002Fandroid-chrome-192x192.png"},{"rel":"icon","type":"image\u002Fpng","sizes":"16x16","href":"\u002Fstatic\u002Ffavicon\u002Ffavicon-16x16.png"}],"style":[],"script":[],"htmlAttrs":{"lang":"en"}},

  render(h, props) {
    const loadingEl = h('NuxtLoading', { ref: 'loading' })
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      },
      on: {
        beforeEnter(el) {
          // Ensure to trigger scroll event after calling scrollBehavior
          window.$nuxt.$nextTick(() => {
            window.$nuxt.$emit('triggerScroll')
          })
        }
      }
    }, [ templateEl ])

    return h('div', {
      domProps: {
        id: '__nuxt'
      }
    }, [
      loadingEl,
      transitionEl
    ])
  },
  data: () => ({
    isOnline: true,
    layout: null,
    layoutName: ''
  }),
  beforeCreate() {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created() {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (process.client) {
      window.$nuxt = this
      this.refreshOnlineStatus()
      // Setup the listeners
      window.addEventListener('online', this.refreshOnlineStatus)
      window.addEventListener('offline', this.refreshOnlineStatus)
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },

  mounted() {
    this.$loading = this.$refs.loading
  },
  watch: {
    'nuxt.err': 'errorChanged'
  },

  computed: {
    isOffline() {
      return !this.isOnline
    }
  },
  methods: {
    refreshOnlineStatus() {
      if (process.client) {
        if (typeof window.navigator.onLine === 'undefined') {
          // If the browser doesn't support connection status reports
          // assume that we are online because most apps' only react
          // when they now that the connection has been interrupted
          this.isOnline = true
        } else {
          this.isOnline = window.navigator.onLine
        }
      }
    },

    errorChanged() {
      if (this.nuxt.err && this.$loading) {
        if (this.$loading.fail) this.$loading.fail()
        if (this.$loading.finish) this.$loading.finish()
      }
    },

    setLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      this.layoutName = layout
      this.layout = layouts['_' + layout]
      return this.layout
    },
    loadLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      return Promise.resolve(layouts['_' + layout])
    }
  },
  components: {
    NuxtLoading
  }
}
