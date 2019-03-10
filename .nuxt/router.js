import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _1302eb3a = () => interopDefault(import('../pages/posts.vue' /* webpackChunkName: "pages/posts" */))
const _24c8cdcd = () => interopDefault(import('../pages/resume.vue' /* webpackChunkName: "pages/resume" */))
const _18e2c3fb = () => interopDefault(import('../pages/post/_slug.vue' /* webpackChunkName: "pages/post/_slug" */))
const _d6938b60 = () => interopDefault(import('../pages/tag/_tag.vue' /* webpackChunkName: "pages/tag/_tag" */))
const _4dee9fe2 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/posts",
      component: _1302eb3a,
      name: "posts"
    }, {
      path: "/resume",
      component: _24c8cdcd,
      name: "resume"
    }, {
      path: "/post/:slug?",
      component: _18e2c3fb,
      name: "post-slug"
    }, {
      path: "/tag/:tag?",
      component: _d6938b60,
      name: "tag-tag"
    }, {
      path: "/",
      component: _4dee9fe2,
      name: "index"
    }],

    fallback: false
  })
}
