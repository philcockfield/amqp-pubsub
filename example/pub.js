var factory = require("../");
const pubsub = factory("amqp://docker")


const myEvent = pubsub.event("MyEvent");
myEvent.publish({ hello:22 });


setTimeout(function() { process.exit(0) }, 300);
