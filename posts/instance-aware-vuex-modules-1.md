---
title: Instance-Aware Vuex Modules - Part 1
author: Matt Brophy
postDate: 2020-01-26T17:00:00
tags: vue,vuex,javascript,spa
---

[Vuex](https://vuex.vuejs.org/) is a great state-management tool provided by the Vue core team. It's especially useful in server-side rendered (SSR) applications as a mechanism to send the server-side state up to the client for the app hydration process. In this post, we'll look at some of the basics of Vuex and how we can use namespaced modules to isolate our logic into small, targeted modules.

_Note: This is part 1 of a 3-part series on "Instance Aware Vuex Modules". In this post, we'll cover a basic introduction to Vuex, modules, namespaced modules, and the provided `map*` helper functions._

## Using a Basic Vuex Store

Wiring up a basic Vuex store only requires a few lines of code in our main application file:

```js
import Vue from 'vue';
import Vuex from 'vuex';

// Tell Vue to use the Vuex plugin
Vue.use(Vuex);

// Create a Vuex store
const store = new Vuex.Store({
    state: {
        count: 0,
    },
});

// Provide your store to your root Vue component
const app = new Vue({
    el: '#app',
    store,
});
```

And you're done! Now, every component in your application will have the Vuex store available via `this.$store`. This injection is done via the registered Vuex plugin.

```html
<template>
    <h1>Count is {{count}}</h1>
</template>

<script>
    export default {
        computed: {
            count() {
                return this.$store.state.count;
            },
        },
    };
</script>
```

## Namespaced Vuex Modules

As our application grows, and we add more data to `state` and corresponding `mutations` and `actions` to our store, we'll find that it starts to grow in size rather quickly. As your store file grows, sometimes some folks have recommended splitting `state`/`mutations`/`actions`/`getters` into their own files and combining them in a `store/index.js` file. Personally, I am not a fan of this approach, as it adds a level of context-switching that I find slows down a developers ability to move quickly. For example, when you are writing a `mutation`, you are directly mutating the `state` object. If you have to reference the `state` object to determine it's shape, I would prefer to scroll upwards within the same file then switch to a different file all together. Similar arguments can be made when writing `actions` using `mutations`, or `getters` accessing `state`

I find a much cleaner approach to be to split your store into [Vuex sub-modules](https://vuex.vuejs.org/guide/modules.html) focused on functionality instead of splitting by portions of the store. In an e-commerce application, this might consist of a handful of Vuex modules:

-   An `auth` module for manging the user's authentication status
-   A `cart` module for managing the items in the user's cart
-   A `header` module for managing the state of the main header and navigation tree
-   ... and so on

By splitting our main Vuex module into a handful of smaller sub-modules, we can keep these sub-modules quite small and focused, and keep our `state`/`mutations`/`actions`/`getters` to a size that permits them to remain in a single file.

Here is how we would set up some modules in our Vuex store:

```js
///// auth-store.js /////
export default {
    namespaced: true,
    state: {
        loggedIn: false,
    },
    mutations: {
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        },
    },
}

///// cart-store.js /////
export default {
    namespaced: true,
    state: {
        items: [],
    },
    mutations: {
        addItem(state, item) {
            state.items.push(item);
        },
    },
    getters: {
        itemCount(stat) {
            return state.items.length;
        },
    },
}

///// app.js /////
import authStore from './auth-store';
import cartStore from './cart-store';

const store = new Vuex.Store({
    state: { ... },
    modules: {
        auth: authStore,
        cart: cartStore,
    },
});

const app = new Vue({
    el: '#app',
    store,
});
```

Notice that each Vuex sub-module is the exact same shape as the root-module, except that we've added a [`namespaced: true`](https://vuex.vuejs.org/guide/modules.html#namespacing) property. This is optional and defaults to `false`, but I would always suggest you use it as it leads to your store being much easier to work with and debug - and it also avoids naming conflicts across different sub-modules.

Using namespaced modules, our store shape and usage starts to look a little different. Each module's `state` is stored in an object off the root store matching the name of the module at registration time. Similarly, `mutations`, `actions`, and `getters` are prefixed with the module name and a slash.

Here's how we would access those namespaced modules from a component:

```js
export {
    computed: {
        isLoggedIn() {
            return this.$store.state.auth.loggedIn;
        },
        itemCount() {
            return this.$store.getters['cart/itemCount'];
        },
    },
    methods: {
        logout() {
            this.$store.commit('auth/setLoggedIn', false)l
        },
        addCartItem(item) {
            this.$store.commit('cart/addItem', item);
        },
    },
}
```

## Vuex map\* Helper Methods

As we start using more and more modules, and even potentially start nesting them more than one level deep, it gets tedious to continue to type out the full module namespace each time you want to work with a given module. Thankfully, Vuex provides some [helper functions](https://vuex.vuejs.org/api/#component-binding-helpers) that make this much more concise in your components

Using these helpers, we can simplify the above component example to the following:

```js
import { mapState, mapGetters, mapMutations } from 'vuex';

export {
    computed: {
        ...mapState('auth', ['loggedIn']),    // Exposes this.loggedIn
        ...mapGetters('cart', ['itemCount']), // Exposes this.itemCount
    },
    methods: {
        ...mapMutations('auth', {
            logout: 'setLoggedIn',  // Exposes this.logout()
        })
        ...mapMutations('cart', {
            addItem: 'addItem',  // Exposes this.addItem()
        })
    },
}
```

This approach really starts to benefit your component code once you start using multiple mappers per store, as it reduces the boilerplate of adding a new computed property or method every time you need to access a new `state` field, `mutation`, etc.

I hope this gives a basic introduction to Vuex and it's use of namespaced modules. In [part 2](/post/instance-aware-vuex-modules-2) of this series, we'll look into using these namespaced modules to provide dynamic vuex stores for use alongside dynamic routes in vue-router. Thanks for reading!
