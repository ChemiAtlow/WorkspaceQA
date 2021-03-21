module.exports = {
    root: true,

    env: {
        node: true
    },
    extends: [
        "plugin:vue/vue3-essential",
        "@vue/typescript/recommended",
        "eslint:recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint"
    ],

    parserOptions: {
        ecmaVersion: 2020
    },

    rules: {
        "vue/html-self-closing": "off",
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
    }
};
