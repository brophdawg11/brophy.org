<template>
    <div>
        <h1 class="c-tags__title">
            <span class="c-tags__title-tag">{{ tag }}</span> Posts
        </h1>

        <PostList :posts="posts" />
    </div>
</template>

<script>
import { get, filter, includes } from 'lodash';

import { enhancePosts } from '../../js/post-utils';

import PostList from '../../components/PostList.vue';

export default {
    components: {
        PostList,
    },
    asyncData({ app, route }) {
        const tag = get(route, 'params.tag');
        const postHasTag = p => includes(get(p, 'tags', '').split(','), tag);
        return app.$content('/')
            .getAll()
            .then(posts => filter(posts, postHasTag))
            .then(posts => ({
                tag,
                posts: enhancePosts(posts),
            }));
    },
    data() {
        return {
            tag: null,
            posts: [],
        };
    },
};
</script>
