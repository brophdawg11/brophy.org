<template>
    <div class="">

        <p v-for="(line, index) in lines" :key="index" class="page-footer-line">
            <component
                :is="text.href ? 'ExternalLink' : 'span'"
                v-for="(text, index2) in line"
                :key="index2"
                v-bind="{
                    ...(text.href ? { href: text.href } : {}),
                }"
                v-text="text.title || text" />
        </p>

        <p class="page-footer-line">
            &copy; Copyright {{ year }} Matt Brophy
        </p>

    </div>
</template>

<script>
import ExternalLink from '~/components/ExternalLink.vue';

export default {
    name: 'SiteInfo',
    components: {
        ExternalLink,
    },
    data() {
        return {
            year: new Date().getFullYear(),
            lines: [
                [
                    'built with ',
                    {
                        href: 'https://vuejs.org/',
                        title: 'vue',
                    },
                    ' and ',
                    {
                        href: 'https://nuxtjs.org/',
                        title: 'nuxt',
                    },
                ],
                [
                    'stored in ',
                    {
                        href: 'https://www.github.com/brophdawg11/brophy.org',
                        title: 'gitHub',
                    },
                    ', hosted in ',
                    {
                        href: 'https://www.netlify.com/',
                        title: 'netlify',
                    },
                ],
                [
                    'icons from ',
                    {
                        href: 'https://fontawesome.com/',
                        title: 'font-awesome',
                    },
                    ' via ',
                    {
                        href: 'http://fontello.com/',
                        title: 'fontello',
                    },
                ],
            ],
        };
    },
};
</script>

<style lang="scss">
.page-footer-line {
    line-height: 1.5em;
    padding: 0.25em;
}
</style>
