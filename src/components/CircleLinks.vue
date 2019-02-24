<template>
    <ul class="page-links__ul">

        <li v-for="link in links"
            :key="link.url"
            class="page-link__li">

            <ExternalLink v-if="link.external"
                          :href="link.url"
                          :title="link.title"
                          class="page-link__a">
                <LinkBody :icon="link.icon" :title="link.title" />
            </ExternalLink>

            <router-link v-else
                         :to="link.url"
                         :title="link.title"
                         class="page-link__a">
                <LinkBody :icon="link.icon" :title="link.title" />
            </router-link>

        </li>

    </ul>
</template>

<script>
import ExternalLink from '@components/ExternalLink';

const LinkBody = {
    functional: true,
    props: {
        icon: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    render(h, context) {
        return [
            h('span', { attrs: { class: `fa fa-${context.props.icon}` } }),
            h('span', { attrs: { class: 'page-link__p' } }, context.props.title),
        ];
    },
};

export default {
    name: 'CircleLinks',
    components: {
        ExternalLink,
        LinkBody,
    },
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
