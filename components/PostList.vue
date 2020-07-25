<template>
    <div>

        <ul class="c-posts__list">

            <li v-for="post in posts" :key="post.permalink" class="c-posts__item">

                <h2 class="c-posts__title">
                    <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                    <nuxt-link :to="post.permalink" :title="post.title">
                        {{ post.title }}
                    </nuxt-link>
                </h2>

                <!-- eslint-disable-next-line vue/no-v-html-->
                <p class="c-posts__excerpt" v-html="post.excerpt" />

                <div class="c-posts__meta">
                    <PostMeta :post="post" />
                </div>

            </li>

        </ul>

    </div>
</template>

<script>
import PostMeta from './PostMeta.vue';

export default {
    components: {
        PostMeta,
    },
    props: {
        posts: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';
@import '~scss/utils/_mixins.scss';

.c-posts {

    &__list {
        list-style: none;
        padding-bottom: $content-padding;
    }

    &__item {
        padding-bottom: $content-padding;
    }

    &__title {
        margin-bottom: 0.25em;
    }

    &__excerpt {
        @include post-styles();
        padding-bottom: 1em;
        line-height: 1.5em;
    }

    &__meta {
        text-align: right;
    }

}
</style>
