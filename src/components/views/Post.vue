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

import { SET_POST } from '@store/mutations';

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
        return import(
            /* webpackChunkName: "post-" */
            `@content/${slug}.md`,
        ).then(post => {
            store.commit(SET_POST, post.default);
        });
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
            return this.sortedPosts[idx] ? this.sortedPosts[idx] : null;
        },
        nextPost() {
            const idx = this.postIndex + 1;
            return this.sortedPosts[idx] ? this.sortedPosts[idx] : null;
        },
    },
    mounted() {
        import(
            /* webpackChunkName: "highlight" */
            'highlight.js',
        ).then(hljs => {
            document.querySelectorAll('pre code')
                .forEach(el => hljs.highlightBlock(el));
        });
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
    },
};
</script>
