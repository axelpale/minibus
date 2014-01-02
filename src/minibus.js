// Minibus
//
// Known Issues
//   on() without parameters creates empty route which produce errors emit()

var Minibus = (function () {
  var exports = {};
  /////////////////
  
  
  
  // Constructor
  
  var Bus = function () {
    // key -> set of routes
    // key -> [r1, r2, r3, ...]
    this.keyRoutes = {};
    
    // route id -> route object
    this.idRoutes = {};
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
    //
    // Parameter
    // 
    // Return
    //   route
    
    if (this.keyRoutes.hasOwnProperty(key)) {
      // Do not add if the route already exists.
      var routes, i, exists;
      routes = this.keyRoutes[key];
      exists = false;
      for (i = 0; i < routes.length; i += 1) {
        if (fun === routes[i].fun) {
          exists = true;
          break;
        }
      }
      
      if (exists) {
        return routes[i];
      }
    } else {
      // First
      this.keyRoutes[key] = [];
    }
    // Assert this.keyRoutes[key] is array
    
    // Create route
    var route = {
      id : Identity.create(),
      key: key,
      fun: fun
    };
    
    this.keyRoutes[key].push(route);
    this.idRoutes[route.id] = route;
    
    return route;
  };
  
  Bus.prototype.off = function (routeOrKey, fun) {
    // Unbind one or many handlers.
    // 
    // Parameter
    //   route
    //     The route to be shut down.
    // 
    // Parameter (Alternative)
    //   key
    //     Shut down all the routes with this event key.
    // 
    // Parameter (Alternative)
    //   key
    //     Shut down the route with this event key and handler combination.
    //   fun
    //     The handler function
    // 
    // Parameter (Alternative)
    //   (nothing)
    //     Shut down all the routes; unbind all the handlers.
    // 
    // Throw
    //   InvalidParameterError
    // 
    // Return
    //   this
    //     For chaining.
    
    // Normalize parameters
    var realId = null, realKey, realFun;
    var message;
    var offAllKeys = false;
    var offAll = false;
    var invalid = false;
    if (typeof routeOrKey === 'string') {
      realKey = routeOrKey;
      if (typeof fun === 'function') {
        realFun = fun;
      } else {
        offAll = true; // Unbind all handlers of key
      }
    } else {
      if (typeof routeOrKey === 'object') {
        if (routeOrKey.hasOwnProperty('id') &&
            routeOrKey.hasOwnProperty('key') &&
            routeOrKey.hasOwnProperty('fun') &&
            typeof routeOrKey.id === 'string' &&
            typeof routeOrKey.key === 'string' &&
            typeof routeOrKey.fun === 'function') {
          realId = routeOrKey.id;
          realKey = routeOrKey.key;
          realFun = routeOrKey.fun;
        } else {
          invalid = true;
          message = 'Invalid route object.';
        }
      } else if (typeof routeOrKey === 'undefined') {
        offAllKeys = true;
      } else {
        invalid = true;
        message = 'Unknown route description.';
      }
    }
    if (invalid) {
      throw {
        name:'InvalidParameterError',
        message: message
      };
    }
    
    // If no keys specified, unbind all
    if (offAllKeys) {
      this.keyRoutes = {};
      this.idRoutes = {};
      return this;
    } // else
    
    if (!this.keyRoutes.hasOwnProperty(realKey)) {
      // Already removed.
      return this;
    } // else
    // Assert: routes with this key exist.
    
    // Predefine
    var i, routeId, routeKey, routeFun;
    var routes = this.keyRoutes[realKey];
    
    // If only key is specified, unbind all the handlers
    if (offAll) {
      for (i = 0; i < routes.length; i += 1) {
        routeId = routes[i].id;
        delete this.idRoutes[routeId];
      }
      delete this.keyRoutes[realKey];
      return this;
    } // else
    
    // Find route id if not known.
    if (realId === null) {
      for (i = 0; i < routes.length; i += 1) {
        if (realFun === routes[i].fun) {
          realId = routes[i].id;
          break;
        }
      }
    }
    if (realId === null) {
      // No matching route found. Already removed perhaps.
      return this;
    }
    // Assert: realId !== null
    // Assert: realId, realKey and realFun are known.
    
    // Remove from keyRoutes
    for (i = 0; i < routes.length; i += 1) {
      if (realFun === routes[i].fun) {
        routes.splice(i, 1);
        break;
      }
    }
    
    // Remove from idRoutes
    delete this.idRoutes[realId];
    
    // Assert: route removed everywhere.
    return this;
  };
  
  Bus.prototype.emit = function (key) {
    // Emit an event to fire the bound handlers.
    // The handlers are executed immediately.
    // 
    // Parameter
    //   key
    //     Event key
    //   arg1 (optional)
    //     Argument to be passed to the handler functions.
    //     Is also the this-context of the functions.
    //   arg2 (optional)
    //   ...
    // 
    // Return
    //   this
    //     For chaining.
    var emitArgs, i, routes, context;
    
    if (this.keyRoutes.hasOwnProperty(key)) {
      // Collect passed arguments
      emitArgs = [];
      for (i = 1; i < arguments.length; i += 1) {
        emitArgs.push(arguments[i]);
      }
      
      // First argument will also be the context
      if (emitArgs.length > 0) {
        context = emitArgs[0];
      } else {
        context = {};
      }
      
      // Execute each route
      routes = this.keyRoutes[key];
      for (i = 0; i < routes.length; i += 1) {
        routes[i].fun.apply(context, emitArgs);
      }
    }
    // else
    //   No such event key exists.
    //   Do not execute anything.
    return this;
  };
  
  
  
  ///////////////
  return exports;
}());
