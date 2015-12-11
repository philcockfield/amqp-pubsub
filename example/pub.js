var pubsub = require("../");



pubsub("amqp://docker", "my-event").then(event => {

  const args = { hello: 123 };
  console.log("Publishing event", args);
  event.publish(args);
  event.publish(1);
  event.publish("harry");

  // setTimeout(function() { process.exit(0) }, 300)

});




pubsub("amqp://docker", "event-2").then(event => {

  event.publish({ foo: "event2" });

  // setTimeout(function() { process.exit(0) }, 300)

});
