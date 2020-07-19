
<template>
    <div>
        <h1 class="c-tags__title">
            <span class="c-tags__title-tag">{{ tag }}</span> Posts
        </h1>

        <PostList :posts="posts" />
    </div>
</template>

<script>
import { getPostsContentChain } from '~/assets/js/utils';
import PostList from '~/components/PostList.vue';

export default {
    components: {
        PostList,
    },
    async asyncData({ $content, route }) {
        const { tag } = route.params;
        const posts = await getPostsContentChain($content).fetch();
        return { tag, posts: posts.filter(p => p.tags.split(',').includes(tag)) };
    },
};
</script>

<style lang="scss">
</style>
