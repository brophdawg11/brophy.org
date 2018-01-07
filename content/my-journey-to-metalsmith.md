---
title: My Journey to Metalsmith
author: Matt Brophy
postDate: 2016-12-27 12:00
tags: ssg,javascript,metalsmith
layout: post.nunjucks
---

Every developer has a never-ending _TODO_ list of side projects, experiments,
blog posts, etc.  We're going to get to these things, we _promise_!  Perpetually hanging towards the top of my list was _"make [brophy.org] more than just my resume."_  However, tackling that item proved to be a longer-than-anticipated journey through the world of Static Site Generators, finally landing me on [Metalsmith].

I can't count the number of times I did something at work, tracked down a tricky problem, experimented with a new library/framework/language, and thought to myself, _"Man, that was kinda cool, maybe I should write about that."_  Easy, right?  But without a simple process to move thoughts out of my cramped brain and onto the web, I never did.  Sure, I could have fired up a quick blog on WordPress/Ghost/Blogger/etc., ... but ... what if I wanted to host my resume there too?  What if I wanted custom styles that weren't provided through some pre-fab theme?  What if I wanted to do more than just blog posts?  Show off software demos or libraries?  All of those all-in-one solutions seemed too...restricting.  I mean, I'm a _software developer_, I _should_ be able to do this.  

Queue the arrival of Static Site Generators.  Precisely what I was looking for, dump some content into a Markdown file, toss it up on my [EC2] server (or better yet, a static [S3] site) and voilà - unleash my ramblings on the world.  I'd venture to say that _"ah-ha"_ moment was back in 2013 or so, when a co-worker of mine was raving about a [Clojure]-based SSG he was using and hosting a side-project site on S3.  So, why am I writing about this now, on the cusp of 2017?

In short: hidden complexities, lack of documentation, and lack of customization.  And, of course, time on my part.  Being primarily a front-end dev, my area of expertise is Javascript above all else, thus I was pretty set on a [Node.js] framework.  Of course it would have been fun to experiment with [Go] ([Hugo]) or [Haskell] ([Hakyll]), but both of those would not exactly qualify as a _"simple process"_ when you take into account the full new language to be learned.  Sure, I wan to try out new languages, but I want to do that as a primary task - not something that could inhibit the ability to hammer out a quick blog post.

So I dove into the world of Node.js-based SSG's.  I looked at [Jekyll] and [Hexo], but the thought of using a cli that would "magically" dump out files seemed too black-box for me.  I tried [Punch] and [Wintersmith] to the extent that I actually got a skeleton site up and running on them, with some lorem ipsum posts.  But in both cases, it took me far too long just to get a simple setup working to my liking.  In both cases, the _"Getting Started"_ guide works like a charm, and it's smooth sailing..until the minute you want to do something different than the authors preference.  Want to add Handlebars helpers to your templates?  Spend hours digging through poor documentation to figure out how to plug it into the framework's build process.  Want to use [Nunjucks] over [Jade]?  Start digging.  Want to modify some metadata for your posts?  Hah.

It was precisely this Jade/Nunjucks/metadata problem that finally got me fed up with Wintersmith.  I had my full skeleton site up and running - an index page, individual blog post pages, a link off to my JSON-generated resume, and thought I was well on my way.  But...then I wanted a blog post listing and archives section.  And for whatever reason, brain-dead after a full day of coding, pure inability, or maybe lacking framework documentation, everything I tried seemed...hackish.  Pagination was a pain.  Tags were a pain.  All of my data from the front-matter sections of the Markdown files was buried, somewhere inside the engine...and I couldn't easily get to it.

This led to a 2 AM coding session where I finally said _"F-it, I can build this"_.  What's a static site generator anyway?  It's a static directory of content, rendered against templates, through a series of pipelines of sort.  Input file extensions feed into pipelines and generate output.  Simple.  In a few hours, I built up a working, albeit extremely limited, framework that accomplished the basics.  The main idea was to define a `Pipeline` that ran against a given glob.  Do whatever you want in the pipeline, I don't care.  Add metadata to the pipeline object.  Transform files.  Output content.  Got 50 markdown files?  No problem, that's a single `Pipeline` with 50 `PipelineInstances`.  All of which can know about each other, or not, who cares.

