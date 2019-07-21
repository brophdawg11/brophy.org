(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{257:function(e,t){e.exports={title:"A Look Inside Vue's Change Detection",author:"Matt Brophy",postDate:"2017-11-15 17:30",tags:"vue,javascript,spa",__content:'<style type="text/css">\nsup {\n    vertical-align: super;\n}\n</style>\n\n<p>A layman&#39;s interpretation of <a href="https://en.wikipedia.org/wiki/Occam%27s_razor" title="Occam&#39;s Razor">Occam&#39;s Razor</a> can be boiled down to <em>&quot;the simplest explanation is usually the correct one.&quot;</em>  This was exactly what came to mind the moment I learned how <a href="https://vuejs.org/" title="Vue.js">Vue.js</a> implements it&#39;s change detection under the hood.  It&#39;s simple, elegant, and beautiful.</p>\n<p>As a (primarily front-end) software engineer, I&#39;ve always firmly believed that keeping up with the latest industry trends is one of the most important things I can do.  It benefits me, my employer, and generally just keeps me excited about the work I&#39;m doing and what I might do next.  For that reason, I&#39;ve been keeping a close eye on <a href="https://vuejs.org/" title="Vue.js">Vue.js</a> the past year or so as it&#39;s gained traction and popularity.  I&#39;ve done plenty of personal toying with it.  I&#39;ve implemented our first Vue.js internal app over at <a href="http://www.urbn.com/" title="URBN">URBN</a>.  And when I saw the <a href="https://frontendmasters.com/workshops/vue-advanced-features/" title="Vue Advanced Features">Vue.js Advanced Features from the Ground Up</a> course pop up over on <a href="https://frontendmasters.com/" title="Frontend Masters">Frontend Masters</a>, I knew I had to check it out. </p>\n<blockquote>\n<p><em><strong>Disclaimer</strong>: Evan You is smarter than me.  Everything in this post comes from that course.  So, if you&#39;ve got the time and money, I highly suggest checking out the course instead of reading this article.</em></p>\n</blockquote>\n<p>That being said, maybe you&#39;ve only got the rest of your lunch break and this article is just short enough to fit in there.  So let&#39;s dive in.</p>\n<h2 id="change-detection">Change Detection</h2>\n<p>One common problem that all reactive UI frameworks must solve is how to handle change detection.  <em>I.e.</em>, if I change my view model, how does the DOM know to update?  Frameworks have solved this with dirty checking, virtual DOM (vdom) diffing, and probably other ways I don&#39;t even know about.  But generally, there&#39;s some level of overhead in current approaches.  </p>\n<p>When dirty checking, we always run a few dirty checks against thing&#39;s that <em>haven&#39;t</em> changed.  In vdom diffing, we render some set of virtual DOM nodes that <em>haven&#39;t</em> changed.  And in the more explicit approaches, we can limit what needs to be checked by manually declaring <em>which</em> properties a given component cares about.  However, beyond the fact that this tightly couples your template and model (leading to potential long term maintenance issues), it also <em>still</em> requires a level of dirty checking or vdom processing to determine which of your subset <em>actually changed</em>.  There&#39;s <em>got</em> to be a better way.</p>\n<p>I&#39;ll be honest, for a long time, I wasn&#39;t sure there was.  I had accepted that libraries like Angular and React had made the less-than-optimal approaches fast enough for real world use.  And they work.  And pretty damn well at that.</p>\n<p>There was even a brief evening where I began looking into <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy" title="Proxy">Proxy</a> objects, thinking that I could use those to potentially proxy up an entire object store to know exactly what deeply nested property changed on every change, and therefore attempt to render out the minimally dependent set of UI updates.  I still think that&#39;s theoretically possible, possibly non-trivial, and potentially very expensive, but in that evening, I didn&#39;t have the energy to continue down that road.  Maybe some other time...</p>\n<h2 id="vuejs-change-detection">Vue.js Change Detection</h2>\n<p>Enter Vue.js Change detection.  That thought above with the proxies seems to be something of a holy grail of Change Detection.  Given that our template bindings make it easy to know what portions of our UI use what portions of our view model.  It&#39;d be <em>awesome</em> if we could know, automatically and on every change to our view model -- exactly what property it was, so we can re-render only the minimally required set of UI templates.</p>\n<p>So, we&#39;re going to do just that, using this simple little JSBin template of the <a href="https://en.wikipedia.org/wiki/Pythagorean_theorem" title="Pythagorean Theorem">Pythagorean Theorem</a>  - yeah, that guy, from high school.  Good old <em>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></em>.  It actually turns out to be a great simple candidate for a reactive UI - as we&#39;ve got two explicit one-to-one dependencies (a, b), and one implicit one-to-many dependency (c).  </p>\n<p>Our first example below is completely non-reactive.  We&#39;ve created a basic view model <code>store</code> object, and wired up some render functions, but we&#39;ve done nothing to wire up our UI such that render functions will re-run on store changes.  </p>\n<p>The <code>highlight</code> function is just for this example - to apply a little CSS animation on properties anytime they re-render.  If you reload, you might catch the initial render highlights.  But since this is a non-reactive example, you won&#39;t see any more.</p>\n<h2 id="non-reactive-ui">Non-Reactive UI</h2>\n<p data-height="265" data-theme-id="0" data-slug-hash="LmwwXP" data-default-tab="js,result" data-user="brophdawg11" data-embed-version="2" data-pen-title="Simple Non-Reactive UI" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/brophdawg11/pen/LmwwXP/">Simple Non-Reactive UI</a> by Matt Brophy (<a href="https://codepen.io/brophdawg11">@brophdawg11</a>) on <a href="https://codepen.io">CodePen</a>.</p>\n\n<p>Now, what would it take to make it reactive?  One explicit way might be to do something like:</p>\n<pre><code class="hljs javascript"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">dependsOn</span>(<span class="hljs-params">path, renderFns</span>) </span>{\n    <span class="hljs-comment">// Magic logic to compare prior store values to current store </span>\n    <span class="hljs-comment">// values for store[path] and execute render functions when </span>\n    <span class="hljs-comment">// they change</span>\n}\n\ndependsOn(<span class="hljs-string">\'a\'</span>, [ renderA, renderC ]);\ndependsOn(<span class="hljs-string">\'a\'</span>, [ renderB, renderC ]);</code></pre>\n<p>And this will work just fine...but it doesn&#39;t scale.  We&#39;ve tightly coupled our data model to our render functions - and updating one without the other can become problematic.  Assume <code>renderC</code> becomes more complex and relies on a new <code>store.d</code> property - if we forget to add <code>dependsOn(&#39;d&#39;, [ renderC ])</code> - our UI will be broken.  And worst of all, it&#39;ll only be slightly broken.  Most of our reactive rendering will still work just fine.  It&#39;ll just be the scenario that when <code>store.d</code> changes that won&#39;t re-render.  We&#39;ll just need to hope that QA has test cases for that scenario.</p>\n<h2 id="making-it-reactive">Making it Reactive</h2>\n<p>So, what can we do?  The Vue.js approach is broken down into 3 steps:</p>\n<h3 id="pseudo-object-proxying">Pseudo Object-proxying</h3>\n<p>The first step Vue tackles is that it creates a sort of pseudo-proxy for your data store using Object <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get" title="Object Getter">getter</a>/<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set" title="Object Setter">setter</a> functions.  Using this approach, we can define properties on an object that actually contain getter and setter functions for when they are accessed:</p>\n<pre><code class="hljs javascript"><span class="hljs-keyword">let</span> obj = {};\n<span class="hljs-keyword">let</span> value;\n<span class="hljs-built_in">Object</span>.defineProperty(obj, <span class="hljs-string">\'foo\'</span>, {\n    <span class="hljs-keyword">get</span>() {\n        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'Getting property\'</span>);\n        <span class="hljs-keyword">return</span> value;\n    },\n    <span class="hljs-keyword">set</span>(val) {\n        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">`Setting property to <span class="hljs-subst">${val}</span>`</span>);\n        value = val;\n    }\n});\n\nobj.foo = <span class="hljs-number">5</span>          \n<span class="hljs-comment">// Logs "Setting property to 5"</span>\n\n<span class="hljs-built_in">console</span>.log(obj.foo) \n<span class="hljs-comment">// Logs "Getting property"</span>\n<span class="hljs-comment">// Also logs the value: 5</span></code></pre>\n<p>Thats pretty cool - we&#39;ve now got a property <code>obj.foo</code>, that we can know any time it is accessed or changed.  The former is vital to know what computed (higher-order) properties might access <code>obj.foo</code>.  The latter is vital to know when to re-render templates that contain <code>obj.foo</code>.  The nice thing is tht we an do this directly on top of existing properties too, which will come in handy later.</p>\n<h3 id="dependency-tracking">Dependency Tracking</h3>\n<p>Now, logging something to the console doesn&#39;t really do us any good.  Instead, we need a simple way to track dependencies between data store properties and associated render functions.  So Vue uses a really simple class, we&#39;ll call it <code>Dep</code>, to track dependencies:</p>\n<pre><code class="hljs javascript"><span class="hljs-built_in">window</span>.Dep = <span class="hljs-class"><span class="hljs-keyword">class</span> </span>{\n    <span class="hljs-keyword">constructor</span>() {\n        <span class="hljs-keyword">this</span>.deps = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Set</span>();\n    }\n\n    depend(fn) {\n        <span class="hljs-keyword">this</span>.deps.add(fn);\n    }\n\n    notify() {\n        <span class="hljs-keyword">this</span>.deps.forEach(<span class="hljs-function"><span class="hljs-params">fn</span> =&gt;</span> fn());\n    }\n};\n\n<span class="hljs-keyword">const</span> dep = <span class="hljs-keyword">new</span> Dep();\n<span class="hljs-keyword">const</span> logger = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"I\'m a logger!"</span>);\ndep.depend(logger);\ndep.notify();\n<span class="hljs-comment">// Logs "I\'m a logger!"</span></code></pre>\n<p>Again, nice and simple.  Maintain an internal <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set" title="Set">Set</a> object to track all our dependent functions, and a simple <code>notify</code> function to iterate through and execute all dependencies.</p>\n<h3 id="the-magic">The Magic</h3>\n<p>Hopefully by now, you&#39;re starting to see where we&#39;re headed.  We have a way to proxy reads and writes to properties on our data store and do <em>something</em> accordingly.  We also have a simple way to track dependent functions.  And our end goal here is to know what render functions to execute when certain properties change.  <em>I.e.</em>, we need to know <em>what</em> render functions depend on <em>what</em> data store properties.  And we need to do that automatically, without any explicit declarations on our part.  🤔</p>\n<pre><code class="hljs javascript"><span class="hljs-comment">// How can we know, automatically, that \'renderA\' depends on \'store.a\'?</span>\n<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">renderA</span>(<span class="hljs-params"></span>) </span>{\n  $(<span class="hljs-string">\'a\'</span>).innerHTML = store.a * store.a;\n}</code></pre>\n<p>This is exactly where Occam&#39;s Razor comes into play.  We&#39;ve done nothing super advanced thus far, less than about 20 lines of plain, vanilla JS code.  But we&#39;re at this crux where we need one final piece to tie it all together.  I can remember thinking, <em>&quot;this must be the really hard part that&#39;s 100&#39;s of lines long.&quot;</em></p>\n<p>I couldn&#39;t have been more wrong.  This is what I think is the true genius of Vue.js&#39;s approach (and Evan You for coming up with it).  And it takes advantage of one little aspect of the Javascript language.  Nothing new, nothing fancy.  <strong>Javascript is single threaded</strong> (if that&#39;s a word).  Javascript has been single threaded since day 1, long before all the ES6 syntax/functions the cool kids are using these days.</p>\n<p>Remember, we have a way using our getter proxy to know any time a given property is accessed.  So - what if we could know <em>who</em> is accessing it?  Well, because Javascript is single threaded, there is only <em>one</em> function running at any given point in time.  So, what if we tracked what that function was, and stored that as our dependency?</p>\n<pre><code class="hljs javascript"><span class="hljs-comment">// Single global variable to track _what_ function of ours is currently running</span>\n<span class="hljs-keyword">let</span> currentFn;\n\n<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">makeFunctionReactiveAndExecute</span>(<span class="hljs-params">fn</span>) </span>{\n    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">wrapped</span>(<span class="hljs-params"></span>) </span>{\n        currentFn = fn;\n        fn();\n        currentFn = <span class="hljs-literal">null</span>;\n    }\n    wrapped();\n}\n\nmakeFunctionReactiveAndExecute(renderA);</code></pre>\n<p>So, what have we done here?  We&#39;ve setup a tiny wrapper function that when run for a given function (<code>renderA</code>), it:</p>\n<ul>\n<li>Marks globally in <code>currentFn</code> that <code>renderA</code> is executing</li>\n<li>Executes <code>renderA</code> (assumes it&#39;s synchronous, which render functions are)</li>\n<li>Unsets <code>currentFn</code> such that it shows no function is currently running</li>\n</ul>\n<p>Now, when <code>renderA</code> executes inside of <code>wrapped</code> above, and it accesses our proxied version of <code>store.a</code>, we an look at <code>currentFn</code> to know <em>what</em> function accessed <code>store.a</code> (<em>I.e.</em>, what function <em>depends</em> on <code>store.a</code>).</p>\n<h2 id="reactive-ui">Reactive UI</h2>\n<p data-height="265" data-theme-id="0" data-slug-hash="KROOro" data-default-tab="js,result" data-user="brophdawg11" data-embed-version="2" data-pen-title="Fully Reactive UI" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/brophdawg11/pen/KROOro/">Fully Reactive UI</a> by Matt Brophy (<a href="https://codepen.io/brophdawg11">@brophdawg11</a>) on <a href="https://codepen.io">CodePen</a>.</p>\n\n<p>And there you have it.  Automatic dependency tracking and reactive UI updates.  No manual registering of watcher or subscribers.  No dirty checking.  No virtual DOM diffing.  We know exactly what properties change (via our object proxies), and exactly what render functons care (via our <code>currentFn</code> tracking).  so when a given property changes, we execute every render function that cares.  and only those render function that care.</p>\n<h3 id="additional-notes">Additional Notes</h3>\n<p>It should be noted that this is a <em>very</em> simplified example of the core concepts used in Vue&#39;s change detection approach.  It:</p>\n<ul>\n<li>Does not support for complex property types (<em>I.e.</em>, arrays)</li>\n<li>Does not support nested objects on the data store</li>\n<li>Assumes reactive functions are always synchronous</li>\n<li>Probably glazes over a <em>ton</em> of other stuff that&#39;s included in the actual Vue implementation</li>\n</ul>\n<p>But I think it&#39;s a great example of the core concepts and their underlying simplicity.  </p>\n<p>Thanks for reading!</p>\n',excerpt:'A layman&apos;s interpretation of <a href="https://en.wikipedia.org/wiki/Occam%27s_razor" title="Occam&apos;s Razor">Occam&apos;s Razor</a> can be boiled down to <em>&quot;the simplest explanation is usually the correct one.&quot;</em>  This was exactly what came to mind the moment I learned how <a href="https://vuejs.org/" title="Vue.js">Vue.js</a> implements it&apos;s change detection under the hood.  It&apos;s simple, elegant, and beautiful.',permalink:"/post/a-look-inside-vues-change-detection",readingTime:{text:"10 min read",minutes:9.62,time:577199.9999999999,words:1924},slug:"a-look-inside-vues-change-detection"}}}]);