<template>
<ul class="page-links__ul">

    <li v-for="link in links"
        class="page-link__li">

        <CircleLink :link="link">

           <span class="fa"
                 :class="`fa-${link.icon}`">
           </span>

           <span class="page-link__p">
               {{ link.title }}
           </span>

        </CircleLink>

    </li>

</ul>
</template>

<script>
import CircleLink from './CircleLink.vue';

export default {
    name: 'CircleLinks',
    components: {
        CircleLink,
    },
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
