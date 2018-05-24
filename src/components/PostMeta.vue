<template>
    <div>

        <p class="c-meta__line1">
            <span class="c-meta__date">
                {{ formattedDate }}
            </span>

            <span class="c-meta__divider c-meta__divider--first">|</span>

            <span class="c-meta__readtime">{{ readTime }}</span>

        </p>

        <p class="c-meta__line2">

            <span class="c-meta__tags">
                Tags:
                <template v-for="(tag, index) in tagArray">
                    <router-link
                        :key="tag"
                        :to="`/tag/${tag}/`"
                        :title="tag"><!--
                        -->{{ tag }}<!--
                    --></router-link><!--
                    --><template v-if="index < tagArray.length - 1">, </template>
                </template>
            </span>

        </p>

    </div>
</template>

<script>
import { isString } from 'lodash-es';
import moment from 'moment';
import readingTime from 'reading-time';

export default {
    props: {
        post: {
            type: Object,
            required: true,
        },
    },
    computed: {
        formattedDate() {
            return moment(this.post.postDate).format('MMMM D, YYYY');
        },
        tagArray() {
            return isString(this.post.tags) ?
                this.post.tags.split(',') :
                [];
        },
        readTime() {
            if (this.post.readingTime) {
                return this.post.readingTime.text;
            }

            /* eslint-disable no-underscore-dangle */
            if (this.post.__content) {
                return readingTime(this.post.__content).text;
            }
            /* eslint-enable no-underscore-dangle */

            return null;
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
