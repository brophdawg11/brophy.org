<template>
<ul class="page-links__ul">

    <li v-for="link in links"
        class="page-link__li">

        <a class="page-link__a"
           :href="link.url"
           :title="link.title">

           <span class="fa"
                 :class="`fa-${link.icon}`">
           </span>

           <span class="page-link__p">
               {{ link.title }}
           </span>

        </a>

    </li>

</ul>
</template>

<script>
export default {
    name: 'circle-links',
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
