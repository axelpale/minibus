// Minibus
//
// Known Issues
//   on() without parameters creates empty route which produce errors emit()

// Constructor

var Bus = function () {
  // event string -> sub route map
  this.eventMap = {};

  // route string -> route object
  this.routeMap = {};
};

exports.create = function () {
  return new Bus();
};

// For extendability.
// Usage: Minibus.extension.myFunction = function (...) {...};
exports.extension = Bus.prototype;


// Helper functions

var isArray = function (v) {
  return Object.prototype.toString.call(v) === '[object Array]';
};



// Member functions. They all are mutators.


var _emit = function (eventString) {
  var subRouteMap, routeString, emitArgs, i, eventHandlers;

  if (!this.eventMap.hasOwnProperty(eventString)) {
    return;
  } // else

  // Collect passed arguments. Drop the eventString argument.
  emitArgs = [];
  for (i = 1; i < arguments.length; i += 1) {
    emitArgs.push(arguments[i]);
  }

  // Collect handlers synchronously to prevent additional
  // handlers becoming executed if those become added between
  // emit call and setTimeout.
  eventHandlers = [];
  subRouteMap = this.eventMap[eventString];
  for (routeString in subRouteMap) {
    if (subRouteMap.hasOwnProperty(routeString)) {
      eventHandlers.push(subRouteMap[routeString].eventHandler);
    }
  }

  setTimeout(function () {
    for (var i = 0; i < eventHandlers.length; i += 1) {
      eventHandlers[i].apply({}, emitArgs);
    }
  }, 0);

  return;
/*
  // Emit an event to fire the bound handlers.
  // The handlers are executed immediately.
  //
  // Parameter
  //   key
  //     Event key
  //   arg1 (optional)
  //     Argument to be passed to the handler functions.
  //     If type of arg1 is an object then it will be used
  //     as this-context for the functions.
  //   arg2 (optional)
  //   ...
  //
  // Return
  //   this
  //     For chaining.
  var emitArgs, i, route, routes, context;

  if (this.keyRoutes.hasOwnProperty(key)) {
    // Collect passed arguments. Drop the 'key' argument.
    emitArgs = [];
    for (i = 1; i < arguments.length; i += 1) {
      emitArgs.push(arguments[i]);
    }

    // First argument will also be the context (if type of object).
    // ECMA Script requires the context to be an object.
    //   See http://stackoverflow.com/a/15027847/638546
    if (emitArgs.length > 0) {
      context = emitArgs[0];
      if (typeof context !== 'object') {
        context = {};
      }
    } else {
      context = {};
    }

    // Execute each route.
    // Copy the array because there is off calls that modify the
    // original array.
    // See http://stackoverflow.com/a/7486130
    routes = this.keyRoutes[key].slice(0); // Copy
    for (i = 0; i < routes.length; i += 1) {
      route = routes[i];

      // Remove if once.
      // Execute off before apply because additional ons or onces
      // may be set in the applied function.
      if (route.limit > 0) {

        if (route.limit === 1) {
          this.off(route);
        } else {
          route.limit -= 1;
        }
      }

      route.fun.apply(context, emitArgs);
    }
  }
  // else
  //   No such event key exists.
  //   Do not execute anything.
  return this;
*/
};

// See Node.js events.EventEmitter.emit
Bus.prototype.emit = _emit;

// See Backbone.js Events.trigger
Bus.prototype.trigger = _emit;

// See Mozilla Web API EventTarget.dispatchEvent
// See http://stackoverflow.com/a/10085161/638546
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.dispatchEvent = _emit;

// See http://stackoverflow.com/a/9672223/638546
// Uncomment to enable. Too rare to be included by default.
//Bus.prototype.fireEvent = _emit;



