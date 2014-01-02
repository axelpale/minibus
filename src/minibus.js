// Minibus
//
// Known Issues
//   on() without parameters creates empty route which produce errors emit()

var Minibus = (function () {
  var exports = {};
  /////////////////
  
  
  
  // Constructor
  
  var Bus = function () {
    // key -> set of functions
    // key -> [f1, f2, f3, ...]
    this.routes = {};
    
    // Route functions have to be called in some context.
    // Use empty object for the context.
    this.dummyThis = {};
  };
  
  exports.create = function () {
    return new Bus();
  };
  
  // For extendability.
  // Usage: Minibus.extension.myFunction = function (...) {...};
  exports.extension = Bus.prototype;
  
  
  
  // Mutators
  
  Bus.prototype.on = function (key, fun) {
    // Bind handler function to a specific event.
    
    if (this.routes.hasOwnProperty(key)) {
      // Do not add if the route already exists.
      var routeFunctions, i, exists;
      routeFunctions = this.routes[key];
      exists = false;
      for (i = 0; i < routeFunctions.length; i += 1) {
        if (fun === routeFunctions[i]) {
          exists = true;
          break;
        }
      }
      
      if (!exists) {
          routeFunctions.push(fun);
      }
    } else {
      // First
      this.routes[key] = [fun];
    }
    
    var route = {
        key: key,
        fun: fun
    };
    return route;
  };
  
  Bus.prototype.off = function (route) {
    if (this.routes.hasOwnProperty(route.key)) {
      var routeFunctions, i, exists;
      routeFunctions = this.routes[route.key];
      for (i = 0; i < routeFunctions.length; i += 1) {
        if (route.fun === routeFunctions[i]) {
          routeFunctions.splice(i, 1);
          break;
        }
      }
    }
    // else
    //   route already does not exists
  };
  
  Bus.prototype.emit = function (key) {
    var emitValues, i, routeFunctions;
    
    if (this.routes.hasOwnProperty(key)) {
      // Collect passed arguments
      emitValues = [];
      for (i = 1; i < arguments.length; i += 1) {
        emitValues.push(arguments[i]);
      }

      // Execute each route
      routeFunctions = this.routes[key];
      for (i = 0; i < routeFunctions.length; i += 1) {
          routeFunctions[i].apply(this.dummyThis, emitValues);
      }
    }
    // else
    //   No such event key exists.
  };
  
  
  
  ///////////////
  return exports;
}());
