<template>
    <div>

        <aside class="page-aside">

            <div class="page-aside-img-loader" />

        </aside>

        <section :class="pageScope" class="page-content-wrapper">

            <header class="page-header">

                <nav>

                    <CircleLinks :links="headerLinks" class="s-header-links" />

                </nav>

            </header>

            <div class="page-content">
                <slot/>
            </div>

            <footer class="page-footer">

                <nav>

                    <CircleLinks :links="footerLinks" class="s-footer-links" />

                </nav>

                <SiteInfo/>

            </footer>

        </section>

    </div>
</template>

<script>
import CircleLinks from '@components/CircleLinks.vue';
import SiteInfo from '@components/SiteInfo.vue';

export default {
    components: {
        CircleLinks,
        SiteInfo,
    },
    data() {
        return {
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
                external: true,
                title: 'GitHub',
                class: 'github',
                icon: 'github-circled',
            }, {
                url: 'http://www.instagram.com/brophdawg11',
                external: true,
                title: 'Instagram',
                class: 'instagram',
                icon: 'instagram',
            }, {
                url: 'http://www.twitter.com/brophdawg11',
                external: true,
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
    computed: {
        pageScope() {
            return this.$store.state.pageScope || '';
        },
    },
};
</script>

<style lang="scss">
</style>
