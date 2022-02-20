---
title: Vue Microfrontends
author: Matt Brophy
postDate: 2020-03-31
tags: vue,javascript,spa,microfrontend
draft: true
---

What's all the fuss about this new "microfrontends" concept, anyway? Let's dive in and take a look at one way to setup a microfrontend stack using [Vue](https://vuejs.org/).

Recently, I got to thinking about how we might setup a series of internal applications at work. Every company, especially tech companies, needs a slew of internal tools for day to day tasks. These could range from reporting, to internal project management, to data management, to really anything. Most of the time, these tools are not customer-facing, and they're not going to be where a company wants to invest a lot of time and resources. These are tools that aim to make the company better/faster/more-efficient at delivering it's primary goods or services.

For common pain points, you can look to grab open-source or commercial projects to satisfy those needs (think JIRA, Trello, github, Slack, etc.). But what about tools that are unique to _your_ company? Tools that need to interface with _your_ databases, _your_ user accounts, _your_ ... whatever. There aren't going to be solutions sitting out there that "just work" with your specific use case. If you've ever worked in a non-tech company, this is where folks tend to do some pretty gnarly things with Excel macros - but those are only useful until the one employee who wrote the whole thing and knows how it works, quits.

So what if you do work for a tech company? What if you work for a company that is capable of whipping up quick little web UIs to satisfy some of these internal needs? This is where the microfrontend concept can come in really handy. In my opinion, microfrontends can be very useful for some targeted scenarios. I'll spare you the gory details and point you in the direction of [Cam Jackson's](https://camjackson.net/) excellent in-depth [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) article. In the article, Cam covers the benefits and drawbacks of microfrontends along with various potential implementation approaches, including a demo repo of one of the approaches implemented using React.

This got me thinking, how might this be done in Vue? So I sat down this past Sunday to see what I might be able to come up with, based in part on the approaches reviewed by Cam in the article above.

## Design Goals

I set out with a few design goals in mind.

**Apps do not rely on any common/shared framework**

While we intend to use Vue for all of the apps in this example, we should not have these apps rely on the Vue library being provided to them from the host application. This may seem like a good idea at first, and may lead to small bundles and more shared code across apps - but consider down the road whn you've got 10 apps all using a common Vue library - and you need to make a major update and introduce breaking changes? You need to upgrade all 10 apps _in unison_ which completely defeats the advantages of a microfrontend in the first place.

And if we're going to let each subapp use any version of Vue that it wants, it's a small step to just say _"use any framework you want."_ Remember the goal here is efficiency, so if a certain team needs an app, and they just happen to have a solid Svelte developer on their team, they shouldn't be obstructed from adding their app to the mix. Any SPA that can "mount" itself into an empty `div` should be a viable sub-app for this setup.

**Apps are independent of the host application**

We want individual apps to be created, updated, and deployed with minimal changes required to the Host application.

## Concessions

I call these concessions because they weren't necessarily "goals" from the outset, but they seemed like decisions that favored simplicity so long as we weren't sacrificing any major functionality.

**No client-side routing between sub-apps**

This ties into the "no common/shared framework" from above. If we did end up with different apps using the same verisons of `vue-router`, we could theoretically get something working where there was a host router, and it fetched sub-routes from sub-app manifests of some sort and registered them dynamically using [`addRoutes`](https://router.vuejs.org/api/#router-addroutes). But even in the small chance that scenario happens, it sounds like a lot of potentially complex work. And we're striving for efficiency. Furthermore - if we're outing between subapps, we have to clean up after each sub-app just the same, so there's more work to consider.

Instead, w'ell assume that if you route between sub-apps, it'll just be a fresh server load for the new sub-app path. and the new page will jsut be an instance of the Host app that boots up the specific sub-app. Then, routing between usb-apps is just normal `<a>` tags and cleanup of prior apps happens automatically for us.

TODO

-   App manifests (host and client)
-   Loading the host app
-   Determining the proper sub app
-   Public paths
-   etc.
