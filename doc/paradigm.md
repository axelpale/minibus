# Simplifying the structure of your code

Let's take an example how an event bus could help you to simplify your code and make it more extendable. Let's say you have this little chat application that follows ModelViewController paradigm. `Model` is responsible of loading messages from the server and the job of `View` is to displays them. `Controller` is responsible of connecting the two.

    var View = ...

    var Model = ...

    var Controller = {
      start: function () {
        var view = View.create();
        var model = Model.create(view);

        model.onMessageFromServer(function success(message) {
          view.appendMessage(message);
        });
      };
    };

    Controller.start();

A couple of years pass and the application needs a new feature: it should play a sound when a new message is loaded. An already implemented function `playSound` is given to you. The question is how to integrate it into the old code?

You could play dirty and put `playSound` call into `appendMessage`. Each `appendMessage` call `playSound` is also called. Okay, it might work at first but after a year you or your co-worker will hate the former you when `appendMessage` will also be used to append the messages the users type in by themselves in addition to received ones.

You could add `playSound` directly into `success` callback after or before the `appendMessage` call. Okay, this is better but still this, and the previous approach as well, requires you to modify the old code. As you probably know, modified old code is a great source of strange errors, especially when done after a couple of years.

So none of the approaches were optimal. How to have the new functionality without putting it close to an unrelated piece of code or stabbing and probably breaking the old code?

Let's go back in time and implement the original code with an event bus. In other words, let's make `Model` and `View` communicate with events instead of function calls:

    function view(bus) {
      var appendMessage = function (message) { ... };
      bus.on('newMessage', appendMessage);
    };

    function model(bus) {
      var onMessageFromServer = function (success) { ... };
      onMessageFromServer(function success(message) {
        bus.emit('newMessage');
      });
    };

    function controller(Minibus) {
      var bus = Minibus.create();
      view(bus);
      model(bus);
    };
    controller(Minibus);


Nothing much changed or did it? Now the view listens to `newMessage` events and the model emits those. One important change is that `success` would work even if the view did not exist and therefore the view and model are now called _loosely coupled_ instead of _tightly coupled_.

Let's go back to the future where `playSound` should be included. Due to our event bus we can now do it without the downsides. All we need is to add an additional handler for the `newMessage` event:

    function soundView(bus) {
      var playSound = function () { ... };
      bus.on('newMessage', playSound);
    };

    function view(bus) {
      var appendMessage = function (message) { ... };
      bus.on('newMessage', appendMessage);
    };

    function model(bus) {
      var onMessageFromServer = function (success) { ... };
      onMessageFromServer(function success(message) {
        bus.emit('newMessage');
      });
    };

    function controller(Minibus) {
      var bus = Minibus.create();
      soundView(bus);
      view(bus);
      model(bus);
    };
    controller(Minibus);


Nice and simple, huh? No need to mix the new functionality with irrelevant code or modify the old. All we need is to share the event bus with the parts of the program emitting to or listening it.
