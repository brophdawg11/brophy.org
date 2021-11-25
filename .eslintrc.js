module.exports = {
    root: true,
    parserOptions: {
        parser: '@babel/eslint-parser',
        sourceType: 'module',
    },
    env: {
        browser: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/recommended',
    ],
    plugins: [
        'vue',
    ],
    // Check if imports actually resolve
    settings: {
        'import/resolver': {
            nuxt: {
                extensions: ['.js', '.vue'],
            },
        },
    },
    rules: {
        // Don't enforce parents around arrow functions with bodies
        'arrow-parens': 'off',

        // 4 space indent
        indent: ['error', 4],

        // Copied from airbnb but turning off the requirement for a space before this,
        // for usage in vue components with ${this.thing}
        'keyword-spacing': ['error', {
            before: true,
            after: true,
            overrides: {
                case: { after: true },
                return: { after: true },
                this: { before: false },
                throw: { after: true },
            },
        }],

        // Max length of 80 characters in source code
        'max-len': ['error', { code: 100 }],

        // Don't allow console.*, force logger usage
        'no-console': 'error',

        // Allow unary + and -- operators
        'no-plusplus': 'off',

        // Force linebreaks after operators for multi-line boolean/ternary expressions
        'operator-linebreak': ['error', 'after'],

        // Require extensions on non-JS files.  Turned off for now because when
        // aliased imports are ignored below, this can't determine the proper
        // extension and therefore causes all aliases imports to error
        // 'import/extensions': ['error', 'always', { js: 'never' }],
        'import/extensions': 'off',

        // Always put closing brackets on the same line
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'never',
        }],

        // Use 4 space indents in templates
        'vue/html-indent': ['error', 4],

        // Allow as many attrs as git on one line, but once the element is spread
        // across multiple, require one attribute per line
        'vue/max-attributes-per-line': ['error', {
            singleline: 10,
            multiline: 1,
        }],

        // Turn off - prefer 2 newlines and that can't be configured
        'vue/multiline-html-element-content-newline': 'off',
        'vue/singleline-html-element-content-newline': 'off',
    },
    overrides: [{
        files: ['layouts/**/*.vue', 'pages/**/*.vue'],
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    }],
};
