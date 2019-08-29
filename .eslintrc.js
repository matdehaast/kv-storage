module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    env: {
        node: true,
    },
    extends: [
        'standard',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    plugins: [
        "@typescript-eslint/eslint-plugin",
        "import"
    ],
    rules: {
        // Gives false positives for intentional behaviour. See issue: https://github.com/eslint/eslint/issues/11899.
        "require-atomic-updates": "off",
        // Defining AppStates may require any
        "@typescript-eslint/no-explicit-any": "off"
    }
};
