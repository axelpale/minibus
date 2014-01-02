var Identity = (function () {
  // A utility for creating unique strings for identification.
  // 
  // Usage
  //   >>> Identity.create();
  //   '1'
  //   >>> Identity.create();
  //   '2'
  // 
  var exports = {};
  /////////////////
  
  
  // State
  var counter = 0;
  
  
  // Constructor
  
  var Id = function () {
    this.counter = 0;
  };
  
  exports.create = function () {
    counter += 1;
    return counter.toString();
  };
  
  
  
  ///////////////
  return exports;
}());
