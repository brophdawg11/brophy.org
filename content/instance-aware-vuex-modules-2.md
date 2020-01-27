---
title: Instance-Aware Vuex Modules - Part 2
author: Matt Brophy
postDate: 2020-01-26 21:00
tags: vue,vuex,javascript,spa
---

_Note: This is part 2 of a 3-part series on "Instance Aware Vuex Modules".  In [Part 1](/post/instance-aware-vuex-modules-1) we covered a basic introduction to Vuex and the use of namespaced modules.  In this post, we'll explore using dynamically-namespaced Vuex modules alongside dynamic routes in vue-router, and some interesting challenges presented._

## Dynamic Vuex Modules per Route

Now that we have a better understanding of how Vuex modules work (from [part 1](/post/instance-aware-vuex-modules-1)), we can start exploring the main reason for this series.  If you happened to also read my [Component Driven Performance Patterns](/post/async-loading-patterns-in-vue) article, you may remember how we talked about registering Vuex modules dynamically as we go to a new route, in order to keep that module code off the critical path and keep our apps fast.  Specifically, in the [Dynamic Vuex Modules](/post/async-loading-patterns-in-vue#dynamic-vuex-modules) section we talk about how we would dynamically register a route-level module for a Homepage and an About page on our website.

Let's change that up a bit here and work with a bit more complicated example where our route has dynamic parameters.  Consider again an e-commerce site where we can view different products via URLs such as `/product/red-dress` and `/product/blue-dress`.  In [vue-router](https://router.vuejs.org/) we can set that up as follows:

```js
import Router from 'vue-router';
import ProductRouteComponent from 'ProductRouteComponent.vue';

const router = new Router({
    routes: [{ 
        path: '/product/:slug', 
        component: ProductRouteComponent,
    }],
})    
```

Now, when we render our `ProductRouteComponent` via a url such as `/product/red-dress`, we will be able to access the `red-dress` slug via `this.route.params.slug`.

### Data Fetching

Once we have our router passing along the proper slug, we have to handle fetching the data for the given slug.  There are two main ways to approach this concept of loading async-data along with a route transition.

#### Option 1: Fetch data, then route

In this approach, when a user clicks on a link, we fetch the data for the destination route while still on the current route.  Once we have the data, we can route to the destination.  This allows us to route/animate into a fully-rendered destination route.  If we were to encounter errors during the data fetch, we can show some form of in-context error on the current page.

#### Option 2: Route, then fetch data

In this approach, when a user clicks on a link we immediately route them to the destination route, and then start the data fetch.  Because we don't have the data available, the destination route component needs to be able to kick off it's own data fetching as well as show some sort of skeleton view or loading state during the fetch.  If we encounter any errors during the data load, our destination page needs to show some form of error state to the user.

_Note: This was a common enough decision that the Vue SSR docs [have an entire section for it](https://ssr.vuejs.org/guide/data.html#logic-collocation-with-components), which [used to include](https://github.com/vuejs/vue-ssr-docs/pull/222/files#diff-c53265dc51020ae044ecbbb195278a96L167) both of the above approaches.  However, with the introduction of the `serverPrefetch` hook in Vue 2.6, they seem to now only document the second approach because it aligns with the `serverPrefetch` hook.  Personally I think both options are viable depending on your UX, so I do wish they still included documentation on the first approach._

_For this post we are going to choose option 1 above, but the concept of Instance-Aware Vuex Modules applies in both cases._

### Vuex Module Registration

The idea is to use a dynamic Vuex module per-route, so we need a way to:

1. Let a route-level component define a Vuex module to be used
2. Let a route-level component define _how_ to fetch the data required for that route
3. Hook into all routing operations so we can register the Vuex module and fetch the data for the destination route

For performance reasons, we'd like to include all logic related to a given route behind the [route-level async component](/post/async-loading-patterns-in-vue#route-level-async-components) so that all of the associated code is bundled with the webpack chunk for that route.  

First, we have to define a Vuex module that can handle the data for our route.  Here is what a simple product page module might look like.  Note that we're [using a function](https://vuex.vuejs.org/guide/modules.html#module-reuse) for our `state` here so we can re-use this module across multiple routes.

```js
// product-module.js
export {
    namespaced: true,
    state: () => ({
        productData: null,
    }),
    mutations: {
        setData(state, data) {
            state.productData = data;
        },
    },
    actions: {
        async loadData({ commit }, slug) {
            const data = await fetchProductDataForSlug(slug);
            commit('setData', data);
        },
    },
};
```

Then, we can add some new properties to our route-level component for (1) and (2) above to inform it of our module and how to fetch the data required for our route:

```js
// ProductRouteComponent.vue
import productModule from './product-module';

export default {
    name: 'ProductRouteComponent',
    // This property doesn't mean anything to Vue, this is a special property we
    // will be using to tell our router hook about the dynamic Vuex module we want
    // to use
    vuex: {
        moduleName: 'product',
        module: productModule,
    },
    // Another property that doesn't mean anything to Vue, but that we'll be calling
    // from our route guard to fetch the data required before routing to this route
    fetchData(route, store) {
        return store.dispatch('product/loadData', route.params.slug);
    },
}
```

As you can see, we've added a new `vuex` property to our component that allows us to define the Vuex module and namespace we'd like to use for these routes.  Then, we've added a new `fetchData` method that, given the route and the Vuex store instance, will use the provided Vuex module and the route slug to fetch the appropriate data for the route.

With this, we now need to solve (3) above and hook into our routing lifecycle so we can leverage these two new properties on our components.  To hook into a routing operation, we can use the [`vue-router` `beforeResolve`](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-resolve-guards) navigation guard.  This allows us to perform async operations and call `next` to continue with the routing operation.  The following example is based on the [now-removed](https://github.com/vuejs/vue-ssr-docs/pull/222/files#diff-c53265dc51020ae044ecbbb195278a96L167) approach in the Vue SSR docs.

_Note: This is a simplistic approach for example purposes.  In a real-world app you will need to do some comparisons between prior routes and avoid double-registering modules_

```js
// router.js
router.beforeResolve(async (to, from, next) => {
    // Find out the components that match our destination route.  This will
    // only be more than one component if you are using nested routes
    const matched = router.getMatchedComponents(to);

    try {
        // Register Vuex modules for each destination component
        matched
            .filter(cmp => cmp.vuex)
            .forEach(cmp => store.registerModule(cmp.vuex.moduleName, cmp.vuex.module));
        
        // Execute fetchData for each destination component
        const promises = matched
            .filter(cmp => cmp.fetchData)
            .map(cmp => cmp.fetchData(to, store));
        await Promise.all(promises);

        // All data is now loaded, call next() to continue the routing
        // operation
        next();
    } catch (e) {
        // We encountered an error while fetching data, call next(e) to 
        // abort the routing operation
        next(e);
    }
});
```

Cool - now we have a way to automatically load data into a namespaced Vuex module for every routing operation!  Below is a codepen showing this in action.  The product page in this case is mapping the product slug in from it's namespaced Vuex store so it can render the slug in the template.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="brophdawg11" data-slug-hash="GRgedVm" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vuex Module/Vue Router Animation Issue">
  <span>See the Pen <a href="https://codepen.io/brophdawg11/pen/GRgedVm">
  Vuex Module/Vue Router Animation Issue</a> by Matt Brophy (<a href="https://codepen.io/brophdawg11">@brophdawg11</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<br>

## So, we're done, right?

So that's it?  We can take this approach and run with it.  We can use namespaced modules for all of our routes and everything just works?  

...not quite.  Did you try clicking between `/product/red-dress` and `/product/blue-dress` above?  And if so do you see the bug?  Go back and look closely...

...

OK, hopefully you saw it - when we click from one product route to another, the current route that is being animated out updates with the destination route slug.  This happens because we're using the same `product` namespace for all `ProductRouteComponent` instances.  So when we load `/product/red-dress` we populate the `state.product` store with data from the `red-dress`.  But when we click to the `blue-dress`, during our `beforeResolve` hook we update the same `state.product` store with the `blue-dress` data, and because Vue's computed properties are reactive, our current view (very helpfully) re-renders the new data for us while it's being animated out.

Keep in mind that this is really only a problem if you intend to animate route transitions between the same Route-level components.  If this isn't an issue in your UX, then you may be just fine with the current approach.  

But, if we need to support this - what are our options?  There's no way to tell a Vue component to just stop being reactive (as far as I know).  So we need to find a way to actually support having _two_ route-level components rendered on the screen, at the same time, from two different Vuex modules.  

### Namespacing to the rescue

Namespacing seems like an obvious solution to this issue, but we're already namespacing, so what gives?  the problem is that we haven't made our namespace specific enough.  We chose `product`, which is specific to our route-entry, but not specific enough for each potential instance of that route-entry.  Because our route of `/product/:slug` is slug-specific - we need to also ensure our Vuex namespace is slug-specific.

So, lets take a look at what that might mean to our above setup.  We don't need to change our vuex module at all - we simply need to adjust the namespace we register it with.  So what if instead of a static string for the namespace, we provided a function that could generate a namespaced given a component instance?

```js
// ProductRouteComponent.vue
import productModule from './product-module';

// Function that will return us a slug-specific namespace based on 
// the current route
const getNamespace = cmp => `product--${cmp.$route.params.slug}`;

export default {
    name: 'ProductRouteComponent',
    vuex: {
        moduleName: getNamespace, // Specify a function instead of a string
        module: productModule,
    },
    fetchData(route, store) {
        // Since we don't yet have a component instance yet, we can fake
        // it and provide an object with the $route property we require
        const fakeCmp = { $route: route };
        const namespace = getNamespace(fakeCmp);
        return store.dispatch(`${namespace}/loadData`, route.params.slug);
    },
}
```

This type of change will allow us to create a store that looks like the following.  It will allow us to have both `red-dress` and `blue-dress` components rendered simultaneously from their own respective Vuex stores.  And we'll also have mutations/actions/getters that are specific to the individual stores.

```js
store.state = {
    `product--red-dress`: {
        productData: { ... },        
    },
    `product--blue-dress`: {
        productData: { ... },        
    },
}
```

### map* helpers 

This above setup works quite well from my experience, but it does have one fairly annoying "issue" in that it does not play nicely with the awesome `map*` helpers provided by Vuex because they only accept a static string for the namespace.  There is no way to dynamically determine the namespace at runtime based on the component instance.  

```js
// ProductRouteComponent.vue
export {
    methods: {
        // This works with a static namespace, but there is no way to map 
        // these actions such that they differentiate between 
        // `product--red-dress/loadData` and `product--blue-dress/loadData`
        ...mapActions('product', {
            loadData: 'loadData',
        }),
    },
}
```

This functionality [has been requested](https://github.com/vuejs/vuex/issues/863) but the Vuex team has decided not to implement it because there are some ways to workaround it, although I don't personally like the workarounds due to the amount of additional boilerplate code they require.  Here's an example of the [workaround proposed by the Vuex authors](https://github.com/vuejs/vuex/issues/863#issuecomment-329510765):

```js
// ProductRouteComponent.vue
const getNamespace = cmp => `product--${cmp.$route.params.slug}`;

export {
    methods: {
        ...mapActions({
            loadData(dispatch, payload) {
                return dispatch(getNamespace(this) + '/loadData', payload);
            },
        }),
    },
}
```

While this works fine, it doesn't really scale very well as you map more and more state/mutations/actions/getters into your component.  Let's look at a more realistic scenario for a product page where your Vue store exposes a lot of various actions and getters:

```js
// ProductRouteComponent.vue
const getNamespace = cmp => `product--${cmp.$route.params.slug}`;

export {
    computed: {
        ...mapState({
            productName: state => state[this.namespace].productName,
            productPrice: state => state[this.namespace].productPrice,
            productColors: state => state[this.namespace].productColors,
            productSizes: state => state[this.namespace].productSizes,
        }),
        namespace() {
            return getNamespace(this);
        },
    },
    methods: {
        ...mapActions({
            loadData(dispatch, payload) {
                return dispatch(this.namespace + '/loadData', payload);
            },
            addToCart(dispatch, payload) {
                return dispatch(this.namespace + '/addToCart', payload);
            },
        }),
    },
}
```

To me, this is a lot of repetitive boilerplate just to support namespaced properties.  It's also worth noting that this simple approach above doesn't work for nested module state where the namespace is more than one level deep.  I would instead like to see something that looks almost identical to how we'd use the `map*` helpers with static namespaces.  Something like the following is what we're striving for:

```js
export {
    computed: {
        ...mapInstanceState(getNamespace, {
            productName: state => state.productName, 
            productPrice: state => state.productPrice,
            productColors: state => state.productColors,
            productSizes: state => state.productSizes,
        ]),
    },
    methods: {
        ...mapInstanceActions(getNamespace, {
            loadData: 'loadData',
            addToCart: 'addToCart',
        }),
    },
}
```

## Creating Instance-Aware Helpers

Thankfully, we're not totally stuck with the overly-verbose workaround proposed by he Vuex authors.  It's possible to write our own little wrapper utilities that will abstract away the boilerplate and get us back to the lean approach we'd have with static namespaces.

Let's look at how we could write a `mapInstanceState` wrapper around `mapState` that allowed for namespace functions instead of strings.

First, let's look at what the `mapState` usage looks like for a static namespace:

```js
computed: {
    ...mapState('product', {
        productName: state => state.productName,
    }),
},

// This effectively becomes the following at runtime:
computed: {
    productName() {
        const moduleState = this.$store.state.product;
        return moduleState.productName;
    },
},
```

For dynamic namespaces, we could write our transformation such that it still just uses `mapState` under the hood, so consider the following transformation:

```js
const getNamespace = cmp => cmp.$route.params.slug;

// We would need to transform this:
computed: {
    ...mapInstanceState(getNamespace, {
        productName: state => state.productName,
    }),
},

// Into something like this using the regular mapState function:
computed: {
    ...mapState({
        productName() {
            const namespace = getNamespace(this);
            const moduleState = this.$store.state[namespace];
            return moduleState.productName;
        },
    }),
},

```

So, we can leverage `mapState` against the root store, and we just need to enhance the provider "mapper" functions to determine the namespace and provide the namespaced module state to the mapper.

Let's see at what this looks like:

```js
function mapInstanceState(getModuleNameFn, mappers) {
    // Create an object of the same shape but with namespaced mapper functions
    const namespacedMappers = {};
    Object.entries(mappers).forEach((entry) => {
        const [name, mapper] = entry;
        // Note: Do not use an arrow function because we do _not_ want to
        // capture the `this` value at this point, we need the runtime 
        // component instance to be the `this` value
        namespacedMappers[name] = function (state) {
            // Determine the namespaced module state
            const namespace = getModuleNameFn(this);
            // "Walk" the state tree step by step,m just in case we have a 
            // deeply nested namespace
            const moduleState = namespace.split('/')
                .reduce((acc, p) => acc[p], state);
            // Call the original mapper function with the moduleState
            return mapper.call(this, moduleState);
        };
    });

    // Pass through our namespaced mappers to the normal mapState function
    return mapState(namespacedMappers);
}
```

What we're doing here is going through all of the values of the object passed as the second argument to `mapInstanceState` (i.e., the mapper functions) and creating wrapping them in little outer functions that will determine the proper namespace, then the namespaced module state, and then call the existing mapper function with the module state.  then we take this newly created object and pass it along to `mapState`.  

Now if we update our example to use these dynamic namespaced based on the route slug, we can see that we no longer have an issue during our animations - because we are working off of two different sub-modules:

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="brophdawg11" data-slug-hash="ZEYPgZm" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vuex Module/Vue Router Animation Issue - Fixed">
  <span>See the Pen <a href="https://codepen.io/brophdawg11/pen/ZEYPgZm">
  Vuex Module/Vue Router Animation Issue</a> by Matt Brophy (<a href="https://codepen.io/brophdawg11">@brophdawg11</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<br>

I should note that the function above doesn't yet support all of the same usages as the `mapState` function.  For example, it cannot use the array shorthand, nor does it pass through module `getters` as the second argument, but those are not terribly complex changes to add if required.

We should also note that similar `mapInstanceMutations`, `mapInstanceActions` and `mapInstanceGetters` can be written using very similar approaches.  We've been using this type of approach a lot over at [URBN](https://www.urbn.com) and hopefully we'll open source our versions of these utilities in the near future.

Thanks for Reading, and stay tuned for part 3 of this series where we will look into some other use cases for instance-aware Vuex components beyond strictly route-level components.

