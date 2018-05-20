<template>
    <div class="c-content-centered-outer">

        <div class="c-content-centered">
            <slot/>
        </div>

    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '~@scss/_variables.scss';

.c-content-centered-outer {
    width: 100%;
    min-height: 100vh;
    background: $offblack;
    padding: 1em 0;
}

.c-content-centered {
    background: $offwhite;
    width: 98%;
    padding: 0.5em;
    margin: 0 1%;

    @media all and (min-width: $medium-min) {
        width: 94%;
        padding: 1%;
        margin: 0 3%;
    }

    @media all and (min-width: $large-min) {
        width: 90%;
        max-width: 1000px;
        margin: 0 auto;
    }
}
</style>
