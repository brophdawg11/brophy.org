<template>
    <span>
        <a v-if="link.external"
           :href="link.url"
           :title="link.title"
           class="page-link__a">
            <slot/>
        </a>

        <nuxt-link v-else
                   :to="link.url"
                   :title="link.title"
                   class="page-link__a">
            <slot/>
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
