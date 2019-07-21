importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/async/app.4457040a617c756a85cc.js",
    "revision": "855b684ef8a73066f391f248c2a8b5e6"
  },
  {
    "url": "/_nuxt/async/commons.app.818c68e7fc8bb0f5bf2d.js",
    "revision": "99ffd6061731ca101e16227d54ed07fa"
  },
  {
    "url": "/_nuxt/async/contents.4835be393b7360362c05.js",
    "revision": "c1aacf9a791a4205307039c564065f09"
  },
  {
    "url": "/_nuxt/async/pages/index.a822673d24e2764a0bc3.js",
    "revision": "6d69ab320b6bb199375759ff31de61de"
  },
  {
    "url": "/_nuxt/async/pages/post/_slug.d851e136b06223941c64.js",
    "revision": "d766429f7d92c1e548cfb3b7f9537cff"
  },
  {
    "url": "/_nuxt/async/pages/posts.415f2de41f3294c9f297.js",
    "revision": "0d617a48ee29b4033e83b31523585970"
  },
  {
    "url": "/_nuxt/async/pages/resume.73a24636a7f51f12387a.js",
    "revision": "33f4d90e3335521876a6c581bb1f6fb1"
  },
  {
    "url": "/_nuxt/async/pages/tag/_tag.5a1c760cefc1a1276084.js",
    "revision": "dedcad31a9533c79805facb07d5f1e6c"
  },
  {
    "url": "/_nuxt/async/post-0.24c4d5455fea3fc48e32.js",
    "revision": "b513c7292e8d8e07f6da0a8148f954f4"
  },
  {
    "url": "/_nuxt/async/post-1.2bdf470d8550db524753.js",
    "revision": "c698a4d210f637ba05cbb2fb947e3120"
  },
  {
    "url": "/_nuxt/async/post-2.286baef6d04a822820c8.js",
    "revision": "6578f352d30600632bc0acec3b218eee"
  },
  {
    "url": "/_nuxt/async/post-3.236bbcabd60e91b3e46f.js",
    "revision": "9b04c84ebb133c2b8ab2b926ed453f7b"
  },
  {
    "url": "/_nuxt/async/post-4.07c110b9e5c0646780a6.js",
    "revision": "538cd04c4fe6a9b3787ef6db8e4e91da"
  },
  {
    "url": "/_nuxt/async/post-5.a263c708faf6d3ba0f0c.js",
    "revision": "d2c931e31dc395f7066b428bdd8d64db"
  },
  {
    "url": "/_nuxt/async/post-6.eb9d093858231ee0d82f.js",
    "revision": "f094bc940b282762147ce560a1e2d2c0"
  },
  {
    "url": "/_nuxt/async/post-7.4cf70a73a26fa0651ff6.js",
    "revision": "fc53e7592be102e29d282c505997bc0a"
  },
  {
    "url": "/_nuxt/async/vendors.pages/post/_slug.pages/posts.pages/tag/_tag.03dcd1db5506e18083a6.js",
    "revision": "69dc21286ac7a08ff6d36edc786883db"
  },
  {
    "url": "/_nuxt/async/vendors.pages/resume.c33737de7c71c0e0fd74.js",
    "revision": "a5e40da130f8896c01109e1ee054cf24"
  },
  {
    "url": "/_nuxt/runtime.22102a7afd9fdd49cb99.js",
    "revision": "febb9d660debbdc435544b4e27fc9a24"
  }
], {
  "cacheId": "brophy.org",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
