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

        <nuxt-content class="c-post__content" :document="post" />

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

export default {
    components: {
        PostMeta,
        PostNav,
    },
    async asyncData({ route, $content }) {
        const { slug } = route.params;
        const data = await Promise.all([
            $content(slug).fetch(),
            $content()
                .where({ draft: { $ne: true } })
                .only(['title', 'permalink'])
                .sortBy('postDate', 'desc')
                .surround(slug)
                .fetch(),
        ]);

        const [post, [nextPost, previousPost]] = data;
        return { post, nextPost, previousPost };
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
};
</script>

<style lang="scss">
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
        padding-bottom: $content-padding / 3;
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
