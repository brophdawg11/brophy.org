<template>
    <article>
        <header>
            <h1 class="c-post__title">
                {{ post.title }}
            </h1>
            <div class="c-post__meta">
                <PostMeta :post="post" />
            </div>
        </header>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="c-post__content" v-html="post.__content" />

        <footer>
            <div class="c-post__share">

                <p class="c-post__share-lead-in">
                    Enjoy this post?
                </p>

                <a
                    :href="twitterUrl"
                    class="c-post__share-medium"
                    @click.prevent="shareTwitter()">
                    Share on Twitter<!--
                --></a>

                or

                <a
                    :href="twitterDiscussUrl"
                    class="c-post__share-medium"
                    target="_blank"
                    rel="noopener noreferrer">
                    Discuss on Twitter
                </a>

            </div>

            <PostNav :previous-post="previousPost" :next-post="nextPost" />
        </footer>

    </article>
</template>

<script>
import PostMeta from '~/components/PostMeta.vue';
import PostNav from '~/components/PostNav.vue';

async function loadManifest() {
    const manifest = await import(/* webpackChunkName: "contents" */ '~/build/contents.json');
    return manifest.default;
}

async function loadPost(manifest, slug) {
    const { default: post } = await import(`~/content/${slug}.md`);
    const postMeta = manifest.contents.find(p => p.slug === slug);
    return {
        ...post,
        ...postMeta,
    };
}

function getSurroundingPosts(manifest, slug) {
    const posts = manifest.contents.filter(p => !p.draft);
    const idx = posts.findIndex(p => p.slug === slug);
    if (idx < 0) {
        return [null, null];
    }
    return [posts[idx + 1], posts[idx - 1]];
}

export default {
    components: {
        PostMeta,
        PostNav,
    },
    async asyncData({ route }) {
        const { slug } = route.params;
        const manifest = await loadManifest();
        const post = await loadPost(manifest, slug);
        const [previousPost, nextPost] = getSurroundingPosts(manifest, slug);

        return {
            post,
            previousPost,
            nextPost,
        };
    },
    head() {
        const dupTags = (names, content) => names.map(name => ({ name, content }));
        return {
            title: `${this.post.title} | brophy.org`,
            meta: [
                {
                    name: 'keywords',
                    content: this.post.tags,
                },
                ...dupTags(['title', 'og:title', 'twitter:title'], this.post.title),
                ...dupTags(['og:url', 'twitter:url'], this.url),
            ],
        };
    },
    computed: {
        url() {
            return `https://www.brophy.org${this.post.permalink}`;
        },
        twitterUrl() {
            return `https://twitter.com/share?text=${this.post.title}&amp;url=${this.url}`;
        },
        twitterDiscussUrl() {
            return `https://twitter.com/search?q=${this.url}`;
        },
    },
    mounted() {
        this.loadJsBin();
    },
    methods: {
        shareTwitter() {
            window.open(this.twitterUrl, 'twitter-share', 'width=550,height=235');
            return false;
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

            if (document.querySelectorAll('.codepen').length === 0) {
                return Promise.resolve();
            }

            return appendScript('https://static.codepen.io/assets/embed/ei.js');
        },
    },
};
</script>

<style lang="scss">
@use "sass:math";
@import '~/static/highlightjs/atom-one-light.min.css';
@import '~scss/_variables.scss';
@import '~scss/utils/_mixins.scss';

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
        @include post-styles();
        font-size: 1.15em;
        line-height: 1.75em;
    }

    &__share {
        text-align: right;
        margin-bottom: $content-padding;
    }

    &__share-lead-in {
        padding-bottom: math.div($content-padding, 3);
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

}
</style>
