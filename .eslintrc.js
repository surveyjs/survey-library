module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
    "warnOnUnsupportedTypeScriptVersion": false
  },
  "plugins": [
    "@typescript-eslint",
    "surveyjs"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "surveyjs/no-test-only": 2,
    "surveyjs/no-test-debug": 2,
    "surveyjs/no-imports-from-entries": 2,
    "no-console": 2, // Remember, this means error!
    "indent": ["error", 2, {
      "SwitchCase": 1,
      // "MemberExpression": 1,
      // "CallExpression": {
      //   "arguments": 1
      // }
    }],
    "semi": ["error", "always"],
    "quotes": ["error", "double", { "avoidEscape": true }],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "space-before-blocks": "error",
    "space-infix-ops": "error",
    "comma-spacing": ["error", { "before": false, "after": true }],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "no-multi-spaces": "error",
    "block-spacing": "error",
    "key-spacing": "error",
    "keyword-spacing": ["error", {
      "overrides": {
        "this": { "after": false, "before": false },
        // "function": { "after": false, "before": false },
        "while": { "after": false },
        "switch": { "after": false },
        "new": { "before": false },
        "catch": { "after": false }
      }
    }],
    "semi-spacing": "error",
    "computed-property-spacing": "error",
    "no-whitespace-before-property": "error",
    "no-extra-semi": ["error"],
    "linebreak-style": ["error", "windows"],
    "no-useless-escape": "off",
    "no-case-declarations": "off",
    "no-constant-condition": "off",
    "no-prototype-builtins": "off",
    "no-var": "off",
    "prefer-const": "off",
    "prefer-rest-params": "off",
    "no-extra-boolean-cast": "off",
    "prefer-spread": "off",
    "no-empty": "off",

    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        },
        "overrides": {
          "interface": {
            "multiline": {
              "delimiter": "semi",
              "requireLast": true
            }
          }
        }
      }
    ],

    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-types": "off",
  },
  "overrides": [
    {
      "files": [
        "*.js"
      ],
      "rules": {
        "no-undef": "off"
      }
    }
  ]
};
