<template>
    <div id="app">
        <noscript>
            Your browser does not have JS enabled, you are still able to browse
            the website but you won't be able to access advanced features such
            as editing or logging in.
        </noscript>
        <router-view :key="$route.fullPath" class="view" />
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style lang="scss">
@import '~@static/fontello/css/icon-font.css';
@import '~@scss/main.scss';
</style>
