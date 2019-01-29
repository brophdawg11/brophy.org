---
title: Beware of hidden inputs in Angular filters
author: Matt Brophy
postDate: 2017-01-14 12:00
tags: angularjs,javascript,functional
---

If you've been writing JavaScript (or really any language for that matter) in the past few years, chances are you've caught wind of the rising popularity of functional programming paradigms.  _Pure functions_ are one of the major concepts of functional programming, and as it turns out, the usage of impure functions in Angular filters can produce some not-so-obvious bugs in your AngularJS application.

Don't worry, I'm not going to get into a big discussion of the advantages of functional programing/pure functions/immutability in this post.  There's plenty of stuff out there from people far smarter than me that you can find with a few simple Google searches.  However, this Angular filter nuance almost bit me recently, and the subtle nature of it caught me by surprise - even though it seems pretty blatantly obvious after the fact.  

**TL;DR;** Here's a quick [Plnkr][plnkr] demonstrating a broken and fixed filter using impure/pure functions in Angular.

### Pure Functions

For some quick reading on pure functions, I would recommend reading Kris Jenkins' great [What is Functional Programming][what-is-functional] article or checking out the Wikipedia page for [Pure Functions][pure-function].  In short, a pure function should have explicit inputs, zero side-effects, and always produce the same output for a set of inputs.

```javascript
// Bad: Impure function - hidden input from SalesService
function calculateTaxBad(price) {
    return price * SalesService.getTaxRate());
}

// Good: Pure function - no hidden inputs
function calculateTaxGood(price, taxRate) {
    return price * taxRate;
}
```

In the second example, we've removed the hidden `SalesService.getTaxRate()` input and made it an explicit input to the function.

### Angular Filters

[Angular filters][angular-filters] are a handy little mechanism for transforming data within Angular templates.

```javascript
angular.module('app').filter('uppercase', function() {
  return function(input) {
    return (input || '').toUpperCase();
  };
})
```

```html
<span>{{ 'hello world' | uppercase }}</span>

<!-- produces -->
<span>HELLO WORLD</span>
```

Cool - super simple, super useful.

### Impure functions as Angular filters

So what's the problem?  It comes down to to the logic used in the dirty checking in Angular's digest cycles.  Let's pretend we wanted to use our `calculateTaxBad` method above as a filter to produce an itemized pricing display:

```javascript
angular.module('app').filter('taxBroken', function (SalesService) {
    return function (price) {
        return price * SalesService.getTaxRate();
    }    
});
```

We could then generate the display:

```html
<p>Price: {{ item.price | currency }}</p>
<p>Tax: {{ item.price | taxBroken | currency }}</p>
```

This is where the "magical" nature of Angular's digest cycle almost came back to bite me.  At first glance, it seems reasonable to think that when the digest cycle runs, it'll evaluate the _entire_ expression `{{ item.price | taxBroken | currency }}` and determine if a re-render is required.  

However, if we look deep into the internals of Angular's parser and dirty checking logic, we can see where the problem arises:

[![Filter with hidden input](/assets/images/post/beware-hidden-inputs-in-angular-filters/parser-filter-impure.png)](/assets/images/post/beware-hidden-inputs-in-angular-filters/parser-filter-impure.png)

When parsing the expression, Angular determines that there is only one input for the expression, `data.price`.  This is based on an internal Angular assumption that the filter is pure, and therefore given one input, it will always produce the same output.  Thus, Angular doesn't need to bother executing the `taxBroken` or `currency` filters if `data.price` hasn't changed, because by definition, the output will not change.  And boom - the nasty hidden input gets ignored and our UI is broken if the `SalesService.taxRate` value changes without the corresponding price changing.

### Pure functions as Angular filters

the fix is fairly straightforward now that we know what the problem is.  By removing the hidden input, we can adjust our filter:

```javascript
angular.module('app').filter('taxFixed', function (SalesService) {
    return function (price, taxRate) {
        return price * taxRate;
    }    
});
```

We could then generate the display by explicitly passing the taxRate as a second input to the filter:

```html
<p>Price: {{ item.price | currency }}</p>
<p>Tax: {{ item.price | taxFixed:getTaxRate() | currency }}</p>
```

Now, let's look again at the Angular internals:

[![Filter with hidden input](/assets/images/post/beware-hidden-inputs-in-angular-filters/parser-filter-pure.png)](/assets/images/post/beware-hidden-inputs-in-angular-filters/parser-filter-pure.png)

We can see by adjusting the filter to pass the `taxRate` in as an input to the filter, the expression is now parsed with 2 inputs, the same first input as before, and an additional second input which is a function call corresponding to `getTaxRate()`.  

This produces our Plnkr UI showing the live usages of the broken and fixed versions of the filter while updating the tax rate:

![Plnkr UI](/assets/images/post/beware-hidden-inputs-in-angular-filters/output.png)

### Takeaway

In Angular's defense, they are actually quite [explicit][custom-filters] about this in their documentation, but it's buried a bit down in the `$filter` documentation.  And, to be honest, I would venture to guess that most beginners learning how to implement filters are not reading the full Angular docs, but rather reading from a simplified blog post or Stack Overflow response that may not touch on the pure function requirement

 >  The filter function should be a [pure function][pure-function], which means that it should be stateless and idempotent. Angular relies on these properties and executes the filter only when the inputs to the function change.

That's it for today.  Hopefully this helps someone, somewhere, trying to track down a filter bug in their app.

[plnkr]: https://plnkr.co/edit/WMMNWiSqE0Uij9ZXwy4G?p=preview "Broken Filter Example"
[angular-filters]: https://code.angularjs.org/1.4.14/docs/guide/filter "Angular Filters"
[custom-filters]: https://code.angularjs.org/1.4.14/docs/guide/filter#creating-custom-filters "Angular Custom Filters"
[pure-function]: https://en.wikipedia.org/wiki/Pure_function "Pure Function"
[what-is-functional]: http://blog.jenkster.com/2015/12/what-is-functional-programming.html "What is Functional Programming"


