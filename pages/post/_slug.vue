<template>
<article>
    <header>
        <h1 class="c-post__title">
            {{ post.title }}
        </h1>
        <div class="c-post__meta">
            <PostMeta :post="post"></PostMeta>
        </div>
    </header>

    <section class="c-post__content"
             v-html="post.body">
    </section>

    <footer>
        <div class="c-post__share">
            Enjoy this post?  Share on

            <a class="c-post__share-medium"
               :href="`https://twitter.com/share?text=${post.title}&amp;url=${url}`"
               onclick="window.open(this.href,'twitter-share','width=550,height=235');return false"><!--
               --><span class="fa fa-twitter"></span><!--
            --></a><!--

            --><a class="c-post__share-medium"
                  :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
                  onclick="window.open(this.href,'facebook-share','width=580,height=296');return false"><!--
               --><span class="fa fa-facebook"></span><!--
            --></a><!--

            --><a class="c-post__share-medium"
                  :href="`https://plus.google.com/share?url=${url}`"
                  onclick="window.open(this.href,'google-plus-share','width=490,height=530');return false"><!--
               --><span class="fa fa-gplus"></span><!--
            --></a>
        </div>

        <!--
        <div class="c-post__nav">

            <div class="c-post__previous">
                {% if previous %}
                    <a href="{{ previous.path }}" title="{{ previous.title }}">
                        <span class="fa fa-arrow-left"></span>
                    </a>
                    <a href="{{ previous.path }}" title="{{ previous.title }}">
                        {{ previous.title }}
                    </a>

                    {% if next %}
                        <span class="c-post__nav-divider">|</span>
                    {% endif %}

                {% endif %}
            </div>

            <div class="c-post__next">

                {% if next %}
                    <a href="{{ next.path }}" title="{{ next.title }}">
                        {{ next.title }}
                    </a>
                    <a href="{{ next.path }}" title="{{ next.title }}">
                        <span class="fa fa-arrow-right"></span>
                    </a>
                {% endif %}
            </div>

        </div>
        -->
    </footer>

</article>
</template>

<script>
import { omit } from 'lodash';

import PostMeta from '../../components/PostMeta.vue';

export default {
    components: {
        PostMeta,
    },
    asyncData({ app, route, payload }) {
        return app.$content('/')
            .get(route.path)
            .then(post => ({ post: post || payload }));
    },
    computed: {
        url() {
            return `${this.$store.state.url}${this.post.permalink}`;
        },
    },
    created() {
        console.log(omit(this.post, 'body'));
    },
};
</script>
