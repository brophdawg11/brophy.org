<template>
    <div class="c-post__nav">

        <div v-if="previousPost"
             class="c-post__nav-link c-post__nav-link--previous" >

            <!--
            <nuxt-link :to="previousPost.permalink"
                       :title="previousPost.title">
                <span class="fa fa-arrow-left"></span>
            </nuxt-link>
            -->

            <nuxt-link :to="previousPost.permalink"
                       :title="previousPost.title">
                Previous: {{ previousPost.title }}
            </nuxt-link>

        </div>

        <div v-if="nextPost"
             class="c-post__nav-link c-post__nav-link--next" >

            <nuxt-link :to="nextPost.permalink"
                       :title="nextPost.title">
                Next: {{ nextPost.title }}
            </nuxt-link>

            <!--
            <nuxt-link :to="nextPost.permalink"
                       :title="nextPost.title">
                <span class="fa fa-arrow-right"></span>
            </nuxt-link>
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
