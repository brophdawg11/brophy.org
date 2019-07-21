---
title: Component-Driven Performance Patterns in Vue
author: Matt Brophy
postDate: 2019-02-28 20:00
tags: vue,javascript,spa,performance
draft: true
---

As web apps grow more complex, we end up sending larger JS/CSS bundles to the client.  If you're not careful, before long you can find yourself with a site that no longer snappy on slower connections due to the sheer amount of time it takes to send the bundles across the wire.  This post aims to document  handful of patterns we've found handy at [URBN](www.urbn.com) to keep bundles small and our load times fast.


## What is "Performance"?

_Performance_ is an overly vague term often tossed around without proper specificity or context.  Performance can be impacted by any number of the following concepts, as well as any number of additional things not mentioned here:

* Server response time
* Initial HTML payload size
* Number of HTTP requests
* Asset size/compression
* Image formats and optimizations
* CSS Selector complexity
* Caching
* Bandwidth
* CPU speed
* etc.

To further complicate matters, we can measure performance using any number of metrics and methods:

* Time to First Paint (TTFP)
* SpeedIndex
* Time to Interactive
* DOM Ready
* Page Load
* Synthetic/Real-User (RUM)
* etc.

Thus, I've always found that any meaningful discussion around performance needs to properly define the aspects of performance that are being discussed, measured, and hopefully improved.

In this post, we will focus on minimizing the amount of JS we send to the client on initial render - thus hopefully speeding up our TTI metrics for the user.

## Performance Budgets

While I'm unsure who coined the _Performance Budget_ term, I came across the following article by Alex Russell at Google a while back, and it has largely been the basis for a lot of the performance work we've been doing at [URBN](www.urbn.com) over the past year or so.

> [Can You Afford It?: Real-world Web Performance Budgets](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/)

In a nutshell, using data such as network transfer speeds and CPU processing power, Alex calculates that if you want to achieve a sub-5 second TTI for users on an average mobile device on a 3G connection, you can afford to send **~130Kb of gzipped Javascript** to the client.  At a first glance, you may think this sounds like a fair amount.  That's close to 1MB uncompressed (but still minified).  However, the use of popular libraries can very quickly eat into most or all of that budget if you're not careful.  Take a look at the sizes of some of the popular libraries:

