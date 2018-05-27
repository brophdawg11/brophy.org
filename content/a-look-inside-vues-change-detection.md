---
title: A Look Inside Vue's Change Detection
author: Matt Brophy
postDate: 2017-11-15 17:30
tags: vue,javascript,spa
layout: post.nunjucks
---

<style type="text/css">
sup {
    vertical-align: super;
}
</style>

A layman's interpretation of [Occam's Razor][occams-razor] can be boiled down to _"the simplest explanation is usually the correct one."_  This was exactly what came to mind the moment I learned how [Vue.js][vue-js] implements it's change detection under the hood.  It's simple, elegant, and beautiful.

As a (primarily front-end) software engineer, I've always firmly believed that keeping up with the latest industry trends is one of the most important things I can do.  It benefits me, my employer, and generally just keeps me excited about the work I'm doing and what I might do next.  For that reason, I've been keeping a close eye on [Vue.js][vue-js] the past year or so as it's gained traction and popularity.  I've done plenty of personal toying with it.  I've implemented our first Vue.js internal app over at [URBN][urbn].  And when I saw the [Vue.js Advanced Features from the Ground Up][vue-advanced-features] course pop up over on [Frontend Masters][frontend-masters], I knew I had to check it out. 

  > _**Disclaimer**: Evan You is smarter than me.  Everything in this post comes from that course.  So, if you've got the time and money, I highly suggest checking out the course instead of reading this article._

That being said, maybe you've only got the rest of your lunch break and this article is just short enough to fit in there.  So let's dive in.

## Change Detection

One common problem that all reactive UI frameworks must solve is how to handle change detection.  _I.e._, if I change my view model, how does the DOM know to update?  Frameworks have solved this with dirty checking, virtual DOM (vdom) diffing, and probably other ways I don't even know about.  But generally, there's some level of overhead in current approaches.  

When dirty checking, we always run a few dirty checks against thing's that _haven't_ changed.  In vdom diffing, we render some set of virtual DOM nodes that _haven't_ changed.  And in the more explicit approaches, we can limit what needs to be checked by manually declaring _which_ properties a given component cares about.  However, beyond the fact that this tightly couples your template and model (leading to potential long term maintenance issues), it also _still_ requires a level of dirty checking or vdom processing to determine which of your subset _actually changed_.  There's _got_ to be a better way.

I'll be honest, for a long time, I wasn't sure there was.  I had accepted that libraries like Angular and React had made the less-than-optimal approaches fast enough for real world use.  And they work.  And pretty damn well at that.

There was even a brief evening where I began looking into [Proxy][proxy] objects, thinking that I could use those to potentially proxy up an entire object store to know exactly what deeply nested property changed on every change, and therefore attempt to render out the minimally dependent set of UI updates.  I still think that's theoretically possible, possibly non-trivial, and potentially very expensive, but in that evening, I didn't have the energy to continue down that road.  Maybe some other time...

## Vue.js Change Detection

Enter Vue.js Change detection.  That thought above with the proxies seems to be something of a holy grail of Change Detection.  Given that our template bindings make it easy to know what portions of our UI use what portions of our view model.  It'd be _awesome_ if we could know, automatically and on every change to our view model -- exactly what property it was, so we can re-render only the minimally required set of UI templates.

So, we're going to do just that, using this simple little JSBin template of the [Pythagorean Theorem][pythagorean-theorem]  - yeah, that guy, from high school.  Good old _a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>_.  It actually turns out to be a great simple candidate for a reactive UI - as we've got two explicit one-to-one dependencies (a, b), and one implicit one-to-many dependency (c).  

Our first example below is completely non-reactive.  We've created a basic view model `store` object, and wired up some render functions, but we've done nothing to wire up our UI such that render functions will re-run on store changes.  

The `highlight` function is just for this example - to apply a little CSS animation on properties anytime they re-render.  If you reload, you might catch the initial render highlights.  But since this is a non-reactive example, you won't see any more.

## Non-Reactive UI

_Note: The embedded bin is currently unavailable, as I recently moved off static HTTP hosting on AWS S3 to HTTPS hosting via Firebase, and didn't realize embedding JSBin over HTTPS required a Pro account.  For now, use this [direct link to the JSBin](https://jsbin.com/joguyav/3/edit?html,js,output).  Apologies for the inconvenience :(_

<a class="jsbin-embed" 
   href="https://jsbin.com/joguyav/3/embed?js,output">
    Simple Non-Reactive UI
</a>

Now, what would it take to make it reactive?  One explicit way might be to do something like:

```javascript
function dependsOn(path, renderFns) {
    // Magic logic to compare prior store values to current store 
    // values for store[path] and execute render functions when 
    // they change
}

dependsOn('a', [ renderA, renderC ]);
dependsOn('a', [ renderB, renderC ]);
```

And this will work just fine...but it doesn't scale.  We've tightly coupled our data model to our render functions - and updating one without the other can become problematic.  Assume `renderC` becomes more complex and relies on a new `store.d` property - if we forget to add `dependsOn('d', [ renderC ])` - our UI will be broken.  And worst of all, it'll only be slightly broken.  Most of our reactive rendering will still work just fine.  It'll just be the scenario that when `store.d` changes that won't re-render.  We'll just need to hope that QA has test cases for that scenario.


## Making it Reactive

So, what can we do?  The Vue.js approach is broken down into 3 steps:

### Pseudo Object-proxying

The first step Vue tackles is that it creates a sort of pseudo-proxy for your data store using Object [getter]/[setter] functions.  Using this approach, we can define properties on an object that actually contain getter and setter functions for when they are accessed:

