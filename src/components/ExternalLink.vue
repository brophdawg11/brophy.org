<script>
export default {
    name: 'ExternalLink',
    functional: true,
    render(h, context) {
        const data = Object.assign({}, context.data);
        Object.assign(data.attrs, {
            target: '_blank',
            // Required for Lighthouse accessibility audit
            rel: 'noopener',
        });
        return h('a', data, context.slots().default);
    },
};
</script>
