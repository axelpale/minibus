
Features in 3.0.0
=================

Multiple bindings with same event and handler pair
--------------------------------------------------
In 2.x.x if a function F is bound with event E multiple times, it is still called only once when E is emitted. In "on" method this requires comparing each bound function to the new handler, making the complexity of the method O(N) where N is the number of handlers bound with the event.

Without this comparison the handler becomes associated with the event multiple times and therefore will be called as many times when the event is fired. The advance is that the modification makes the complexity of "on" method O(1).

Possible disadvantage of this is grown possibility for the programming error that bounds the same function to the same key infinite times. How critical is this disadvantage?

Simple way to bind multiple events to same handler
------------------------------------------------------
In 2.x.x "on" method accepted only one event to be bind per one call. The method should accept a set of events.

Without this feature it is impossible to bind multiple events to an anonymous function.

Route is just a string
----------------------
In 2.x.x the route object returned by "on" is a object having properties like the event key, the handler function, route id and such. This allows the user to modify the route freely but on the other hand gives lot of room for an error. For example resetting the handler to a string may cause weird behaviour.

To capsule the inner workings of Minibus more securely, route object should contain only the identity of the route. Natural choice would be an unique string.

Sync and async calls
--------------------
Separate sync and async calls. Async calls place the execution of the handler functions on back of the JS's event queue. Sync calls execute the handlers immediately in sequence so that when "emit" finishes the handlers are already executed.


Features in 4.0.0
=================

Busify any object
-----------------
Method "extend" that takes in an object and turns it into a minibus instance. The handlers are executed in the context of the object.
