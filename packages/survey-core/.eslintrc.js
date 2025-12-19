module.exports = {
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "overrides": [
    {
      "files": [
        "src/**/*.ts"
      ],
      "rules": {
        "no-restricted-properties": [
          "error",
          {
            "object": "window",
            "property": "document"
          }
        ],
        "no-restricted-globals": [
          "error",
          {
            "name": "document",
            "message": "Do not use document into survey-core. Use methods from DomDocumentHelper"
          },
          {
            "name": "window",
            "message": "Do not use window into survey-core. Use method from DomWindowHelper"
          }
        ]
      }
    },
  ]
};
