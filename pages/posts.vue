<template>
    <PostList :posts="posts" />
</template>

<script>
import PostList from '~/components/PostList.vue';

export default {
    components: {
        PostList,
    },
    async asyncData() {
        const { default: data } =
            await import(/* webpackChunkName: "contents" */ '~/dist/contents.json');
        return { posts: data.contents };
    },
};
</script>
