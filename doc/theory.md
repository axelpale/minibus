# Theory

## Cause and effect

Events trigger functions, functions trigger more events.

Minibus is based on the following paradigm. Events happen, they represent the cause. The routes point out the effects of the causes. Handler functions encapsulate the effects and the code within them describes the effects. The effects may trigger new events, giving again a cause for a new set of effects.

![Paradigm for using Minibus and events in general](../master/doc/img/eventmodel.png?raw=true)