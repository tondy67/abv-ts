/**
 * Abvos Debug
 * https://github.com/tondy67/abv-ts
 */
"use strict";

// export DEBUG=abv:*,info / unset DEBUG
// localStorage.debug = 'abv:*';

const Debug = require('./lib/Debug.js');

module.exports = (opt) => { return new Debug(opt); };
