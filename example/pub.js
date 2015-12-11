var factory = require("../");



const pubsub = factory("amqp://docker")
  // .then(result => {})
  // .catch(err => console.log("ERROR", err));

const event = pubsub.event("MyEvent");

event.ready().then(result => {
  console.log("event", event);
  event.publish({hello:22})
})


// event.publish()

// console.log("pubsub", pubsub);

// pubsub("amqp://docker", "my-event").then(event => {
//
//   const args = { hello: 123 };
//   console.log("Publishing event", args);
//   event.publish(args);
//   event.publish(1);
//   event.publish("harry");
//
//   // setTimeout(function() { process.exit(0) }, 300)
//
// });
//
//
