<template>
    <PostList :posts="posts" />
</template>

<script>
import { getPostsContentChain } from '~/assets/js/utils';
import PostList from '~/components/PostList.vue';

export default {
    components: {
        PostList,
    },
    async asyncData({ $content }) {
        const posts = await getPostsContentChain($content).fetch();
        return { posts };
    },
};
</script>
