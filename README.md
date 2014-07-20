# minibus.js<sup>v2.4.0</sup>

Minimal Message Dispatcher for JavaScript.

![minibus.js](../master/doc/img/minibus.png?raw=true)


## Basic example

    > var bus = Minibus.create();
    > var route = bus.on('out-of-fuel', function () {
        console.log('Hitchhike.');
      });
    > bus.emit('out-of-fuel');
    Hitchhike.
    > bus.off(route);
    > bus.emit('out-of-fuel');
    (nothing)


## Features

- Lightweight, about 600 bytes when compressed.
- Compatible with browsers, [Node](http://nodejs.org/), [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD).
- Create a message bus by `var bus = Minibus.create()`
- Bind event handlers by `bus.on('myevent', function () { ... })`
- Bind only once by `bus.once('myevent', function () { ... })`
- Emit events by `bus.emit('myevent')`
- Pass parameters to handlers by `bus.emit('myevent', param1, param2, ...)`
- Unbind the handlers by `bus.off('myevent')`
- Unbind specific handler by first `var route = bus.on('myevent', function () { ... })` and then `bus.off(route)`
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


## Emitting parameters

    > bus.on('flat-tire', function (frontOrBack, side) {
        console.log('The ' + frontOrBack + ' ' + side + ' tire blew out');
      });
    > bus.emit('flat-tire', 'front', 'right');
    The front right tire blew out.

## Alternative naming
Influenced by [Node.js](http://nodejs.org/) and [Backbone.js](http://backbonejs.org/).

    > var bus = Minibus.create();
    > bus.listen('out-of-fuel', function () {...});
    > bus.trigger('out-of-fuel');
    > bus.removeListener('out-of-fuel');

## Customize Minibus

Customize buses by:

    Minibus.extension.myFunction = function (...) {...};

After that you can:

    var bus = Minibus.create();
    bus.myFunction();

## History

The development of Minibus started in 2013-02-15 after hassling with [EventBus](https://github.com/krasimir/EventBus) and [Socket.IO](http://socket.io/). They either had complex API or solved too much.

## See also

- [Roadmap](doc/roadmap.md)
- [Background theory](doc/theory.md)

## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)

## License

[MIT License](../blob/master/LICENSE)
