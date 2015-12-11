const R = require("ramda");
const Promise = require("bluebird");
const pubsub = require("../")("amqp://docker");


// Create the event.
const myEvent = pubsub.event("MyEvent");
const publish = (index) => myEvent.publish({ event: index + 1 });


// Read in the command-line args, to determine how many events to fire.
// eg. `npm run pub ...` will fire 3 events.
const args = process.argv.slice(2).join(" ");
const count = parseInt(args) || 1;
R.times(publish, count);
