<template>
    <span>
        <a v-if="link.external"
           class="page-link__a"
           :href="link.url"
           :title="link.title">
           <slot></slot>
        </a>

        <nuxt-link v-else
                   class="page-link__a"
                   :to="link.url"
                   :title="link.title">
            <slot></slot>
        </nuxt-link>
    </span>
</template>

<script>
export default {
    name: 'CircleLink',
    props: {
        link: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss">
</style>
