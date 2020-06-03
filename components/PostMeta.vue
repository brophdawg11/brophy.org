<template>
    <div>

        <p class="c-meta__line1">
            <span :title="formattedDate" class="c-meta__date">
                {{ relativeDate }}
            </span>

            <span class="c-meta__divider c-meta__divider--first">|</span>

            <span class="c-meta__readtime">{{ post.readingTime.text }}</span>

        </p>

        <p class="c-meta__line2">

            <span class="c-meta__tags">
                Tags:
                <template v-for="(tag, index) in tagArray">
                    <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                    <nuxt-link
                        :key="tag"
                        :to="`/tag/${tag}/`"
                        :title="tag"><!--
                        -->{{ tag }}<!--
                    --></nuxt-link><!--
                    --><template v-if="index < tagArray.length - 1">, </template>
                </template>
            </span>

        </p>

    </div>
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
.c-meta {

    &__line1 {
        padding-bottom: 0.5rem;
    }

    &__date {

    }

    &__divider {
        padding: 0 10px;
    }

    &__tags {

    }

    &__readtime {

    }

}
</style>
