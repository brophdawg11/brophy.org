---
title: Building a Blog with Metalsmith
author: Matt Brophy
postDate: 2017-02-15 19:00
tags: ssg,javascript,metalsmith,blog
layout: post.nunjucks
---

Ever want to set up your own blog?  Stuck on which Static Site Generator to use?  Know Javascript?  Or don't?  After trying out multiple NodeJS based SSG's, and looking into multiple non-NodeJS based ones, I settled on Metalsmith for my own blog.  Here's my beginner's guide to setting up a new blog from scratch.

## Prerequisites

* You have [NodeJS][Node.js] installed.  And are hopefully at least a _little_ familiar with it.

## Setup

Start with a brand new empty directory, set it up for a Node project, and install [Metalsmith][Metalsmith]:

```bash
> mkdir blog
> cd blog
> npm init
# Answer questions
> npm install --save metalsmith
```

Create your bare-bones Metalsmith build file, `build.js`:

```javascript
var Metalsmith  = require('metalsmith');

Metalsmith(__dirname)
    .source('./contents')       // read files from here
    .destination('./output')    // write files to here
    .build(err => {             // build!
        if (err) throw err;     // handle errors
    });
```

Yep, that's it.  That's a fully-functioning Metalsmith static site.  It's not going to do anything but copy your stuff from `contents/` into `output/`, but it works.  Give it a shot - make your first content file and run the build:

```bash
> mkdir contents
> echo "<h1>Hello World</h1>" > contents/index.html
> node build.js
> cat output/index.html
<h1>Hello World</h1>
```

Look at that, there's our file, processed through the Metalsmith pipeline.

The pipeline is an important concept to grasp when it comes to working with Metalsmith.  You tell it where to find your input files via `.source()` and where to write the output files via `.destination()`, and then you will begin inserting a bunch of plugins as ordered steps along the pipeline.  When all your plugins are registered, you call `.build()` to start the processing.  It will then process _all_ files from your `source` directory through the plugin pipeline, transforming them at each step of the way, and finally write out the final files in your `destination` directory.

Let's take a look at what the pipeline looks like by writing and adding our first plugin.  Add the following between the `destination` and `build` steps:

```javascript
.use((files, metalsmith, done) => {
    console.log('files', files);
    console.log('metalsmith', metalsmith);
    console.log('done', done);
    setImmediate(done);
})
```

This is the format of a plugin and it's going to show us exactly what the pipeline looks like.  A plugin is called with `.use(Function)`, and in most plugins, you'll see that you call the plugin which returns the function you'll pass to `.use()`.  Each step of the pipeline receives three arguments - the `files` object, the `metalsmith` object, and a `done` callback.

**The `files` object:**

```json
{
    'index.html': {
        contents: <Buffer>,
        mode: '0644',
        stats: {
            dev: 16777220,
            mode: 33188,
            ...
        }
    }
}
```

The files object is just a key-value store with an entry for each file in your `source` directory.  It stores some useful information about the file in `mode` and `stats`, and it stores the entire content of the file as a `Buffer` in `contents`.  You can easily convert the`Buffer` to a string using `files['index.html'].contents.toString()`.

**The `metalsmith` object**

...is not super important for now.  It's got lots of global metadata about the actual build you're running.  Maybe we'll come back to it, but in building out [this blog][brophy.org], I don't think I ever actually touched it.

**The `done()` callback**

This is to tell Metalsmith when you're done.  For whatever reason, all of their examples show it being called with `setImmediate` during synchronous plugins, so I followed suit.  Don't ask me why that matters.

## Let's make it "Bloggy"

Ok, so using Metalsmith to copy/paste files around seems pretty stupid.  Let's start adding some of the [Community Plugins][Metalsmith-plugins] to make this thing useful.

### Markdown

Let's stop writing HTML directly and use markdown.  First, install the plugin:

```bash
> npm install --save metalsmith-markdown
```

Then, add the plugin as a step in the pipeline, right before our final debugging plugin we set up above.  Please excuse the inline `require` - that's only for readability in this post.

```javascript
.use(require('metalsmith-markdown')())
```

And then rename and alter your existing `index.html` file to an `index.md` file, and adjust it's contents to be markdown:

```bash
> mv contents/index.html contents/index.md
> echo "# Hello World" > contents/index.md
> node build.js
> cat output/index.html
<h1>Hello World</h1>
```

Simple enough?  The `metalsmith-markdown` plugin essentially does the following with the `files` object:

  1. For each `*.md` key, indicating a markdown file in your `source` directory
  2. Convert the contents to HTML by running it through a markdown parser
  3. Write out the new `file` as `*.html`
  4. Delete the old `*.md` key entry

