<template>
    <div class="c-content-centered-outer">

        <div class="c-content-centered">
            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt />
        </div>

    </div>
</template>

<script>
export default {
    name: 'Centered',
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';

.c-content-centered-outer {
    width: 100%;
    min-height: 100vh;
    background: $offblack;
}

.c-content-centered {
    background: $offwhite;

    @media all and (min-width: $medium-min) {
        width: 94%;
        margin: 0 3%;
    }

    @media all and (min-width: $large-min) {
        width: 90%;
        max-width: 1000px;
        margin: 0 auto;
    }
}
</style>
