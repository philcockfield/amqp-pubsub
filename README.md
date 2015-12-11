# mq-pubsub

[![Build Status](https://travis-ci.org/philcockfield/mq-connection.svg?branch=master)](https://travis-ci.org/philcockfield/mq-connection)

Pub/sub pattern for microservices using RabbitMQ.

See also:
- [mq-connection](https://github.com/philcockfield/mq-connection)


## Installation

    npm install --save mq-pubsub


## Usage
Initialize a connection to a RabbitMQ server:

```js
import factory from "mq-pubsub";
const pubsub = factory("amqp://rabbitmq");
```

Create individual event-managers by passing the event's name to the `event` method:

```js
const myEvent = pubsub.event("my-event");
```

To listen to events pass the `subscribe` method a handler:

```js
myEvent.subscribe(data => {
    // ...
});

```

and to publish events, use the `publish` method:

```js
myEvent.publish({ foo: 123 });
```

These methods can be used immediately without waiting for the connection to complete.  The module manages the connection state internally, and pushes publishes events when the connection is established.


## Example
Look in the `/example` folder, you will need to change the `amqp://` URL to your RabbitMQ server.

Start one or more consoles as subscribed listeners:

```bash
npm run sub
```

Then run the the publish script, optionally passing the number of events to fire:

```bash
npm run pub     # Fires one event.
npm run pub 15  # Fires 15 events.
```


## Tests

    npm test


## Docker Commands

    docker run -it -p 5672:5672 rabbitmq:latest


---
### License: MIT
