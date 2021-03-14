---
title: Using ViewModels to Simplify Vue Component Props
author: Matt Brophy
postDate: 2021-01-24
tags: vue,javascript,spa
draft: true
---

When writing highly-reusable Vue components in a large code base and over time, often times you end up needing to account for more and more slight variations of that component's display based on different use cases.  It's common to add props to handle many of these cases, but over time as a component builds up to a large number of props it can become a bit more cumbersome and verbose to use the component.  Let's look at how we can use a ViewModel approach to help keep our components feature-rich, easily usable, and easily testable.

Let's start with a fairly common example in the e-commerce space - the Product Tile.  Initially, this might start as a fairly simple component which displays a product image and a product price.

```html
<template>
    <div>
        <img :src="image" >
        <p>{{ title }}</p>
    </div>
</template>

<script>
export default {
    name: 'ProductTile',
    props: ['image', 'title'],
};
</script>
```

At this scale, it's fairly straightforward to use 2 props to drive the display, and it keeps the usage ofg the component nice and compact in parent components:

```html
<ProductTile :image="productImage" :title="productName" />
```

However, if we look closer at that component, we're missing some very important aspects required for a useful tile on an e-commerce site.  Here's a few examples of additional things we may need for our UI:

* Alt text for the image
* A link to the product page
* Price
* Available colors
* A second image to display on hover
* Sale or promotional information
* Additional images for responsive displays
* Ability to open a quickshop or quickview modal
* Ability to heart or "favorite" a product

At this point, we've ballooned up to 10 or more props for the component, and usage becomes a bit verbose in the parent component:

```html
<ProductTile 
    :image="productImage" 
    :title="productName" 
    :altText="productName"
    :href="productUrl"
    :price="productPrice"
    :colors="productColors"
    :hoverImage="productHoverImage"
    :onSale="productOnSale"
    :highResImage="productHighResImage" />
```

Beyond usage being on the more verbose side - the construction of these individual prop values also has to happen - usually in the `data` method or a `computed` property.  And then and we start using this component in multiple places potentially coming from different data sources - we end up writing oa lot of code spread across a bunch of components just to properly fill-in all of the props on our shared component.


## Object props?

One way we can alleviate some of this verbosity and potential duplication is to wrap up all of our props into a single object and just pass that through:

```html
<template>
    <a :href="productData.href">
        <img :src="productData.image" >
        <p>{{ productData.title }}</p>
    </a>
</template>

<script>
export default {
    name: 'ProductTile',
    props: ['productData'],
};
</script>
```

Now, we can use this component in a much more concise manner:

```html
<ProductTile :productData="productData" />
```

While this certainly "works," it does, to an extent leave the user wondering _what_ properties can or should be on `productData`.  Some readers might even ask _"why couldn't we just use `v-bind`?"_  And certainly we could!  We could create an object with all of the props and just do `<ProductTile v-bind="obj" />`.

However, using this object-based approach suffers a bit form a lack of explicitness or clarity when it comes to using this component down the road.  They generally would need to read the `ProductTile` template to determine _what_ fields can be on the single object prop.  Or, they may reference an existing use-case of the component and see how that parent construct the object prop.  In the former case, it's tedious and the user needs to reverse-engineer the component to an extent.  While in the latter - they may miss out on features available to them, only because they chose a use-case not using them.

## Introducing View Models

Instead, here's a pattern we've started using at URBN in these cases of highly-flexible/highly-reused components.  In order to provide some more concrete definitions and documentation around the fields available, we use JavaScript classes which we can create and document in a concise manner, and also leverage type checking at the Vue prop level.

Benefits
 - reusbale
 - testable
 - easy to use
