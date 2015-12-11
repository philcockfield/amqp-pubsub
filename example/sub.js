const pubsub = require("../")("amqp://docker");
const myEvent = pubsub.event("MyEvent");

console.log("Listening for events...\n");
myEvent.subscribe(data => {
    console.log(" [-]", data);
});
