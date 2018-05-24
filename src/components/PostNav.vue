<template>
    <div class="c-post__nav">

        <div v-if="previousPost"
             class="c-post__nav-link c-post__nav-link--previous" >

            <!--
            <router-link :to="previousPost.permalink"
                       :title="previousPost.title">
                <span class="fa fa-arrow-left"></span>
            </router-link>
            -->

            <router-link :to="`/post/${previousPost.slug}`"
                         :title="previousPost.title">
                Previous: {{ previousPost.title }}
            </router-link>

        </div>

        <div v-if="nextPost"
             class="c-post__nav-link c-post__nav-link--next" >

            <router-link :to="`/post/${nextPost.slug}`"
                         :title="nextPost.title">
                Next: {{ nextPost.title }}
            </router-link>

            <!--
            <router-link :to="nextPost.permalink"
                       :title="nextPost.title">
                <span class="fa fa-arrow-right"></span>
            </router-link>
            -->

        </div>

    </div>
</template>

<script>
export default {
    props: {
        previousPost: {
            type: Object,
            default: null,
        },
        nextPost: {
            type: Object,
            default: null,
        },
    },
};
</script>