var _on = function (eventString, eventHandler) {
  // Bind an event string(s) to an event handler function.
  //
  // Parameter
  //   event
  //     Event string or array of event strings.
  //   handler
  //     Event handler function to be executed when the event is emitted.
  //
  // Throws
  //   InvalidEventStringError
  //   InvalidEventHandlerFunctionError
  //
  // Return
  //   a route string or an array of route strings
  var i, routeObject, routeString;

  if (!isArray(eventString)) {
    eventString = [eventString];
  }

  for (i = 0; i < eventString.length; i += 1) {
    routeObject = {
      eventString: eventString[i],
      eventHandler: eventHandler
    };

    routeString = Identity.create();

    if (!this.eventMap.hasOwnProperty(eventString[i])) {
      this.eventMap[eventString[i]] = {};
    }
    this.eventMap[eventString[i]][routeString] = routeObject;
    this.routeMap[routeString] = routeObject;
  }

  return routeString;

/*
  // Validate parameters
  var valid = false;
  if (typeof key === 'string' &&
      typeof fun === 'function') {
    valid = true;
  }
  if (!valid) {
    throw {
      name: 'InvalidParameterError',
      message: 'Invalid or insufficient parameters. ' +
               'Event must be a string and handler a function. ' +
               'Instead they are ' + (typeof key) + ' and ' + (typeof fun) +
               '.'
    };
  }

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
      routes[i].limit = 0; // Might be set with once in the first place
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
    fun: fun,
    limit: 0 // zero means no limit
  };

  this.keyRoutes[key].push(route);
  this.idRoutes[route.id] = route;

  return route;
*/
};

// Aliases

// See Backbone.js Events.on
// See Node.js events.EventEmitter.on
Bus.prototype.on = _on;

// See http://stackoverflow.com/a/9672223/638546
Bus.prototype.listen = _on;

// See Node.js events.EventEmitter.addListener
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.addListener = _on;

// See Mozilla Web API EventTarget.addEventListener
// See http://stackoverflow.com/a/11237657/638546
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.addEventListener = _on;



var _once = function (eventString, eventHandler) {
  // Like _on but reacts to emit only once.
  var that, routeString, called;
  that = this;
  called = false;
  routeString = this.on(eventString, function () {
    if (!called) {
      called = true; // Required to prevent duplicate sync calls
      that.off(routeString);
      // Apply. Use the context given by emit.
      eventHandler.apply(this, arguments);
    }
  });
  return routeString;
/*
  // Validate parameters
  var valid = false;
  if (typeof key === 'string' &&
      typeof fun === 'function') {
    valid = true;
  }
  if (!valid) {
    throw {
      name: 'InvalidParameterError',
      message: 'Invalid or insufficient parameters. ' +
               'Event must be a string and handler a function. ' +
               'Instead they are ' + (typeof key) + ' and ' + (typeof fun) +
               '.'
    };
  }

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
      routes[i].limit = 1; // Might be set with on
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
    fun: fun,
    limit: 1 // Call only once
  };

  this.keyRoutes[key].push(route);
  this.idRoutes[route.id] = route;

  return route;
*/
};

// See Node.js events.EventEmitter.once
// See Backbone.js Events.once
Bus.prototype.once = _once;



var _off = function (routeString) {
  var noArgs, routeObject, eventString, subRouteMap, rs;

  noArgs = (typeof routeString === 'undefined');
  if (noArgs) {
    this.routeMap = {};
    this.eventMap = {};
    return;
  }

  if (this.routeMap.hasOwnProperty(routeString)) {
    routeObject = this.routeMap[routeString];
    delete this.routeMap[routeString];
    delete this.eventMap[routeObject.eventString][routeString];
    // TODO remove empty sub route map
    return;
  } // else

  eventString = routeString;
  if (this.eventMap.hasOwnProperty(eventString)) {
    subRouteMap = this.eventMap[eventString];
    for (rs in subRouteMap) {
      if (subRouteMap.hasOwnProperty(rs)) {
        delete this.routeMap[rs];
      }
    }
    delete this.eventMap[eventString];
  }
  return;
/*
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

  // If only the key is specified, unbind all the handlers
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
*/
};

// Backbone.js Events.off
Bus.prototype.off = _off;

// Node.js events.EventEmitter.removeListener
Bus.prototype.removeListener = _off;

// See Mozilla Web API EventTarget.removeEventListener
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.removeEventListener = _off;
