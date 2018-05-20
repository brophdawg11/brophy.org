<template>
    <div>
        <div v-html="cssStyles" />

        <!-- Prefetch subsequent images -->
        <div v-once style="display: none;">
            <img v-for="img in tailImages"
                 :key="img"
                 :src="img">
        </div>

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

            </footer>

        </section>

    </div>
</template>

<script>
import { tail } from 'lodash-es';

import CircleLinks from '@components/CircleLinks.vue';

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
        images() {
            return this.$store.state.asides;
        },
        tailImages() {
            return tail(this.images);
        },
    },
    created() {
        // Set here so it's purposely not dynamic
        this.cssStyles = this.genStyles();
    },
    methods: {
        genStyles() {
            const startImg = this.images[0];
            const num = this.images.length;
            const duration = num * 30;
            const pi = Math.round(100 / num); // percentage increment
            const pd = Math.round(pi / 2); // percentage delta

            const styles = [
                `.page-aside { background-image: url(${startImg}); }     `,
                '@keyframes rotate-background {                          ',
                '    from {                                              ',
                `        background-image: url(${startImg});             `,
                '    }                                                   ',

                // Include a step for each subsequent image
                this.tailImages.map((img, i) => {
                    const p = pi * (i + 1);
                    const bg = `background-image: url(${img});`;
                    return `${p - pd}%, ${p + pd}% { ${bg} }`;
                }).join('\n'),

                '    to {                                                ',
                `      background-image: url(${startImg});               `,
                '    }                                                   ',
                '}                                                       ',

                '.page-aside {                                           ',
                '    animation-name: rotate-background;                  ',
                `    animation-duration: ${duration}s;                   `,
                '    animation-iteration-count: infinite;                ',
                '}                                                       ',
            ].join('\n');

            return `<style>${styles}</style>`;
        },
    },
};
</script>
