<template>
    <div>

        <span class="c-meta__date">
            {{ formattedDate }}
        </span>

        <span class="c-meta__divider">|</span>

        <span class="c-meta__tags">
            <template v-for="(tag, index) in tagArray">
                <nuxt-link
                    :key="tag"
                    :to="`/tag/${tag}/`"
                    :title="tag"><!--
                    -->{{ tag }}<!--
                --></nuxt-link><!--
                --><template v-if="index < tagArray.length - 1">, </template>
            </template>
        </span>

        <span class="c-meta__divider">|</span>

        <span class="c-meta__readtime">{{ readTime }}</span>

    </div>
</template>

<script>
import { isString } from 'lodash';
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
            if (this.post.readTime) {
                return this.post.readTime.text;
            }

            if (this.post.body) {
                return readingTime(this.post.body).text;
            }

            return null;
        },
    },
};
</script>
