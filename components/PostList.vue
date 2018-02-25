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
                <nuxt-link :to="post.permalink"
                           :title="post.title">
                    {{ post.title }}
                </nuxt-link>
            </h2>

            <p class="c-posts__excerpt">
                <span v-html="post.excerpt"></span>
                <a class="read-more"
                   :href="post.permalink"
                   :title="post.title">
                    <span class="fa fa-angle-double-right"></span>
                </a>
            </p>

            <div class="c-posts__meta">
                <PostMeta :post="post"></PostMeta>
            </div>

         </li>

    </ul>

    <!--{% include "templates/partials/pagination.nunjucks" %}-->
</div>
</template>

<script>
import { sortBy } from 'lodash';

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
            return sortBy(this.posts, 'postDate').reverse();
        },
    },
};
</script>
