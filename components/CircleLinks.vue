<template>
<ul class="page-links__ul">

    <li v-for="link in links"
        class="page-link__li">

        <nuxt-link class="page-link__a"
                   :to="link.url"
                   :title="link.title">

           <span class="fa"
                 :class="`fa-${link.icon}`">
           </span>

           <span class="page-link__p">
               {{ link.title }}
           </span>

        </nuxt-link>

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
