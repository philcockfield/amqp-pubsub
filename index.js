
console.log("TODO - babel-polyfill only require if not already created");

"use strict"
require("babel-polyfill"); // NB: Required for ES6 generators with built code in `lib`.
module.exports = require("./lib/main");
