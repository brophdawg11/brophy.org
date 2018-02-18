<template>
<div class="c-home-content">

    <img class="c-home-logo"
         src="~/static/images/logo.png"
         alt="Matt Brophy" />

    <h1 class="c-home-title">
        {{ title }}
    </h1>

    <p class="c-home-description">
        web/software developer at
        <a href="http://www.urbn.com"
           title="URBN">urbn</a>
    </p>

    <p class="c-home-description">
        enjoys sports, beer, coffee, and coding
        <span class="c-home-description-dash">&mdash;</span>
        <br class="c-home-description-break" />
        order of preference depends on day and time
    </p>

</div>
</template>

<script>
import { SET_PAGE_SCOPE } from '../store/mutations';

export default {
    computed: {
        title() {
            return this.$store.state.title;
        },
    },
    beforeCreate() {
        this.$store.commit(SET_PAGE_SCOPE, 's-home');
    },
};
</script>

<style lang="scss">
</style>
