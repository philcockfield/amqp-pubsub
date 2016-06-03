# mq-pubsub

[![Build Status](https://travis-ci.org/philcockfield/mq-connection.svg?branch=master)](https://travis-ci.org/philcockfield/mq-connection)

Pub/sub pattern for microservices using RabbitMQ.

See also:
- [mq-connection](https://github.com/philcockfield/mq-connection)
- [mq-pushworker](https://github.com/philcockfield/mq-pushworker)


## Installation

    npm install --save mq-pubsub


## Usage
Initialize a connection to a RabbitMQ server:

```js
import pubsubFactory from "mq-pubsub";
const pubsub = pubsubFactory("amqp://rabbitmq");
```

Create individual event-managers by passing the event's name to the `event` method:

```js
const myEvent = pubsub.event("my-event");
```

To listen for events, pass a handler to the `subscribe` method:

```js
myEvent.subscribe(data => {
  console.log("event:", data);
});

```

To publish events, push data to the `publish` method:

```js
myEvent.publish({ foo: 123 });
```

These methods can be used immediately without waiting for the connection to complete.  The module manages the connection state internally, and buffers events until the RabbitMQ connection is ready.


## Example
Look in the `/example` folder, you will need to change the "`amqp://`" URL in the `pub.js` and `sub.js` files to your RabbitMQ server.

By default the examples assume a RabbitMQ server running within docker (on `192.168.99.100`), which you can start with:

    npm run example:up

- **Subscribe:** Start one or more consoles as subscribed listeners to the `"foo"` and `"bar"` events:

    ```bash
    npm run example:sub
    ```

- **Publish:** In another console run the publish script:

    ```bash
    npm run example:pub <event> <total>
    ```

    For example:

    ```bash
    npm run example:pub           # Fires the "foo" event one time.
    npm run example:pub foo 15    # Fires the "foo" event 15 times.
    npm run example:pub bar 101   # Fires the "bar" event 101 times.
    ```


## Tests

    npm test


## Docker Commands

    docker run -it -p 5672:5672 rabbitmq


---
### License: MIT
