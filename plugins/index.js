import Vue from 'vue';
import marked from 'marked';

Vue.mixin({
    methods: {
        md(value) {
            try {
                return marked(value).trim().replace(/^<p>|<\/p>$/g, '');
            } catch (e) {
                console.debug('Error processing markdown:', value, e);
                return value;
            }
        },
    },
});
