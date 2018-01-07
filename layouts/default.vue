<template>
<Layout>
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

</Layout>
</template>

<script>
import CircleLinks from '../components/CircleLinks.vue';
import Layout from '../components/Layout.vue';

export default {
    components: {
        CircleLinks,
        Layout,
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
