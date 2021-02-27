<template>
    <div :class="`page-content-wrapper s-page-${$route.name}`">

        <header class="page-header">
            <CircleLinks :links="headerLinks" />
        </header>

        <div class="page-content">
            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt />
        </div>

        <footer class="page-footer">
            <CircleLinks :links="footerLinks" class="page-footer__links" />
            <SiteInfo />
        </footer>

    </div>
</template>

<script>
import CircleLinks from '~/components/CircleLinks.vue';
import SiteInfo from '~/components/SiteInfo.vue';
import twitterPhotoUrl from '~/static/images/twitter-card.jpg';

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
                url: 'https://www.github.com/brophdawg11',
                external: true,
                title: 'GitHub',
                class: 'github',
                icon: 'github-circled',
            }, {
                url: 'https://www.instagram.com/brophdawg11',
                external: true,
                title: 'Instagram',
                class: 'instagram',
                icon: 'instagram',
            }, {
                url: 'https://www.twitter.com/brophdawg11',
                external: true,
                title: 'Twitter',
                class: 'twitter',
                icon: 'twitter',
            }, {
                url: '/rss.xml',
                external: true,
                title: 'RSS',
                class: 'rss',
                icon: 'rss-squared',
            }],
        };
    },
    head() {
        const dupTags = (names, content) => names.map(name => ({ name, content }));

        return {
            meta: [
                {
                    name: 'og:site_name',
                    content: 'brophy.org',
                },
                {
                    name: 'twitter:card',
                    content: 'summary',
                }, {
                    name: 'twitter:creator',
                    content: '@brophdawg11',
                },
                ...dupTags(
                    ['image', 'og:image', 'twitter:image'],
                    `https://www.brophy.org${twitterPhotoUrl}`,
                ),
            ],
        };
    },
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';

.page-content-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 0 $content-padding;
}

.page-header {
    padding: $content-padding 0 (2 * $content-padding);
    text-align: center;
}

.page-content {
    padding-bottom: 2 * $content-padding;
    width: 100%;
    max-width: 45em;
    margin: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.page-footer {
    padding: (2 * $content-padding) 0 $content-padding;
    text-align: center;

    &__links {
        margin-bottom: 6 * $base-link-unit;
    }
}

.page-footer-nav {
    text-align: center;
    font-size: 0.75em;
}

 @media screen and (min-width: $large-min) {
    .page-header, .page-footer {
        opacity: 0.2;
        transition: opacity 500ms ease;

        &:hover, .s-page-index & {
            opacity: 1;
        }
    }
}
</style>
