<template>
    <div class="c-post-nav">

        <div v-if="previousPost"
             class="c-post-nav__link c-post-nav__link--previous">

            <router-link :to="previousPost.permalink"
                         :title="previousPost.title">
                Previous: {{ previousPost.title }}
            </router-link>

        </div>

        <div v-if="nextPost"
             class="c-post-nav__link c-post-nav__link--next">

            <router-link :to="nextPost.permalink"
                         :title="nextPost.title">
                Next: {{ nextPost.title }}
            </router-link>

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

<style lang="scss">
.c-post-nav {
    display: flex;

    &__link {
        flex-grow: 1;

        &--previous {
            padding-right: 10px;
            text-align: left;
        }

        &--next {
            padding-left: 10px;
            text-align: right;
        }
    }
}
</style>
