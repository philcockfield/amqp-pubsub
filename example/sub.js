const URL = 'amqp://192.168.99.100';
const lib = require('../').default;
const pubsub = lib(URL);
console.log(`Server: ${ URL }\n`);


const fooEvent = pubsub.event('foo');
const barEvent = pubsub.event('bar');


pubsub.ready()
  .then(() => console.log(`Connected to '${ URL }'. Listening for events...\n`))
  .catch(err => console.log('ERROR', err));


fooEvent.subscribe(data => console.log(' [+] foo:', data));
barEvent.subscribe(data => console.log(' [+] bar:', data));
