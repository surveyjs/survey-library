
'use strict';

const define = require('../utils/define');

const lang = 'non English or Code';
const regex = /[^\x00-\x7F]+/;
module.exports = define(lang, regex);
