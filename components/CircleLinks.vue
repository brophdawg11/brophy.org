<template>
    <nav class="circle-links">

        <template v-for="link in links">

            <ExternalLink
                v-if="link.external"
                :key="link.url"
                :href="link.url"
                :title="link.title"
                class="circle-links__a">
                <LinkBody :icon="link.icon" :title="link.title" />
            </ExternalLink>

            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt-link
                v-else
                :key="link.url"
                :to="link.url"
                :title="link.title"
                class="circle-links__a">
                <LinkBody :icon="link.icon" :title="link.title" />
            </nuxt-link>

        </template>

    </nav>
</template>

<script>
import ExternalLink from '~/components/ExternalLink';

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
            h('span', { attrs: { class: 'circle-links__p' } }, context.props.title),
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
@import '~scss/_variables.scss';

.circle-links {
    text-align: center;
    color: $orange;

    &__a {
        position: relative;
        display: inline-block;
        margin: 0 $base-link-unit;
        background-color: $offwhite;
        border: 2px solid $orange;
        border-radius: 50%;
        transition: all $transition-duration;
        padding: (2 * $base-link-unit) (1.5 * $base-link-unit);
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

        &:hover,
        &:focus {
            background-color: $orange;
            color: $offwhite;

            @media screen and (min-width: $large-min) {
                & .circle-links__p {
                    opacity: 1;
                }
            }
        }
    }

    &__p {
        display: none;

        @media screen and (min-width: $large-min) {
            display: block;
            color: $orange;
            opacity: 0;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            margin-bottom: -(4 * $base-link-unit);
            text-align: center;
            transition: opacity $transition-duration;
            font-size: 0.8em;
        }
    }
}
</style>
