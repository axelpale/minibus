# minibus.js<sup>v3.0.0</sup>

Minimal event bus a.k.a. message dispatcher for JavaScript.

![minibus.js](../master/doc/img/minibus.png?raw=true)



## Basic example

    > var bus = Minibus.create()
    > var route = bus.on('out-of-fuel', function () {
        console.log('Hitchhike.')
      });
    > bus.emit('out-of-fuel')
    Hitchhike.
    > bus.off(route)
    > bus.emit('out-of-fuel')
    (nothing)



## Features

- Lightweight, about 600 bytes when compressed.
- Compatible with browsers, [Node](http://nodejs.org/), [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD).
- Create a message bus by `var bus = Minibus.create()`
- Bind event handlers by `bus.on('myevent', function () { ... })`
- Bind only once by `bus.once('myevent', function () { ... })`
- Emit events by `bus.emit('myevent')`
- Pass parameters to handlers by `bus.emit('myevent', param1, param2, ...)`
- Unbind the handlers of an event by `bus.off('myevent')`
- Unbind a route by first `var route = bus.on('myevent', function () { ... })` and then `bus.off(route)`
- Unbind everything by `bus.off()`



## Installation

### Browsers

    <script src="scripts/minibus.js"></script>

### CommonJS & Node.js

    $ npm install minibus
    ---
    > var Minibus = require('minibus');

### AMD & Require.js

    define(['scripts/minibus'], function (Minibus) { ... });



## API

### Minibus.create

Create a new `bus`. Takes no parameters.

    >> var bus = Minibus.create()
    >> bus.on('hello', function () { ...



### bus.emit

*alias bus.**trigger***

Emit an event to execute the event handlers. The event handlers are executed immediately. Takes in an event string. Returns nothing.

    >> bus.emit('out-of-fuel')

Alternatively takes in an array of event strings.

    >> bus.emit(['out-of-fuel', 'radio-on'])

Accepts also extra parameters to be given as parameters to the event handler.

    >> bus.on('out-of-fuel', function (litersFuelLeft) { ... })
    >> bus.emit('out-of-fuel', 0.5)

Another example:

    >> bus.on('flat-tire', function (frontOrBack, side) {
         console.log('The ' + frontOrBack + ' ' + side + ' tire blew out');
       });
    >> bus.emit('flat-tire', 'front', 'right');
    The front right tire blew out.

Throws `InvalidEventStringError` if given event string is not a string or an array of strings.



### bus.on

*alias bus.**listen***

On an event string being emitted, execute an event handler function. Returns a route that can be used with `off` to cancel this binding.

    >> var route = bus.on('out-of-fuel', function () {
         console.log('Hitchhike.')
       })
    >> bus.off(route)

Takes in an event string or an array of event strings and an event handler function.

    >> bus.on(['out-of-fuel', 'battery-dead'], function () {
         console.log('Call home.')
       })

Throws `InvalidEventStringError` if given event string is not a string or array of strings. Throws `InvalidEventHandlerError` if given event handler is not a function.



### bus.once

Bind once. Just like `bus.on` but the event handler function can be executed only once and is then forgotten.

    >> bus.once('out-of-fuel', function () {
         console.log('Smoke your last cigarette.')
       })
    >> bus.emit('out-of-fuel')
    'Smoke your last cigarette.'
    >> bus.emit('out-of-fuel')
    (nothing)



### bus.off

*alias bus.**removeListener***

Unbind one or many event handlers. Returns nothing. With no parameters, unbinds all the event handlers for all the event strings.

    >> bus.off()

Takes in a route an array of routes returned by an `on` or `once`.

    >> var route = bus.on('out-of-fuel', function () {
         console.log('Hitchhike.')
       })
    >> bus.off(route)
    >> bus.emit('out-of-fuel')
    (nothing)

Alternatively takes in an array of routes.

    >> bus.off([route, otherRoute])

Throws `InvalidRouteStringError` if given route is not a string or array of strings.



## Customize Minibus

Customize `bus` by:

    Minibus.extension.myFunction = function (...) {...};

After that you can:

    var bus = Minibus.create();
    bus.myFunction();



## Repository branches

- `master` is for production-ready releases.
- `develop` is for feature development

This convention follows a [successful git branching model](http://nvie.com/posts/a-successful-git-branching-model/).



## History

The development of Minibus started in 2013-02-15 after hassling with [EventBus](https://github.com/krasimir/EventBus) and [Socket.IO](http://socket.io/). They either had complex API or solved too much. The 1.x.x and 2.x.x were designed in 2013. Codebase was completely rewritten to 3.x.x in the end of 2014.



## See also

- [Roadmap](doc/roadmap.md)
- [Background theory](doc/theory.md)
- [About testing](doc/testing.md)



## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



## License

[MIT License](../blob/master/LICENSE)
