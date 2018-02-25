<template>
    <div>
        <PostList :posts="posts" />
    </div>
</template>

<script>
import { enhancePosts } from '../js/post-utils';

import PostList from '../components/PostList.vue';

export default {
    components: {
        PostList,
    },
    asyncData({ app }) {
        return app.$content('/').getAll().then(posts => ({
            posts: enhancePosts(posts),
        }));
    },
    data() {
        return {
            posts: [],
        };
    },
};
</script>
