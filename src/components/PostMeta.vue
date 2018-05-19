<template>
    <div>

        <span class="c-meta__date">
            {{ formattedDate }}
        </span>

        <span class="c-meta__divider">|</span>

        <span class="c-meta__tags">
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

        <span class="c-meta__divider">|</span>

        <span class="c-meta__readtime">{{ readTime }}</span>

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
