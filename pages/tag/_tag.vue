<template>
    <div>
        <h1 class="tag__title">
            Posts tagged with <span class="tag__tag">{{ tag }}</span>
        </h1>

        <PostList :posts="posts" />
    </div>
</template>

<script>
import PostList from '~/components/PostList.vue';

export default {
    components: {
        PostList,
    },
    async asyncData({ route }) {
        const { tag } = route.params;
        const { default: data } =
            await import(/* webpackChunkName: "contents" */ '~/dist/contents.json');
        return {
            tag,
            posts: data.contents.filter(p => p.tags.split(',').includes(tag)),
        };
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
