<template>
    <div>
        <!--
        {% if pagination %}
            {% if pagination.previous %}
                {% include "templates/partials/pagination.nunjucks" %}
            {% endif %}
        {% endif %}
        -->

        <ul class="c-posts__list">

            <li v-for="post in sortedPosts"
                :key="post.permalink"
                class="c-posts__item">

                <h2 class="c-posts__title">
                    <router-link :to="post.permalink"
                                 :title="post.title">
                        {{ post.title }}
                    </router-link>
                </h2>

                <p class="c-posts__excerpt">
                    <!-- eslint-disable-next-line vue/no-v-html-->
                    <span v-html="post.excerpt" />
                    <router-link :to="post.permalink"
                                 :title="post.title"
                                 class="read-more">
                        <span class="fa fa-angle-double-right" />
                    </router-link>
                </p>

                <div class="c-posts__meta">
                    <PostMeta :post="post" />
                </div>

            </li>

        </ul>

        <!--{% include "templates/partials/pagination.nunjucks" %}-->
    </div>
</template>

<script>
import { sortBy } from 'lodash-es';

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
    computed: {
        sortedPosts() {
            return sortBy(this.posts, 'postDate').filter(p => !p.draft).reverse();
        },
    },
};
</script>

<style lang="scss">
@import '~@scss/_variables.scss';
@import '~@scss/utils/_mixins.scss';

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
        @include post-styles;
        padding-bottom: 1em;
        line-height: 1.5em;
    }

    &__meta {
        font-size: 1em;
        font-style: italic;
    }

}

.c-pagination {
    text-align: center;
    margin-bottom: $content-padding;
}
</style>
