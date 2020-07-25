<template>
    <section class="resume-section">
        <h2 class="resume-section__title">{{ title }}</h2>

        <div class="resume-section__content">
            <slot />
        </div>
        <div class="resume-section__clear" />
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
    border-top: 1px solid #dedede;
    padding: 10px 0;

    &:first-child {
        border-top: 0;
    }

    &:last-child {
        padding-bottom: 10px;
    }

    &__title {
        float: none;
        width: 100%;
        font-family: $serif;
        font-style: italic;
        font-size: 1.75em;
        color: #c58405;


        @media (min-width: $medium-min) {
            float: left;
            width: 25%;
        }
    }

    &__content {
        float: none;
        width: 100%;
        margin-left: 5px;

        @media (min-width: $medium-min) {
            float: right;
            width: 72.5%;
        }

        article {
            margin-top: 15px;
            margin-right: 10px;

            @media (min-width: $medium-min) {
                &:first-child {
                    margin-top: 5px;
                }
            }
        }

        h2 {
            font-family: $serif;
            font-size: 1.5em;
        }
    }


    &__clear {
        clear: both;
        margin-top: 10px;
    }
}
</style>