* [jQuery](https://jquery.com/): 26Kb gzipped
* [Lodash](https://lodash.com/): 20Kb gzipped
* [Moment](https://momentjs.com/): 15Kb gzipped
* [Vue](https://vuejs.org/)/[Vuex](https://vuex.vuejs.org/)/[Vue-Router](https://router.vuejs.org/): 30Kb

As you can see, it's really easy to eat into that 130Kb, with these libraries alone we've used up 91Kb, or 70% of our budget - and we haven't written a single line of our own app code.

### Quick wins

Since library-choices aren't specifically what we want to focus on in this post, I'll just say there are a few quick wins you can and should evaluate.  

* Consider each third party library you choose to bring into your codebase, and it's impact on your budget
* Use vanilla JS where you can
* Choose smaller alternatives where possible ([date-fns](https://github.com/date-fns/date-fns) over Moment)
* Use techniques such as [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) to remove unused code
  * Look for tree-shakable libraries where possible([lodash-es](https://www.npmjs.com/package/lodash-es) over the standard build) 
* Use webpack's [Performance Configurations](https://webpack.js.org/configuration/performance/#performancemaxentrypointsize) to alert you when your bundle grow beyond the acceptable limit


## Dynamic Imports and Async Components

Which brings us to the main concept of this post - using webpack [Dynamic Imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) to load code asynchronously only when it's needed.  Thankfully, if you're using Vue, this gets even easier with the use of [Async Components](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components).

An Async Component in Vue is a component that instead of being bundled directly into your main app bundles, is instead split into it's own file (via dynamic imports) and only loaded when you render it into the UI.

### Basic Async Component 

Consider the following example:

```
<template>
    <div>
        <button @click="toggleDetails">Show Details</button>
        <DetailsComponent v-if="showDetails" />
    </div>
</template>

<script>
// Bad!  Bundled into the critical path even though it's not shown
import DetailsComponent from './DetailsComponent.vue';

export default {
    components: {
        DetailsComponent,
    },
    data() {
        return {
            showDetails: false,
        };
    },
    methods: {
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
    },
};
```

We've got a `DetailsComponent` that is always hidden on initial render and only shown when the user clicks a button.  There's no need to send this component up in the initial render, so we can use a dynamic import to split it out into it's own file by changing two lines of code:

```
<template>
    <div>
        <button @click="toggleDetails">Show Details</button>
        <DetailsComponent v-if="showDetails" />
    </div>
</template>

<script>
export default {
    components: {
        // Good!  Loaded on-demand when it's shown
        DetailsComponent: () => import('./DetailsComponent.vue'),
    },
    data() {
        return {
            showDetails: false,
        };
    },
    methods: {
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
    },
};
```

Now, webpack will split all of the code for `DetailsComponent.vue`, and all of it's dependencies, into their own separate JS file, which Vue will not load until the user clicks the button.  this is a very powerful pattern that can be leveraged in a variety of ways to reduce our critical bundle sizes and improve app performance.


### Route-level Async Components

Most applications consist of a number of separate routes, loading a root component per-route.  Using static imports, we bundle all of our route components into the same critical-path bundle:

```js
// Bad!  All routes bundled together into the critical path
import HomepageView from './HomepageView.vue';
import AboutView from './AboutView.vue';

const router = new VueRouter({
    routes: [{
        path: '/',
        component: HomepageView
    }, {
        path: '/about',
        component: AboutView,
    }],
};
```

We can use async components in our route definitions to only load each route component when we route to that page:

```js
// Good!  Each route loaded only when routed to
const router = new VueRouter({
    routes: [{
        path: '/',
        component: () => import('./HomepageView.vue'),
    }, {
        path: '/about',
        component: () => import('./AboutView.vue'),
    }],
};
```


### Dynamic Vuex Modules

In larger-scale apps, we'll have a Vuex store to help with state management, and we may portion off our store into sections relevant to routes in our app:

```js
// Bad!  All routes included in the root store in the critical path
const store = new Vuex.Store({
    state: {
        homepage: {
            data: { ... },
        },
        about: {
            data: { ... }
        },
    },
    mutations: {
        SET_HOMEPAGE_DATA(state, data) {
            state.homepage.data = data
        },
        SET_ABOUT_DATA(state, data) {
            state.about.data = data
        },
    },
    actions: {
        LOAD_HOMEPAGE_DATA({ commit }) {
            axios.get('/api/homepage/data')
                .then(data => commit(SET_HOMEPAGE_DATA, data));
        },
        LOAD_ABOUT_DATA({ commit }) {
            axios.get('/api/about/data')
                .then(data => commit(SET_ABOUT_DATA, data));
        },
    },
};
```

Over time, this can lead to a very large store, with blurred boundaries about which state/mutations/actions are used by which routes.  A better approach would be to use [Vuex Modules](https://vuex.vuejs.org/guide/modules.html) to keep each our routes stores separate:

```js
// Better - routes are separated into modules...but still loaded on 
// the critical path
const homepageModule = {
    namespaced: true,
    state: () => ({
        data: { ... },
    }),
    mutations: {
        SET_HOMEPAGE_DATA(state, data) {
            state.data = data
        },
    },
    actions: {
        LOAD_HOMEPAGE_DATA({ commit }) {
            axios.get('/api/homepage/data')
                .then(data => commit(SET_HOMEPAGE_DATA, data));
        },
    },
};

const aboutModule = {
    namespaced: true,
    state: () => ({
        data: { ... },
    }),
    mutations: {
        SET_ABOUT_DATA(state, data) {
            state.data = data
        },
    },
    actions: {
        LOAD_ABOUT_DATA({ commit }) {
            axios.get('/api/about/data')
                .then(data => commit('SET_ABOUT_DATA', data));
        },
    },
};

const store = new Vuex.Store({
    state: {},
    modules: {
        homepage: homepageModule,
        about: aboutModule,
    },
};
```

This approach will scale much better as our app grows - however, we're still statically including each module in the critical path bundle.  If a user goes to the homepage - ideally we would only load the homepage module - and delay loading the about module until they click through to the about page.

To accomplish this, we can move the modules into the components and thus bundle them with the component dynamic imports.

```
// Homepage.vue
<script>
const homepageModule = {
    namespaced: true,
    state: () => ({
        data: { ... },
    }),
    mutations: {
        SET_HOMEPAGE_DATA(state, data) {
            state.data = data
        },
    },
    actions: {
        LOAD_HOMEPAGE_DATA({ commit }) {
            axios.get('/api/homepage/data')
                .then(data => commit(SET_HOMEPAGE_DATA, data));
        },
    },
};

```



* Route level
* Lazy vuex modules
* Moving Vuex modules into components
* On click
* Loading states/Error states
* Below the fold (IntersectionObserver)
* Changing behavior of components (lazy load images)
* Loading portions of a component (icons)
* Conclusion
  * Only deliver what is above-the-fold/user-visible/SEO critical on first load
  * Lazy load everything else base don user actions (click, scroll)
  * Push all dependencies behind the component entry point (vuex, third party libs, etc.)
  * Lazy load images, icons, etc.
