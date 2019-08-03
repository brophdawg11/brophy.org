<template>
    <div v-once>
        <p class="page-footer-line">
            built with
            <ExternalLink href="https://vuejs.org/" title="Vue">
                vue
            </ExternalLink>
            and
            <ExternalLink href="https://nuxtjs.org/" title="Nuxt">
                nuxt
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            stored in
            <ExternalLink href="https://www.github.com/brophdawg11/brophy.org"
                          title="GitHub">
                github<!--
            --></ExternalLink>,
            hosted in
            <ExternalLink href="https://www.netlify.com/" title="Netlify">
                netlify
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            side images from
            <ExternalLink href="https://www.gratisography.com/" title="Gratisography">
                gratisography
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            icons from
            <ExternalLink href="https://fontawesome.com/"
                          title="Font-Awesome">
                font-awesome
            </ExternalLink>
            via
            <ExternalLink href="http://fontello.com/" title="Fontello">
                fontello
            </ExternalLink>
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
