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

        <li v-for="post in posts"
            :key="post.slug"
            class="c-posts__item">

            <h2 class="c-posts__title">
                <a :href="post.permaLink"
                   :title="post.title">
                    {{ post.title }}
                </a>
            </h2>

            <p class="c-posts__excerpt">
                <span v-html="post.excerpt"></span>
                <a class="read-more"
                   :href="post.permaLink"
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

import PostMeta from '../components/PostMeta.vue';

function excerpt(body) {
    const $ = cheerio.load(body);
    return $.html($('p').first())
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

function mapPosts(posts) {
    const mapPost = post => extend(omit(post, 'body'), {
        excerpt: excerpt(post.body),
        readTime: readingTime(post.body),
    });
    return sortBy(map(posts, mapPost), 'postDate').reverse();
}

export default {
    components: {
        PostMeta,
    },
    asyncData({ app, route, payload }) {
        return app.$content('/')
            .getAll()
            .then(posts => ({ posts: mapPosts(posts) }));
    },
    data() {
        return {
            posts: [{
                slug: 'foo',
                title: 'Foo',
                path: '/post/foo',
                excerpt: 'This is the foo post',
                date: '2017-01-01',
                tags: ['foo', 'bar', 'baz'],
                readtime: '9 minutes',
            }],
        };
    },
};
</script>
