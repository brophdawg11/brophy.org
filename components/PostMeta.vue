<template>
    <p class="post-meta">
        <span :title="formattedDate" class="c-meta__date">{{ relativeDate }}</span>

        <span class="post-meta__divider1">|</span>

        {{ post.readingTime }}

        <br class="post-meta__br">

        <span class="post-meta__divider2">|</span>

        <span v-for="tag in tagArray" :key="tag" class="post-meta__link">
            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt-link :key="tag" :to="`/tag/${tag}/`" :title="tag">{{ tag }}</nuxt-link>
        </span>
    </p>
</template>

<script>
import { isString } from 'lodash-es';
import vagueTime from 'vague-time';

export default {
    props: {
        post: {
            type: Object,
            required: true,
        },
    },
    computed: {
        postDate() {
            return new Date(Date.parse(this.post.postDate));
        },
        relativeDate() {
            return vagueTime.get({ to: this.postDate.getTime() });
        },
        formattedDate() {
            const [, month, date, year] = this.postDate.toDateString().split(' ');
            return `${month} ${date}, ${year}`;
        },
        tagArray() {
            return isString(this.post.tags) ?
                this.post.tags.split(',') :
                [];
        },
    },
};
</script>

<style lang="scss">
@import '~scss/_variables.scss';

.post-meta {
    line-height: 1.5em;

    @media (min-width: $medium-min) {
        line-height: 1em;
    }

    &__divider1,
    &__divider2 {
        padding: 0 5px;
    }

    &__divider2 {
        display: none;

        @media (min-width: $medium-min) {
            display: inline;
        }
    }

    &__br {
        @media (min-width: $medium-min) {
            display: none;
        }
    }

    &__link {
        &:not(:last-child):after {
            content: ', ';
        }
    }
}
</style>
