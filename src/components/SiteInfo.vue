<template>
    <div v-once>
        <p class="page-footer-line">
            built with
            <ExternalLink href="https://vuejs.org/" title="Vue">
                vue
            </ExternalLink>
            and
            <ExternalLink href="https://ssr.vuejs.org/en/" title="Vue SSR">
                vue ssr
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            hosted on
            <ExternalLink href="https://firebase.google.com/" title="Firebase">
                firebase
            </ExternalLink>
            using
            <ExternalLink href="https://firebase.google.com/products/functions/"
                          title="Cloud Functions">
                cloud functions
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            stored in
            <ExternalLink href="https://www.github.com/brophdawg11/brophy.org"
                          title="GitHub">
                github
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            side images from
            <ExternalLink href="http://www.gratisography.com/" title="Gratisography">
                gratisography
            </ExternalLink>
        </p>
        <p class="page-footer-line">
            icons from
            <ExternalLink href="http://fortawesome.github.io/Font-Awesome/"
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
import ExternalLink from '@components/ExternalLink.vue';

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
