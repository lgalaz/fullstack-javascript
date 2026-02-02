'use strict';

const util = require('util');

const oldApi = util.deprecate(
  (name) => {
    return `Hello, ${name}`;
  },
  'oldApi() is deprecated. Use newApi() instead.',
  'DEP_DEBUG_001'
);

console.log(oldApi('world'));
