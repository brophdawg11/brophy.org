<template>
    <section class="resume-section">
        <h2 class="resume-section__title">{{ title }}</h2>
        <div class="resume-section__content">
            <slot />
        </div>
    </section>
</template>

<script>export default {
    props: {
        title: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';
@import '~scss/utils/_mixins.scss';

.resume-section {
    display: grid;
    grid-template-columns: 1fr;
    padding: 10px 0;

    @media (min-width: $medium-min) {
        grid-template-columns: 1fr 3fr;
    }

    &:not(:first-child) {
        border-top: 1px solid $grey;
    }

    &__title {
        font-style: italic;
        color: $orange;
    }
}
</style>
