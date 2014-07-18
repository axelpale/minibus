(function (root, factory) {
  'use strict';
  // UMD pattern commonjsStrict.js
  // https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS & Node
    factory(exports);
  } else {
    // Browser globals
    factory((root.Minibus = {}));
  }
}(this, function (exports) {
  'use strict';