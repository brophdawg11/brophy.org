import marked from 'marked';
import logger from '@js/logger';

export default function initMixins(Vue) {
    Vue.mixin({
        methods: {
            md(value) {
                try {
                    return marked(value).trim().replace(/^<p>|<\/p>$/g, '');
                } catch (e) {
                    logger.warn('Error processing markdown:', value, e);
                    return value;
                }
            },
        },
    });
}
