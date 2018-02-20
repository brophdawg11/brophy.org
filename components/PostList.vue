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
                <a :href="post.permalink"
                   :title="post.title">
                    {{ post.title }}
                </a>
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
import { extend, map, omit, sortBy } from 'lodash';
import cheerio from 'cheerio';
import readingTime from 'reading-time';

import PostMeta from './PostMeta.vue';

function excerpt(body) {
    const $ = cheerio.load(body);
    return $.html($('p').first())
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

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
            const mapped = map(this.posts, post => extend(omit(post, 'body'), {
                excerpt: excerpt(post.body),
                readTime: readingTime(post.body),
            }));
            return sortBy(mapped, 'postDate').reverse();
        },
    },
};
</script>
