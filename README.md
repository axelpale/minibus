# minibus.js

Minimal Message Dispatcher for JavaScript.

## Features

- Create a message bus by `var bus = Minibus.create()`
- Bind event handlers by `bus.on('myevent', function () { ... })`
- Emit events by `bus.emit('myevent')`
- Pass parameters to handlers by `bus.emit('myevent', param1, param2, ...)`
- Unbind the handlers by `bus.off('myevent')`
- Unbind specific handler by `var route = bus.on('myevent', function () { ... })` and `bus.off(route)`

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
    

## License

MIT
