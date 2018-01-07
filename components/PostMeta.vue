<template>
<div>

    <span class="c-meta__date">
        {{ formattedDate }}
    </span>

    <span class="c-meta__divider">|</span>

    <span class="c-meta__tags">
        <template v-for="(tag, index) in tagArray">
            <a :href="`/tags/${tag}/`"
               :title="tag">
                {{tag}}<!--
            --></a><!--
            --><template v-if="index < tagArray.length - 1">,</template>
        </template>
    </span>

    <span class="c-meta__divider">|</span>

    <span class="c-meta__readtime">{{ readTime }}</span>

</div>
</template>

<script>
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
            return this.post.tags.split(',');
        },
        readTime() {
            return readingTime(this.post.body).text;
        },
    },
};
</script>