```javascript
let obj = {};
let value;
Object.defineProperty(obj, 'foo', {
    get() {
        console.log('Getting property');
        return value;
    },
    set(val) {
        console.log(`Setting property to ${val}`);
        value = val;
    }
});

obj.foo = 5          
// Logs "Setting property to 5"

console.log(obj.foo) 
// Logs "Getting property"
// Also logs the value: 5
```

Thats pretty cool - we've now got a property `obj.foo`, that we can know any time it is accessed or changed.  The former is vital to know what computed (higher-order) properties might access `obj.foo`.  The latter is vital to know when to re-render templates that contain `obj.foo`.  The nice thing is tht we an do this directly on top of existing properties too, which will come in handy later.

### Dependency Tracking

Now, logging something to the console doesn't really do us any good.  Instead, we need a simple way to track dependencies between data store properties and associated render functions.  So Vue uses a really simple class, we'll call it `Dep`, to track dependencies:

```javascript
window.Dep = class {
    constructor() {
        this.deps = new Set();
    }

    depend(fn) {
        this.deps.add(fn);
    }

    notify() {
        this.deps.forEach(fn => fn());
    }
};

const dep = new Dep();
const logger = () => console.log("I'm a logger!");
dep.depend(logger);
dep.notify();
// Logs "I'm a logger!"
```

Again, nice and simple.  Maintain an internal [Set][set] object to track all our dependent functions, and a simple `notify` function to iterate through and execute all dependencies.

### The Magic

Hopefully by now, you're starting to see where we're headed.  We have a way to proxy reads and writes to properties on our data store and do _something_ accordingly.  We also have a simple way to track dependent functions.  And our end goal here is to know what render functions to execute when certain properties change.  _I.e._, we need to know _what_ render functions depend on _what_ data store properties.  And we need to do that automatically, without any explicit declarations on our part.  🤔

```javascript
// How can we know, automatically, that 'renderA' depends on 'store.a'?
function renderA() {
  $('a').innerHTML = store.a * store.a;
}
```

This is exactly where Occam's Razor comes into play.  We've done nothing super advanced thus far, less than about 20 lines of plain, vanilla JS code.  But we're at this crux where we need one final piece to tie it all together.  I can remember thinking, _"this must be the really hard part that's 100's of lines long."_

I couldn't have been more wrong.  This is what I think is the true genius of Vue.js's approach (and Evan You for coming up with it).  And it takes advantage of one little aspect of the Javascript language.  Nothing new, nothing fancy.  **Javascript is single threaded** (if that's a word).  Javascript has been single threaded since day 1, long before all the ES6 syntax/functions the cool kids are using these days.

Remember, we have a way using our getter proxy to know any time a given property is accessed.  So - what if we could know _who_ is accessing it?  Well, because Javascript is single threaded, there is only _one_ function running at any given point in time.  So, what if we tracked what that function was, and stored that as our dependency?

```javascript
// Single global variable to track _what_ function of ours is currently running
let currentFn;

function makeFunctionReactiveAndExecute(fn) {
    function wrapped() {
        currentFn = fn;
        fn();
        currentFn = null;
    }
    wrapped();
}

makeFunctionReactiveAndExecute(renderA);
```

So, what have we done here?  We've setup a tiny wrapper function that when run for a given function (`renderA`), it:

* Marks globally in `currentFn` that `renderA` is executing
* Executes `renderA` (assumes it's synchronous, which render functions are)
* Unsets `currentFn` such that it shows no function is currently running

Now, when `renderA` executes inside of `wrapped` above, and it accesses our proxied version of `store.a`, we an look at `currentFn` to know _what_ function accessed `store.a` (_I.e._, what function _depends_ on `store.a`).

## Reactive UI

_Note: The embedded bin is currently unavailable, as I recently moved off static HTTP hosting on AWS S3 to HTTPS hosting via Firebase, and didn't realize embedding JSBin over HTTPS required a Pro account.  For now, [use this direct link to the JSBin](https://jsbin.com/joguyav/5/edit?html,js,output).  Apologies for the inconvenience :(_

<a class="jsbin-embed" 
   href="https://jsbin.com/joguyav/5/embed?js,output">
    Fully Reactive UI
</a>

And there you have it.  Automatic dependency tracking and reactive UI updates.  No manual registering of watcher or subscribers.  No dirty checking.  No virtual DOM diffing.  We know exactly what properties change (via our object proxies), and exactly what render functons care (via our `currentFn` tracking).  so when a given property changes, we execute every render function that cares.  and only those render function that care.

### Additional Notes

It should be noted that this is a _very_ simplified example of the core concepts used in Vue's change detection approach.  It:

  * Does not support for complex property types (_I.e._, arrays)
  * Does not support nested objects on the data store
  * Assumes reactive functions are always synchronous
  * Probably glazes over a _ton_ of other stuff that's included in the actual Vue implementation

But I think it's a great example of the core concepts and their underlying simplicity.  

Thanks for reading!

[frontend-masters]: https://frontendmasters.com/ "Frontend Masters"
[getter]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get "Object Getter"
[occams-razor]: https://en.wikipedia.org/wiki/Occam%27s_razor "Occam's Razor"
[proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy "Proxy"
[pythagorean-theorem]: https://en.wikipedia.org/wiki/Pythagorean_theorem "Pythagorean Theorem"
[set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set "Set"
[setter]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set "Object Setter"
[vue-advanced-features]: https://frontendmasters.com/workshops/vue-advanced-features/ "Vue Advanced Features"
[urbn]: http://www.urbn.com/ "URBN"
[vue-js]: https://vuejs.org/ "Vue.js"

