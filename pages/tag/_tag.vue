<template>
    <div>
        <h1 class="tag__title">
            Posts tagged with <span class="tag__tag">{{ tag }}</span>
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
@import '~scss/_variables.scss';

.tag {
    &__title {
        margin-bottom: 2em;
        font-size: 1.5em;
        text-align: center;
    }

    &__tag {
        color: $orange;
    }
}
</style>
