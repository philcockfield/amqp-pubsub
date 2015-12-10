var pubsub = require("../lib/main");

// amqp://guest:guest@dev.rabbitmq.com
pubsub("amqp://docker", "my-event").then(event => {

  console.log("Listening for events...\n");

  event.subscribe(data => {
    console.log("data", data);
  });


});
