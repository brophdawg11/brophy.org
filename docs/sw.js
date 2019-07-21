importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/async/app.000c4097745af34ba54f.js",
    "revision": "cfb7654abfc5176230492ae6938871c0"
  },
  {
    "url": "/_nuxt/async/commons.app.9c5135f89d753b8191ab.js",
    "revision": "35164efca3c8bc03e7e0bfd57bc35f06"
  },
  {
    "url": "/_nuxt/async/contents.79eff948eb0c8bbe45ac.js",
    "revision": "039468b436081148fdcaa707790043bf"
  },
  {
    "url": "/_nuxt/async/pages/index.67facccf3fa3afeeb4be.js",
    "revision": "65a3c4908971488511d43725cef41f03"
  },
  {
    "url": "/_nuxt/async/pages/post/_slug.696eef9b23c1afe6e9f3.js",
    "revision": "fac3aa9a78e1804f0c55949837f23bd2"
  },
  {
    "url": "/_nuxt/async/pages/posts.09f9a6637f1550485ada.js",
    "revision": "4b1be5627013b438516bf8cd078e857a"
  },
  {
    "url": "/_nuxt/async/pages/resume.3ba62fe94b5297bfd6fc.js",
    "revision": "82cc9d90ee6c0c7fb25d7f169732d21d"
  },
  {
    "url": "/_nuxt/async/pages/tag/_tag.50a17bbf8a5780556003.js",
    "revision": "94649a489f580c64f7d047083bf5f5d0"
  },
  {
    "url": "/_nuxt/async/post-0.8721475ccece47641f1d.js",
    "revision": "5e4760e6032cf6087ce9833685c918cc"
  },
  {
    "url": "/_nuxt/async/post-1.96b71c789ef06d962a0b.js",
    "revision": "dd6582f9eb676dedad6ab4f4baa97d0e"
  },
  {
    "url": "/_nuxt/async/post-2.3490c66e454d4949cfd7.js",
    "revision": "ad31bfeeb45892243b4b118c6fbdccb8"
  },
  {
    "url": "/_nuxt/async/post-3.765aa72cde9c94f65de9.js",
    "revision": "31d6876b634cb12c15c03822061c2f64"
  },
  {
    "url": "/_nuxt/async/post-4.04454172c75eb776a05e.js",
    "revision": "56056850112c26bb6614810b5cc6749b"
  },
  {
    "url": "/_nuxt/async/post-5.c24b9f6b8ec8d16c00b4.js",
    "revision": "b91eeae84255038c1411bc497ebccd39"
  },
  {
    "url": "/_nuxt/async/post-6.6d72ba13bbed077e1109.js",
    "revision": "a21c6b7076fb7685ab03787db76fe348"
  },
  {
    "url": "/_nuxt/async/post-7.59405149f5bffaa4874c.js",
    "revision": "b284c8d02b1920bd95aa4dc70c9b57ec"
  },
  {
    "url": "/_nuxt/async/vendors.pages/post/_slug.pages/posts.pages/tag/_tag.162d6901fd75a3e8a5ea.js",
    "revision": "6193549f0c96003317cf2b38a0331e30"
  },
  {
    "url": "/_nuxt/async/vendors.pages/resume.4343c7a81520e7b556cc.js",
    "revision": "1a9f7f0a3d52c474aacf07e8ab9838b2"
  },
  {
    "url": "/_nuxt/runtime.94c5cfbdd2fb87a1541a.js",
    "revision": "038028e5a787157a9421e4fdccba3733"
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
