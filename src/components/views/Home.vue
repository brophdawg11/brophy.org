<template>
    <DefaultLayout>

        <div class="c-home-content">

            <img :src="logo"
                 class="c-home-logo"
                 alt="Matt Brophy">

            <h1 class="c-home-title">
                {{ title }}
            </h1>

            <p class="c-home-description">
                web/software developer at
                <a href="http://www.urbn.com"
                   title="URBN"
                   target="_blank">
                    urbn
                </a>
            </p>

            <p class="c-home-description">
                enjoys sports, beer, coffee, and coding
                <span class="c-home-description-dash">&mdash;</span>
                <br class="c-home-description-break" >
                order of preference depends on day and time
            </p>

        </div>

    </DefaultLayout>
</template>

<script>
import DefaultLayout from '@components/layouts/DefaultLayout.vue';

export default {
    components: {
        DefaultLayout,
    },
    computed: {
        title() {
            return this.$store.state.title;
        },
        logo() {
            /* eslint-disable global-require */
            return require('@static/images/logo.png');
            /* eslint-enable global-require */
        },
    },
};
</script>

<style lang="scss">
@import '~@scss/_variables.scss';

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
