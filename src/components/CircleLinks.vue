<template>
    <ul class="page-links__ul">

        <li v-for="link in links"
            :key="link.url"
            class="page-link__li">

            <a v-if="link.external"
               :href="link.url"
               :title="link.title"
               class="page-link__a">
                <span :class="`fa-${link.icon}`" class="fa" /><!--
                --><span class="page-link__p">{{ link.title }}</span>
            </a>

            <router-link v-else
                         :to="link.url"
                         :title="link.title"
                         class="page-link__a">
                <span :class="`fa-${link.icon}`" class="fa" /><!--
                --><span class="page-link__p">{{ link.title }}</span>

            </router-link>

        </li>

    </ul>
</template>

<script>
export default {
    name: 'CircleLinks',
    props: {
        links: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss">
</style>
