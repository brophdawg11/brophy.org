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

                <nav class="page-footer-nav">

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
@import '~@scss/_variables.scss';

.page-aside {
    background-position: 50% 50%;
    background-size: cover;
    height: 150px;
    background-image: url('~/static/images/asides/bike-wide-small-4.jpg');

    @media screen and (min-width: $medium-min) {
        background-image: url('~/static/images/asides/bike-wide-medium-4.jpg');
    }

    @media screen and (min-width: $large-min) {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: $lhs-aside-width;
        height: 100%;
        background-image: url('~/static/images/asides/bike-tall-4.jpg');
    }
}

.page-content-wrapper {
    display: flex;
    flex-direction: column;

    position: relative;
    padding: $content-padding;

    @media screen and (min-width: $large-min) {
        padding: $content-padding 0;
        // @todo This is messy!!
        margin-left: calc(#{$lhs-aside-width} + #{$content-padding});
        width: calc(100% - #{$lhs-aside-width} - #{2 * $content-padding});
        min-height: 100vh;
    }
}

.page-content {
    width: 100%;
    max-width: 768px;
    margin: auto;
    padding-bottom: $content-padding;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.page-header {
    position: absolute;
    top: -($top-aside-height / 2);
    left: 0;
    right: 0;
    padding-bottom: $content-padding;
    text-align: center;

    @media screen and (min-width: $large-min) {
        position: relative;
        top: 0;
    }
}

.page-footer {
    text-align: center;
}

.page-footer-nav {
    text-align: center;
    font-size: 0.75em;
}

.s-header-links {

}

.s-footer-links {

    &.page-links__ul {
        padding-bottom: $content-padding;
    }

    .page-link__li {
        margin: (3 * $base-link-unit) (1.5 * $base-link-unit);

        @media screen and (min-width: $small-min) {
            margin: 2 * $base-link-unit;
        }
    }
}
</style>
