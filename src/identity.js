var Identity = (function () {
  // A utility for creating unique strings for identification.
  // Abstracts how uniqueness is archieved.
  //
  // Usages
  //   >>> Identity.create();
  //   '532402059994638'
  //   >>> Identity.create();
  //   '544258285779506'
  //
  var exports = {};
  /////////////////

  exports.create = function () {
    return Math.random().toString().substring(2);
  };

  ///////////////
  return exports;
}());
