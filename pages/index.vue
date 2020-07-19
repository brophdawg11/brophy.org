<template>
    <div class="c-home-content">

        <img :src="logo" class="c-home-logo" alt="Matt Brophy">

        <h1 class="c-home-title">Matt Brophy</h1>

        <p class="c-home-description">
            web/software developer at
            <ExternalLink href="https://www.urbn.com" title="URBN">
                urbn
            </ExternalLink>
        </p>

        <p class="c-home-description">
            <span>enjoys sports, beer, coffee, and coding</span>
            <span class="c-home-description-dash">&mdash;</span>
            <br class="c-home-description-break">
            <span>order of preference depends on day and time</span>
        </p>

    </div>
</template>

<script>
import ExternalLink from '~/components/ExternalLink.vue';

export default {
    components: {
        ExternalLink,
    },
    computed: {
        logo() {
            /* eslint-disable global-require */
            return require('~/static/images/logo.png');
            /* eslint-enable global-require */
        },
    },
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';

.c-home-content {
    text-align: center;
    padding-top: 1.5em;
}

.c-home-logo {
    width: 75px;
    padding-bottom: 1em;
}

.c-home-title {
}

.c-home-description {
    padding: 1em;
    line-height: 1.5em;
}

.c-home-description-dash {
    display: inline;

    @media all and (min-width: $small-min) {
        display: none;
    }
}

.c-home-description-break {
    display: none;

    @media all and (min-width: $small-min) {
        display: block;
    }
}
</style>
