const pubsub = require("../")("amqp://docker");

const fooEvent = pubsub.event("foo");
const barEvent = pubsub.event("bar");


pubsub.ready()
  .then(() => console.log("Connected. Listening for events...\n"))
  .catch(err => console.log("ERROR", err));


fooEvent.subscribe(data => console.log(" [+] foo:", data));
barEvent.subscribe(data => console.log(" [+] bar:", data));
