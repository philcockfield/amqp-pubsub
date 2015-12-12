const R = require("ramda");
const Promise = require("bluebird");
const pubsub = require("../")("amqp://docker");



const publish = (event, index) => {
    const data = { number: index + 1 };
    console.log(` [-] Published event '${ event.name }' with data:`, data);
    event.publish(data)
  };


// Create the event.
const events = {
  foo: pubsub.event("foo"),
  bar: pubsub.event("bar")
};


// Read in the command-line args, to determine which event to fire
// and how many events to fire it.
const args = process.argv.slice(2);
const eventName = args[0] || "foo";
const count = parseInt(args[1]) || 1;

if (events[eventName]) {
  const promises = R.times((index) => publish(events[eventName], index), count);
  Promise.all(promises)
    .then(() => {
      console.log("");
      setTimeout(() => process.exit(0), 200);
    })

} else {
  console.log(`Event named '${ eventName }' does not exist.\n`);
}
