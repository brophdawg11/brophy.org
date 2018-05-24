<template>
    <DefaultLayout>

        <article>
            <header>
                <h1 class="c-post__title">
                    {{ post.title }}
                </h1>
                <div class="c-post__meta">
                    <PostMeta :post="post" />
                </div>
            </header>

            <section class="c-post__content"
                     v-html="post.__content" />

            <footer>
                <div class="c-post__share">
                    Enjoy this post?  Share on

                    <a :href="twitterUrl"
                       class="c-post__share-medium"
                       @click.prevent="shareTwitter()"><!--
                       --><span class="fa fa-twitter" /><!--
                    --></a><!--

                    --><a :href="facebookUrl"
                          class="c-post__share-medium"
                          @click.prevent="shareFacebook()"><!--
                       --><span class="fa fa-facebook" /><!--
                    --></a><!--

                    --><a :href="googlePlusUrl"
                          class="c-post__share-medium"
                          @click.prevent="shareGooglePlus()"><!--
                       --><span class="fa fa-gplus" /><!--
                    --></a>
                </div>

                <PostNav :previous-post="previousPost" :next-post="nextPost" />
            </footer>

        </article>

    </DefaultLayout>
</template>

<script>
import { findIndex, sortBy } from 'lodash-es';

import { SET_POST, SET_POSTS } from '@store/mutations';

import DefaultLayout from '@components/layouts/DefaultLayout.vue';
import PostMeta from '@components/PostMeta.vue';
import PostNav from '@components/PostNav.vue';

export default {
    components: {
        DefaultLayout,
        PostMeta,
        PostNav,
    },
    fetchData({ store, route }) {
        const { slug } = route.params;

        const loadPosts = store.state.posts == null ?
            import(
                /* webpackChunkName: "contents" */
                '@dist/contents.json',
            ).then(contents => {
                store.commit(SET_POSTS, contents.contents);
            }) :
            Promise.resolve();

        const loadPost = import(
            /* webpackChunkName: "post-" */
            `@content/${slug}.md`,
        ).then(post => {
            store.commit(SET_POST, Object.assign(post.default, { slug }));
        });

        return Promise.all([ loadPosts, loadPost ]);
    },
    computed: {
        url() {
            return `${this.$store.state.url}${this.post.permalink}`;
        },
        twitterUrl() {
            return `https://twitter.com/share?text=${this.post.title}&amp;url=${this.url}`;
        },
        facebookUrl() {
            return `https://www.facebook.com/sharer/sharer.php?u=${this.url}`;
        },
        googlePlusUrl() {
            return `https://plus.google.com/share?url=${this.url}`;
        },
        post() {
            return this.$store.state.post;
        },
        sortedPosts() {
            return sortBy(this.$store.state.posts, 'postDate');
        },
        postIndex() {
            return findIndex(this.sortedPosts, { slug: this.post.slug });
        },
        previousPost() {
            const idx = this.postIndex - 1;
            return idx >= 0 && this.sortedPosts[idx] ? this.sortedPosts[idx] : null;
        },
        nextPost() {
            const idx = this.postIndex + 1;
            return idx > 0 && this.sortedPosts[idx] ? this.sortedPosts[idx] : null;
        },
    },
    mounted() {
        this.highlightCode();
        this.loadJsBin();
    },
    methods: {
        shareTwitter() {
            window.open(this.twitterUrl, 'twitter-share', 'width=550,height=235');
            return false;
        },
        shareFacebook() {
            window.open(this.facebookUrl, 'facebook-share', 'width=580,height=296');
            return false;
        },
        shareGooglePlus() {
            window.open(this.googlePlusUrl, 'google-plus-share', 'width=490,height=530');
            return false;
        },
        highlightCode() {
            return import(
                /* webpackChunkName: "highlight" */
                'highlight.js',
            ).then(hljs => {
                document.querySelectorAll('pre code')
                    .forEach(el => hljs.highlightBlock(el));
            });
        },
        loadJsBin() {
            function appendScript(url) {
                return new Promise(resolve => {
                    const el = document.createElement('script');
                    const m = document.getElementsByTagName('script')[0];
                    el.async = 1;
                    el.src = url;
                    el.onload = resolve;
                    m.parentNode.insertBefore(el, m);
                });
            }

            if (document.querySelectorAll('.jsbin-embed').length === 0) {
                return Promise.resolve();
            }

            // HACK: This is needed to make embedded JSBin's work on client side
            // routes for subsequent posts including JSBin.  After it loads the
            // first time, it sets this global variable which prevents it from
            // executing on subsequent inclusions of this script.  This may change
            // at any time and it may break :()
            // TODO: File issue with JSBin to make this an API behavior
            window.jsbinified = undefined;
            return appendScript('https://static.jsbin.com/js/embed.min.js?4.1.0');
        },
    },
};
</script>

<style lang="scss">
@import '~@static/highlight.js/atom-one-light.min.css';
@import '~@scss/_variables.scss';
@import '~@scss/utils/_mixins.scss';

.c-post {

    &__title {
        margin-bottom: 10px;
    }

    &__meta {
        font-size: 0.9em;
        font-style: italic;
        margin-bottom: $content-padding;
    }

    &__date {
        font-style: italics;
    }

    &__tags {

    }

    &__content {
        @include post-styles;
        font-size: 1.15em;
        line-height: 1.75em;
    }

    &__share {
        text-align: right;
        margin-bottom: $content-padding;
    }

    &__share-medium {
        .fa {
            padding: 5px;
            border-radius: 50%;
            transition: color $transition-duration,
                        background-color $transition-duration;

            &:hover,
            &:focus {
                color: $white;
                background-color: $orange;
            }
        }
    }

    &__nav {
        display: flex;
    }

    &__nav-link {
        flex-grow: 1;

        &--previous {
            padding-right: 10px;
        }

        &--next {
            padding-left: 10px;
            text-align: right;
        }
    }

}

</style>
