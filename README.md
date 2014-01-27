# minibus.js

Minimal Message Dispatcher for JavaScript.

![Minibus.js](../master/img/minibus.png?raw=true)

## Features

- Lightweight, less than 600 bytes when compressed.
- Create a message bus by `var bus = Minibus.create()`
- Bind event handlers by `bus.on('out-of-fuel', function () { ... })`
- Bind only once by `bus.once('out-of-fuel', function () { ... })`
- Emit events by `bus.emit('out-of-fuel')`
- Pass parameters to handlers by `bus.emit('out-of-fuel', param1, param2, ...)`
- Unbind the handlers by `bus.off('out-of-fuel')`
- Unbind specific handler by first `var route = bus.on('out-of-fuel', function () { ... })` and then `bus.off(route)`
- Unbind everything by `bus.off()`

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

## Passing parameters

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

## Cause and effect

Minibus is based on the following paradigm. Events happen, they represent the cause. The routes point out the effects of the causes. Handler functions encapsulate the effects and the code within them describes the effects. The effects may trigger new events, giving again a cause for a new set of effects.

![Paradigm for using Minibus and events in general](../master/img/eventmodel.png?raw=true)

## History

The development of Minibus started in 2013-02-15 after hassling with [EventBus](https://github.com/krasimir/EventBus) and [Socket.IO](http://socket.io/). They either had complex API or solved too much.

## License

[MIT License](../blob/master/LICENSE)
