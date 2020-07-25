<template>
    <p class="post-meta">

        <template v-if="relativeDate">
            <span :title="formattedDate" class="c-meta__date">{{ relativeDate }}</span>
            <span class="post-meta__divider1">|</span>
        </template>

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
            try {
                const [, y, m, d] = this.post.postDate.match(/(\d{4})-(\d{2})-(\d{2})/);
                return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
            } catch (e) {
                return null;
            }
        },
        relativeDate() {
            return this.postDate ? vagueTime.get({ to: this.postDate.getTime() }) : null;
        },
        formattedDate() {
            if (!this.postDate) {
                return this.post.postDate;
            }
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
