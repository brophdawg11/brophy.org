<template>
<div>
    <PostList :posts="posts"></PostList>
</div>
</template>

<script>
import PostList from '../components/PostList.vue';

export default {
    components: {
        PostList,
    },
    asyncData({ app }) {
        return app.$content('/').getAll().then(posts => ({ posts }));
    },
    data() {
        return {
            posts: [],
        };
    },
};
</script>
