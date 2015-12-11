const R = require("ramda");
const pubsub = require("../")("amqp://docker");


// Create the event.
const myEvent = pubsub.event("MyEvent");
const publish = (index) => myEvent.publish({ event: index });


// Read in the command-line args, to determine how many events to fire.
// eg. `npm run pub ...` will fire 3 events.
const args = process.argv.slice(2).join(" ");
const count = args.length || 1;
R.times(publish, count)


// Close the process.
setTimeout(function() { process.exit(0) }, 300);
