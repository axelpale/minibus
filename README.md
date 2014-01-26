# minibus.js

Minimal Message Dispatcher for JavaScript.

![Minibus.js](../master/img/minibus.png?raw=true)

## Features

- Lightweight, less than 600 bytes when compressed.
- Create a message bus by `var bus = Minibus.create()`
- Bind event handlers by `bus.on('myevent', function () { ... })`
- Bind only once by `bus.once('myevent', function () { ... })`
- Emit events by `bus.emit('myevent')`
- Pass parameters to handlers by `bus.emit('myevent', param1, param2, ...)`
- Unbind the handlers by `bus.off('myevent')`
- Unbind specific handler by first `var route = bus.on('myevent', function () { ... })` and then `bus.off(route)`
- Unbind everything by `bus.off()`

## Basic example

    > var bus = Minibus.create();
    > var route = bus.on('myevent', function () {
        console.log('Hello universe.');
      });
    > bus.emit('myevent');
    Hello universe.
    > bus.off(route);
    > bus.emit('myevent');
    (nothing)

## Passing parameters

    > bus.on('wakeup', function (greet, place) {
        console.log(greet + place);
      });
    > bus.emit('wakeup', 'Hello ', 'universe.');
    Hello universe.

## Alternative naming
Influenced by [Node.js](http://nodejs.org/) and [Backbone.js](http://backbonejs.org/).

    > var bus = Minibus.create();
    > bus.listen('myevent', function () {...});
    > bus.trigger('myevent');
    > bus.removeListener('myevent');

## Customise Minibus

Customise buses by:

    Minibus.extension.myFunction = function (...) {...};

After that you can:

    var bus = Minibus.create();
    bus.myFunction();

## History

The development of Minibus started in 2013-02-15 after hassling with [EventBus](https://github.com/krasimir/EventBus) and [Socket.IO](http://socket.io/). They either had complex API or solved too much.

## License

[MIT License](../blob/master/LICENSE)
