var pubsub = require("../");

// amqp://guest:guest@dev.rabbitmq.com
pubsub("amqp://docker", "my-event").then(event => {

  console.log("Listening for events...\n");

  event.subscribe(data => {
    console.log("data", data);
  });


});

//
// pubsub("amqp://docker", "event-2").then(event => {
//   event.subscribe(data => {
//     console.log("event-2 ::: ", data);
//   });
//
//
// });


pubsub("amqp://docker").event("my-event")
