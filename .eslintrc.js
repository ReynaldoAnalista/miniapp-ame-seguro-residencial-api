module.exports = {
    env: {
        es6: true,
        node: true,
    },
    plugins: ["@typescript-eslint", "prettier", "jest"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "plugin:jest/recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    ignorePatterns: ["src/routes.ts"],
    rules: {
        // desejável no futuro transformar em error
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-var-requires": "warn",
        "prefer-const": "warn",
        "prefer-rest-params": "warn",
        "jest/no-conditional-expect": "warn",
        "jest/no-try-expect": "warn",
        "no-unused-expressions": "error",
        "jest/no-focused-tests": "off",
        "no-undef": "error",
        "prettier/prettier": "error",
        "no-console": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
    }
}

