importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/04454172c75eb776a05e.js",
    "revision": "56056850112c26bb6614810b5cc6749b"
  },
  {
    "url": "/_nuxt/3490c66e454d4949cfd7.js",
    "revision": "ad31bfeeb45892243b4b118c6fbdccb8"
  },
  {
    "url": "/_nuxt/40858ba0032ef86f2adc.js",
    "revision": "1987c80c409b5fa3e14a117417f5fd00"
  },
  {
    "url": "/_nuxt/458d43f594ccbf3b4cc1.js",
    "revision": "e255e25513287cf54fac4c22da920a28"
  },
  {
    "url": "/_nuxt/52f88ad5eefe681ab953.js",
    "revision": "933eacac38d32ee97a7294fc7e00b5c7"
  },
  {
    "url": "/_nuxt/59405149f5bffaa4874c.js",
    "revision": "b284c8d02b1920bd95aa4dc70c9b57ec"
  },
  {
    "url": "/_nuxt/6d72ba13bbed077e1109.js",
    "revision": "a21c6b7076fb7685ab03787db76fe348"
  },
  {
    "url": "/_nuxt/765aa72cde9c94f65de9.js",
    "revision": "31d6876b634cb12c15c03822061c2f64"
  },
  {
    "url": "/_nuxt/79eff948eb0c8bbe45ac.js",
    "revision": "039468b436081148fdcaa707790043bf"
  },
  {
    "url": "/_nuxt/8721475ccece47641f1d.js",
    "revision": "5e4760e6032cf6087ce9833685c918cc"
  },
  {
    "url": "/_nuxt/921cd2c9ae4dd82c9a5b.js",
    "revision": "f14a899059732bb2a973c2257d420bf4"
  },
  {
    "url": "/_nuxt/92baad10e8576323a1a9.js",
    "revision": "7160d4f874a8ed8774c53302cf6384ed"
  },
  {
    "url": "/_nuxt/a4f6b76a56b4308ec726.js",
    "revision": "6f67579f57a741f2300820ee01feab47"
  },
  {
    "url": "/_nuxt/ba54a89f5236a6e46341.js",
    "revision": "af087a0155a317af2258445e2000b3bd"
  },
  {
    "url": "/_nuxt/bc20afbfa9e7104d090b.js",
    "revision": "e4aedda332f1520387829f245c12a28d"
  },
  {
    "url": "/_nuxt/c24b9f6b8ec8d16c00b4.js",
    "revision": "b91eeae84255038c1411bc497ebccd39"
  },
  {
    "url": "/_nuxt/e47551c0445ff80cc51d.js",
    "revision": "31ff89f37876d9969593380aa7b01f8c"
  },
  {
    "url": "/_nuxt/e7b03dadce62414de120.js",
    "revision": "614a31d2e5d76e18d66d965273cdee5d"
  },
  {
    "url": "/_nuxt/f5ea07a72f9f258600e0.js",
    "revision": "cfa6fd212160cef164947bf4e7319893"
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
