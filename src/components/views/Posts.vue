<template>
    <DefaultLayout>
        <PostList :posts="posts" />
    </DefaultLayout>
</template>

<script>
import { SET_POSTS } from '@store/mutations';

import DefaultLayout from '@components/layouts/DefaultLayout.vue';
import PostList from '@components/PostList.vue';

export default {
    components: {
        DefaultLayout,
        PostList,
    },
    fetchData({ store }) {
        return import(
            /* webpakcChunkName: "contents" */
            '@dist/contents.json',
        ).then(contents => {
            store.commit(SET_POSTS, contents.contents);
        });
    },
    computed: {
        posts() {
            return this.$store.state.posts;
        },
    },
};
</script>
