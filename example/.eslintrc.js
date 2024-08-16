module.exports = {
    env: {
        es2021: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: "module",
    },
    plugins: ['custom-rules'],
    rules: {
    },
    overrides: [
        {
            files: ['src/route/**/*.ts'],
            rules: {
                'custom-rules/use-create-handler': 'error',
            },
        },
    ],
};
