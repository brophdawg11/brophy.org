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
                    <router-link :to="`/post/${post.slug}`"
                                 :title="post.title">
                        {{ post.title }}
                    </router-link>
                </h2>

                <p class="c-posts__excerpt">
                    <span v-html="post.excerpt" />
                    <a :href="post.permalink"
                       :title="post.title"
                       class="read-more">
                        <span class="fa fa-angle-double-right" />
                    </a>
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
            return sortBy(this.posts, 'postDate').reverse();
        },
    },
};
</script>
