<template>
<div>
    <div style="display: none;">
        <!--{% for img in _.tail(global.asides) %}
            <img src="{{ img }}" />
        {% endfor %}-->
    </div>

    <aside class="page-aside">

        <div class="page-aside-img-loader">
        </div>

    </aside>

    <section class="page-content-wrapper">

        <header class="page-header">

            <nav>

                <CircleLinks
                    :links="headerLinks"
                    class='s-header-links'>
                </CircleLinks>

            </nav>

        </header>

        <div class="page-content">
            <nuxt></nuxt>
        </div>

        <footer class="page-footer">

            <nav>

                <CircleLinks
                    :links="footerLinks"
                    class='s-footer-links'>
                </CircleLinks>

            </nav>

            <p class="page-footer-line">
                built with
                <a href="https://nuxtjs.org/" title="Nuxt">nuxt</a>
            </p>
            <p class="page-footer-line">
                hosted on
                <a href="https://aws.amazon.com/s3/" title="S3">aws s3</a>
                &mdash;
                stored in
                <a href="https://www.github.com/brophdawg11/brophy.org" title="GitHub">github</a>
            </p>
            <p class="page-footer-line">
                side images from
                <a href="http://www.gratisography.com/" title="Gratisography">gratisography</a>
                &mdash;
                icons from
                <a href="http://fortawesome.github.io/Font-Awesome/" title="Font-Awesome">font-awesome</a> via
                <a href="http://fontello.com/" title="Fontello">fontello</a>
            </p>
            <p class="page-footer-line">
                &copy; Copyright {{year}} Matt Brophy
            </p>

        </footer>

    </section>

    <!--<script>
        /* eslint-disable */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-17810974-2', 'auto');
        ga('send', 'pageview');
        /* eslint-enable */
    </script>-->

</div>
</template>

<script>
import CircleLinks from '../components/CircleLinks.vue';

export default {
    components: {
        CircleLinks,
    },
    data() {
        return {
            year: new Date().getFullYear(),
            headerLinks: [{
                url: '/',
                title: 'Home',
                class: 'home',
                icon: 'home',
            }, {
                url: '/posts/',
                title: 'Blog',
                class: 'blog',
                icon: 'chat',
            }, {
                url: '/resume/',
                title: 'Resume',
                class: 'resume',
                icon: 'doc-text-inv',
            }],
            footerLinks: [{
                url: 'http://www.github.com/brophdawg11',
                title: 'GitHub',
                class: 'github',
                icon: 'github-circled',
            }, {
                url: 'http://www.instagram.com/brophdawg11',
                title: 'Instagram',
                class: 'instagram',
                icon: 'instagram',
            }, {
                url: 'http://www.facebook.com/matt.b.brophy',
                title: 'Facebook',
                class: 'facebook',
                icon: 'facebook',
            }, {
                url: 'http://www.twitter.com/brophdawg11',
                title: 'Twitter',
                class: 'twitter',
                icon: 'twitter',
            }, {
                url: '/rss.xml',
                title: 'RSS',
                class: 'rss',
                icon: 'rss-squared',
            }],
        };
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
