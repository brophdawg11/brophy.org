<template>
<div class="c-home-content">

    <img class="c-home-logo"
         src="~/assets/images/logo.png"
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
export default {
    computed: {
        title() {
            return this.$store.state.title;
        },
    },
};
</script>

<style lang="scss">
</style>
