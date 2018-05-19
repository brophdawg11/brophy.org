<template>
    <header class="header">
        Header content
    </header>
</template>

<script>
export default {
    name: 'Header',
};
</script>

<style lang="scss" scoped>
// Sass imports using webpack aliases require a leading ~
// https://github.com/webpack-contrib/sass-loader#imports
@import '~@scss/_variables.scss';

.header {
    text-align: center;
    margin-bottom: 2 * $global-spacer;
}
</style>
