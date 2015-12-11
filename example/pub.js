const pubsub = require("../")("amqp://docker");


const myEvent = pubsub.event("MyEvent");
myEvent.publish({ hello:22 });


setTimeout(function() { process.exit(0) }, 300);
