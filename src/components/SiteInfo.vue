<template>
    <div v-once>
        <p class="page-footer-line">
            built with
            <a href="https://vuejs.org/"
               title="Vue"
               target="_blank">vue</a>
        </p>
        <p class="page-footer-line">
            hosted on
            <a href="https://firebase.google.com/"
               title="Firebase"
               target="_blank">
                firebase
            </a>
            using
            <a href="https://firebase.google.com/products/functions/"
               title="Cloud Functions"
               target="_blank">
                cloud functions
            </a>
            &mdash;
            stored in
            <a href="https://www.github.com/brophdawg11/brophy.org"
               title="GitHub"
               target="_blank">
                github
            </a>
        </p>
        <p class="page-footer-line">
            side images from
            <a href="http://www.gratisography.com/"
               title="Gratisography"
               target="_blank">
                gratisography
            </a>
            &mdash;
            icons from
            <a href="http://fortawesome.github.io/Font-Awesome/"
               title="Font-Awesome"
               target="_blank">
                font-awesome
            </a>
            via
            <a href="http://fontello.com/"
               title="Fontello"
               target="_blank">
                fontello
            </a>
        </p>
        <p class="page-footer-line">
            &copy; Copyright {{ year }} Matt Brophy
        </p>

    </div>
</template>

<script>
export default {
    name: 'SiteInfo',
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
    padding: 0.5em;
}
</style>
