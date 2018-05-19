<template>
    <footer class="footer">
        Footer content
    </footer>
</template>

<script>
export default {
    name: 'Footer',
};
</script>

<style lang="scss" scoped>
// Sass imports using webpack aliases require a leading ~
// https://github.com/webpack-contrib/sass-loader#imports
@import '~@scss/_variables.scss';

.footer {
    text-align: center;
    margin-top: 2 * $global-spacer;
}
</style>
