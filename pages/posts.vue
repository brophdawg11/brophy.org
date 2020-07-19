<template>
    <PostList :posts="posts" />
</template>

<script>
import { omit } from 'lodash-es';

import PostList from '~/components/PostList.vue';

export default {
    components: {
        PostList,
    },
    async asyncData({ $content }) {
        const posts = await $content()
            .where({
                draft: { $ne: true },
                extension: { $eq: '.md' },
            })
            .sortBy('postDate', 'desc')
            .fetch();
        return {
            posts: posts.map(p => omit(p, ['body', 'toc'])),
        };
    },
};
</script>
