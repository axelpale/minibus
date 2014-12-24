# minibus.js<sup>v3.1.0</sup>

![minibus.js](../master/doc/img/minibus.png?raw=true)

Minibus is a minimal event bus for JavaScript.

Using an event bus simplifies the structure of your code by letting the code communicate via events instead of direct function calls. If a piece of code tells what happens instead of what should be done next, it is much easier to hook new functionality to the piece of code without actually modifying it.



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



## Simplifying the structure of your code

Let's take an example how an event bus could help you to simplify your code and make it more extendable. Let's say you have this little chat application having view and main modules. Main is responsible of loading messages from the server and the job of view is to displays them.

    // view.js
    var View = function () {
      this.appendMessage = function (message) {
        $('ul#messages').append('<li>' + message + '</li>');
      };
    };

    // main.js
    var view = new View();
    loadMessageAndThen(function success(message) {
      view.appendMessage(message);
    });

A couple of years pass and the application needs a new feature: it should play a sound when a new message is loaded. A function `playSound` is given to you premade. The question is how to integrate it into the old code?

You could play dirty and put `playSound` call into `appendMessage` before adding `<li>` element. Okay, it might work at first but you or your co-worker will hate former you when `appendMessage` needs to be modified next year.

You could add `playSound` directly into `success` callback after the `appendMessage` call. Okay, it's somewhat better but still this, and the previous approach as well, requires you to modify the old code. As you probably know, modified old code is a great source of strange errors, especially when done after a couple of years.

So none of the approaches were optimal. How to have the new functionality without putting it close to an unrelated piece of code or stabbing and probably breaking the old code?

Let's go back in time and implement the original code with an event bus:

    // view.js
    var initView = function (bus) {
      bus.on('newMessage', function appendMessage(message) {
        $('ul#messages').append('<li>' + message + '</li>');
      });
    };

    // main.js
    var bus = Minibus.create();
    initView(bus);
    loadMessageAndThen(function success(message) {
      bus.emit('newMessage', message);
    });

Nothing much changed or did it? Now the view listens to `newMessage` events and main emits those. One important change is that `success` would work even if view did not exist and therefore view and main are now called loosely coupled instead of tightly coupled.

Let a couple of years pass and `playSound` function to be included. Due to our event bus we can now do it without the downsides. All we need is to add an additional handler for the `newMessage` event:

    // view.js
    var initView = function (bus) {
      bus.on('newMessage', function appendMessage(message) {
        $('ul#messages').append('<li>' + message + '</li>');
      });
      bus.on('newMessage', function () {
        playSound();
      });
    };

    // main.js
    var bus = Minibus.create();
    initView(bus);
    loadMessageAndThen(function success(message) {
      bus.emit('newMessage', message);
    });

Nice and simple, huh? No need to mix the new functionality with irrelevant code or modify the old. All we need is to share the event bus with the parts of the program emitting to or listening it.



## API

### Minibus.create

Create a new `bus`. Takes no parameters.

    >> var bus = Minibus.create()
    >> bus.on('hello', function () { ...



### bus.emit

*alias bus.__trigger__*

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

*alias bus.__listen__*

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

*alias bus.__removeListener__*

Unbind one or many event handlers. Returns nothing. With no parameters, unbinds all the event handlers for all the event strings.

    >> bus.off()

Takes in a route returned by an `on` or `once`.

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
- [About testing](doc/testing.md)



## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



## License

[MIT License](../blob/master/LICENSE)