The core of this little experiment was ran through only about 30-40 lines of code, with a configuration set up like the following:

```javascript
const config = {
  pipelines: [{
    name: 'articles',
    glob: '../contents/articles/*/index.md',
    steps: [
      readFileContents,
      readMarkdown,
      parseMarkdown,
      writeHtml
    ]
  }]
};
 
function readFileContents(filePath) {
  return fs.readFileSync(filePath).toString()
}

function readMarkdown(contents) {
  return front(contents).body;
}

function parseMarkdown(md) {
  return markdown.toHTML(markdown.parse(md));
}

function writeHtml(html) {
  return fs.outputFileSync(
    path.join('output', getMdOutputPath.bind(this)()), 
    html);
}
```

Simple.  Find a `.md` file, read it from disk, parse as markdown, write it out.

First, we need to be able to take a series of functions and run the in sequence.  In a synchronous world, this is easy with [_.flow].  But what if some steps are async and some aren't?  This led to a nifty little `flowAsync` method that I really like and would like to find a use for in something real:

```javascript
function flowAsync() {
  const arr = Array.prototype.slice.call(arguments);
  const next = (fn, data) => {
    return typeof fn === 'object' && fn.hasOwnProperty('length') ?
             flowAsync.apply(this, fn)(data) :
             promisify(fn.call(this, data));
  };
  const reducer = (accum, fn) => accum.then(next.bind(this, fn));
  return value => arr.reduce(reducer.bind(this), Promise.resolve(value));
}

function promisify(val) {
  return val && typeof val.then === 'function' ?
           val :
           Promise.resolve(val);
}
```

Cool.  Just provide an array of functions, returning promises or not, and they'll run in sequence, awaiting promise resolutions where supplied.  The innerds of the `next` function even allow you to expand out the pipeline by returning an array from a step to _insert_ new steps into the pipeline after the current step.  Maybe I'll put it out as a little utility sometime, or write a blog post with some examples...add it to the TODO list.

Then, the concept of a Pipeline and a series of PipelineInstances that use flowAsync to run the `steps` from the config above across the files matched by the  `glob`:

```javascript
function PipelineInstance(pipeline, filePath) {
  this.pipeline = pipeline;
  this.filePath = filePath;
  this.run = function (filePath) {
    return flowAsync.apply(this, this.pipeline.steps)(this.filePath);
  };
}

function Pipeline(pipeline) {
  this.raw = pipeline;
  this.pipelineInstances = [];
  this.run = function (filePath) {
    const self = this;
    const files = globule.find(this.raw.glob);
    const runs = files.map(f => {
      var p = new PipelineInstance(pipeline, f);
      self.pipelineInstances.push(p);
      return p.run.bind(p);
    });
    const identity = data => data;
    const finalize = this.raw.finalize ?
                       this.raw.finalize.bind(this) :
                       identity.bind(this);
    return () => {
      debugger;
      const done = data => promisify(finalize(data));
      return flowAsync.apply(null, runs)().then(done.bind(self));
    };
  };
}

function processPipeline(pipeline) {
  const p = new Pipeline(pipeline);
  return p.run();
}

flowAsync.apply(null, config.pipelines.map(processPipeline))();
```

Cool.  Now I can run whatever the heck I want on any set of file globs.  In any order, all the while having global access to the rest of the pipeline info from prior steps, if needed.  That's where all the usages of `this` come in.  Pipelines have access to their array of instances (`this.pipelineInstances`) and instances have access to their parent pipeline (`this.pipeline`).  Tack on any metadata you want in an earlier step, and use it in a later step.

