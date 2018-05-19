<template>
    <nav class="nav">
        <router-link
            class="link"
            to="/">
            Home
        </router-link>
        <router-link
            class="link"
            to="/about/foo">
            About/Foo
        </router-link>
        <router-link
            class="link"
            to="/about/bar">
            About/Bar
        </router-link>
    </nav>
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

.nav {
    text-align: center;
    margin-bottom: 2 * $global-spacer;
}

.link {
    display: inline-block;
    padding: $global-spacer;
}
</style>
