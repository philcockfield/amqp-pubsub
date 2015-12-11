"use strict"

if (typeof(regeneratorRuntime) === "undefined") {
  require("babel-polyfill"); // NB: Required for ES6 generators with built code in `lib`.
}

module.exports = require("./lib/main");