I was pretty happy at this point, not so much about anything groundbreaking, although I was pretty psyched about the ease of which `flowAsync` made the pipeline steps.  But still, the thought of writing pipeline steps for everything needed for a true SSG blog was a little daunting.  Templates, Tags, Archives, Drafts, Pagination, Images, Styles, RSS feed, icons...uh oh.  I might be in over my head.

So I went back to Googling, and this time, read a little deeper into Metalsmith and caught this little nugget:

> The task of a static site generator is to produce static build files that can be deployed to a web server. These files are built from source files. Basically for a static site generator this means:
> 
>   1. from a source directory read the source files and extract their information
>   2. manipulate the information
>   3. write the manipulated information to files into a destination directory
>   
> Metalsmith is built on this reasoning. It takes the information from the source files from a source directory and it writes the manipulated information to files into a destination directory. All manipulations, however, it exclusively leaves to plugins.

Well, crap.  That sounds _a lot_ like what I was headed towards.  Metalsmith basically does this concept, providing you a global `metadata` object throughout your applied plugins.  A bit more reading, and I was sold:

<p style="text-align:center">
    <img src="https://d17oy1vhnax1f7.cloudfront.net/items/3J0p0L2d3b2E2G1M0C13/Image%202016-12-28%20at%201.02.42%20AM.png?v=b9e9bffa" title="Hello Metalsmith" />
</p>

I'll do a separate post on my Metalsmith setup at some point (_queue TODO list reference_), but in a nutshell, I've been pleasantly surprised with the ease of debugging, inspecting, altering plugins as needed to achieve what I wanted.  It's by far the easiest to grasp of all the Node SSG's I've tried thus far.  For more info, read the [How Does it Work][Metalsmith-details] section.  But, essentially, I can jump into `node_modules`, add some debugging code to figure out what the heck is going on quite easily.  I can write my own little plugins where needed, but for the most part, their extensive list of [community plugins][Metalsmith-plugins] have solved my needs on the first try, with minimal adjustments or digging.

So, in the end, it was a bit of a long road, but I'm happy where I landed.  Of course, as I was putting some final touches on tonight adding tag support using [metalsmith-tags], I tripped across the former author's blog post describing a similar journey of his, which resulted in his writing of [Yarn], yet another Node SSG...so, for now I'm for praying I won't be ditching Metalsmith in a few months.  _Shudder._

[brophy.org]: http://brophy.org "brophy.org"
[Metalsmith]: http://metalsmith.io "Metalsmith"
[Metalsmith-plugins]: http://www.metalsmith.io/#the-community-plugins "Metalsmith Plugins"
[Metalsmith-details]: http://www.metalsmith.io/#how-does-it-work-in-more-detail- "Metalsmith Details"
[metalsmith-tags]: https://github.com/totocaster/metalsmith-tags "metalsmith-tags"
[EC2]: https://aws.amazon.com/ec2/ "EC2"
[S3]: https://aws.amazon.com/s3/ "S3"
[Clojure]: http://clojure.com/ "Clojure"
[Node.js]: https://nodejs.org/ "Node.js"
[Go]: https://golang.org/ "Go"
[Hugo]: https://gohugo.io/ "Hugo"
[Haskell]: https://www.haskell.org/ "Haskell"
[Hakyll]: https://jaspervdj.be/hakyll/ "Hakyll"
[Punch]: http://laktek.github.io/punch/ "Punch"
[Wintersmith]: http://wintersmith.io/ "Wintersmith"
[Jekyll]: https://jekyllrb.com/ "Jekyll"
[Hexo]: https://hexo.io/ "Hexo"
[Handlebars]: http://handlebarsjs.com/ "Handlebars"
[Nunjucks]: https://mozilla.github.io/nunjucks/ "Nunjucks"
[Jade]: https://www.npmjs.com/package/jade "Jade (aka Pug)"
[_.flow]: https://lodash.com/docs/4.17.3#flow "_.flow"
[Yarn]: http://hswolff.com/blog/introducing-yarn/ "Yarn"
