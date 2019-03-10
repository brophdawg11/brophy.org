<template>
    <div class="c-post-nav">

        <div v-if="previousPost"
             class="c-post-nav__link c-post-nav__link--previous">

            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt-link
                :to="previousPost.permalink"
                :title="previousPost.title">
                Previous: {{ previousPost.title }}
            </nuxt-link>

        </div>

        <div v-if="nextPost"
             class="c-post-nav__link c-post-nav__link--next">

            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt-link
                :to="nextPost.permalink"
                :title="nextPost.title">
                Next: {{ nextPost.title }}
            </nuxt-link>

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
