<template>
<div>
    <slot></slot>

</div>
</template>

<script>
export default {
    mounted() {
        /* eslint-disable */
        // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        // })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        // ga('create', 'UA-17810974-2', 'auto');
        // ga('send', 'pageview');
        /* eslint-enable */
    },
};
</script>

<style lang="scss">
// Layout inspired by http://demo.onedesigns.com/graceunderpressure/journal/
@import '../assets/scss/reset';
@import '../assets/scss/variables';
@import '../assets/scss/utils/mixins';
@import '../assets/scss/global';
@import '../assets/scss/content-centered';
@import '../assets/scss/page';
@import '../assets/scss/home';
@import '../assets/scss/posts';
@import '../assets/scss/tags';
@import '../assets/scss/pagination';
@import '../assets/scss/post';
@import '../assets/scss/meta';
@import '../assets/scss/resume';
@import '../assets/scss/scopes/header';
@import '../assets/scss/scopes/footer';
@import '../assets/scss/scopes/home';

.page-aside {
    background-image: url(/static/images/asides/bike.jpg);
}
</style>
