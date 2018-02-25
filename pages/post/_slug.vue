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

        <section class="c-post__content"
                 v-html="post.body" />

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
        twitterUrl() {
            return `https://twitter.com/share?text=${this.post.title}&amp;url=${this.url}`;
        },
        facebookUrl() {
            return `https://www.facebook.com/sharer/sharer.php?u=${this.url}`;
        },
        googlePlusUrl() {
            return `https://plus.google.com/share?url=${this.url}`;
        },
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
