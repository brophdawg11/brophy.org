module.exports = ({ options }) => ({
    plugins: {
        cssnano: options.isProd ? options.cssnano : false,
    },
});
