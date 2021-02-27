<template>
    <div class="content-centered">
        <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
        <nuxt />
    </div>
</template>

<script>
export default {
    name: 'Centered',
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';

.content-centered {
    width: 100%;
    max-width: 1000px;
    min-height: 100vh;
    margin: 0 auto;
}
</style>