It might seem odd that it's deleting the old one, but that's again an important aspect of the metalsmith pipeline.  The `.build()` step at the very end essentially just writes the `files` object to disk.  For every key in `files`, a file matching that path is created in your `destination` directory, and the contents written to it.  If we didn't create the new `index.html` key in `files`, we wouldn't get an `output/index.html` file, and if we didn't delete the `index.md` key, we'd also get an `output/index.md` file written out.


### Templating

Now that we're converting markdown to HTML, let's start wrapping our contents in a common header and footer using nunjucks templates.  First, install the `metalsmith-layouts` plugin and the `nunjucks` package, and create a directory to store our templates:

```bash
> npm install --save metalsmith-layouts nunjucks
> mkdir templates
```

Then add two templates we'll use for scaffolding the HTML page:

```html
// templates/layout.nunjucks
<!doctype html>
<html>
<head>
    {% block head %}
    {% endblock %}
</head>
<body>
    <header>
        {% block header %}
            Welcome to My Blog!
        {% endblock %}
    </header>
    <div>
        {% block content %}{% endblock %}
    </div>
    <footer>
        {% block footer %}
            Built with <a href="http://metalsmith.io/">Metalsmith</a>
        {% endblock %}
    </footer>
</body>
</html>
```

```html
// temmplates/post.nunjucks
{% extends "templates/layout.nunjucks" %}

{% block content %}
    <div class="post">
        {{ contents | safe }}
    </div>
{% endblock %}
```

Basically, `layout.nunjucks` will be the base layout for every single page on out site, providing extendable blocks where content can be inserted.  Then `post.nunjucks` extends the layout tempate, and inserts the file contents inside the `body` block.

Now, add a pipeline step that will process your files against these templates

```javascript
.use(require('metalsmith-layouts')({
    engine: 'nunjucks',        // Which engine to use
    directory: 'templates',    // Where are the templates stored
    default: 'post.nunjucks'   // Default template to use
}))
```

Now, when you run the pipeline, you should see a full-structured     index.html` file written out, using the proper above layout.

## Page titles and specific layouts

Let's look at how we might both title a post as well as choose a specific layout to use.  Metalsmith supports [YAML Frontmatter][frontmatter] by default (which can be turned off, but I don't see a good reason why), so you can specify metadata at the beginning of your source files.  So, insert the following at the beginning of `index.md`:

```markdown
---
title: My first Blog Post
layout: post.nunjucks
---

```


Those entries will become key/value pairs on the file object in the pipeline, and also exposed to your templates.  So now we can enhance our `post.nunjucks` file to include the title:

```html
{% extends "templates/layout.nunjucks" %}

{% block header %}
    <h1>{{ title }} </h1>
{% endblock %}

{% block content %}
    ...
{% endblock %}
```

And the `metalsmith-layouts` plugin already looks for a `layout` property on every source file, and uses that prior to the default.

## Next Steps

So what's next?  We've got markdown files with frontmatter metadata building into a nunjucks-driven extensible layout structure.  What do we need to move this into a full-on blog?  Here's the list of plugins I'm using to host [brophy.org][brophy.org], and feel free to check out the source for this site over in [GitHub][github] if you want to see any examples:

* `metalsmith-collections` to organize all of your posts into sorted collections
* `metalsmith-pagination` to group your collections into paginated lists
* `metalsmith-metallic` for syntax highlighting in code blocks
* `metalsmith-page-titles` to generate HTML `<title>` content
* `metalsmith-assets` to copy over static assets
* `metalsmith-favicons` to copy over and setup your site icons
* `metalsmith-drafts` to support draft posts that don't get published
* `metalsmith-permalinks` to generate permalinks without the `.html`
* `metalsmith-excerpts` to grab the first paragraph of a post for an overview display
* `metalsmith-tags` to allow tagging of posts and listing posts by tag`
* `metalsmith-sass` for SCSS compilation
* `metalsmith-icons` for easy inclusion of custom icon fonts from font-awesome
* `metalsmith-feed` to generate an RSS feed

Good luck!

[brophy.org]: http://brophy.org "brophy.org"
[Metalsmith]: http://metalsmith.io "Metalsmith"
[Metalsmith-plugins]: http://www.metalsmith.io/#the-community-plugins "Metalsmith Plugins"
[Metalsmith-details]: http://www.metalsmith.io/#how-does-it-work-in-more-detail- "Metalsmith Details"
[metalsmith-tags]: https://github.com/totocaster/metalsmith-tags "metalsmith-tags"
[Node.js]: https://nodejs.org/ "Node.js"
[Nunjucks]: https://mozilla.github.io/nunjucks/ "Nunjucks"
[frontmatter]: https://middlemanapp.com/basics/frontmatter/ "Frontmatter"
[github]: https://www.github.com/brophdawg11/brophy.org "brophy.org on GitHub"
