<template>
    <ul class="page-links__ul">

        <li v-for="link in links"
            :key="link.url"
            class="page-link__li">

            <a v-if="link.external"
               :href="link.url"
               :title="link.title"
               class="page-link__a">
                <span :class="`fa-${link.icon}`" class="fa" /><!--
                --><span class="page-link__p">{{ link.title }}</span>
            </a>

            <router-link v-else
                         :to="link.url"
                         :title="link.title"
                         class="page-link__a">
                <span :class="`fa-${link.icon}`" class="fa" /><!--
                --><span class="page-link__p">{{ link.title }}</span>

            </router-link>

        </li>

    </ul>
</template>

<script>
export default {
    name: 'CircleLinks',
    props: {
        links: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss">
@import '~@scss/_variables.scss';

.page-links__ul {
    text-align: center;
    color: $orange;
}

.page-link__li {
    display: inline-block;
    margin: 1em;

    &:hover {

    }

    @media screen and (min-width: $large-min) {
        position: relative;
    }
}

.page-link__a {
    background-color: $offwhite;
    border: 2px solid $orange;
    border-radius: 50%;
    transition: all $transition-duration;
    padding: (2.5 * $base-link-unit) (1.4 * $base-link-unit) (2 * $base-link-unit);
    text-decoration: none;
    font-family: $sans-serif;

    .fa {
        font-size: 3 * $base-link-unit;
    }

    &:link,
    &:active,
    &:visited,
    &:hover {
        color: inherit;
        text-decoration: none;
    }

    &:hover {
        background-color: $orange;
        color: $offwhite;

        @media screen and (min-width: $large-min) {
            .page-link__p {
                opacity: 1;
            }
        }
    }
}

.page-link__p {
    display: none;

    @media screen and (min-width: $large-min) {
        display: block;
        color: $orange;
        opacity: 0;
        position: absolute;
        bottom: 0;
        width: 150%;
        margin-bottom: -(6 * $base-link-unit);
        margin-left: -25%;
        text-align: center;
        left: 0;
        right: 0;
        transition: opacity $transition-duration;
        font-size: 0.8em;
    }
}
</style>
