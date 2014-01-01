// Minibus
// Minimal Event Bus
// Minimal Message Dispatcher for JavaScript
//
// Author
//   Akseli Palén <akseli.palen@gmail.com>
//
// Version
//   1.0.0
//
// Known Issues
//   on() without parameters creates empty route which produce errors emit()
//
// 2013-02-15 AP
//   Developed Minibus after hassling with
//   EventBus <https://github.com/krasimir/EventBus> and
//   Socket.IO <http://socket.io/>

if (typeof xeli === 'undefined') { var xeli = {}; };

xeli.minibus = {};

xeli.minibus.MiniBus = function ()
{
    // key -> set of functions
    // key -> [f1, f2, f3, ...]
    this.routes = {};
    
    // Route functions have to be called in some context.
    // Use empty object for the context.
    this.dummy_this = {};
}

xeli.minibus.MiniBus.prototype = {
    on: function (key, fun)
    {
        if (this.routes.hasOwnProperty(key))
        {
            // Do not add if the route already exists.
            var route_functions, i, exists;
            route_functions = this.routes[key];
            exists = false;
            for (i = 0; i < route_functions.length; i++)
            {
                if (fun === route_functions[i]) {
                    exists = true;
                    break;
                }
            }
            
            if (!exists)
            {
                route_functions.push(fun);
            }
        }
        else
        {
            // First
            this.routes[key] = [fun];
        }
        
        var route = {
            key: key,
            fun: fun
        }
        return route;
    },
    
    off: function (route)
    {
        if (this.routes.hasOwnProperty(route.key))
        {
            var route_functions, i, exists;
            route_functions = this.routes[route.key];
            for (i = 0; i < route_functions.length; i++)
            {
                if (route.fun === route_functions[i])
                {
                    route_functions.splice(i, 1);
                    break;
                }
            }
        }
        // else
        //     route already does not exists 
    },
    
    emit: function (key)
    {
        var emit_values, i, route_functions;
        
        if (this.routes.hasOwnProperty(key))
        {
            // Collect passed arguments
            emit_values = [];
		    for (i = 1; i < arguments.length; i++)
		    {
			    emit_values.push(arguments[i]);
		    }

            // Execute each route
		    route_functions = this.routes[key];
		    for (i = 0; i < route_functions.length; i++)
		    {
		        route_functions[i].apply(this.dummy_this, emit_values);
		    }
		}
    }
}

xeli.minibus.bus = new xeli.minibus.MiniBus();
