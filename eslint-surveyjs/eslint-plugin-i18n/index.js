'use strict';

module.exports = {
  rules: {
    'only-english-or-code': require('./lib/rules/only-english-or-code'),
  },
  rulesConfig: {
    'only-english-or-code': 1,
  },
  configs: {
    recommended: {
      plugins: [
        'i18n',
      ],
      rules: {
        'i18n/only-english-or-code': 'warn',
      },
    },
  },
};
