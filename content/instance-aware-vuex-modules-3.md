---
title: Instance-Aware Vuex Modules - Part 3
author: Matt Brophy
postDate: 2020-02-16 13:00
tags: vue,vuex,javascript,spa
---

_Note: This is part 3 of a 3-part series on "Instance Aware Vuex Modules".  In [Part 1](/post/instance-aware-vuex-modules-1) we covered a basic introduction to Vuex and the use of namespaced modules.  In [Part 2](/post/instance-aware-vuex-modules-2) we covered the usage of dynamic route-based Vuex modules, the issues with `map*` helpers, and how we can work around them with our own `mapInstance*` helpers methods.  In this post, we'll explore other opportunities where instance-aware Vuex modules can help us._

_Interested in using this approach?  We've open-sourced these helpers functions we're using at [URBN](https://www.urbn.com/) as the [`@urbn/vuex-helpers`](https://www.npmjs.com/package/@urbn/vuex-helpers) package on `npm`._

## Container/Presentational Components

There's a widely popular and often-referenced blog post from Dan Abramov (Redux co-creator, member of the React Team) called [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).  The general idea presented by Dan in this post is that there's a benefit to separating your components into two categories:

* **Presentational** components are concerned with how things _look_
* **Container** components are concerned with how things _work_

This is indeed an incredibly helpful pattern in a lot of use-cases.  In some ways, it's similar to a version of the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) in that if a component is concerned with both how it looks and how it works, it could be argued to now have 2 responsibilities.

When following this pattern, we often find ourselves "lifting" business logic out of presentational components and up into an ancestor container component.  In small use-cases, this can be fine and we may have two components living next to each other.  But if you read the update in at the top of Dan's blog post, he states

> I don’t suggest splitting your components like this anymore. If you find it natural in your codebase, this pattern can be handy. But I’ve seen it enforced without any necessity and with almost dogmatic fervor far too many times. The main reason I found it useful was because it let me separate complex stateful logic from other aspects of the component. 

In my personal experience, I have found that as you move into more complex UI interactions, the strict presentational/container divide becomes trickier to follow, and in some ways starts to move code that's highly related far apart from each other.  This violates a coding pattern referred to as [colocation](https://kentcdodds.com/blog/colocation) that I have always found very helpful to follow.


## Example: An E-Commerce Cart

Let's consider a basic e-commerce site to start, where we might render the items in your cart along with a way to update their quantity and remove them from the cart.  Following a strict container/presentational pattern, we may split these components by user action:

```html
<CartItem>
    <CartItemTitle />
    <CartItemImage />
    <CartItemPriceContainer>
        <CartItemPrice />
    </CartItemPriceContainer>
    <CartItemRemoveContainer>
        <CartItemRemove />
    </CartItemRemoveContainer>
</CartItem>
```

In this case, the components would have the following responsibilities:

* `CartItem` - Presentational component responsible for scaffolding of child components
* `CartItemTitle`/`CartItemImage` - Presentational components for displaying the title and image
* `CartItemPriceContainer` - Container component that make the API call to update the item price based on an event from `CartItemPrice`
* `CartItemPrice` - Presentational component that displays the price and quantity, and upon changing quantity emits an event to it's parent container
* `CartItemRemoveContainer` - Container component that make the API call to remove the item based on an event from `CartItemRemove`
* `CartItemRemove` - Presentational component that displays the remove button and emits an event to it's parent container upon click


This setup would certainly work, and it provides a really nice separation of of business logic (container components) and UI logic (presentational components).

However, even though we can remove items and change their pricing, think about what additional impacts that may have on our UI:

* Somewhere above `CartItem` there must be a component that knows about all of our items, so when we remove an item we need to inform that component.  Do we emit an event from `CartItemRemoveContainer` -> `CartItem` -> `CartItemList`?
* What if we have a cart summary or something in our header, maybe showing your total # of items and cost.  When we remove items or change quantities, we need to update those components as well.  Do we emit events for those?  Or if they are not in our hierarchy, do we send a global event?

These type of problems are where Vuex really starts to shine, in that it gives us a single store for our application state to avoid lots of messy intra-component communication.

### Using Vuex

Let's then consider what might happen to our example when we bring Vuex into the mix.  We would likely move the business logic from our container components to Vuex actions such as `UPDATE_ITEM_QUANTITY` and `REMOVE_ITEM`.  This can then end up really simplifying our container components because all they really need to do now is dispatch an action:

```html
<!-- CartItemRemoveContainer.vue -->
<template>
    <CartItemRemove @remove="removeItem" />
</template>

<script>
export default {
    props: ['item'],
    methods: {
        async removeItem() {
            try {
                await this.$store.state.dispatch('REMOVE_ITEM', this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
    },
};
</script>
```

At this point, you could certainly argue that this specific container component is no longer necessary.  We went from 2 locations to deal with removing an item to 3 and this component really doesn't do anything except serve as a proxy for a Vue event to a Vuex action.  If we remove these now-empty container components, we can simplify our component hierarchy a good bit as well:

```html
<CartItem>
    <CartItemTitle />
    <CartItemImage />
    <CartItemPrice />
    <CartItemRemove />
</CartItem>
```

That seems much nicer to work with!  But what do we do with the code that used to be in the containers?  It seems we have 2 options - we could either lift the Vuex action into `CartItem` or we could push it down into `CartItemRemove`.

### Lifting Business Logic to `CartItem`

If we lift the action up, we maintain our strictly presentational component in `CartItemRemove`.  This seems advantageous initially, however remember that our `CartItem` component used to be presentational in that it was responsible for scaffolding all of it's child components.  Now it's doing UI logic for itself as well as business logic for many of it's children.  Consider what happens in the long run for our `CartItem` as the UI requirements grow and we add more and more functionality to our app.  Maybe in addition to editing quantity, we can edit item colors/sizes, or save the item for later, or add gift wrap to an item:

```html
<!-- CartItemRemoveContainer.vue -->
<template>
    <!-- Note we do not include here for brevity, but this component would 
    have a handful of div and other wrapper components to properly lay out 
    the UI of a cart item -->
    <CartItemTitle />
    <CartItemImage />
    <CartItemSize @update="updateSize"/>
    <CartItemColor @update="updateColor"/>
    <CartItemPrice @update="updateQuantity"/>
    <CartItemRemove @remove="removeItem"/>
    <CartItemSave @save="saveItemForLater"/>
    <CartItemGiftWrap @save="addItemGiftWrap"/>
</template>

<script>
export default {
    props: ['item'],
    methods: {
        async updateSize() {
            try {
                await this.$store.state.dispatch('UPDATE_SIZE', this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
        async removeItem() {
            try {
                await this.$store.state.dispatch('REMOVE_ITEM', this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
        ...
    },
};
</script>
```

As our app grows, this component continues to increase in size and ends up doing the vast majority of the handling of a cart item, both from a UI scaffold perspective as well as communicating with Vuex and handling API errors and error states.  We've kept our UI logic in purely presentational components at the cost of encapsulation since we no longer encapsulate individual item action behaviors into sub-components.

If we step back a moment and consider Dan Abromov's initial reason for this layer of separation:

> The main reason I found it useful was because it let me separate complex stateful logic from other aspects of the component. 

I think we argue that we've done that by moving the logic to Vuex.  And by lifting the handling of that logic to the parent `CartItem` component, we've lost some of the benefits of [colocation](https://kentcdodds.com/blog/colocation) and [encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)).  


### Pushing Business Logic Down into our Presentational Components

😧 _GASP!_  _The audacity!_  

I know, but hear me out.  Let's say we push the logic down into our `CartItemRemove` component:

```html
<!-- CartItemRemove.vue -->
<template>
    <div>
        <!-- pretty UI markup here -->
        <button @click="removeItem">
            Remove Item
        </button>
    </div>
</template>

<script>
export default {
    props: ['item'],
    methods: {
        async removeItem() {
            try {
                await this.$store.state.dispatch('REMOVE_ITEM', this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
    },
};
</script>

<style>
.item-remove { ... }
</style>
```

I would argue that this still accomplishes the goals of the container/presentational separation.  This component is still only concerned with how things _look_.  It still has no idea _how_ to remove an item, we've just moved from emitting an event to a parent component to dispatching an action to Vuex.  We haven't made this component any more aware of the business logic, so I argue that it still qualifies as "presentational."

The main advantage of this approach over lifting the dispatching to the parent is that we've gained a level of colocation that I would argue is super helpful.  No longer does a developer have to touch the `CartItem` component when dealing with removal logic.  They work solely in `CartItemRemove` and the `REMOVE_ITEM` Vuex action, which seems nice and simple for an incoming developer to figure out too (or even the original author 6 months down the road!).  This is true for all of our other cart item actions as well.  Furthermore, we've vastly simplified `CartItem` again so it's now mainly focused on scaffolding it's child components, but not performing business logic on the item itself.


## Vuex Setup

So, with our example above, we've reached a point that we have a nice separation of concerns:

* `CartItem` parent component - responsible for scaffolding child components
* `CartItem*` child components - responsible for displaying the UI for performing these actions, and dispatching Vuex events when the user performs them
* Vuex - contains all business logic in distinct actions for _how_ to perform these actions

To further clean up our code above, we can put all of these actions into a `cart` namespaced Vuex module, and start using `mapActions` to reduce some of the boilerplate in our components:

```js
// cart-module.js
export default {
    namespaced: true,
    state: {
        items: [],
    },
    ...,
    actions: {
        REMOVE_ITEM({ commit }, itemId) {
            await apiClient.post(`remove/${itemId}`);
            // commit new items either from new API call or local modification
        }
    }
};

// store.js
import cartModule from './cart-module';

export default new Vuex.Store({
    state: { ... },
    modules: {
        cart: cartModule
    }
})


// CartItemRemove.vue
import { mapActions } from 'vuex';

export default {
    props: ['item'],
    methods: {
        ...mapActions('cart', {
            removeItem: 'REMOVE_ITEM',
        }),
        async onRemoveClick() {
            try {
                await this.removeItem(this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
    },
};
```


## Displaying Multiple Carts

Now, let's consider a more complex UI scenario.  Remember the action to save an item for later?  What if we wanted to display these saved items on the page, below your active cart.  This would give the user an easy way to scan both and to move items from saved items into their active cart for purchase.  

We could consider extending our `cart` Vuex module to contain separate lists of active cart items and saved cart items.  

```js
// cart-module.js
export default {
    namespaced: true,
    state: {
        items: [],
        savedItems: [],
    },
    ...,
    actions: {
        REMOVE_ITEM({ commit }, itemId) {
            // Is this a saved item, or a normal item?
            // Do I make a different API call depending on which?
            await apiClient.post(`remove/${itemId}`);
        }
    }
};
```

But that seems a bit wrong - the `cart` module is intended to handle a single cart.  This may introduce some additional logic in having to know how to handle differences between active and saved cart items.  What if we want to use this module on another page as well - maybe for displaying a wishlist, or displaying the cart items on a users receipt page?  In those cases we wouldn't want the module to hold 2 carts - we'd just want whatever the "current" cart we were displaying.

Instead, maybe for pages where we want to display multiple carts, we should have multiple instances of this Vuex module?


```js
// store.js
import cartModule from './cart-module';

export default new Vuex.Store({
    state: { ... },
    modules: {
        cart: cartModule,
        savedCart: cartModule
    }
})
```

That seems nicer - now we have explicit sections dealing with our two carts.  Now keep in mind this only works if the active and saved cart business logic is _mostly_ the same.  I.e., hitting similar endpoints, allowing similar user actions, etc.  In cases that they differ, I've found it really useful to use either the [Factory Method Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) or [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) to help handle these differences.

Let's assume that maybe it's a slightly different API call to remove an item from the saved cart.  We can use a factory pattern to create the Vuex module that knows how to behave differently:

```js
// cart-module.js
export default function createCartModule(isSaved) {
    namespaced: true,
    state: {
        items: [],
    },
    ...,
    actions: {
        REMOVE_ITEM({ commit }, itemId) {
            if (isSavedCart) {
                await apiClient.post(`removed/saved/${itemId}`);
            } else {
                await apiClient.post(`remove/${itemId}`);
            }
        }
    }
};

// store.js
import createCartModule from './cart-module';

export default new Vuex.Store({
    state: { ... },
    modules: {
        cart: createCartModule(false),
        savedCart: createCartModule(true)
    }
})
```

Or, we could look into a dependency-injection approach if the differences in logic are more extreme:

```js
// cart-module.js
export default function createCartModule(removeItem) {
    namespaced: true,
    state: {
        items: [],
    },
    ...,
    actions: {
        REMOVE_ITEM({ commit }, itemId) {
            await removeItem(itemId);
        }
    }
};

// store.js
import createCartModule from './cart-module';

function removeActiveItem(itemId) { ... }

function removeSavedItem(itemId) { ... }

export default new Vuex.Store({
    state: { ... },
    modules: {
        cart: createCartModule(removeActiveItem),
        savedCart: createCartModule(removeSavedItem)
    }
})
```


## map* Helpers

This is playing out nicely.  We now have nicely isolated components handling a specific UI aspect of a cart item, delegating business logic to Vuex.  We've got a Vuex module capable of managing a given cart (active or saved), and we have a way to handle minor differences in logic between cart types while still using the same module.  

So let's step higher up in our stack and see how we'd render a page with multiple carts:


```html
<!-- CartPage.vue -->
<template>
    <h1>Cart</h1>
    <ul>
        <li v-for="item in activeItems" :key="item.id">
            <CartItem :item="item" />
        </li>
    </ul>

    <h1>Saved Items</h1>
    <ul>
        <li v-for="item in savedItems" :key="item.id">
            <CartItem :item="item" />
        </li>
    </ul>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState('cart', {
            activeItems: state => state.items,
        }),
        ...mapState('savedCart', {
            savedItems: state => state.items,
        }),
    },
}
</script>
```

This works great!  We just `mapState` from our different Vuex modules to get access to our items, and them loop through them using `v-for` and display each `CartItem`.  

But, there's still a lurking problem.  Remember what our sub-components ended up looking likje once we wired them up to dispatch events directly to Vuex?

```js
// CartItemRemove.vue
import { mapActions } from 'vuex';

export default {
    props: ['item'],
    methods: {
        ...mapActions('cart', {
            removeItem: 'REMOVE_ITEM',
        }),
        async onRemoveClick() {
            try {
                await this.removeItem(this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
    },
};
```

Uh-oh - we've hardcoded these to work directly on the `cart` module.  We need a way for these sub-components to know how to dispatch their actions to the `savedCart` module.


## mapInstance* Helpers to the Rescue

This is where our concept of instance-aware Vuex modules saves the day.  If we decide to pass along a `moduleName` property down from `CartPage` -> `CartItem` -> `CartItemRemove` so we know what module to work off of, we lose the ability to use the Vuex `map*` helpers because they only accept a static namespace.  Using `mapInstance*` helpers allows us to continue to work using these helpers:

```js
// CartItemRemove.vue
import { mapInstanceActions } from '@urbn/vuex-helpers';

// We'll determine our module based on the moduleName prop on this component
const getModuleName = cmp => cmp.moduleName;

export default {
    props: ['moduleName', 'item'],
    methods: {
        // This will map either cart/REMOVE_ITEM or savedCart/REMOVE_ITEM
        ...mapInstanceActions(getModuleName, {
            removeItem: 'REMOVE_ITEM',
        }),
        async onRemoveClick() {
            try {
                await this.removeItem(this.item.id);
            } catch (e) {
                // Do something to inform the user of the error
            }
        },
    },
};
```


## Conclusion

I think this concept of re-using Vuex modules with different/dynamic namespaces has a number of benefits:

* We still have the concept of pseudo-presentational components primarily concerned with how things _look_
* We've eliminated the standard "container" components in favor of managing business logic in Vuex
* We've created isolated Vuex modules to deal with certain sub-sections of our application, leading to better encapsulation of the code for those areas
* We've achieved a level of colocation by dispatching our Vuex actions directly from our presentational components
* By using dynamic Vuex modules, we've allowed ourselves to re-use Vuex modules more easily while not impacting the way in which users can use map* methods to reduce Vuex boilerplate code

It's somewhat odd that it took 3 full blog to arrive at this final conclusion of "you can call `mapInstanceState` instead of `mapState`" 😬.  I think these are the types of patterns that start to emerge when doing application development at scale.  When working in smaller apps or even blog post examples, it's really easy to look at container/presentational patterns and see them working really well.  Or not seeing the issues of a lack of co-location because there is just not enough different logic to make it a pain point.  From my experience, it;'s not until you get into a larger-scale usage that the pain points can start to emerge.  

Anyway, I hope you enjoyed this, thanks for reading!

