<script>
export default {
    name: 'ExternalLink',
    functional: true,
    render(h, context) {
        const attrs = Object.assign({}, context.props, {
            target: '_blank',
            // Required for Lighthouse accessibility audit
            rel: 'noopener',
        });
        return h('a', { attrs }, context.slots().default);
    },
};
</script>
